/**
 * Firebase Configuration and Initialization
 * Handles the connection to Firebase services (Auth, Firestore).
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, enableIndexedDbPersistence } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// WARNING: This is a public-facing demo config. Do not use for production.
const firebaseConfig = {
    apiKey: "AIzaSyBsmUPg2plkJS86sFkXU-QkJttJJcOj8dw",
    authDomain: "vrinda-cloud-kitchen.firebaseapp.com",
    projectId: "vrinda-cloud-kitchen",
    storageBucket: "vrinda-cloud-kitchen.firebasestorage.app",
    messagingSenderId: "166281611781",
    appId: "1:166281611781:web:5090b4106e97e08931aa6c",
};

let app, db, auth;
let isFirebaseReady = false;

try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);

    // ENABLE OFFLINE PERSISTENCE
    enableIndexedDbPersistence(db).catch((err) => {
        if (err.code == 'failed-precondition') {
            console.warn('Persistence failed: Multiple tabs open');
        } else if (err.code == 'unimplemented') {
            console.warn('Persistence failed: Browser not supported');
        }
    });

    auth = getAuth(app);
    isFirebaseReady = true;
    console.log("✅ Firebase initialized successfully");
} catch (error) {
    console.error("❌ CRITICAL: Firebase Initialization failed.", error);
    document.body.innerHTML = `<div class="w-screen h-screen flex items-center justify-center bg-red-100 text-red-800 p-8"><strong>Application Error:</strong> Could not connect to the database.</div>`;
}

export { app, db, auth, isFirebaseReady };
