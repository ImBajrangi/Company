import { db, auth } from "./firebase-config.js";
import { collection, addDoc, serverTimestamp, query, where, orderBy, limit, onSnapshot, updateDoc, doc, writeBatch } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { showToast, showAlert } from "./utils.js";

let allNotifications = [];
let notificationListener = null;
let lastPlayedSound = 0;

/**
 * Sends a notification to a user or role.
 * @param {Object} data - { userId, role, shopId, message, orderId }
 */
export async function createNotification(data) {
    if (!db) return;
    try {
        // We write to Firestore, which triggers the listeners on other devices immediately
        await addDoc(collection(db, "notifications"), { 
            ...data, 
            createdAt: serverTimestamp(), 
            read: false,
            priority: 'high' // Mark as high priority
        });
    } catch (error) { console.error("Error creating notification:", error); }
}

/**
 * Listens for notifications for the current user.
 */
export function listenForNotifications(userRole, userId, currentUserShopId) {
    // Unsubscribe previous listener if exists
    if (notificationListener) {
        notificationListener();
        notificationListener = null;
    }

    if (!auth.currentUser && !userId) { 
        updateNotificationUI([]); 
        return; 
    }

    let q;
    // 1. Customer: Listen for their own ID
    if (userRole === 'customer') {
        q = query(collection(db, "notifications"), where("userId", "==", userId), orderBy("createdAt", "desc"), limit(20));
    } 
    // 2. Staff/Owner: Listen for their specific Role AND Shop ID
    else if (currentUserShopId && ['kitchen', 'delivery', 'owner'].includes(userRole)) {
        q = query(collection(db, "notifications"), where("shopId", "==", currentUserShopId), where("role", "==", userRole), orderBy("createdAt", "desc"), limit(20));
    } 
    // 3. Developer: Listen for everything in the shop
    else if (userRole === 'developer' && currentUserShopId) {
        q = query(collection(db, "notifications"), where("shopId", "==", currentUserShopId), orderBy("createdAt", "desc"), limit(50));
    } else {
        return;
    }

    notificationListener = onSnapshot(q, (snapshot) => {
        const changes = snapshot.docChanges();
        allNotifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Handle NEW notifications that just arrived
        changes.forEach((change) => {
            if (change.type === "added") {
                const notif = change.doc.data();
                // Check if it's truly new (created in the last 30 seconds) to avoid spam on reload
                const now = Date.now();
                const notifTime = notif.createdAt ? notif.createdAt.toMillis() : now;
                
                if (!notif.read && (now - notifTime < 30000)) {
                    triggerDeviceNotification(notif);
                }
            }
        });

        updateNotificationUI(allNotifications);
    }, (error) => { console.error("Error listening for notifications:", error); });
}

function triggerDeviceNotification(notif) {
    // 1. Play Sound (Throttled to once every 2 seconds)
    const now = Date.now();
    if (now - lastPlayedSound > 2000) {
        const audio = document.getElementById('notification-sound');
        if (audio) {
            audio.play().catch(e => console.log("Audio play prevented (user interaction required first)."));
            lastPlayedSound = now;
        }
    }
    
    // 2. Vibrate Device (Aggressive pattern)
    if (navigator.vibrate) {
        navigator.vibrate([500, 200, 500, 200, 500]);
    }
    
    // 3. Show In-App Toast
    showToast(notif.message, 'info');

    // 4. Show System Notification (Service Worker)
    // This allows notifications even if the tab is in the background (on supported browsers)
    if (Notification.permission === 'granted' && 'serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
            registration.showNotification('Cloud Kitchen Update', { 
                body: notif.message, 
                icon: './icon.svg', 
                badge: './icon.svg',
                vibrate: [500, 200, 500], 
                tag: notif.id || 'general-notification', 
                renotify: true, // Re-alert even if tag exists
                requireInteraction: true, // KEEPS NOTIFICATION ON SCREEN until user clicks
                data: {
                    orderId: notif.orderId,
                    url: './kitchen.html'
                },
                actions: [
                    { action: 'view', title: 'View Order' }
                ]
            });
        });
    }
}

function updateNotificationUI(notifications) {
    const listEl = document.getElementById('notification-list');
    const dotEl = document.getElementById('notification-dot');
    
    if (!listEl || !dotEl) return;

    const unreadCount = notifications.filter(n => !n.read).length;
    dotEl.classList.toggle('hidden', unreadCount === 0);

    if (notifications.length === 0) {
        listEl.innerHTML = `<p class="p-4 text-gray-500 text-center">No notifications.</p>`;
    } else {
        listEl.innerHTML = notifications.map(n => {
            const time = n.createdAt ? new Date(n.createdAt.toMillis()).toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', month: 'short', day: 'numeric' }) : 'Just now';
            // Note: Functions attached to window in app.js
            const linkAction = n.orderId ? `onclick="window.markNotificationReadAndOpenOrder('${n.id}', '${n.orderId}')"` : `onclick="window.markSingleNotificationRead('${n.id}')"`;
            
            return `
                <div class="p-4 border-b hover:bg-gray-50 transition-colors cursor-pointer ${n.read ? 'opacity-60' : 'bg-blue-50 border-l-4 border-l-blue-500'}" ${linkAction}>
                    <div class="flex justify-between items-start">
                        <p class="text-sm text-gray-900 font-medium">${n.message}</p>
                        ${!n.read ? '<span class="w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></span>' : ''}
                    </div>
                    <p class="text-xs text-gray-500 mt-1">${time}</p>
                </div>
            `;
        }).join('');
    }
}

export async function markSingleNotificationRead(id) {
    if (!db || !id) return;
    try { await updateDoc(doc(db, "notifications", id), { read: true }); } catch (error) { console.error("Error marking read:", error); }
}

export async function markNotificationsAsRead() {
    const unreadIds = allNotifications.filter(n => !n.read).map(n => n.id);
    if (unreadIds.length === 0) return;
    try {
        const batch = writeBatch(db);
        unreadIds.forEach(id => batch.update(doc(db, "notifications", id), { read: true }));
        await batch.commit();
    } catch (error) { console.error("Error marking batch read:", error); }
}

export async function clearAllNotifications() {
    if (allNotifications.length === 0) return;
    showAlert("Clear all notifications?", false, async () => {
        try {
            const batch = writeBatch(db);
            allNotifications.forEach(n => batch.delete(doc(db, "notifications", n.id)));
            await batch.commit();
            updateNotificationUI([]);
        } catch (error) { console.error("Error clearing:", error); }
    });
}