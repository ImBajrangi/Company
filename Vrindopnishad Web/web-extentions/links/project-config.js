// project-config.js - Customize this for your project
// Include this AFTER universal-linker.js

// Resource paths configuration
RESOURCES.css = {
    // External CDN resources
    cdn: {
        fontAwesome: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    },
    
    // Main styles
    main: {
        styles: '/Home/css/styles.css',
        imageHover: '/Home/css/image-hover.css'
    },
    // Components
    components: {
        customCursor: '/web-extentions/Custom Cursor/custom-cursor.css'
    }
};

RESOURCES.js = {
    // Core modules
    modules: {
        linkHandler: '/web-extentions/links/link-handler.js',
        customCursor: '/web-extentions/Custom Cursor/custom-cursor.js'
    }
};

// Define main bundle for home page
BUNDLES.home = {
    css: [
        'cdn.fontAwesome',
        'main.styles',
        'main.imageHover',
        'components.customCursor'
    ],
    js: [
        { path: 'modules.linkHandler', options: { defer: true } },
        { path: 'modules.customCursor', options: { module: true } }
    ]
};

// Page-specific bundles for your project
BUNDLES.homepage = {
    css: [
        'main',
        'custom.home',
        'animations.hover',
        'components.cards'
    ],
    js: [
        { path: 'modules.imageHover', options: { module: true } },
        { path: 'modules.customCursor', options: { module: true } }
    ]
};

BUNDLES.aboutPage = {
    css: [
        'main',
        'custom.about',
        'animations.fade'
    ],
    js: [
        { path: 'modules.linkHandler' },
        { path: 'components.accordion' }
    ]
};

// Project loader functions
const ProjectLoader = {
    // Load all home page resources
    loadHome: function() {
        return LinkManager.bundle('home').then(() => {
            console.log('✅ Home resources loaded successfully');
        }).catch(error => {
            console.error('❌ Error loading home resources:', error);
        });
    },
    
    // Load homepage resources
    loadHomePage: function() {
        return LinkManager.bundle('homepage');
    },
    
    // Load about page resources  
    loadAboutPage: function() {
        return LinkManager.bundle('aboutPage');
    },
    
    // Load specific page
    loadPage: function(pageName) {
        return Promise.all([
            LinkManager.css(`custom.${pageName}`),
            LinkManager.js(`pages.${pageName}`)
        ]);
    }
};

// Make available globally
window.MyProjectLoader = MyProjectLoader;

// Make loader available globally
window.ProjectLoader = ProjectLoader;

// Auto-load based on page
document.addEventListener('DOMContentLoaded', function() {
    const path = window.location.pathname;
    
    if (path === '/' || path.includes('home')) {
        ProjectLoader.loadHome();
    }
});