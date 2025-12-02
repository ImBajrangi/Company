import { db, auth } from "./firebase-config.js";
import { collection, addDoc, serverTimestamp, query, where, orderBy, limit, onSnapshot, updateDoc, doc, writeBatch } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { showToast, showAlert } from "./utils.js";

let allNotifications = [];
let notificationListener = null;

/**
 * Sends a notification to a user or role.
 * @param {Object} data - { userId, role, shopId, message, orderId }
 */
export async function createNotification(data) {
    if (!db) return;
    try {
        if (data.userId || data.role) {
            await addDoc(collection(db, "notifications"), { ...data, createdAt: serverTimestamp(), read: false });
        }
    } catch (error) { console.error("Error creating notification:", error); }
}

/**
 * Listens for notifications for the current user.
 * @param {string} userRole 
 * @param {string} userId 
 * @param {string} currentUserShopId 
 */
export function listenForNotifications(userRole, userId, currentUserShopId) {
    if (notificationListener) notificationListener();
    if (!auth.currentUser || auth.currentUser.isAnonymous) { updateNotificationUI([]); return; }

    let q;
    if (userRole === 'customer') {
        q = query(collection(db, "notifications"), where("userId", "==", userId), orderBy("createdAt", "desc"), limit(20));
    } else if (currentUserShopId && ['kitchen', 'delivery', 'owner'].includes(userRole)) {
        q = query(collection(db, "notifications"), where("shopId", "==", currentUserShopId), where("role", "==", userRole), orderBy("createdAt", "desc"), limit(20));
    } else if (userRole === 'developer' && currentUserShopId) {
        q = query(collection(db, "notifications"), where("shopId", "==", currentUserShopId), orderBy("createdAt", "desc"), limit(50));
    } else {
        updateNotificationUI([]); return;
    }

    notificationListener = onSnapshot(q, (snapshot) => {
        allNotifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        updateNotificationUI(allNotifications);
    }, (error) => { console.error("Error listening for notifications:", error); });
}

function updateNotificationUI(notifications) {
    const listEl = document.getElementById('notification-list');
    const dotEl = document.getElementById('notification-dot');
    const panelEl = document.getElementById('notification-panel');
    if (!listEl || !dotEl || !panelEl) return;

    const unreadCount = notifications.filter(n => !n.read).length;
    dotEl.classList.toggle('hidden', unreadCount === 0);

    if (unreadCount > 0 && notifications.length > 0) {
        const latest = notifications[0];
        const now = Date.now();
        const notifTime = latest.createdAt ? latest.createdAt.toMillis() : now;
        
        // Only notify if the notification is new (within last 10 seconds) and unread
        if (now - notifTime < 10000 && !latest.read) {
            
            // 1. Play Sound
            const audio = document.getElementById('notification-sound');
            if (audio) audio.play().catch(e => console.log("Audio play prevented by browser:", e));
            
            // 2. Vibrate Device
            if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
            
            // 3. Show In-App Toast
            showToast(latest.message, 'info');

            // 4. Show System Notification (Status Bar)
            if (Notification.permission === 'granted') {
                navigator.serviceWorker.ready.then(registration => {
                    registration.showNotification('Cloud Kitchen Update', { 
                        body: latest.message, 
                        icon: './icon.svg', 
                        badge: './icon.svg',
                        vibrate: [200, 100, 200], 
                        tag: latest.id, // Prevents duplicate notifications
                        renotify: true,
                        data: {
                            orderId: latest.orderId,
                            url: './kitchen.html'
                        }
                    });
                });
            }
        }
    }

    if (notifications.length === 0) {
        listEl.innerHTML = `<p class="p-4 text-gray-500 text-center">No notifications.</p>`;
    } else {
        listEl.innerHTML = notifications.map(n => {
            const time = n.createdAt ? new Date(n.createdAt.toMillis()).toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', day: 'numeric', month: 'short' }) : 'Just now';
            // Note: window.markNotificationReadAndOpenOrder and window.markSingleNotificationRead must be defined in app.js
            const linkAction = n.orderId ? `onclick="window.markNotificationReadAndOpenOrder('${n.id}', '${n.orderId}')"` : `onclick="window.markSingleNotificationRead('${n.id}')"`;
            return `<div class="p-4 hover:bg-gray-50 ${n.read ? 'opacity-70' : 'font-medium bg-blue-50 cursor-pointer'}" ${linkAction}><p class="text-sm text-gray-800">${n.message}</p><p class="text-xs text-gray-500 mt-1">${time}</p></div>`;
        }).join('');
    }
}

export async function markSingleNotificationRead(id) {
    if (!db) return;
    try { await updateDoc(doc(db, "notifications", id), { read: true }); } catch (error) { console.error("Error marking single notification as read:", error); }
}

export async function markNotificationsAsRead() {
    const unreadIds = allNotifications.filter(n => !n.read).map(n => n.id);
    if (unreadIds.length === 0) return;
    try {
        const batch = writeBatch(db);
        unreadIds.forEach(id => batch.update(doc(db, "notifications", id), { read: true }));
        await batch.commit();
    } catch (error) { console.error("Error marking notifications as read:", error); }
}

export async function clearAllNotifications() {
    if (allNotifications.length === 0) return;
    showAlert("Are you sure you want to clear all your notifications?", false, async () => {
        try {
            const batch = writeBatch(db);
            allNotifications.forEach(n => batch.delete(doc(db, "notifications", n.id)));
            await batch.commit();
            updateNotificationUI([]);
            document.getElementById('notification-panel').classList.add('hidden');
        } catch (error) { console.error("Error clearing notifications:", error); showAlert("Failed to clear notifications.", true); }
    });
}
