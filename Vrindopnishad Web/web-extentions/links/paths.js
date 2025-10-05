// Base paths configuration
const BASE = {
    home: '/Home',
    webExt: '/web-extentions'
};

// Unified file paths configuration
const filePaths = {
    css: {
        styles: `${BASE.home}/css/styles.css`,
        imageHover: `${BASE.home}/css/image-hover.css`,
        customCursor: `${BASE.webExt}/Custom Cursor/custom-cursor.css`
    },
    js: {
        animations: `${BASE.home}/js/animations.js`,
        effects: `${BASE.home}/js/effects.js`,
        imageHover: `${BASE.home}/js/image-hover.js`,
        linkHandler: `${BASE.webExt}/links/link-handler.js`,
        customCursor: `${BASE.webExt}/Custom Cursor/custom-cursor.js`
    }
};

// Detect current path context
const isInHomeDir = window.location.pathname.includes('/Home/main/');

// Resource paths configuration
const PATHS = {
    styles: {
        main: `${BASE.home}/css/styles.css`,
        imageHover: `${BASE.home}/css/image-hover.css`,
        customCursor: `${BASE.webExt}/Custom Cursor/custom-cursor.css`
    },
    scripts: {
        // Core scripts
        animations: `${BASE.home}/js/animations.js`,
        effects: `${BASE.home}/js/effects.js`,
        imageHover: `${BASE.home}/js/image-hover.js`,
        // Extensions
        linkHandler: `${BASE.webExt}/links/link-handler.js`,
        customCursor: `${BASE.webExt}/Custom Cursor/custom-cursor.js`,
        btnRipple: `${BASE.webExt}/Ripple Btn/btn-ripple.js`
    },
    media: {
        sounds: {
            success: `${BASE.home}/sounds/success.mp3`,
            error: `${BASE.home}/sounds/error.mp3`,
            info: `${BASE.home}/sounds/info.mp3`
        },
        images: {
            icon: `${BASE.home}/image/icon_main_02.png`,
            decorative: `${BASE.home}/image/Home Pics/img_vas.jpg`,
            logo: `${BASE.home}/image/icon_main_02.png`
        }
    },
    pages: {
        home: `${BASE.home}/main/home.html`,
        about: `/about code/main/about.html`,
        gallery: `/Pictures/main/Gallery.html`,
        pictures: `/Pictures/main/pictures.html`,
        stack: `/Stack/main/stack.html`,
        book: `/book/main/book.html`,
        pdf_viewer: `/pdf/main/pdf-viewer.html`
    }
};

// Resource loader utility
const ResourceLoader = {
    // Load a single CSS file
    loadStyle(path) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = path;
        document.head.appendChild(link);
    },

    // Load multiple CSS files
    loadStyles(styles) {
        styles.forEach(path => this.loadStyle(path));
    },

    // Load a single JavaScript file
    loadScript(path, options = {}) {
        const script = document.createElement('script');
        script.src = path;
        if (options.module) script.type = 'module';
        if (options.defer) script.defer = true;
        document.head.appendChild(script);
        return script;
    },

    // Load multiple JavaScript files
    loadScripts(scripts) {
        scripts.forEach(({path, options}) => this.loadScript(path, options));
    },

    // Initialize core resources
    init() {
        // Load core styles
        this.loadStyles([
            PATHS.styles.main,
            PATHS.styles.imageHover,
            PATHS.styles.customCursor
        ]);

        // Load core scripts
        this.loadScripts([
            { path: PATHS.scripts.linkHandler, options: { defer: true } },
            { path: PATHS.scripts.customCursor, options: { module: true } }
        ]);
    }
};

// Simple functions to load files
function loadCSS(name) {
    const path = files.css[name];
    if (!path) {
        console.error(`CSS file not found: ${name}`);
        return;
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = path;
    document.head.appendChild(link);
}

function loadJS(name, isModule = false) {
    const path = files.js[name];
    if (!path) {
        console.error(`JS file not found: ${name}`);
        return;
    }
    const script = document.createElement('script');
    script.src = path;
    if (isModule) script.type = 'module';
    document.head.appendChild(script);
}

// Make functions available globally
window.loadFile = {
    css: loadCSS,
    js: loadJS
};