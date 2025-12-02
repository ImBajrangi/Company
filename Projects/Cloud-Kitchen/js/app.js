import { app, db, auth, isFirebaseReady } from "./firebase-config.js";
import { onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { collection, addDoc, onSnapshot, doc, updateDoc, query, where, serverTimestamp, getDoc, setDoc, getDocs, orderBy, deleteDoc, limit, startAfter, Timestamp, endAt, endBefore, startAt, writeBatch } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { showAlert, showToast, initAlertSystem } from "./utils.js";
import { createNotification, listenForNotifications, markSingleNotificationRead, markNotificationsAsRead, clearAllNotifications } from "./notifications.js";

const DEVELOPER_EMAIL = "dev@example.com";

let userRole = 'customer';
let userId = null;
let userEmail = 'Guest';
let currentUserShopId = null;
let currentShopName = null;

let cart = [];
let staffCart = [];
let currentTrackingOrderId = null;
let isEditingOrder = false;
let currentOrderListener = null;

let salesChartInstance = null;
let statusChartInstance = null;
let completedOrders = [];
let historyFilter = 'week';

let allUsersCache = [];
let userSortCriteria = 'email';
let userSortDirection = 'asc';
let orderDateFilter = 'all';
let orderQueryLimit = 10;
let orderFirstVisibleDoc = null;
let orderLastVisibleDoc = null;
let orderCurrentPage = 1;
let orderQueryUnsubscribe = null;

let allShops = [];
let currentMenu = [];
let selectedShopId = null;

const authBtn = document.getElementById('auth-btn');
const authStatusEl = document.getElementById('auth-status');
const createOrderModal = document.getElementById('create-order-modal');
const viewSwitcher = document.getElementById('view-switcher');
const views = {
    customer: document.getElementById('customer-view'),
    kitchen: document.getElementById('kitchen-view'),
    transport: document.getElementById('transport-view'),
    owner: document.getElementById('owner-view'),
    developer: document.getElementById('developer-view'),
};
const prevOrdersBtn = document.getElementById('prev-orders-btn');
const nextOrdersBtn = document.getElementById('next-orders-btn');
const orderPageInfoEl = document.getElementById('order-page-info');

// Initialize Alert System
initAlertSystem();

// Expose notification functions to window for HTML onclick attributes
window.markSingleNotificationRead = markSingleNotificationRead;
window.markNotificationReadAndOpenOrder = async (notificationId, orderId) => {
    await markSingleNotificationRead(notificationId);
    document.getElementById('notification-panel').classList.add('hidden');
    
    // Route to correct view based on role
    if (userRole === 'customer') {
         document.querySelector('[data-view="customer"]').click();
         // Tracking logic will pick up latest order
    } else {
        // For staff, try to find the order in the relevant list
        const targetView = (userRole === 'delivery' || userRole === 'transport') ? 'transport' : 'kitchen';
        const viewButton = document.querySelector(`button[data-view="${targetView}"]`);
        
        if (viewButton && !viewButton.classList.contains('hidden')) {
            viewButton.click();
            // Highlight the order if possible
            setTimeout(() => {
               const orderCard = document.querySelector(`button[data-id="${orderId}"]`);
               if(orderCard) orderCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
        }
    }
};

document.getElementById('create-order-close-btn').addEventListener('click', () => createOrderModal.classList.add('hidden'));
document.getElementById('create-order-btn').addEventListener('click', () => {
    if (!currentUserShopId) {
        const msg = (userRole === 'developer') ? "Please select a shop from the Dev Panel first." : "You must be assigned to a shop to create orders.";
        return showAlert(msg, true);
    }
    renderCreateOrderModal(currentUserShopId);
    createOrderModal.classList.remove('hidden');
});

// --- Service Worker Message Listener (For Mobile Notifications) ---
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.action === 'OPEN_ORDER') {
            const orderId = event.data.orderId;
            if (userRole === 'customer') {
                document.querySelector('[data-view="customer"]').click();
            } else if (['kitchen', 'owner'].includes(userRole)) {
                document.querySelector('[data-view="kitchen"]').click();
            } else if (['delivery', 'owner'].includes(userRole)) {
                document.querySelector('[data-view="transport"]').click();
            }
        }
    });
}

// --- Profile/Login Modal Logic ---
function openProfileModal(isForced = false) {
    const profileModal = document.getElementById('profile-modal');
    const profileContent = document.getElementById('profile-content');
    if (!profileModal || !profileContent) return;

    document.getElementById('notification-panel').classList.add('hidden');

    if (!auth.currentUser || auth.currentUser.isAnonymous) {
        profileContent.innerHTML = `
            <form id="email-auth-form" class="space-y-4">
                <h3 class="text-xl font-semibold">${isForced ? 'Login Required' : 'Login or Sign Up'}</h3>
                ${isForced ? '<p class="text-red-500 text-sm mb-4">You need to log in or sign up to place an order.</p>' : ''}
                <div><label class="block text-sm">Email</label><input type="email" id="auth-email" class="w-full" required></div>
                <div><label class="block text-sm">Password</label><input type="password" id="auth-password" class="w-full" required></div>
                <div class="flex gap-4">
                    <button type="submit" id="login-btn" class="btn-primary flex-1">Login</button>
                    <button type="button" id="signup-btn" class="btn-primary flex-1 bg-gray-600">Sign Up</button>
                </div>
            </form>
            <div class="relative my-6"><div class="absolute inset-0 flex items-center"><span class="w-full border-t"></span></div><div class="relative flex justify-center text-sm"><span class="bg-white px-2 text-gray-500">OR</span></div></div>
            <button id="google-login-btn" class="btn-primary w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2">
                Continue with Google
            </button>
        `;
    } else {
        let shopInfo = currentUserShopId ? `Shop: ${currentShopName || currentUserShopId.substring(0, 6)}` : 'No shop assigned';
        if (userRole === 'customer' || (userRole === 'developer' && !currentShopName)) shopInfo = '';

        profileContent.innerHTML = `
            <h3 class="text-xl font-semibold">${userEmail}</h3>
            <p class="capitalize">Role: ${userRole}</p>
            ${shopInfo ? `<p class="capitalize">${shopInfo}</p>` : ''}
            <button id="logout-btn" class="btn-primary w-full mt-4 bg-red-600">Logout</button>
        `;
    }

    const form = document.getElementById('email-auth-form');
    if (form) {
        form.addEventListener('submit', e => handleEmailAuth(e, false));
        document.getElementById('signup-btn')?.addEventListener('click', e => handleEmailAuth(e, true));
    }
    document.getElementById('google-login-btn')?.addEventListener('click', handleGoogleLogin);
    document.getElementById('logout-btn')?.addEventListener('click', () => {
        signOut(auth);
        profileModal.classList.add('hidden');
        cart = [];
        selectedShopId = null;
        currentUserShopId = null;
        currentShopName = null;
        showShopSelector();
    });

    profileModal.classList.remove('hidden');
}

authBtn.addEventListener('click', () => openProfileModal(false));
document.getElementById('profile-close').addEventListener('click', () => document.getElementById('profile-modal').classList.add('hidden'));

async function loadAllShops() {
    try {
        const snapshot = await getDocs(collection(db, "shops"));
        allShops = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderShopSelector();
        if (userRole === 'developer') {
            populateShopDropdowns();
            renderDevShopList();
        }
        updateDevSummary();
    } catch (error) {
        console.error("Failed to load shops.", error);
    }
}

