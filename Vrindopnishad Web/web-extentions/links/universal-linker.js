// Universal Resource Linker - Core System
const RESOURCES = {
    css: {
        main: {
            styles: '/Home/css/styles.css',
            imageHover: '/Home/css/image-hover.css'
        },
        components: {
            customCursor: '/web-extentions/Custom Cursor/custom-cursor.css'
        }
    },
    js: {
        modules: {
            animations: '/Home/js/animations.js',
            effects: '/Home/js/effects.js',
            imageHover: '/Home/js/image-hover.js',
            customCursor: '/web-extentions/Custom Cursor/custom-cursor.js',
            // linkHandler: './link-handler.js'
            linkHandler: '/web-extentions/links/project-config.js'
        }
    }
};

// Bundle definitions
const BUNDLES = {
    core: {
        css: ['main.styles', 'main.imageHover', 'components.customCursor'],
        js: [
            { path: 'modules.linkHandler', options: { defer: true } },
            { path: 'modules.customCursor', options: { module: true } }
        ]
    },
    home: {
        css: ['main.styles', 'main.imageHover', 'components.customCursor'],
        js: [
            { path: 'modules.animations', options: { module: true } },
            { path: 'modules.effects', options: { module: true } },
            { path: 'modules.imageHover', options: { module: true } },
            { path: 'modules.customCursor', options: { module: true } },
        ]
    }
};

// Link Manager Class
class LinkManager {
    static resolveResourcePath(path) {
        const parts = path.split('.');
        let current = RESOURCES;
        for (const part of parts) {
            if (!current[part]) {
                console.error(`Resource not found: ${path}`);
                return null;
            }
            current = current[part];
        }
        return current;
    }

    static css(path) {
        const resourcePath = this.resolveResourcePath(`css.${path}`);
        if (!resourcePath) return Promise.reject(`CSS resource not found: ${path}`);

        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = resourcePath;
            link.onload = () => resolve(link);
            link.onerror = () => reject(`Failed to load CSS: ${resourcePath}`);
            document.head.appendChild(link);
        });
    }

    static js(path, options = {}) {
        const resourcePath = this.resolveResourcePath(`js.${path}`);
        if (!resourcePath) return Promise.reject(`JS resource not found: ${path}`);

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = resourcePath;
            if (options.module) script.type = 'module';
            if (options.defer) script.defer = true;
            script.onload = () => resolve(script);
            script.onerror = () => reject(`Failed to load JS: ${resourcePath}`);
            document.head.appendChild(script);
        });
    }

    static module(path) {
        return this.js(path, { module: true });
    }

    static async bundle(name) {
        const bundle = BUNDLES[name];
        if (!bundle) {
            console.error(`Bundle not found: ${name}`);
            return;
        }

        // Load CSS first
        if (bundle.css) {
            await Promise.all(bundle.css.map(path => this.css(path)));
        }

        // Then load JS
        if (bundle.js) {
            await Promise.all(bundle.js.map(item => {
                if (typeof item === 'string') {
                    return this.js(item);
                } else {
                    return this.js(item.path, item.options);
                }
            }));
        }
    }
}

// Auto-load bundles based on HTML attribute
document.addEventListener('DOMContentLoaded', () => {
    const bundleName = document.documentElement.getAttribute('data-load-bundle');
    if (bundleName) {
        LinkManager.bundle(bundleName)
            .then(() => console.log(`✅ Bundle '${bundleName}' loaded successfully`))
            .catch(error => console.error(`❌ Failed to load bundle '${bundleName}':`, error));
    }
});

// Make available globally
window.LinkManager = LinkManager;
window.RESOURCES = RESOURCES;
window.BUNDLES = BUNDLES;