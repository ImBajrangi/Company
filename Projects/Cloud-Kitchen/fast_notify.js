import { collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

/**
 * A dedicated, high-speed notification system.
 * Listens directly to the 'orders' collection.
 * - Kitchen/Owner: Listens for 'new' orders.
 * - Delivery: Listens for 'ready_for_pickup' orders.
 */
export class FastOrderMonitor {
    constructor(db, shopId) {
        this.db = db;
        this.shopId = shopId;
        this.unsubscribe = null;
        this.audioUnlocked = false;

        // Loud alarm sound
        this.alarmSound = new Audio("https://assets.mixkit.co/active_storage/sfx/995/995-preview.mp3");
        this.alarmSound.loop = true;
        this.alarmSound.volume = 1.0;
    }

    enableAudio() {
        if (this.audioUnlocked) return;
        this.alarmSound.play().then(() => {
            this.alarmSound.pause();
            this.alarmSound.currentTime = 0;
            this.audioUnlocked = true;
            console.log("🔊 Audio Context Unlocked");
        }).catch(err => console.warn("Audio unlock failed:", err));
    }

    /**
     * Starts monitoring based on the user's role.
     * @param {string} role - 'kitchen', 'owner', or 'delivery'
     */
    startListening(role) {
        if (this.unsubscribe) this.unsubscribe();
        if (!this.shopId) return;

        let statusToWatch = 'new';
        let alertTitle = "🔥 NEW ORDER!";

        // Delivery staff needs to know when food is READY
        if (role === 'delivery') {
            statusToWatch = 'ready_for_pickup';
            alertTitle = "📦 ORDER READY!";
        }

        console.log(`🚀 Fast Monitor started for Shop: ${this.shopId} | Role: ${role} | Watching: ${statusToWatch}`);

        const q = query(
            collection(this.db, "orders"),
            where("shopId", "==", this.shopId),
            where("status", "==", statusToWatch)
        );

        this.unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") { // New document added to this status query
                    const orderData = change.doc.data();

                    // Only alert if the change happened recently (avoid alerts on page refresh for old orders)
                    if (this.isOrderRecent(orderData)) {
                        console.log(`🚨 ALERT (${role}):`, change.doc.id);
                        this.triggerAlert(orderData, change.doc.id, alertTitle);
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
        // We use a slightly different logic here depending on status if needed, 
        // but generally checking createdAt vs now is a safe fallback for 'new'.
        // For 'ready_for_pickup', strictly speaking we should check 'updatedAt', 
        // but since we don't always track that, we'll rely on the real-time listener 'added' event 
        // which fires when a doc enters the query view.
        // To be safe against page refreshes, we ignore orders created > 2 hours ago.

        const now = Date.now();
        const orderTime = order.createdAt?.toMillis ? order.createdAt.toMillis() : now;
        const twoHours = 2 * 60 * 60 * 1000;

        // Simple check: if order is ancient, ignore it on load. 
        // The real-time 'added' event handles new status changes for existing docs correctly.
        return (now - orderTime) < twoHours;
    }

    triggerAlert(order, orderId, title) {
        this.playAlarm();
        this.sendSystemNotification(order, title);

        // Dispatch event for UI to handle (Show Stop Button)
        window.dispatchEvent(new CustomEvent('fast-order-alert', {
            detail: { order, orderId, title }
        }));
    }

    playAlarm() {
        this.alarmSound.currentTime = 0;
        const playPromise = this.alarmSound.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => console.error("🔊 Audio play failed. Interaction needed."));
        }
    }

    stopAlarm() {
        this.alarmSound.pause();
        this.alarmSound.currentTime = 0;
    }

    sendSystemNotification(order, title) {
        if (!("Notification" in window)) return;
        if (Notification.permission === "default") Notification.requestPermission();

        if (Notification.permission === "granted") {
            const options = {
                body: `${order.customerName}\nTotal: ₹${order.totalAmount}`,
                icon: './icon.svg',
                requireInteraction: true,
                tag: 'alert-' + Date.now()
            };

            if (navigator.serviceWorker && navigator.serviceWorker.controller) {
                navigator.serviceWorker.ready.then(reg => reg.showNotification(title, options));
            } else {
                const notif = new Notification(title, options);
                notif.onclick = () => { window.focus(); notif.close(); };
            }
        }
    }
}