let authInitialized = false;
async function setupUser(user) {
    authInitialized = true;
    currentUserShopId = null;
    currentShopName = null;

    if (user) {
        userId = user.uid;
        userEmail = user.email || 'Guest';

        if (user.isAnonymous) {
            userRole = 'customer';
            userEmail = 'Guest';
        } else if (user.email === DEVELOPER_EMAIL) {
            userRole = 'developer';
            await setDoc(doc(db, "users", userId), { email: user.email, role: 'developer' }, { merge: true });
        } else {
            const userDocSnap = await getDoc(doc(db, "users", userId));
            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                userRole = userData.role || 'customer';
                currentUserShopId = userData.shopId || null;
                if (currentUserShopId) {
                    if (allShops.length === 0) await loadAllShops();
                    const shop = allShops.find(s => s.id === currentUserShopId);
                    if (shop) currentShopName = shop.name;
                    else {
                        const shopDoc = await getDoc(doc(db, "shops", currentUserShopId));
                        if (shopDoc.exists()) currentShopName = shopDoc.data().name;
                    }
                }
            } else {
                userRole = 'customer';
                await setDoc(doc(db, "users", userId), { email: user.email, role: 'customer' });
            }
        }
    } else {
        if (isFirebaseReady) {
            try {
                const anonUser = await signInAnonymously(auth);
                userId = anonUser.user.uid;
            } catch (e) {
                userId = 'offline-' + Math.random().toString(36).substring(2);
            }
        }
        userEmail = 'Guest (Offline)';
        userRole = 'customer';
    }

    updateAuthStatusUI();
    updateVisibleViews();
    renderCustomerUI();
    
    // Use imported notification listener
    listenForNotifications(userRole, userId, currentUserShopId);

    if (user) {
        if (currentUserShopId) {
            if (['owner', 'developer'].includes(userRole)) { loadOwnerDashboard(); listenToOrderHistory(); }
            if (['kitchen', 'delivery', 'owner', 'developer'].includes(userRole)) { listenToStaffOrders(); }
            document.getElementById('kitchen-view-title').textContent = currentShopName || 'Kitchen';
            document.getElementById('transport-view-title').textContent = currentShopName || 'Delivery';
            document.getElementById('owner-view-title').textContent = currentShopName ? `${currentShopName} - Dashboard` : 'Owner Dashboard';
        }

        if (userRole === 'developer') {
            await loadDeveloperPanel();
            runSystemTests();
            updateDevSummary();
        }
    }
}

if (isFirebaseReady) {
    await loadAllShops();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        await setupUser(user);
        unsubscribe();
        onAuthStateChanged(auth, async (user) => {
            if (authInitialized) await setupUser(user);
        });
    });
}

function updateAuthStatusUI() {
    let statusText = 'Guest';
    if (userEmail !== 'Guest' && !userEmail.includes('Offline')) {
        statusText = `${userEmail.split('@')[0]} (${userRole})`;
    }
    authStatusEl.textContent = statusText;
    authBtn.textContent = (userEmail === 'Guest' || userEmail.includes('Offline')) ? 'Login' : 'Profile';
    let subtitle = 'Find your favorite local kitchens';
    if (currentShopName) {
        if (userRole === 'developer') subtitle = `Dev View: ${currentShopName}`;
        else if (userRole === 'customer') subtitle = `Ordering from ${currentShopName}`;
        else subtitle = `Managing: ${currentShopName}`;
    }
    document.getElementById('header-subtitle').textContent = subtitle;
}

function updateVisibleViews() {
    const isPureCustomer = userRole === 'customer' && !currentUserShopId && userEmail !== DEVELOPER_EMAIL;
    document.getElementById('view-switcher').classList.toggle('hidden', isPureCustomer);

    const devAccess = userRole === 'developer';
    const canSeeKitchen = devAccess || (['kitchen', 'owner'].includes(userRole) && currentUserShopId);
    const canSeeTransport = devAccess || (['delivery', 'owner'].includes(userRole) && currentUserShopId);
    const canSeeOwner = devAccess || (['owner'].includes(userRole) && currentUserShopId);

    document.querySelector('[data-view="kitchen"]').classList.toggle('hidden', !canSeeKitchen);
    document.querySelector('[data-view="transport"]').classList.toggle('hidden', !canSeeTransport);
    document.querySelector('[data-view="owner"]').classList.toggle('hidden', !canSeeOwner);
    document.querySelector('[data-view="developer"]').classList.toggle('hidden', !devAccess);

    if (!canSeeKitchen && !canSeeTransport && !canSeeOwner && !devAccess) {
        if (document.querySelector('[data-view="customer"]')) {
            Array.from(viewSwitcher.querySelectorAll('button')).forEach(btn => btn.classList.remove('btn-active'));
            document.querySelector('[data-view="customer"]').classList.add('btn-active');
        }
    }
}

function renderCustomerUI() {
    renderOrderForm();
    startTrackingLatestOrder();
    showShopSelector();
}

function renderShopSelector() {
    const container = document.getElementById('shop-list-container');
    if (!container) return;
    if (allShops.length === 0) {
        container.innerHTML = '<p class="text-gray-500 col-span-full text-center">No kitchens are currently available.</p>';
        return;
    }
    container.innerHTML = allShops.map(shop => `
        <div class="shop-card card p-0 cursor-pointer" data-shop-id="${shop.id}" data-shop-name="${shop.name}">
            <div class="relative w-full h-40 bg-gray-200 overflow-hidden">
                <img src="${shop.image || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22600%22 height=%22400%22%3E%3Crect fill=%22%23e5e7eb%22 width=%22600%22 height=%22400%22/%3E%3Ctext fill=%22%23999%22 font-family=%22sans-serif%22 font-size=%2224%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3EShop%3C/text%3E%3C/svg%3E'}" 
                     alt="${shop.name}" class="w-full h-full object-cover" loading="lazy">
            </div>
            <div class="p-5">
                <h3 class="text-lg font-semibold">${shop.name}</h3>
                <p class="text-gray-600 text-sm">${shop.address || 'No address provided'}</p>
            </div>
        </div>
    `).join('');
}

document.getElementById('shop-list-container').addEventListener('click', (e) => {
    const card = e.target.closest('.shop-card');
    if (card) selectShop(card.dataset.shopId, card.dataset.shopName);
});

document.getElementById('back-to-shops').addEventListener('click', showShopSelector);

function showShopSelector() {
    document.getElementById('shop-selector-view').style.display = 'block';
    document.getElementById('menu-and-cart-view').style.display = 'none';
    selectedShopId = null;
    currentMenu = [];
    cart = [];
    updateCart();
}

async function selectShop(shopId, shopName) {
    selectedShopId = shopId;
    document.getElementById('shop-selector-view').style.display = 'none';
    document.getElementById('menu-and-cart-view').style.display = 'block';
    document.getElementById('menu-shop-name').textContent = shopName;
    if (userRole === 'customer') {
        document.getElementById('header-subtitle').textContent = `Ordering from ${shopName}`;
    }
    await renderMenu(shopId);
}

async function renderMenu(shopId) {
    const container = document.getElementById('menu-items');
    if (!container) return;
    container.innerHTML = '<p class="text-gray-500">Loading menu...</p>';

    try {
        const menuSnapshot = await getDocs(query(collection(db, "menus"), where("shopId", "==", shopId)));
        currentMenu = menuSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (currentMenu.length === 0) {
            container.innerHTML = '<p class="text-gray-500 col-span-full text-center">This kitchen has not set up its menu yet.</p>';
            return;
        }

        container.innerHTML = '';
        currentMenu.forEach(item => {
            const cartItem = cart.find(ci => ci.id === item.id);
            let buttonHTML;
            if (cartItem) {
                buttonHTML = `
                    <div class="quantity-selector mt-4">
                        <button class="quantity-btn quantity-minus" data-id="${item.id}">-</button>
                        <span class="quantity-display">${cartItem.quantity}</span>
                        <button class="quantity-btn quantity-plus" data-id="${item.id}">+</button>
                    </div>
                `;
            } else {
                buttonHTML = `<button data-id="${item.id}" class="add-to-cart-btn mt-4 btn-primary w-full">Add to Cart</button>`;
            }
            container.innerHTML += `
                <div class="menu-item card p-0">
                    <div class="relative w-full h-40 bg-gray-200 overflow-hidden">
                        <img src="${item.image || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22600%22 height=%22400%22%3E%3Crect fill=%22%23e5e7eb%22 width=%22600%22 height=%22400%22/%3E%3Ctext fill=%22%23999%22 font-family=%22sans-serif%22 font-size=%2224%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3EItem%3C/text%3E%3C/svg%3E'}" 
                             alt="${item.name}" class="w-full h-full object-cover" loading="lazy">
                    </div>
                    <div class="p-5">
                        <h3 class="text-lg font-semibold">${item.name}</h3>
                        <p class="text-gray-600">₹${item.price}</p>
                        ${buttonHTML}
                    </div>
                </div>`;
        });
    } catch (error) {
        console.error("Error loading menu:", error);
    }
}

function updateCart() {
    const itemsEl = document.getElementById('cart-items');
    const summaryEl = document.getElementById('cart-summary');
    if (!itemsEl || !summaryEl) return;

    if (cart.length === 0) {
        itemsEl.innerHTML = '<p class="text-gray-400 text-center py-8">Your cart is empty</p>';
        summaryEl.innerHTML = '';
        return;
    }

    let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    itemsEl.innerHTML = cart.map(item => `
        <div class="flex justify-between items-center">
            <div><p class="font-medium">${item.name}</p><p class="text-sm text-gray-500">₹${item.price} x ${item.quantity}</p></div>
            <span class="font-semibold w-16 text-right">₹${item.price * item.quantity}</span>
        </div>`).join('');
    summaryEl.innerHTML = `<div class="flex justify-between font-bold text-xl"><span>Total</span><span>₹${total}</span></div>`;
}

