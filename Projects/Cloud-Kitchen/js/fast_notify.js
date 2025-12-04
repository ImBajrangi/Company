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
        this.role = null; // Store role for filtering

        // Loud alarm sound
        this.alarmSound = new Audio("https://assets.mixkit.co/active_storage/sfx/995/995-preview.mp3");
        this.alarmSound.loop = true;
        this.alarmSound.volume = 1.0;
        this.isPlaying = false; // Track internal alarm state
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

        this.role = role;

        // Determine the status to watch based on role
        let statusToWatch;
        if (role === 'delivery') {
            statusToWatch = 'ready_for_pickup';
        } else {
            // Kitchen, Owner watch for brand new orders
            statusToWatch = 'new';
        }

        console.log(`🔊 Fast Monitor started for Shop: ${this.shopId} | Role: ${role} | Watching: ${statusToWatch}`);

        // FIX: The query must only contain the shopId where clause to avoid the composite index error,
        // as onSnapshot uses internal ordering that conflicts with multiple where clauses unless indexed.
        const q = query(
            collection(this.db, "orders"),
            where("shopId", "==", this.shopId)
        );

        this.unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                const orderData = change.doc.data();

                // 1. Filter locally for the watched status
                if (orderData.status !== statusToWatch) {
                    return; // Ignore orders not matching the required status
                }

                // 2. Check if this is a newly added order in this status view
                // 'added' event fires when a document is created OR when a document 
                // changes status and enters the query result set (which only filters on shopId here).
                // We rely on the 'added' type to catch the status transition.
                if (change.type === "added") {
                    
                    // 3. Only alert if the order is recent (to avoid false alerts on page refresh/load)
                    if (this.isOrderRecent(orderData)) {
                        console.log(`🔊 ALERT (${this.role}):`, change.doc.id);
                        
                        const alertTitle = this.role === 'delivery' ? "ORDER READY!" : "NEW ORDER!";
                        
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
        // If the order has a 'createdAt' timestamp, check if it's less than 5 minutes old.
        // This mitigates the issue of re-alerting on browser refresh for old, untouched orders.
        const now = Date.now();
        const orderTime = order.createdAt?.toMillis ? order.createdAt.toMillis() : now;
        const fiveMinutes = 5 * 60 * 1000;

        // If the order is a new status change (caught by the change.type === "added" above),
        // we can assume it's recent for the purpose of alarming, but keep the timestamp check
        // for robustness.
        return (now - orderTime) < fiveMinutes || (now - orderTime) < (24 * 60 * 60 * 1000); // Also allow alarms for up to 24 hours just in case the alarm was missed.
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
        if (this.isPlaying) return;
        this.isPlaying = true; // Set internal state

        this.alarmSound.currentTime = 0;
        const playPromise = this.alarmSound.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => console.error("🔊 Audio play failed. Interaction needed."));
        }
    }

    stopAlarm() {
        this.isPlaying = false; // Reset internal state
        this.alarmSound.pause();
        this.alarmSound.currentTime = 0;
    }

    sendSystemNotification(order, title) {
        if (!("Notification" in window)) return;
        if (Notification.permission === "default") Notification.requestPermission();

        if (Notification.permission === "granted") {
            const options = {
                body: `${order.customerName}\nTotal: ₹${order.totalAmount}`,
                icon: './public/icon.svg',
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
