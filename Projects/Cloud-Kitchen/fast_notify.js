import { collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

/**
 * A dedicated, high-speed notification system for Kitchens.
 * Listens directly to the 'orders' collection to bypass any delays 
 * in the secondary 'notifications' collection creation process.
 */
export class FastOrderMonitor {
    constructor(db, shopId) {
        this.db = db;
        this.shopId = shopId;
        this.unsubscribe = null;
        this.audioUnlocked = false;

        // Load a distinct, loud alarm sound
        // Using a different sound as requested (Emergency Alert style)
        this.alarmSound = new Audio("https://assets.mixkit.co/active_storage/sfx/995/995-preview.mp3"); 
        this.alarmSound.loop = true;
        this.alarmSound.volume = 1.0;
    }

    /**
     * Call this on a user click (e.g., login or "Enable Sound" button) 
     * to allow the browser to play audio.
     */
    enableAudio() {
        if (this.audioUnlocked) return;
        
        // Play and immediately pause to unlock the AudioContext
        this.alarmSound.play().then(() => {
            this.alarmSound.pause();
            this.alarmSound.currentTime = 0;
            this.audioUnlocked = true;
            console.log("🔊 Audio Context Unlocked - Alarms ready.");
        }).catch(err => {
            console.warn("Audio unlock failed (browser blocked):", err);
        });
    }

    /**
     * Starts monitoring for new orders in real-time.
     */
    startListening() {
        if (this.unsubscribe) this.unsubscribe();
        if (!this.shopId) {
            console.warn("FastOrderMonitor: No shopId provided.");
            return;
        }

        console.log(`🚀 Fast Monitor started for Shop: ${this.shopId}`);

        // Listen for ANY order with status 'new' for this shop
        const q = query(
            collection(this.db, "orders"),
            where("shopId", "==", this.shopId),
            where("status", "==", "new")
        );

        this.unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const orderData = change.doc.data();
                    
                    // Filter out old orders (e.g., older than 5 minutes) to prevent 
                    // alarm blasts on page reload
                    if (this.isOrderRecent(orderData)) {
                        console.log("🚨 NEW ORDER DETECTED DIRECTLY:", change.doc.id);
                        this.triggerAlert(orderData, change.doc.id);
                    }
                }
            });
        }, (error) => {
            console.error("Fast Monitor Error:", error);
        });
    }

    stopListening() {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
        this.stopAlarm();
    }

    isOrderRecent(order) {
        if (!order.createdAt) return true; // Fallback if no timestamp
        
        // Check if created within the last 5 minutes
        const now = Date.now();
        const orderTime = order.createdAt.toMillis ? order.createdAt.toMillis() : now;
        const fiveMinutes = 5 * 60 * 1000;
        
        return (now - orderTime) < fiveMinutes;
    }

    triggerAlert(order, orderId) {
        // 1. Play Loud Loop Alarm
        this.playAlarm();

        // 2. Browser System Notification (Works when tab is backgrounded)
        this.sendSystemNotification(order);

        // 3. Show Visual Modal (Dispatch event for UI to handle)
        window.dispatchEvent(new CustomEvent('fast-order-alert', { 
            detail: { order, orderId } 
        }));
    }

    playAlarm() {
        this.alarmSound.currentTime = 0;
        const playPromise = this.alarmSound.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.error("🔊 Audio play failed. User interaction required.");
            });
        }
    }

    stopAlarm() {
        this.alarmSound.pause();
        this.alarmSound.currentTime = 0;
    }

    sendSystemNotification(order) {
        if (!("Notification" in window)) return;

        // Request permission if not already granted/denied
        if (Notification.permission === "default") {
            Notification.requestPermission();
        }

        if (Notification.permission === "granted") {
            // Using the Service Worker if available for better background handling
            if (navigator.serviceWorker && navigator.serviceWorker.controller) {
                navigator.serviceWorker.ready.then(reg => {
                    reg.showNotification("🔥 NEW ORDER!", {
                        body: `Customer: ${order.customerName}\nAmount: ₹${order.totalAmount}\nClick to View!`,
                        icon: './icon.svg',
                        vibrate: [200, 100, 200, 100, 200],
                        tag: 'new-order-' + Date.now(),
                        requireInteraction: true // Keeps it on screen
                    });
                });
            } else {
                // Fallback to standard Notification API
                const notif = new Notification("🔥 NEW ORDER!", {
                    body: `Customer: ${order.customerName}\nTotal: ₹${order.totalAmount}`,
                    icon: './icon.svg',
                    requireInteraction: true
                });
                
                notif.onclick = () => {
                    window.focus();
                    notif.close();
                };
            }
        }
    }
}