function renderOrderForm(order = null) {
    const container = document.getElementById('order-form-container');
    if (!container) return;
    const isUpdate = !!order;
    container.innerHTML = `
        <h2 class="text-xl font-semibold text-gray-900 mb-4">${isUpdate ? 'Update Your Order' : 'Delivery Details'}</h2>
        <form id="order-form" class="space-y-4" data-mode="${isUpdate ? 'update' : 'create'}">
            <div><label class="block text-sm font-medium">Name</label><input type="text" id="customer-name" class="w-full" value="${order?.customerName || ''}" ${isUpdate ? 'disabled' : ''} required></div>
            <div><label class="block text-sm font-medium">Address</label><input type="text" id="customer-address" class="w-full" value="${order?.customerAddress || ''}" ${isUpdate ? 'disabled' : ''} required></div>
            <div><label class="block text-sm font-medium">Phone</label><input type="tel" id="customer-phone" class="w-full" value="${order?.customerPhone || ''}" ${isUpdate ? 'disabled' : ''} required></div>
            <button type="submit" class="btn-primary w-full">${isUpdate ? 'Update & Pay Difference' : 'Pay & Place Order'}</button>
        </form>
    `;
}

async function placeOrder() {
    if (cart.length === 0) return showAlert('Your cart is empty.');
    if (!selectedShopId) return showAlert('No shop selected.', true);

    if (auth.currentUser?.isAnonymous || userId.startsWith('offline')) {
        openProfileModal(true);
        return;
    }

    const customerName = document.getElementById('customer-name').value;
    const customerAddress = document.getElementById('customer-address').value;
    const customerPhone = document.getElementById('customer-phone').value;
    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (!customerName || !customerAddress || !customerPhone) {
        return showAlert("Please fill out all delivery details.", true);
    }

    const options = {
        key: "rzp_test_RU9lPJQl5wqQFM",
        amount: totalAmount * 100,
        currency: "INR", name: "CloudKitchen", description: "Order Payment",
        image: "https://placehold.co/100x100/000000/FFFFFF?text=CK",
        handler: async (response) => {
            const orderData = {
                shopId: selectedShopId,
                customerName,
                customerAddress,
                customerPhone,
                items: cart.map(item => ({ ...item, ready: false })),
                totalAmount,
                status: 'new',
                createdAt: serverTimestamp(),
                userId,
                isTestOrder: false,
                paymentId: response.razorpay_payment_id,
                paymentIds: [response.razorpay_payment_id]
            };
            await saveOrderToFirestore(orderData);
        },
        prefill: { name: customerName, email: userEmail.includes('Guest') ? '' : userEmail, contact: customerPhone },
        notes: { address: customerAddress },
        theme: { color: "#0071e3" },
        modal: { ondismiss: () => showAlert("Payment was cancelled.", true) }
    };
    const rzp = new Razorpay(options);
    rzp.open();
}

async function saveOrderToFirestore(orderData) {
    try {
        const docRef = await addDoc(collection(db, "orders"), orderData);
        showAlert('Payment successful! Order placed.');
        cart = []; isEditingOrder = false;
        updateCart();
        renderMenu(selectedShopId);
        currentTrackingOrderId = docRef.id;
        startTrackingLatestOrder();

        // ** NOTIFY KITCHEN & OWNER **
        const usersSnapshot = await getDocs(query(collection(db, "users"), where("shopId", "==", orderData.shopId), where("role", "in", ["kitchen", "owner"])));
        
        usersSnapshot.docs.forEach(userDoc => {
            createNotification({
                userId: userDoc.id,
                role: userDoc.data().role,
                shopId: orderData.shopId,
                message: `New Order! ${orderData.customerName} ordered ₹${orderData.totalAmount}.`,
                orderId: docRef.id
            });
        });

    } catch (error) {
        showAlert('Failed to save order.', true);
        console.error("Order save error: ", error);
    }
}

async function updateOrder() {
    if (cart.length === 0) return showAlert('Your cart cannot be empty.');
    if (!currentTrackingOrderId) return showAlert('No order selected.', true);

    const orderDocRef = doc(db, "orders", currentTrackingOrderId);
    try {
        const orderDocSnap = await getDoc(orderDocRef);
        if (!orderDocSnap.exists()) return showAlert("Order not found.", true);

        const originalOrderData = orderDocSnap.data();
        if (!['new', 'preparing'].includes(originalOrderData.status)) return showAlert('Too late to modify this order.', true);

        const newTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const amountDue = newTotal - originalOrderData.totalAmount;

        const finalUpdateLogic = async (paymentId = null) => {
            const updatedItems = cart.map(item => {
                const existingItem = originalOrderData.items.find(i => i.id === item.id);
                return { ...item, ready: existingItem ? existingItem.ready : false };
            });

            let paymentIds = originalOrderData.paymentIds || [originalOrderData.paymentId];
            if (paymentId) paymentIds.push(paymentId);

            await updateDoc(orderDocRef, { items: updatedItems, totalAmount: newTotal, paymentIds });
            showAlert('Order updated successfully!');
            cart = []; isEditingOrder = false;
            updateCart();
            renderMenu(selectedShopId);
            renderOrderForm();
            startTrackingLatestOrder();
        };

        if (amountDue > 0) {
            const options = {
                key: "rzp_test_RU9lPJQl5wqQFM",
                amount: amountDue * 100,
                currency: "INR", name: "CloudKitchen", description: "Order Update",
                handler: async (response) => await finalUpdateLogic(response.razorpay_payment_id),
                prefill: { name: originalOrderData.customerName, contact: originalOrderData.customerPhone },
                theme: { color: "#0071e3" }
            };
            const rzp = new Razorpay(options);
            rzp.open();
        } else {
            await finalUpdateLogic();
        }
    } catch (error) {
        showAlert('Failed to update order.', true);
    }
}

async function startEditingOrder(order) {
    isEditingOrder = true;
    if (allShops.length === 0) await loadAllShops();
    await selectShop(order.shopId, allShops.find(s => s.id === order.shopId)?.name || 'Selected Shop');
    cart = order.items.map(item => ({ ...item }));
    document.getElementById('order-status-container').classList.add('hidden');
    document.getElementById('order-form-container').style.display = 'block';
    updateCart();
    renderMenu(order.shopId);
    renderOrderForm(order);
}

function startTrackingLatestOrder() {
    if (!userId || !isFirebaseReady || userId.startsWith('offline') || auth.currentUser?.isAnonymous) return;
    currentOrderListener?.();
    const q = query(collection(db, "orders"), where("userId", "==", userId), orderBy("createdAt", "desc"), limit(1));

    currentOrderListener = onSnapshot(q, async (snapshot) => {
        const orderFormContainer = document.getElementById('order-form-container');
        const orderStatusContainer = document.getElementById('order-status-container');

        if (snapshot.docs.length > 0 && !isEditingOrder) {
            const latestOrder = snapshot.docs[0];
            currentTrackingOrderId = latestOrder.id;
            const orderData = latestOrder.data();

            if (orderData.status === 'completed') {
                currentTrackingOrderId = null;
                orderFormContainer.style.display = 'block';
                orderStatusContainer.classList.add('hidden');
                showShopSelector();
                return;
            }

            if (orderData.shopId !== selectedShopId) {
                if (allShops.length === 0) await loadAllShops();
                await selectShop(orderData.shopId, allShops.find(s => s.id === orderData.shopId)?.name || 'Your Order');
            }

            trackOrderStatus(latestOrder.id, orderData);
            orderFormContainer.style.display = 'none';
            orderStatusContainer.classList.remove('hidden');
        } else if (!isEditingOrder) {
            currentTrackingOrderId = null;
            orderFormContainer.style.display = 'block';
            orderStatusContainer.classList.add('hidden');
            if (document.getElementById('menu-and-cart-view').style.display === 'block') {
                showShopSelector();
            }
        }
    }, error => {
        console.error("Error tracking latest order:", error);
    });
}

