// --- This script is embedded for demo purposes ---
// --- In your real project, this code would be in 'asset-manager.js' ---

// --- This is the content for asset-manager.js ---

// 1. DEFINE ALL YOUR ASSETS HERE
// We now use objects to define assets, allowing for custom attributes.
const pageAssets = {
  // 'common' assets load on EVERY page
  common: {
    css: [
      {
        href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css',
        attributes: {
          integrity: 'sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==',
          crossorigin: 'anonymous',
          referrerpolicy: 'no-referrer'
        }
      },
      { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap' },
      { 
        href: 'https://imbajrangi.github.io/Company/Vrindopnishad Web/web-extentions/Custom Cursor/custom-cursor.css',
        attributes: { class: 'css' }
      }
    ],
    js: [
      { 
        src: 'https://imbajrangi.github.io/Company/Vrindopnishad Web/web-extentions/Custom Cursor/custom-cursor.js',
        attributes: { defer: true } // 'defer' is ok for a standalone script
      }
    ]
  },
  
  // 'gallery' assets for Gallery.html
  gallery: {
    css: [
      { href: 'https://fonts.googleapis.com/css2?family=Protest+Strike&display=swap' },
      { 
        href: 'https://imbajrangi.github.io/Company/Vrindopnishad Web/Pictures/css/claude-collection.css',
        attributes: { class: 'style' }
      },
      { href: 'https://imbajrangi.github.io/Company/Vrindopnishad Web/Pictures/css/hero-video.css' },
      { href: 'https://imbajrangi.github.io/Company/Vrindopnishad Web/web-extentions/Ripple btn/btn-ripple.css' }
    ],
    js: [
      // *** FIX: Corrected broken relative path to a full URL ***
      { src: 'https://imbajrangi.github.io/Company/Vrindopnishad Web/Pictures/js/collection-page-fix.js' },
      { src: 'https://imbajrangi.github.io/Company/Vrindopnishad Web/web-extentions/Ripple btn/btn-ripple.js' }
    ]
  },

  // 'pictures' assets for pictures.html
  pictures: {
    css: [
      { href: 'https://imbajrangi.github.io/Company/Vrindopnishad Web/Pictures/css/pic-collection.css' },
      { href: 'https://imbajrangi.github.io/Company/Vrindopnishad Web/Pictures/css/lazy-load.css' }
    ],
    js: [
      { src: 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js' },
      { src: 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js' },
      { src: 'https://imbajrangi.github.io/Company/Vrindopnishad Web/Pictures/js/immediate-loader.js' },
      { src: 'https://imbajrangi.github.io/Company/Vrindopnishad Web/Pictures/js/pic-collection.js' },
      { src: 'https://imbajrangi.github.io/Company/Vrindopnishad Web/Pictures/js/pic-simple.js' },
      { src: 'https://imbajrangi.github.io/Company/Vrindopnishad Web/Pictures/js/notifications.js' },
      { src: 'https://imbajrangi.github.io/Company/Vrindopnishad Web/Security/disable-right-click.js' },
      { src: 'https://imbajrangi.github.io/Company/Vrindopnishad Web/Security/image-protection.js' },
      { src: 'https://imbajrangi.github.io/Company/Vrindopnishad Web/Security/watermark.js' },
      { src: 'https://imbajrangi.github.io/Company/Vrindopnishad Web/web-extentions/links/link-handler.js' },
      { 
        src: 'https://imbajrangi.github.io/Company/Vrindopnishad Web/web-extentions/Custom Cursor/custom-cursor.js',
        attributes: { defer: true } // 'defer' is ok for a standalone script
      }
    ]
  },

  // 'home' assets for Home.html
  index: {
    css: [
      { href: 'https://fonts.googleapis.com/css2?family=Anton&display=swap',
        attributes: { rel: 'stylesheet' }
       },
      { href: 'https://imbajrangi.github.io/Company/Vrindopnishad Web/Home/css/styles.css' },
      { href: 'https://imbajrangi.github.io/Company/Vrindopnishad Web/Home/css/image-hover.css' },
      { href: 'https://imbajrangi.github.io/Company/Vrindopnishad Web/web-extentions/Custom Cursor/custom-cursor.css',
        attributes: { class: 'stylesheet' }
      },
      { href: "https://fonts.googleapis.com/css2?family=Anton&display=swap",
        attributes: { rel: 'stylesheet' }
      },
      { href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
        attributes: { rel: 'stylesheet' }
      }
    ],
    js: [
      { src: 'https://imbajrangi.github.io/Company/Vrindopnishad Web/Home/js/animations.js' },
      { src: 'https://imbajrangi.github.io/Company/Vrindopnishad Web/Home/js/effects.js' },
      { src: 'https://imbajrangi.github.io/Company/Vrindopnishad Web/Home/js/image-hover.js' },
      { 
        src: 'https://imbajrangi.github.io/Company/Vrindopnishad Web/web-extentions/Custom Cursor/custom-cursor.js',
        attributes: { defer: true }
      }
    ]
  }
};

// 2. HELPER FUNCTIONS TO LOAD FILES (UPGRADED)

/**
 * Creates and appends a CSS <link> tag to the <head>.
 * @param {object | string} asset - The asset object (or string for simple href).
 */
function loadCss(asset) {
  // Standardize: if asset is just a string, convert to object
  const assetObj = typeof asset === 'string' ? { href: asset } : asset;
  if (!assetObj.href) return;

  const link = document.createElement('link');
  link.rel = 'stylesheet'; // Default
  link.href = assetObj.href;

  // Apply all custom attributes
  if (assetObj.attributes) {
    for (const [key, value] of Object.entries(assetObj.attributes)) {
      link.setAttribute(key, value);
    }
  }

  link.onerror = () => console.error(`Failed to load CSS: ${assetObj.href}`);
  document.head.appendChild(link);
  console.log(`Loading CSS: ${assetObj.href}`);
}

/**
 * Creates and appends a JS <script> tag to the <body>.
 * @param {object | string} asset - The asset object (or string for simple src).
 * @param {function} callback - A function to call once the script is loaded.
 */
function loadJs(asset, callback) {
  // Standardize: if asset is just a string, convert to object
  const assetObj = typeof asset === 'string' ? { src: asset } : asset;
  if (!assetObj.src) {
    if (callback) callback(); // Call callback immediately if no src
    return;
  }

  const script = document.createElement('script');
  script.src = assetObj.src;
  
  // Apply all custom attributes
  if (assetObj.attributes) {
    for (const [key, value] of Object.entries(assetObj.attributes)) {
      if (typeof value === 'boolean') {
        script[key] = value; // Handle boolean properties like defer, async, nomodule
      } else {
        script.setAttribute(key, value); // Handle string properties like type, integrity
      }
    }
  }

  // Set up onload/onerror
  script.onload = () => {
      console.log(`Loaded JS: ${assetObj.src}`);
      if (callback) callback(); // Call the next function in the chain
  };
  script.onerror = () => {
      console.error(`Failed to load JS: ${assetObj.src}`);
      if (callback) callback(); // Still call callback to not break the chain
  };

  // Since the <script> tags in the HTML are at the end of the <body>,
  // document.body is guaranteed to exist. We can append directly.
  document.body.appendChild(script);
  console.log(`Appending JS: ${assetObj.src}`);
}

/**
 * Recursively loads a list of JS assets in sequence.
 * @param {Array<object | string>} jsAssets - The list of assets to load.
 */
function loadJsSequential(jsAssets) {
  if (!jsAssets || jsAssets.length === 0) {
    return; // All scripts loaded
  }
  
  // Get the first asset and the rest of the list
  const [nextAsset] = jsAssets;
  const remainingAssets = jsAssets.slice(1);
  
  // Load the next asset, and when it's done, load the rest
  loadJs(nextAsset, () => loadJsSequential(remainingAssets));
}


// 3. THE MAIN FUNCTION TO CALL FROM YOUR HTML (MODIFIED)

/**
 * Loads all 'common' assets and all assets for a specific page.
 * @param {string} pageName - The key from pageAssets (e.g., 'gallery', 'pictures', 'home').
 */
function loadPageAssets(pageName) {
  console.log(`Loading assets for: ${pageName}`);
  
  // Get assets
  const common = pageAssets.common;
  const page = pageAssets[pageName];

  // --- CSS (can be loaded in parallel) ---
  if (common && common.css) {
    common.css.forEach(loadCss);
  }
  if (page && page.css) {
    page.css.forEach(loadCss);
  }

  // --- JS ---
  // Load common JS (can be loaded in parallel, respects its own 'defer' attribute)
  if (common && common.js) {
    common.js.forEach(asset => loadJs(asset, null)); // No callback, load async
  }
  
  // Load page-specific JS
  if (page && page.js) {
    // For 'pictures' and 'index', scripts have dependencies, so load sequentially
    if (pageName === 'pictures' || pageName === 'index') {
      console.log('Loading JS sequentially for page:', pageName);
      loadJsSequential(page.js);
    } else {
      // For other pages, load in parallel
      console.log('Loading JS in parallel for page:', pageName);
      page.js.forEach(asset => loadJs(asset, null));
    }
  }

  if (!page) {
    console.warn(`No assets found for page: ${pageName}`);
  }
}