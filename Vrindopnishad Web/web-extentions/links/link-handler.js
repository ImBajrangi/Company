// Initialize path management
const initPathManagement = () => {
    // Get paths from global scope if available
    const paths = window.PATHS || {};
    
    console.log('Initializing link handler...'); // Debug log
    
    return {
        PATHS: paths,
        BASE: window.BASE || {
            home: '/Home',
            webExt: '/web-extentions'
        }
    };
};

// Initialize PM (Path Management)
const PM = initPathManagement();

// Get all links that use CSS variables
document.addEventListener('DOMContentLoaded', () => {
    // Use paths from PATHS object if available, otherwise use default paths
    const links = {
        // Pages (use PATHS.pages if available, otherwise fallback to default)
        ...((PM && PM.PATHS && PM.PATHS.pages) || {
            home: "/Home/main/home.html",
            collection: "/Stack/main/stack.html",
            about: "/about code/main/about.html",
            pictures: "/Pictures/main/pictures.html",
            gallery: "/Pictures/main/Gallery.html",
            readme: "/sketch/main/read-me.html",
            book: "/book/main/book.html",
            pdf_viewer: "/pdf/main/pdf-viewer.html",
        }),
        
        // Resources - Using centralized paths when available
        Custom_Cursor_css: "/web-extentions/Custom Cursor/custom-cursor.css",
        Custom_Cursor_js: "/web-extentions/Custom Cursor/custom-cursor.js",
        btn_ripple_js: "/web-extentions/Ripple Btn/btn-ripple.js",
        btn_ripple_css: "/web-extentions/Ripple Btn/btn-ripple.css",
        links: "/web-extentions/links/link-handler.js",
        
        // External links
        web_content_manager: "/web content manager/",
        youtube: "https://www.youtube.com/@vrindopnishad",
        facebook: "https://www.facebook.com/vrindopnishad",
        instagram: "https://www.instagram.com/vrindopnishad",
        pinterest: "www.pinterest.com/vrindopnishad",
        whatsapp_channel: "https://whatsapp.com/channel/0029Vb6UR3Z9mrGcDXbHzA1Q",
        whatsapp_chat: "https://chat.whatsapp.com/JUUD0zZCbPyIemAQsxUdRm?mode=ems_copy_c"
    };

    // Update links with data-link attribute
    console.log('Starting to update links...'); // Debug log
    
    const elements = document.querySelectorAll('[data-link]');
    console.log(`Found ${elements.length} elements with data-link`); // Debug log
    
    elements.forEach(element => {
        const linkType = element.getAttribute('data-link');
        console.log(`Processing link: ${linkType}`); // Debug log
        
        if (links[linkType]) {
            element.href = links[linkType];
            console.log(`Updated ${linkType} to ${links[linkType]}`); // Debug log
        } else {
            console.warn(`No link found for type: ${linkType}`); // Debug warning
        }
    });
});