function trackOrderStatus(orderId, order) {
    const statusContainer = document.getElementById('order-status-container');
    if (!statusContainer) return;

    const canAddItems = ['new', 'preparing'].includes(order.status);
    const stages = ['new', 'preparing', 'ready_for_pickup', 'out_for_delivery', 'completed'];
    const currentStageIndex = stages.indexOf(order.status);

    let progressStepsHTML = '';
    stages.forEach((stage, index) => {
        const isActive = index <= currentStageIndex ? 'active' : '';
        progressStepsHTML += `<div class="progress-step ${isActive}">${index + 1}</div>`;
    });

    const progressPercentage = (currentStageIndex / (stages.length - 1)) * 100;

    statusContainer.innerHTML = `
        <div class="mb-4">
            <h2 class="text-xl font-semibold mb-1">Your Order Status</h2>
            <p class="text-sm text-gray-500">Order ID: ${orderId.substring(0, 8)}</p>
        </div>
        <div class="progress-container">
            <div class="progress-line"><div class="progress-line-fill" style="width: ${progressPercentage}%;"></div></div>
            ${progressStepsHTML}
        </div>
        <div class="flex justify-between text-xs text-gray-500 px-2">
            <span>Placed</span><span>Preparing</span><span>Ready</span><span>Out</span><span>Delivered</span>
        </div>
        <div class="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 class="font-semibold mb-2">Item Details</h3>
            <div class="divide-y">${order.items.map(item => `<div class="flex justify-between items-center py-2"><span>${item.name} x ${item.quantity}</span><span class="text-sm font-medium ${item.ready ? 'text-green-600' : 'text-orange-500'}">${item.ready ? 'Ready' : 'Preparing'}</span></div>`).join('')}</div>
            <p class="text-right font-bold text-lg mt-4">Total: ₹${order.totalAmount}</p>
        </div>
        <p class="text-center mt-4 text-sm text-gray-600">Overall Status: <span class="font-bold uppercase">${order.status.replace(/_/g, ' ')}</span></p>
        ${canAddItems ? `<button id="add-more-items-btn" class="btn-primary w-full mt-6 bg-green-600 hover:bg-green-700">Add More Items</button>` : ''}
    `;
}

function listenToStaffOrders() {
    const kitchenList = document.getElementById('kitchen-orders-list');
    const transportList = document.getElementById('transport-orders-list');

    if (!['kitchen', 'owner', 'delivery', 'developer'].includes(userRole) || !isFirebaseReady) return;

    if (!currentUserShopId) {
        const msg = (userRole === 'developer') ? 'Please select a shop from the Dev Panel to view this section.' : 'You are not assigned to a shop.';
        if (kitchenList) kitchenList.innerHTML = `<p class="text-gray-500 col-span-full text-center">${msg}</p>`;
        if (transportList) transportList.innerHTML = `<p class="text-gray-500 col-span-full text-center">${msg}</p>`;
        return;
    }

    const kitchenQuery = query(collection(db, "orders"), where("status", "in", ["new", "preparing"]), where("shopId", "==", currentUserShopId));
    onSnapshot(kitchenQuery, s => renderOrders(kitchenList, s.docs, 'kitchen'));

    const transportQuery = query(collection(db, "orders"), where("status", "in", ["ready_for_pickup", "out_for_delivery"]), where("shopId", "==", currentUserShopId));
    onSnapshot(transportQuery, s => renderOrders(transportList, s.docs, 'transport'));
}

window.toggleItemReady = async (orderId, itemId) => {
    const orderRef = doc(db, "orders", orderId);
    const orderSnap = await getDoc(orderRef);
    if (orderSnap.exists()) {
        if (orderSnap.data().shopId !== currentUserShopId && userRole !== 'developer') {
            return showAlert("You don't have permission for this order.", true);
        }
        const items = orderSnap.data().items.map(item => String(item.id) === String(itemId) ? { ...item, ready: !item.ready } : item);
        await updateDoc(orderRef, { items });
    }
}

function renderOrders(container, docs, viewType) {
    if (!container) return;
    container.innerHTML = docs.length === 0
        ? `<p class="text-gray-500 col-span-full text-center">No orders to show.</p>`
        : docs.sort((a, b) => (a.data().createdAt?.toMillis() || 0) - (b.data().createdAt?.toMillis() || 0)).map(doc => {
            const order = doc.data();
            let actionButton = '';
            if (viewType === 'kitchen') {
                if (order.status === 'new') actionButton = `<button data-id="${doc.id}" data-status="preparing" class="update-status-btn btn-primary btn-preparing w-full mt-4">Start Preparing</button>`;
                else if (order.status === 'preparing') actionButton = `<button data-id="${doc.id}" data-status="ready_for_pickup" class="update-status-btn btn-primary btn-ready w-full mt-4">Mark Ready</button>`;
            } else if (viewType === 'transport') {
                if (order.status === 'ready_for_pickup') actionButton = `<button data-id="${doc.id}" data-status="out_for_delivery" class="update-status-btn btn-primary btn-delivery w-full mt-4">Out for Delivery</button>`;
                else if (order.status === 'out_for_delivery') actionButton = `<button data-id="${doc.id}" data-status="completed" class="update-status-btn btn-primary btn-completed w-full mt-4">Mark Delivered</button>`;
            }

            const itemsList = order.items.map(item => `<div class="flex justify-between items-center text-sm py-1"><span>${item.name} x ${item.quantity}</span>${order.status === 'preparing' ? `<label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" onchange="toggleItemReady('${doc.id}', '${item.id}')" ${item.ready ? 'checked' : ''}><span class="text-xs font-medium ${item.ready ? 'text-green-600' : ''}">Ready</span></label>` : ''}</div>`).join('');

            return `<div class="card p-4 flex flex-col justify-between"><div><div class="flex justify-between items-start mb-2"><strong class="text-gray-800">${order.customerName}</strong>${order.isTestOrder ? '<span class="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">TEST</span>' : ''}</div><div class="text-sm text-gray-700 mt-3 space-y-1"><p><span class="font-medium">Phone:</span> ${order.customerPhone || 'N/A'}</p><p><span class="font-medium">Address:</span> ${order.customerAddress || 'N/A'}</p></div><div class="mt-2 border-t pt-2">${itemsList}</div><div class="mt-4 flex justify-between items-center"><span class="status-tag status-tag-${order.status}">${order.status.replace(/_/g, ' ')}</span><p class="text-lg font-bold">₹${order.totalAmount}</p></div></div>${actionButton}</div>`;
        }).join('');
}

async function handleEmailAuth(e, isSignup) {
    e.preventDefault();
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const profileModal = document.getElementById('profile-modal');
    try {
        if (isSignup) await createUserWithEmailAndPassword(auth, email, password);
        else await signInWithEmailAndPassword(auth, email, password);
        showAlert(isSignup ? 'Account created successfully!' : 'Logged in successfully!');
        profileModal?.classList.add('hidden');
    } catch (error) {
        showAlert(`Authentication failed. ${error.message}`, true);
    }
}

async function handleGoogleLogin() {
    try {
        if (window.matchMedia('(display-mode: standalone)').matches || /iphone|ipad|ipod|android/.test(window.navigator.userAgent.toLowerCase())) {
            await signInWithRedirect(auth, new GoogleAuthProvider());
        } else {
            await signInWithPopup(auth, new GoogleAuthProvider());
            document.getElementById('profile-modal')?.classList.add('hidden');
            showAlert('Logged in with Google successfully!');
        }
    } catch (error) { showAlert(error.message, true); }
}

if (isFirebaseReady) {
    getRedirectResult(auth).then((result) => {
        if (result) {
            document.getElementById('profile-modal')?.classList.add('hidden');
            showAlert('Logged in with Google successfully!');
        }
    }).catch((error) => console.error(error));
}

viewSwitcher.addEventListener('click', (e) => {
    if (e.target.tagName !== 'BUTTON') return;
    const view = e.target.dataset.view;

    orderQueryUnsubscribe?.(); orderQueryUnsubscribe = null;

    const allowed = {
        customer: ['customer', 'kitchen', 'delivery', 'owner', 'developer'],
        kitchen: ['kitchen', 'owner', 'developer'],
        transport: ['delivery', 'owner', 'developer'],
        owner: ['owner', 'developer'],
        developer: ['developer']
    };

    if (userRole !== 'developer') {
        if (!allowed[view]?.includes(userRole)) return showAlert("You don't have permission to access this view.", true);
        if (['kitchen', 'transport', 'owner'].includes(view) && !currentUserShopId) return showAlert("You must be assigned to a shop to access this view.", true);
    }

    Object.values(views).forEach(v => v.classList.add('view-hidden'));
    views[view].classList.remove('view-hidden');
    views[view].classList.add('view-active');

    Array.from(viewSwitcher.querySelectorAll('button')).forEach(btn => btn.classList.toggle('btn-active', btn.dataset.view === view));

    if (currentUserShopId) {
        if (view === 'owner') { loadOwnerDashboard(); listenToOrderHistory(); }
        else if (view === 'kitchen' || view === 'transport') { listenToStaffOrders(); }
    }

    if (view === 'developer' && userRole === 'developer') {
        orderCurrentPage = 1; orderFirstVisibleDoc = null; orderLastVisibleDoc = null; orderDateFilter = 'all';
        updateOrderFilterButtons(); loadAllOrders('start'); updateDevSummary();
    }
});

function loadOwnerDashboard() {
    if (!isFirebaseReady || !['owner', 'developer'].includes(userRole)) return;
    if (!currentUserShopId) return;

    onSnapshot(query(collection(db, "orders"), where("shopId", "==", currentUserShopId)), (snapshot) => {
        updateDashboard(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });
    loadStaffList();
}

function updateDashboard(allOrders) {
    const liveOrders = allOrders.filter(o => !o.isTestOrder);
    const totalRevenue = liveOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const totalOrders = liveOrders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    document.getElementById('kpi-total-revenue').textContent = `₹${totalRevenue.toFixed(2)}`;
    document.getElementById('kpi-total-orders').textContent = totalOrders;
    document.getElementById('kpi-avg-order-value').textContent = `₹${avgOrderValue.toFixed(2)}`;
    drawSalesChart(liveOrders);
    drawStatusChart(liveOrders);
}

function drawSalesChart(orders) {
    const ctx = document.getElementById('sales-chart-canvas')?.getContext('2d');
    if (!ctx) return;
    salesChartInstance?.destroy();
    const salesByDate = orders.reduce((acc, order) => {
        if (order.createdAt?.toDate) {
            const date = order.createdAt.toDate().toLocaleDateString('en-CA');
            acc[date] = (acc[date] || 0) + (order.totalAmount || 0);
        }
        return acc;
    }, {});
    const sortedDates = Object.keys(salesByDate).sort();
    salesChartInstance = new Chart(ctx, { type: 'bar', data: { labels: sortedDates.map(d => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })), datasets: [{ label: 'Sales', data: sortedDates.map(d => salesByDate[d]), backgroundColor: 'rgba(94, 92, 230, 0.8)', borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { callback: v => '₹' + v } } }, plugins: { legend: { display: false } } } });
}

