import { collection, query, where, orderBy, limit, onSnapshot, addDoc, updateDoc, doc, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// --- CONFIGURATION ---
const EMAILJS_PUBLIC_KEY = "FzQkYPBTjINGhutGv";
const EMAILJS_SERVICE_ID = "service_j1825u9";
const EMAILJS_TEMPLATE_ID = "template_umig5kp";

export class NotificationManager {
    constructor(db, auth) {
        this.db = db;
        this.auth = auth;
        this.unsubscribe = null;
        this.audioContext = null;

        // Initialize Audio
        this.alarmSound = new Audio("https://assets.mixkit.co/active_storage/sfx/995/995-preview.mp3");
        this.alarmSound.loop = true;
        this.notificationSound = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");

        // Initialize EmailJS
        if (window.emailjs) {
            emailjs.init(EMAILJS_PUBLIC_KEY);
        }
    }

    /**
     * Starts listening for notifications based on the user's role and shop.
     */
    startListening(userId, userRole, shopId, onUpdateCallback) {
        // Stop previous listener if exists
        if (this.unsubscribe) this.unsubscribe();

        if (!userId || userId.startsWith('offline')) return;

        let q;
        const collectionRef = collection(this.db, "notifications");

        // 1. Customer: Listen for their specific user ID
        if (userRole === 'customer') {
            q = query(collectionRef, where("userId", "==", userId), orderBy("createdAt", "desc"), limit(10));
        }
        // 2. Staff/Owner: Listen for notifications for their Shop AND Role
        else if (shopId) {
            // This ensures kitchen staff only get kitchen alerts, etc.
            q = query(collectionRef, where("shopId", "==", shopId), where("role", "==", userRole), orderBy("createdAt", "desc"), limit(20));
        } else {
            console.log("NotificationManager: No valid context to listen.");
            return;
        }

        console.log(`🔔 Started listening for notifications. Role: ${userRole}, Shop: ${shopId}`);

        this.unsubscribe = onSnapshot(q, (snapshot) => {
            const notifications = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

            // Check for new unread urgent messages
            const unread = notifications.filter(n => !n.read);
            if (unread.length > 0) {
                this.handleNewNotification(unread[0], userRole);
            }

            // Update UI via callback
            if (onUpdateCallback) onUpdateCallback(notifications);
        }, (error) => {
            console.error("Notification Listener Error:", error);
        });
    }

    /**
     * Handles side effects of a new notification (Sound, Vibration, System Push).
     */
    handleNewNotification(notif, role) {
        // Prevent spamming sound on page load for old notifications (check timestamp < 30s ago)
        const isRecent = notif.createdAt ? (Date.now() - notif.createdAt.toMillis() < 30000) : true;

        if (!isRecent) return;

        // 1. Play Alarm for Orders (Kitchen/Owner)
        if (['kitchen', 'owner'].includes(role) && notif.type === 'order_created') {
            this.playAlarm();
        } else {
            this.playBeep();
        }

        // 2. Vibrate Phone
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);

        // 3. Browser System Notification (Service Worker)
        if (Notification.permission === 'granted' && document.hidden) {
            navigator.serviceWorker.ready.then(reg => {
                reg.showNotification('Cloud Kitchen', {
                    body: notif.message,
                    icon: './public/foodyVrinda-logo.png',
                    tag: notif.id // Prevent duplicates
                });
            });
        }
    }

    /**
     * Helper to create a notification in Firestore for a specific user.
     */
    async notifyUser(targetUserId, message, type = 'info', meta = {}) {
        if (!targetUserId) return;
        try {
            await addDoc(collection(this.db, "notifications"), {
                userId: targetUserId,
                message: message,
                type: type,
                read: false,
                createdAt: serverTimestamp(),
                ...meta
            });
        } catch (e) { console.error("Failed to notify user:", e); }
    }

    /**
     * Sends an email to the shop owner specifically.
     * Looks up the owner of the shopId provided.
     */
    async sendOwnerEmail(shopId, title, body, orderData = {}) {
        if (!shopId) return;

        // 1. Find Owner
        try {
            const q = query(collection(this.db, "users"), where("shopId", "==", shopId), where("role", "==", "owner"));
            const snapshot = await getDocs(q);

            snapshot.forEach(userDoc => {
                const owner = userDoc.data();
                if (owner.email) {
                    // 2. Send via EmailJS
                    console.log(`📧 Sending email to ${owner.email}`);
                    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                        to_email: owner.email,
                        subject: title,
                        message: body,
                        order_id: orderData.id || 'N/A',
                        total: orderData.totalAmount || '0'
                    }).catch(err => console.error("EmailJS Error:", err));
                }
            });
        } catch (e) {
            console.error("Error finding owner for email:", e);
        }
    }

    /**
     * Broadcasts a notification to all staff of a specific role in a shop.
     * Useful for "New Order" -> Notify all "Kitchen" staff.
     */
    async broadcastToRole(shopId, targetRole, message, type = 'info', meta = {}) {
        try {
            const q = query(collection(this.db, "users"), where("shopId", "==", shopId), where("role", "==", targetRole));
            const snapshot = await getDocs(q);

            const batchPromises = snapshot.docs.map(doc => {
                return addDoc(collection(this.db, "notifications"), {
                    userId: doc.id, // The specific staff member's UID
                    role: targetRole, // Also tag the role for redundancy
                    shopId: shopId,
                    message: message,
                    type: type,
                    read: false,
                    createdAt: serverTimestamp(),
                    ...meta
                });
            });
            await Promise.all(batchPromises);
        } catch (e) { console.error("Broadcast Error:", e); }
    }

    playAlarm() {
        this.alarmSound.currentTime = 0;
        this.alarmSound.play().catch(e => console.warn("Audio blocked. Interaction needed."));
        // Dispatch event to show "Stop Alarm" button in UI
        window.dispatchEvent(new CustomEvent('alarm-started'));
    }

    stopAlarm() {
        this.alarmSound.pause();
        this.alarmSound.currentTime = 0;
    }

    playBeep() {
        this.notificationSound.currentTime = 0;
        this.notificationSound.play().catch(e => console.warn("Audio blocked."));
    }

    async markRead(notifId) {
        if (!notifId) return;
        await updateDoc(doc(this.db, "notifications", notifId), { read: true });
    }

    async clearAll(notifList) {
        const batchPromises = notifList.map(n => deleteDoc(doc(this.db, "notifications", n.id)));
        await Promise.all(batchPromises);
    }
}

