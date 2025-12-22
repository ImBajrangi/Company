/**
 * Image Resource Vault & Helper
 * Implements obfuscation and protection layers to secure gallery assets.
 */
(function () {
    'use strict';

    // CONFIGURATION
    const VAULT_PATH = './Vrindopnishad%20Web/class/image/KRSHN/'; // Hidden base path
    const DEFAULT_EXT = '.png';
    const KNOWN_AVIF = ['62', 'tempImageN7Ynt8', 'tempImage0MZ1Qo', 'tempImagepeTFpY', 'tempImageEpdAxY', 'tempImageXR0Khf', 'tempImageQAFHVQ', 'temp-Image-DVx-VWQ', 'temp-Image0m4o-HY', 'temp-Image-Y61d7-W', '32', 'temp-Imageq2-Af-Gz', 'temp-Image-Qu2-Bi-Z', 'temp-Image-KVsh-Fy', 'temp-Image-PRh2-Km'];

    /**
     * Obfuscation helper: Decodes a custom string or adds extensions
     */
    window.resolveVaultPath = function (ref) {
        if (!ref) return null;

        // If it's already a full URL/path with extension, just return it
        if (ref.includes('://') || /\.[a-z0-9]{3,4}$/i.test(ref)) return ref;

        // If it starts with KRSHN:, it's an obfuscated pointer
        let finalPath = ref;
        if (ref.startsWith('vault:')) {
            const fileName = ref.replace('vault:', '');
            const ext = KNOWN_AVIF.includes(fileName) ? '.avif' : DEFAULT_EXT;
            finalPath = VAULT_PATH + encodeURIComponent(fileName) + ext;
        } else if (!/\.[a-z0-9]{3,4}$/i.test(ref)) {
            // Standard fallback
            const ext = KNOWN_AVIF.includes(ref) ? '.avif' : DEFAULT_EXT;
            finalPath = ref + ext;
        }

        return finalPath;
    };

    /**
     * Injects an invisible shielding layer to prevent right-click/save-as
     */
    function shieldElement(el) {
        if (el.dataset.shielded) return;

        // Ensure container is relative
        if (getComputedStyle(el).position === 'static') {
            el.style.position = 'relative';
        }

        const shield = document.createElement('div');
        shield.className = 'img-vault-shield';
        Object.assign(shield.style, {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            zIndex: '10',
            backgroundColor: 'rgba(0,0,0,0)',
            webkitUserSelect: 'none',
            userSelect: 'none',
            pointerEvents: 'auto'
        });

        // Block context menu on the shield
        shield.addEventListener('contextmenu', (e) => e.preventDefault());
        shield.addEventListener('dragstart', (e) => e.preventDefault());

        el.appendChild(shield);
        el.dataset.shielded = 'true';
    }

    /**
     * Core application logic
     */
    window.applyVaultSecurity = function () {
        // 1. Process [data-vault] images
        document.querySelectorAll('[data-vault]').forEach(el => {
            const ref = el.getAttribute('data-vault');
            const realSrc = window.resolveVaultPath(ref);

            if (el.tagName === 'IMG') {
                el.src = realSrc;
                el.style.pointerEvents = 'none'; // Make image un-clickable
                shieldElement(el.parentElement); // Shield the container
            } else {
                // Handle background images
                el.style.backgroundImage = `url('${realSrc}')`;
                shieldElement(el);
            }
        });

        // 2. Global protection for all tiles and gallery items
        const protectSelect = '.tiles__line-img, .gradient-carousel-card, .shader-item, .app-card-img';
        document.querySelectorAll(protectSelect).forEach(el => {
            shieldElement(el);
            // Disable dragging on nested images
            el.querySelectorAll('img').forEach(img => {
                img.style.pointerEvents = 'none';
                img.setAttribute('draggable', 'false');
            });
        });
    };

    // Initialize
    const init = () => {
        // Add shield styles to head
        const style = document.createElement('style');
        style.textContent = `
            .img-vault-shield { touch-action: none; -webkit-touch-callout: none; }
            img { pointer-events: none; -webkit-user-drag: none; }
        `;
        document.head.appendChild(style);

        window.applyVaultSecurity();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