function drawStatusChart(orders) {
    const ctx = document.getElementById('status-chart-canvas')?.getContext('2d');
    if (!ctx) return;
    statusChartInstance?.destroy();
    const statusCounts = orders.reduce((acc, order) => {
        const status = order.status ? order.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});
    const statusLabels = Object.keys(statusCounts);
    const statusColors = { 'New': '#0071e3', 'Preparing': '#f59e0b', 'Ready For Pickup': '#10b981', 'Out For Delivery': '#6366f1', 'Completed': '#4b5563' };
    statusChartInstance = new Chart(ctx, { type: 'doughnut', data: { labels: statusLabels, datasets: [{ label: 'Orders', data: Object.values(statusCounts), backgroundColor: statusLabels.map(l => statusColors[l] || '#cccccc'), borderColor: '#ffffff', borderWidth: 4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } } });
}

function listenToOrderHistory() {
    if (!['owner', 'developer'].includes(userRole)) return;
    if (!currentUserShopId) return;
    onSnapshot(query(collection(db, "orders"), where("status", "==", "completed"), where("shopId", "==", currentUserShopId)), snapshot => {
        completedOrders = snapshot.docs.map(d => ({ id: d.id, ...d.data() })).filter(o => !o.isTestOrder).sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
        filterAndRenderHistory();
    });
}

function filterAndRenderHistory() {
    const listEl = document.getElementById('order-history-list');
    if (!listEl) return;
    const now = new Date(); const startOfWeek = new Date(now); startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); startOfWeek.setHours(0, 0, 0, 0); const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    let filtered = completedOrders;
    if (historyFilter === 'week') filtered = completedOrders.filter(o => o.createdAt?.toDate() >= startOfWeek);
    if (historyFilter === 'month') filtered = completedOrders.filter(o => o.createdAt?.toDate() >= startOfMonth);
    listEl.innerHTML = filtered.length === 0 ? `<p class="text-gray-500 text-center py-4">No past orders.</p>` : filtered.map(o => `<div class="bg-gray-50 p-4 rounded-lg border"><div class="flex justify-between items-start"><div><p class="font-semibold">${o.customerName}</p><p class="text-sm text-gray-500">${o.createdAt.toDate().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</p><p class="text-sm text-gray-600 mt-1">Total: ₹${o.totalAmount}</p></div><div class="flex flex-col items-end gap-2"><p class="text-xs text-gray-500 bg-white px-2 py-1 rounded-md">ID: ${o.id.substring(0, 8)}</p></div></div></div>`).join('');
}

function updateHistoryFilterButtons() {
    document.querySelectorAll('.history-filter-btn').forEach(btn => btn.classList.toggle('btn-active', btn.dataset.filter === historyFilter));
}

async function loadStaffList() {
    if (!['owner', 'developer'].includes(userRole) || !currentUserShopId) return;
    const staffListEl = document.getElementById('staff-list');
    const snapshot = await getDocs(query(collection(db, "users"), where("role", "in", ["kitchen", "delivery"]), where("shopId", "==", currentUserShopId)));
    staffListEl.innerHTML = snapshot.empty ? '<p class="text-gray-500">No staff members found.</p>' : snapshot.docs.map(doc => { const s = doc.data(); return `<div class="flex justify-between items-center bg-gray-50 p-3 rounded-lg"><div><p class="font-medium">${s.email}</p><p class="text-sm text-gray-500 capitalize">${s.role}</p></div><button data-id="${doc.id}" class="remove-staff-btn bg-red-100 text-red-700 px-3 py-1 rounded-md text-sm hover:bg-red-200">Remove</button></div>` }).join('');
}

async function addStaff() {
    if (!currentUserShopId) return showAlert("You must manage a shop to add staff.", true);
    const email = document.getElementById('staff-email').value; const role = document.getElementById('staff-role').value;
    const snapshot = await getDocs(query(collection(db, "users"), where("email", "==", email)));
    if (snapshot.empty) return showAlert("User must sign up first.", true);
    await setDoc(doc(db, "users", snapshot.docs[0].id), { role, shopId: currentUserShopId }, { merge: true });
    showAlert(`Role updated for ${email}.`); document.getElementById('add-staff-form').reset(); loadStaffList();
}

async function loadDeveloperPanel() {
    await loadAllShops();
    await loadAdminPanel();
    document.getElementById('order-search-input').addEventListener('input', () => { orderCurrentPage = 1; orderFirstVisibleDoc = null; orderLastVisibleDoc = null; loadAllOrders('start'); });
    document.getElementById('dev-menu-shop-select').addEventListener('change', (e) => {
        const shopId = e.target.value;
        if (shopId) { document.getElementById('dev-menu-manager-content').style.display = 'grid'; renderDevMenuItemList(shopId); }
        else { document.getElementById('dev-menu-manager-content').style.display = 'none'; }
    });
    document.getElementById('test-order-shop-select').addEventListener('change', (e) => renderTestMenuItems(e.target.value));
    document.querySelectorAll('#developer-view .sortable-header').forEach(header => header.addEventListener('click', handleUserSort));
    updateDevSummary();
}

async function updateDevSummary() {
    if (userRole !== 'developer') return;
    try {
        document.getElementById('dev-summary-shops').textContent = allShops.length;
        const usersSnapshot = await getDocs(query(collection(db, "users"), where("email", "!=", DEVELOPER_EMAIL)));
        document.getElementById('dev-summary-users').textContent = usersSnapshot.docs.filter(doc => doc.data().email).length;
        const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0); const todayEnd = new Date(); todayEnd.setHours(23, 59, 59, 999);
        const ordersTodaySnapshot = await getDocs(query(collection(db, "orders"), where("createdAt", ">=", Timestamp.fromDate(todayStart)), where("createdAt", "<=", Timestamp.fromDate(todayEnd))));
        document.getElementById('dev-summary-orders-today').textContent = ordersTodaySnapshot.size;
        const allOrdersSnapshot = await getDocs(collection(db, "orders"));
        document.getElementById('dev-summary-orders-all').textContent = allOrdersSnapshot.size;
    } catch (error) { console.error(error); }
}