// ------------------------------------------------------------------------------------------------------
// --- Kitchen Notifier for Urgent Order Alerts ---
// ------------------------------------------------------------------------------------------------------
export class KitchenNotifier {
    constructor() {
        // High-pitch, repetitive alarm sound for urgency
        this.alarmAudio = new Audio("https://assets.mixkit.co/active_storage/sfx/995/995-preview.mp3");
        this.alarmAudio.loop = true; // Loops until stopped
        this.alarmAudio.volume = 1.0;

        this.isPlaying = false;
        this.hasInteracted = false;

        // Try to get permission only when enabled
        // this.requestNotificationPermission(); // REMOVED: Must be from user gesture

        // Bind stop function
        this.stopAlarm = this.stopAlarm.bind(this);
    }

    async requestNotificationPermission() {
        if ("Notification" in window) {
            const permission = await Notification.requestPermission();
            console.log("System Notification Permission:", permission);
        }
    }

    // Call this on the first user click (e.g., login or opening dashboard) to unlock AudioContext
    enableAudio() {
        if (!this.hasInteracted) {
            this.alarmAudio.play().then(() => {
                this.alarmAudio.pause();
                this.alarmAudio.currentTime = 0;
                this.hasInteracted = true;
                console.log("Audio enabled successfully");
            }).catch(e => console.warn("Audio autoplay blocked until interaction"));
        }
    }

    triggerNewOrderAlert(orderData) {
        // 1. Play Loud Alarm
        this.playAlarm();

        // 2. Show System Notification (Works even if tab is backgrounded)
        this.showSystemNotification(orderData);

        // 3. Vibrate device (if mobile)
        if (navigator.vibrate) {
            navigator.vibrate([500, 200, 500, 200, 500]);
        }
    }

    playAlarm() {
        if (this.isPlaying) return;

        this.isPlaying = true;
        this.alarmAudio.currentTime = 0;
        this.alarmAudio.play().catch(error => {
            console.error("Audio play failed (user interaction needed):", error);
            alert("NEW ORDER RECEIVED! (Click OK to stop sound)");
        });

        // Show the Stop Button in UI
        const stopBtn = document.getElementById('global-stop-alarm-btn');
        if (stopBtn) stopBtn.classList.remove('hidden');
    }

    stopAlarm() {
        this.isPlaying = false;
        this.alarmAudio.pause();
        this.alarmAudio.currentTime = 0;

        // Hide the Stop Button in UI
        const stopBtn = document.getElementById('global-stop-alarm-btn');
        if (stopBtn) stopBtn.classList.add('hidden');
    }

    showSystemNotification(order) {
        if (!("Notification" in window)) return;

        if (Notification.permission === "granted") {
            const notif = new Notification("🔔 NEW ORDER RECEIVED!", {
                body: `Order for ${order.customerName} - ₹${order.totalAmount}\nClick to view details.`,
                icon: './public/foodyVrinda-logo.png',
                requireInteraction: true, // Keeps notification on screen until clicked
                tag: 'new-order-alert'
            });

            notif.onclick = function () {
                window.focus();
                notif.close();
            };
        }
    }
}