/**
 * Vrindopnishad Offline Handler
 * Detects internet connectivity and displays the custom interactive offline project.
 */

(function () {
    const OFFLINE_CONTAINER_ID = 'vrindopnishad-offline-container';
    const OFFLINE_PAGE_PATH = './Projects/offline web/offline-page.html';

    function createOfflineExperience() {
        if (document.getElementById(OFFLINE_CONTAINER_ID)) return;

        const container = document.createElement('div');
        container.id = OFFLINE_CONTAINER_ID;
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 999999;
            background: #000;
            opacity: 0;
            transition: opacity 0.8s ease;
            overflow: hidden;
        `;

        const iframe = document.createElement('iframe');
        iframe.src = OFFLINE_PAGE_PATH;
        iframe.style.cssText = `
            width: 100%;
            height: 100%;
            border: none;
        `;
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope";

        container.appendChild(iframe);
        document.body.appendChild(container);

        // Trigger fade in
        setTimeout(() => {
            container.style.opacity = '1';
        }, 50);
    }

    function removeOfflineExperience() {
        const container = document.getElementById(OFFLINE_CONTAINER_ID);
        if (container) {
            container.style.opacity = '0';
            setTimeout(() => {
                if (container.parentNode) {
                    container.parentNode.removeChild(container);
                }
            }, 800);
        }
    }

    function checkStatus() {
        if (!navigator.onLine) {
            createOfflineExperience();
        } else {
            removeOfflineExperience();
        }
    }

    window.addEventListener('online', checkStatus);
    window.addEventListener('offline', checkStatus);

    // Initial check
    checkStatus();
})();