function populateShopDropdowns() {
    const shopOptions = allShops.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    document.getElementById('dev-menu-shop-select').innerHTML = `<option value="">-- Select a Shop --</option>${shopOptions}`;
    document.getElementById('test-order-shop-select').innerHTML = `<option value="">-- Select a Shop --</option>${shopOptions}`;
    document.getElementById('dev-dashboard-shop-select').innerHTML = `<option value="">-- Select a Shop --</option>${shopOptions}`;
}

function renderDevShopList() {
    const container = document.getElementById('dev-shop-list');
    if (!container) return;
    container.innerHTML = allShops.length === 0 ? '<p class="text-gray-500">No shops created yet.</p>' : allShops.map(shop => `<div class="flex justify-between items-center bg-gray-50 p-3 rounded-lg"><div><p class="font-medium">${shop.name}</p><p class="text-sm text-gray-500">${shop.address || 'No address'}</p></div><button data-id="${shop.id}" class="dev-remove-shop-btn bg-red-100 text-red-700 px-3 py-1 rounded-md text-sm hover:bg-red-200">Remove</button></div>`).join('');
}

async function createShop(e) {
    e.preventDefault();
    const name = document.getElementById('shop-name').value;
    const address = document.getElementById('shop-address').value;
    const image = document.getElementById('shop-image').value;
    try { await addDoc(collection(db, "shops"), { name, address, image: image || null }); showAlert('Shop created successfully!'); document.getElementById('create-shop-form').reset(); await loadAllShops(); } catch (error) { showAlert("Failed to create shop.", true); }
}

async function createMenuItem(e) {
    e.preventDefault();
    const shopId = document.getElementById('dev-menu-shop-select').value;
    if (!shopId) return showAlert("Please select a shop first.", true);
    const name = document.getElementById('menu-item-name').value; const price = parseFloat(document.getElementById('menu-item-price').value); const image = document.getElementById('menu-item-image').value;
    try { await addDoc(collection(db, "menus"), { shopId, name, price, image: image || null }); showAlert('Menu item added!'); document.getElementById('create-menu-item-form').reset(); renderDevMenuItemList(shopId); } catch (error) { showAlert("Failed to add item.", true); }
}

async function renderDevMenuItemList(shopId) {
    const container = document.getElementById('dev-menu-item-list');
    const snapshot = await getDocs(query(collection(db, "menus"), where("shopId", "==", shopId)));
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    container.innerHTML = items.length === 0 ? '<p class="text-gray-500">No menu items.</p>' : items.map(item => `<div class="flex justify-between items-center bg-gray-50 p-3 rounded-lg"><div><p class="font-medium">${item.name}</p><p class="text-sm text-gray-500">₹${item.price}</p></div><button data-id="${item.id}" data-shop-id="${shopId}" class="dev-remove-menu-item-btn bg-red-100 text-red-700 px-3 py-1 rounded-md text-sm hover:bg-red-200">Remove</button></div>`).join('');
}

async function renderTestMenuItems(shopId) {
    const container = document.getElementById('test-menu-items');
    if (!shopId) { container.innerHTML = '<p class="text-gray-500 text-sm">Select a shop.</p>'; return; }
    const snapshot = await getDocs(query(collection(db, "menus"), where("shopId", "==", shopId)));
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    container.innerHTML = items.length === 0 ? '<p class="text-gray-500 text-sm">No items.</p>' : items.map(item => `<label class="flex items-center gap-2 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"><input type="checkbox" class="test-menu-checkbox" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}"><span class="text-sm">${item.name} (₹${item.price})</span></label>`).join('');
}

async function runSystemTests() {
    const tests = { firebase: document.getElementById('test-firebase'), database: document.getElementById('test-database'), auth: document.getElementById('test-auth') };
    const setStatus = (el, pass) => { if (el) { el.textContent = pass ? 'PASS' : 'FAIL'; el.className = `test-badge ${pass ? 'test-pass' : 'test-fail'}`; } };
    setStatus(tests.firebase, isFirebaseReady);
    try { await getDoc(doc(db, "users", "test-read")); setStatus(tests.database, true); } catch (e) { setStatus(tests.database, e.code === 'permission-denied' || e.message.includes("Missing or insufficient permissions")); }
    setStatus(tests.auth, !!auth.currentUser && !auth.currentUser.isAnonymous);
}

async function createTestOrder(e) {
    e.preventDefault();
    const shopId = document.getElementById('test-order-shop-select').value;
    if (!shopId) return showAlert('Please select a shop.', true);
    const items = Array.from(document.querySelectorAll('.test-menu-checkbox:checked')).map(cb => ({ id: cb.dataset.id, name: cb.dataset.name, price: parseFloat(cb.dataset.price), quantity: 1, ready: false }));
    if (items.length === 0) return showAlert('Select at least one item.', true);
    const orderData = { shopId, customerName: document.getElementById('test-name').value, customerAddress: document.getElementById('test-address').value, customerPhone: document.getElementById('test-phone').value, items, totalAmount: items.reduce((s, i) => s + i.price, 0), status: 'new', createdAt: serverTimestamp(), userId: 'test-developer', isTestOrder: true };
    try {
        const docRef = await addDoc(collection(db, "orders"), orderData);
        showAlert('Test order created!');
        // Notify kitchen/owner of test order
        const usersSnapshot = await getDocs(query(collection(db, "users"), where("shopId", "==", shopId), where("role", "in", ["kitchen", "owner"])));
        usersSnapshot.docs.forEach(userDoc => { createNotification({ userId: userDoc.id, role: userDoc.data().role, shopId: shopId, message: `New TEST order from ${orderData.customerName}.`, orderId: docRef.id }); });
        document.getElementById('test-order-form').reset();
    } catch (error) { showAlert('Failed to create test order.', true); }
}

async function resetCustomerOrders() {
    if (userRole !== 'developer') return showAlert("No permission.", true);
    showAlert(`Delete ALL non-test orders?`, false, async () => {
        const batch = writeBatch(db);
        const snapshot = await getDocs(query(collection(db, "orders")));
        let count = 0;
        snapshot.docs.forEach(doc => { if (!doc.data().isTestOrder) { batch.delete(doc.ref); count++; } });
        await batch.commit(); showAlert(`Deleted ${count} orders.`);
    });
}

function loadAllOrders(direction = 'start') {
    if (userRole !== 'developer') return;
    const container = document.getElementById('all-orders-list');
    container.innerHTML = '<p class="text-gray-500 text-center py-4">Loading orders...</p>';
    orderQueryUnsubscribe?.();
    let q = collection(db, "orders");
    const constraints = [orderBy("createdAt", "desc"), limit(orderQueryLimit)];
    if (direction === 'next' && orderLastVisibleDoc) constraints.unshift(startAfter(orderLastVisibleDoc));
    if (direction === 'prev' && orderFirstVisibleDoc) constraints.unshift(endBefore(orderFirstVisibleDoc));
    
    orderQueryUnsubscribe = onSnapshot(query(q, ...constraints), (snapshot) => {
        let docs = snapshot.docs;
        if (docs.length > 0) { orderFirstVisibleDoc = docs[0]; orderLastVisibleDoc = docs[docs.length - 1]; }
        renderAllOrdersList(docs);
        prevOrdersBtn.disabled = orderCurrentPage <= 1;
        nextOrdersBtn.disabled = docs.length < orderQueryLimit;
        orderPageInfoEl.textContent = `Page ${orderCurrentPage}`;
    });
}

function renderAllOrdersList(docs) {
    const container = document.getElementById('all-orders-list');
    const searchTerm = document.getElementById('order-search-input').value.trim().toLowerCase();
    let filteredDocs = docs.filter(doc => !searchTerm || doc.data().customerName.toLowerCase().includes(searchTerm));
    container.innerHTML = filteredDocs.length === 0 ? '<p class="text-gray-500 text-center py-4">No orders.</p>' : filteredDocs.map(docSnap => {
        const order = docSnap.data();
        const shopName = allShops.find(s => s.id === order.shopId)?.name || 'Unknown';
        return `<div class="bg-gray-50 p-4 rounded-lg"><div class="flex justify-between items-start mb-3"><div><p class="font-semibold">${order.customerName} (${shopName})</p><p class="text-xs text-gray-500">ID: ${docSnap.id}</p></div><div><span class="px-3 py-1 rounded-full text-xs font-semibold bg-gray-200">${order.status}</span></div></div></div>`;
    }).join('');
}

