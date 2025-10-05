// config/paths.js - Centralized path configuration
const PATHS = {
    images: {
      home: {
        decorative: "./image/Home Pics/img_vas.jpg",
        banner: "./image/Home Pics/banner.jpg",
        gallery: [
          "./image/Home Pics/gallery1.jpg",
          "./image/Home Pics/gallery2.jpg",
          "./image/Home Pics/gallery3.jpg"
        ]
      },
      profile: {
        avatar: "./image/Profile/avatar.jpg",
        background: "./image/Profile/bg.jpg"
      },
      products: {
        featured: "./image/Products/featured.jpg",
        categories: {
          electronics: "./image/Products/electronics.jpg",
          fashion: "./image/Products/fashion.jpg"
        }
      }
    },
    scripts: {
      extensions: {
        linkHandler: "/web-extensions/links/link-handler.js",
        customCursor: "/web-extensions/Custom Cursor/custom-cursor.js",
        animations: "/web-extensions/animations/fade.js"
      },
      modules: {
        utils: "/js/utils.js",
        components: "/js/components.js"
      }
    },
    styles: {
      main: "/css/main.css",
      themes: {
        dark: "/css/themes/dark.css",
        light: "/css/themes/light.css"
      }
    }
  };
  
  // Image Manager Class
  class ImageManager {
    constructor() {
      this.paths = PATHS.images;
    }
  
    // Get image path by nested key
    getImage(category, subcategory, index = null) {
      try {
        let path = this.paths[category];
        if (subcategory) path = path[subcategory];
        if (index !== null && Array.isArray(path)) path = path[index];
        return path || null;
      } catch (error) {
        console.warn(`Image path not found: ${category}.${subcategory}`, error);
        return null;
      }
    }
  
    // Create image element dynamically
    createImage(category, subcategory, options = {}) {
      const src = this.getImage(category, subcategory, options.index);
      if (!src) return null;
  
      const img = document.createElement('img');
      img.src = src;
      img.alt = options.alt || 'Image';
      img.loading = options.loading || 'lazy';
      
      if (options.classes) {
        img.className = Array.isArray(options.classes) 
          ? options.classes.join(' ') 
          : options.classes;
      }
  
      return img;
    }
  
    // Preload images
    preloadImages(imageList) {
      imageList.forEach(src => {
        const img = new Image();
        img.src = src;
      });
    }
  }
  
  // Script Manager Class
  class ScriptManager {
    constructor() {
      this.paths = PATHS.scripts;
      this.loadedScripts = new Set();
    }
  
    // Load script dynamically
    async loadScript(category, name, options = {}) {
      const src = this.paths[category][name];
      if (!src) {
        console.warn(`Script not found: ${category}.${name}`);
        return false;
      }
  
      if (this.loadedScripts.has(src)) {
        return true; // Already loaded
      }
  
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.defer = options.defer !== false;
        
        if (options.type) script.type = options.type;
        if (options.module) script.type = 'module';
  
        script.onload = () => {
          this.loadedScripts.add(src);
          resolve(true);
        };
        script.onerror = () => reject(false);
  
        document.head.appendChild(script);
      });
    }
  
    // Load multiple scripts
    async loadScripts(scriptList) {
      const promises = scriptList.map(({ category, name, options }) => 
        this.loadScript(category, name, options)
      );
      return Promise.all(promises);
    }
  }
  
  // Main Resource Manager
  class ResourceManager {
    constructor() {
      this.images = new ImageManager();
      this.scripts = new ScriptManager();
    }
  
    // Initialize common resources
    async initialize() {
      try {
        // Load common scripts
        await this.scripts.loadScripts([
          { category: 'extensions', name: 'linkHandler' },
          { category: 'extensions', name: 'customCursor', options: { module: true } }
        ]);
  
        // Preload critical images
        const criticalImages = [
          this.images.getImage('home', 'decorative'),
          this.images.getImage('home', 'banner')
        ].filter(Boolean);
        
        this.images.preloadImages(criticalImages);
  
        console.log('Resources initialized successfully');
        return true;
      } catch (error) {
        console.error('Failed to initialize resources:', error);
        return false;
      }
    }
  }
  
  // Safe export with error handling
  try {
    if (typeof module !== 'undefined' && module.exports) {
      module.exports = { ResourceManager, PATHS };
    } else if (typeof window !== 'undefined') {
      window.ResourceManager = ResourceManager;
      window.PATHS = PATHS;
    }
  } catch (error) {
    console.warn('Export error:', error);
  }
  
  // Usage Examples:
  
  // 1. Initialize the resource manager
  const resourceManager = new ResourceManager();
  resourceManager.initialize();
  
  // 2. Create images dynamically
  const decorativeImg = resourceManager.images.createImage('home', 'decorative', {
    alt: 'Decorative image',
    classes: 'distort-on-hover',
    loading: 'lazy'
  });
  
  // 3. Get specific image paths
  const avatarPath = resourceManager.images.getImage('profile', 'avatar');
  const galleryImage = resourceManager.images.getImage('home', 'gallery', 0);
  
  // 4. Load additional scripts on demand
  resourceManager.scripts.loadScript('extensions', 'animations');
  
  // 5. Simple helper functions for quick access
  function getImagePath(category, subcategory, index) {
    return PATHS.images[category]?.[subcategory]?.[index] || 
           PATHS.images[category]?.[subcategory] || null;
  }
  
  function getScriptPath(category, name) {
    return PATHS.scripts[category]?.[name] || null;
  }