/**
 * Elite Image Vault & Security System
 * Advanced protection including Blob obfuscation, DevTools blocking, and UI lockdown.
 */
(function () {
    'use strict';

    const VAULT_PATH = './Vrindopnishad%20Web/class/image/KRSHN/';
    const DEFAULT_EXT = '.png';
    const KNOWN_AVIF = ['62', 'tempImageN7Ynt8', 'tempImage0MZ1Qo', 'tempImagepeTFpY', 'tempImageEpdAxY', 'tempImageXR0Khf', 'tempImageQAFHVQ', 'temp-Image-DVx-VWQ', 'temp-Image0m4o-HY', 'temp-Image-Y61d7-W', '32', 'temp-Imageq2-Af-Gz', 'temp-Image-Qu2-Bi-Z', 'temp-Image-KVsh-Fy', 'temp-Image-PRh2-Km'];

    // Map to keep track of blob URLs
    const blobCache = new Map();

    /**
     * Resolves and secures a path using Blob URLs
     * This moves the images from the "Sources" file tree to the "blob:" section.
     */
    async function getSecureBlobUrl(ref) {
        if (!ref) return null;

        // Handle full URLs
        if (ref.startsWith('http://') || ref.startsWith('https://')) {
            if (blobCache.has(ref)) return blobCache.get(ref);
            try {
                const response = await fetch(ref);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);
                blobCache.set(ref, blobUrl);
                return blobUrl;
            } catch (e) {
                console.warn('Fallback to direct URL:', e);
                return ref;
            }
        }

        // Handle local vault references
        if (ref.startsWith('vault:')) {
            const fileName = ref.replace('vault:', '');
            const extensions = KNOWN_AVIF.includes(fileName) ? ['.avif'] : ['.png', '.jpg'];

            for (const ext of extensions) {
                const targetUrl = VAULT_PATH + encodeURIComponent(fileName) + ext;
                if (blobCache.has(targetUrl)) return blobCache.get(targetUrl);

                try {
                    const response = await fetch(targetUrl);
                    if (response.ok) {
                        const blob = await response.blob();
                        const blobUrl = URL.createObjectURL(blob);
                        blobCache.set(targetUrl, blobUrl);
                        return blobUrl;
                    }
                } catch (e) {
                    // Try next extension
                }
            }
            console.warn(`Could not resolve vault image: ${fileName}`);
            return null;
        }

        return ref;
    }

    /**
     * UI Lockdown: Blocks common inspection shortcuts
     */
    function lockUI() {
        document.addEventListener('contextmenu', e => e.preventDefault());

        document.addEventListener('keydown', e => {
            // F12, Ctrl+Shift+I, J, C, U (View Source)
            if (e.keyCode === 123 ||
                (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) ||
                (e.metaKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) ||
                (e.ctrlKey && e.keyCode === 85) || (e.metaKey && e.keyCode === 85)) {
                e.preventDefault();
                return false;
            }
        });

        document.addEventListener('dragstart', e => e.preventDefault());
    }

    /**
     * Shielding Layer
     */
    function shieldElement(el) {
        if (el.dataset.shielded) return;
        if (getComputedStyle(el).position === 'static') el.style.position = 'relative';

        const shield = document.createElement('div');
        shield.className = 'img-vault-shield';
        Object.assign(shield.style, {
            position: 'absolute', top: '0', left: '0', width: '100%', height: '100%',
            zIndex: '100', backgroundColor: 'rgba(0,0,0,0)',
            userSelect: 'none', webkitUserSelect: 'none', pointerEvents: 'auto'
        });

        el.appendChild(shield);
        el.dataset.shielded = 'true';
    }

    /**
     * Master Security Loop
     */
    window.applyEliteSecurity = async function () {
        const elements = document.querySelectorAll('[data-vault]');
        const promises = [];

        for (const el of elements) {
            const ref = el.getAttribute('data-vault');
            el.removeAttribute('data-vault'); // Remove immediately to hide source

            const processElement = async () => {
                const secureUrl = await getSecureBlobUrl(ref);
                if (el.tagName === 'IMG') {
                    el.src = secureUrl;
                    el.style.pointerEvents = 'none';
                    shieldElement(el.parentElement);
                } else {
                    el.style.backgroundImage = `url('${secureUrl}')`;
                    shieldElement(el);
                }
            };
            promises.push(processElement());
        }

        await Promise.all(promises);

        const targetClasses = ['.tiles__line-img', '.gradient-carousel-card', '.shader-item', '.app-card-img'];
        document.querySelectorAll(targetClasses.join(',')).forEach(shieldElement);
    };

    // Initialize
    const init = async () => {
        lockUI();

        const style = document.createElement('style');
        style.textContent = `
            .img-vault-shield { pointer-events: auto !important; }
            img { pointer-events: none !important; -webkit-user-drag: none !important; }
            * { -webkit-touch-callout: none !important; -webkit-user-select: none !important; user-select: none !important; }
        `;
        document.head.appendChild(style);

        await window.applyEliteSecurity();
        setInterval(window.applyEliteSecurity, 2000);

        // Debugger trap: detects if DevTools is open by timing a debugger statement
        setInterval(() => {
            const startTime = performance.now();
            debugger;
            if (performance.now() - startTime > 100) {
                document.body.innerHTML = '<div style="background:#000;color:#f00;height:100vh;display:flex;align-items:center;justify-content:center;font-family:sans-serif;font-size:2rem;text-align:center;padding:2rem;">Security Alert: Inspection is not permitted on this spiritual sanctuary. Please close DevTools to continue.</div>';
            }
        }, 1000);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