function handleUserSort(e) {
    const newCriteria = e.target.closest('[data-sort]').dataset.sort;
    if (userSortCriteria === newCriteria) userSortDirection = userSortDirection === 'asc' ? 'desc' : 'asc';
    else { userSortCriteria = newCriteria; userSortDirection = 'asc'; }
    renderAdminUserList();
}

function sortUsers(users) {
    return users.sort((a, b) => {
        let valA, valB; const dataA = a.data(); const dataB = b.data();
        switch (userSortCriteria) {
            case 'email': valA = dataA.email || ''; valB = dataB.email || ''; break;
            case 'role': valA = dataA.role || ''; valB = dataB.role || ''; break;
            default: return 0;
        }
        return (valA < valB ? -1 : 1) * (userSortDirection === 'asc' ? 1 : -1);
    });
}

async function loadAdminPanel() {
    const snapshot = await getDocs(query(collection(db, "users"), where("email", "!=", null)));
    allUsersCache = snapshot.docs.filter(d => d.id !== userId && d.data().email !== DEVELOPER_EMAIL);
    renderAdminUserList();
}

function renderAdminUserList() {
    const userListEl = document.getElementById('admin-user-list');
    const sortedUsers = sortUsers([...allUsersCache]);
    userListEl.innerHTML = sortedUsers.map(doc => {
        const userData = doc.data();
        const roles = ['customer', 'kitchen', 'delivery', 'owner', 'developer'];
        const roleOptions = roles.map(r => `<option value="${r}" ${userData.role === r ? 'selected' : ''}>${r}</option>`).join('');
        let shopSelectHTML = '<span class="text-gray-400">N/A</span>';
        if (['kitchen', 'delivery', 'owner'].includes(userData.role)) {
            shopSelectHTML = `<select data-uid="${doc.id}" class="shop-selector border rounded px-2 py-1 text-sm"><option value="">-- None --</option>${allShops.map(s => `<option value="${s.id}" ${userData.shopId === s.id ? 'selected' : ''}>${s.name}</option>`).join('')}</select>`;
        }
        return `<tr><td class="px-6 py-4 text-sm">${userData.email}</td><td class="px-6 py-4 capitalize text-sm">${userData.role}</td><td class="px-6 py-4"><select data-uid="${doc.id}" class="role-selector border rounded px-2 py-1 text-sm">${roleOptions}</select></td><td class="px-6 py-4">${shopSelectHTML}</td><td class="px-6 py-4"><button data-id="${doc.id}" class="dev-delete-user-btn btn-danger text-xs px-2 py-1">Delete</button></td></tr>`;
    }).join('');
}

async function deleteUserFromDatabase(deleteUserId) {
    if (!deleteUserId) return;
    try {
        await deleteDoc(doc(db, "users", deleteUserId));
        showAlert("User deleted.");
        allUsersCache = allUsersCache.filter(doc => doc.id !== deleteUserId);
        renderAdminUserList();
    } catch (error) { showAlert("Failed to delete user.", true); }
}

async function renderCreateOrderModal(shopId) {
    staffCart = [];
    const menuSnapshot = await getDocs(query(collection(db, "menus"), where("shopId", "==", shopId)));
    const staffMenu = menuSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    if (staffMenu.length === 0) return document.getElementById('create-order-content').innerHTML = `<p class="text-red-500 text-center">No menu items.</p>`;
    document.getElementById('create-order-content').innerHTML = `<form id="staff-create-order-form"><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div><h3 class="text-lg font-medium">Details</h3><div class="space-y-4 mt-4"><input type="text" id="staff-customer-name" placeholder="Name" class="w-full" required><input type="text" id="staff-customer-address" placeholder="Address" class="w-full" required><input type="tel" id="staff-customer-phone" placeholder="Phone" class="w-full" required></div></div><div><h3 class="text-lg font-medium">Items</h3><div id="staff-menu-selection" class="space-y-3 mt-4 max-h-64 overflow-y-auto">${staffMenu.map(item => `<div class="flex justify-between items-center bg-gray-50 p-2 rounded-lg"><div><p class="font-medium">${item.name}</p><p class="text-sm">₹${item.price}</p></div><div class="quantity-selector"><button type="button" class="quantity-btn staff-quantity-minus" data-id="${item.id}" data-price="${item.price}" data-name="${item.name}">-</button><span id="staff-qty-${item.id}" class="quantity-display">0</span><button type="button" class="quantity-btn staff-quantity-plus" data-id="${item.id}" data-price="${item.price}" data-name="${item.name}">+</button></div></div>`).join('')}</div><div id="staff-cart-summary" class="border-t pt-4 mt-4 flex justify-between font-bold"><span>Total</span><span>₹0</span></div></div></div><div class="mt-8 pt-6 border-t"><button type="submit" class="btn-primary w-full bg-green-600">Create Order</button></div></form>`;
}

function updateStaffCartUI() {
    let total = staffCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    staffCart.forEach(item => { const el = document.getElementById(`staff-qty-${item.id}`); if (el) el.textContent = item.quantity; });
    document.querySelectorAll('#staff-menu-selection .quantity-display').forEach(el => { const id = el.id.replace('staff-qty-', ''); if (!staffCart.find(item => item.id === id)) el.textContent = '0'; });
    document.querySelector('#staff-cart-summary span:last-child').textContent = `₹${total}`;
}

async function handleStaffOrderCreation(e) {
    e.preventDefault();
    if (staffCart.length === 0) return showAlert('Add at least one item.', true);
    if (!currentUserShopId) return showAlert('No shop set.', true);
    const orderData = { shopId: currentUserShopId, customerName: document.getElementById('staff-customer-name').value, customerAddress: document.getElementById('staff-customer-address').value, customerPhone: document.getElementById('staff-customer-phone').value, items: staffCart.map(item => ({ ...item, ready: false })), totalAmount: staffCart.reduce((s, i) => s + i.price * i.quantity, 0), status: 'new', createdAt: serverTimestamp(), userId: 'staff-created', isTestOrder: false, createdBy: userEmail };
    try {
        const docRef = await addDoc(collection(db, "orders"), orderData);
        showAlert('Order created!');
        createOrderModal.classList.add('hidden');
        // Notify kitchen/owner of manual order
        const usersSnapshot = await getDocs(query(collection(db, "users"), where("shopId", "==", currentUserShopId), where("role", "in", ["kitchen", "owner"])));
        usersSnapshot.docs.forEach(userDoc => { createNotification({ userId: userDoc.id, role: userDoc.data().role, shopId: currentUserShopId, message: `Manual order by ${userEmail}.`, orderId: docRef.id }); });
    } catch (error) { showAlert('Failed to create order.', true); }
}

function updateMenuItemControls(itemId) {
    const itemCard = document.querySelector(`.menu-item button[data-id="${itemId}"]`)?.closest('.menu-item') || document.querySelector(`.menu-item span[data-id="${itemId}"]`)?.closest('.menu-item');
    if (!itemCard) return;
    const item = currentMenu.find(m => m.id === itemId);
    const cartItem = cart.find(ci => ci.id === itemId);
    const buttonHTML = cartItem ? `<div class="quantity-selector mt-4"><button class="quantity-btn quantity-minus" data-id="${itemId}">-</button><span class="quantity-display">${cartItem.quantity}</span><button class="quantity-btn quantity-plus" data-id="${itemId}">+</button></div>` : `<button data-id="${itemId}" class="add-to-cart-btn mt-4 btn-primary w-full">Add to Cart</button>`;
    const controlsContainer = itemCard.querySelector('.p-5');
    const existingButton = controlsContainer.querySelector('.add-to-cart-btn');
    const existingSelector = controlsContainer.querySelector('.quantity-selector');
    if (existingButton && cartItem) existingButton.outerHTML = buttonHTML;
    else if (existingSelector) { if (cartItem) existingSelector.querySelector('.quantity-display').textContent = cartItem.quantity; else existingSelector.outerHTML = buttonHTML; }
    else if (!existingButton && !existingSelector && cartItem) controlsContainer.insertAdjacentHTML('beforeend', buttonHTML);
}

document.body.addEventListener('click', async e => {
    const target = e.target;
    const targetId = target.dataset.id;
    if (target.matches('.add-to-cart-btn')) { const item = currentMenu.find(m => m.id === targetId); if (item) cart.push({ ...item, quantity: 1 }); updateCart(); updateMenuItemControls(targetId); }
    if (target.matches('.quantity-plus')) { const item = cart.find(m => m.id === targetId); if (item) item.quantity++; updateCart(); updateMenuItemControls(targetId); }
    if (target.matches('.quantity-minus')) { const idx = cart.findIndex(m => m.id === targetId); if (idx > -1) { cart[idx].quantity--; if (cart[idx].quantity <= 0) cart.splice(idx, 1); } updateCart(); updateMenuItemControls(targetId); }
    if (target.matches('.staff-quantity-plus')) { let item = staffCart.find(ci => ci.id === targetId); if (item) item.quantity++; else staffCart.push({ id: targetId, price: parseFloat(target.dataset.price), name: target.dataset.name, quantity: 1 }); updateStaffCartUI(); }
    if (target.matches('.staff-quantity-minus')) { let idx = staffCart.findIndex(m => m.id === targetId); if (idx > -1) { staffCart[idx].quantity--; if (staffCart[idx].quantity <= 0) staffCart.splice(idx, 1); updateStaffCartUI(); } }
    if (target.closest('#notification-bell-btn')) {
        const panel = document.getElementById('notification-panel');
        if (window.innerWidth < 640) { panel.classList.remove('hidden'); panel.style.top = '0'; panel.style.left = '0'; panel.style.width = '100vw'; panel.style.height = '100vh'; panel.style.backgroundColor = 'rgba(0, 0, 0, 0.4)'; } else { panel.classList.toggle('hidden'); }
        if (!panel.classList.contains('hidden')) markNotificationsAsRead();
    }
    if (target.closest('#notification-panel-close-btn')) document.getElementById('notification-panel').classList.add('hidden');
    if (target.closest('#clear-all-notifications')) clearAllNotifications();
    if (window.innerWidth >= 640 && !target.closest('#notification-panel') && !target.closest('#notification-bell-btn')) document.getElementById('notification-panel').classList.add('hidden');
    if (target.matches('#add-more-items-btn') && currentTrackingOrderId) { const orderDoc = await getDoc(doc(db, "orders", currentTrackingOrderId)); if (orderDoc.exists()) startEditingOrder(orderDoc.data()); }
    if (target.matches('#reset-customer-orders-btn')) await resetCustomerOrders();
    
    // --- STATUS UPDATE LOGIC ---
    if (target.matches('.update-status-btn, .dev-update-status')) {
        try {
            const newStatus = target.dataset.status;
            const orderRef = doc(db, "orders", targetId);
            const orderSnap = await getDoc(orderRef);
            if (!orderSnap.exists()) return showAlert('Order not found.', true);
            const orderData = orderSnap.data();
            
            await updateDoc(orderRef, { status: newStatus });
            showAlert(`Status updated to ${newStatus.replace(/_/g, ' ')}`);
            
            const orderIdShort = targetId.substring(0, 5).toUpperCase();
            
            // 1. Notify Customer
            if (orderData.userId && !['staff-created', 'test-developer'].includes(orderData.userId)) {
                let msg = '';
                if (newStatus === 'preparing') msg = `Your order #${orderIdShort} is being prepared!`;
                else if (newStatus === 'ready_for_pickup') msg = `Your order #${orderIdShort} is ready!`;
                else if (newStatus === 'out_for_delivery') msg = `Order #${orderIdShort} is out for delivery.`;
                else if (newStatus === 'completed') msg = `Order #${orderIdShort} delivered. Enjoy!`;
                
                if (msg) createNotification({ userId: orderData.userId, role: 'customer', message: msg, orderId: targetId });
            }

            // 2. Notify Delivery & Owner (When Ready)
            if (newStatus === 'ready_for_pickup') {
                const staff = await getDocs(query(collection(db, "users"), where("shopId", "==", orderData.shopId), where("role", "in", ["delivery", "owner"])));
                staff.docs.forEach(u => createNotification({ userId: u.id, role: u.data().role, shopId: orderData.shopId, message: `Order #${orderIdShort} ready for pickup!`, orderId: targetId }));
            }
        } catch (e) { showAlert('Failed to update status.', true); }
    }
    
    if (target.matches('.remove-staff-btn')) { showAlert(`Remove this staff member?`, false, async () => { await setDoc(doc(db, "users", targetId), { role: 'customer', shopId: null }, { merge: true }); showAlert('Removed.'); loadStaffList(); }); }
    if (target.matches('.dev-remove-shop-btn')) { showAlert(`Delete this shop?`, false, async () => { try { const users = await getDocs(query(collection(db, "users"), where("shopId", "==", targetId))); users.docs.forEach(u => setDoc(u.ref, { shopId: null }, { merge: true })); await deleteDoc(doc(db, "shops", targetId)); showAlert('Shop removed.'); await loadAllShops(); } catch (e) { showAlert('Error removing shop.', true); } }); }
    if (target.matches('.dev-delete-user-btn')) { showAlert(`Delete user?`, false, async () => deleteUserFromDatabase(target.dataset.id)); }
    if (target.matches('#dev-view-dashboard-btn')) { const shopId = document.getElementById('dev-dashboard-shop-select').value; if (shopId) { currentUserShopId = shopId; currentShopName = allShops.find(s => s.id === shopId).name; updateAuthStatusUI(); loadOwnerDashboard(); listenToOrderHistory(); listenToStaffOrders(); document.querySelector('[data-view="owner"]').click(); } }
    if (target.matches('#run-system-test')) { runSystemTests(); showAlert('Tests completed.'); }
    if (target.matches('#test-push-btn')) { if (Notification.permission === 'granted' && 'serviceWorker' in navigator) navigator.serviceWorker.ready.then(reg => reg.showNotification('Test', { body: 'It works!', icon: 'icon.svg' })); else showAlert('Grant notification permission first.'); }
    if (target.matches('#next-orders-btn')) { orderCurrentPage++; loadAllOrders('next'); }
    if (target.matches('#prev-orders-btn') && orderCurrentPage > 1) { orderCurrentPage--; loadAllOrders('prev'); }
    if (target.matches('.order-filter-btn')) { orderDateFilter = target.dataset.filter; orderCurrentPage = 1; updateOrderFilterButtons(); loadAllOrders('start'); }
});

document.body.addEventListener('submit', async e => {
    e.preventDefault();
    if (e.target.id === 'order-form') { if (e.target.checkValidity()) e.target.dataset.mode === 'update' ? await updateOrder() : await placeOrder(); else showAlert("Fill all fields.", true); }
    if (e.target.id === 'add-staff-form') await addStaff();
    if (e.target.id === 'test-order-form') await createTestOrder(e);
    if (e.target.id === 'staff-create-order-form') await handleStaffOrderCreation(e);
    if (e.target.id === 'create-shop-form') await createShop(e);
    if (e.target.id === 'create-menu-item-form') await createMenuItem(e);
});

document.body.addEventListener('change', async e => {
    const uid = e.target.dataset.uid;
    if (!uid) return;
    if (e.target.classList.contains('role-selector')) { await setDoc(doc(db, "users", uid), { role: e.target.value }, { merge: true }); showAlert('Role updated.'); if (userRole === 'developer') loadAdminPanel(); }
    if (e.target.classList.contains('shop-selector')) { await setDoc(doc(db, "users", uid), { shopId: e.target.value || null }, { merge: true }); showAlert('Shop updated.'); if (userRole === 'developer') loadAdminPanel(); }
});

function updateOrderFilterButtons() { document.querySelectorAll('.order-filter-btn').forEach(btn => { btn.classList.toggle('active', btn.dataset.filter === orderDateFilter); btn.classList.toggle('btn-primary', btn.dataset.filter === orderDateFilter); btn.classList.toggle('btn-secondary', btn.dataset.filter !== orderDateFilter); }); }
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(e => console.log('SW fail', e)));
const enablePushBtn = document.getElementById('enable-push-btn');
const checkPushPermission = () => { if ('Notification' in window) enablePushBtn.classList.toggle('hidden', Notification.permission !== 'default'); };
checkPushPermission();
enablePushBtn.addEventListener('click', () => Notification.requestPermission().then(() => checkPushPermission()));

const installBtn = document.getElementById('install-app-btn');
const checkInstallEligibility = () => installBtn.classList.toggle('hidden', window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone);
checkInstallEligibility();
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); window.deferredPrompt = e; checkInstallEligibility(); });
installBtn.addEventListener('click', async () => { if (window.deferredPrompt) { window.deferredPrompt.prompt(); window.deferredPrompt = null; installBtn.classList.add('hidden'); } else { document.getElementById('install-modal').classList.remove('hidden'); } });
document.getElementById('install-modal-close').addEventListener('click', () => document.getElementById('install-modal').classList.add('hidden'));
document.getElementById('install-modal-ok').addEventListener('click', () => document.getElementById('install-modal').classList.add('hidden'));