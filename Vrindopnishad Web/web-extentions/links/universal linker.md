# Universal Resource Linker - Usage Guide

## Setup

1. Include the Universal Resource Linker in your HTML head:
```html
<script src="/path/to/universal-linker.js"></script>
```

## Usage Methods

### 1. Auto-Loading with Data Attributes (Recommended)

Add a `data-page` attribute to your body tag to automatically load the appropriate bundle:

```html
<body data-page="home">
    <!-- Your content -->
</body>
```

Available bundles:
- `core` - Basic resources (FontAwesome, custom cursor)
- `home` - Home page bundle
- `stack` - Stack page bundle  
- `readMe` - Read-me page bundle
- `about` - About page bundle
- `gallery` - Gallery page bundle

### 2. Manual Bundle Loading

```javascript
// Load a specific bundle
loadBundle('home').then(() => {
    console.log('Home bundle loaded successfully');
});

// Or with error handling
loadBundle('about')
    .then(() => console.log('About bundle loaded'))
    .catch(err => console.error('Failed to load bundle:', err));
```

### 3. Custom Resource Loading

```javascript
// Load custom CSS and JS files
loadResources({
    css: [
        'cdn.fontAwesome',
        'main.styles',
        '/custom/path/style.css'
    ],
    js: [
        'modules.animations',
        { path: 'modules.customCursor', options: { type: 'module' } },
        '/custom/path/script.js'
    ]
});
```

### 4. Individual File Loading

```javascript
// Load single CSS file
loadCSS('main.styles');
loadCSS('/custom/style.css');

// Load single JS file
loadJS('modules.animations');
loadJS('/custom/script.js', { type: 'module' });

// Load with options
loadJS({
    path: 'modules.customCursor',
    options: { type: 'module', defer: true }
});
```

## HTML Examples

### Home Page
```html
<!DOCTYPE html>
<html>
<head>
    <script src="/path/to/universal-linker.js"></script>
</head>
<body data-page="home">
    <!-- Auto-loads home bundle -->
</body>
</html>
```

### Stack Page
```html
<!DOCTYPE html>
<html>
<head>
    <script src="/path/to/universal-linker.js"></script>
</head>
<body data-page="stack">
    <!-- Auto-loads stack bundle -->
</body>
</html>
```

### Custom Loading
```html
<!DOCTYPE html>
<html>
<head>
    <script src="/path/to/universal-linker.js"></script>
</head>
<body>
    <script>
        // Custom resource loading
        document.addEventListener('DOMContentLoaded', () => {
            loadResources({
                css: ['cdn.fontAwesome', 'main.styles'],
                js: ['modules.animations', 'modules.effects']
            });
        });
    </script>
</body>
</html>
```

## Resource Path Notation

Use dot notation to reference predefined resources:

- `cdn.fontAwesome` → FontAwesome CDN
- `main.styles` → Main styles CSS
- `components.customCursor` → Custom cursor CSS
- `modules.animations` → Animations JS
- `pages.stack` → Stack-specific CSS

Or use direct paths:
- `/custom/path/style.css`
- `/custom/path/script.js`

## Advanced Features

### Adding New Resources
```javascript
// Access the universal linker instance
const linker = new UniversalLinker();

// Add new resource paths
linker.addResources({
    css: {
        custom: {
            newStyle: '/path/to/new-style.css'
        }
    }
});
```

### Checking Loaded Resources
```javascript
// Get list of loaded resources
console.log(universalLinker.getLoadedResources());

// Clear cache (force reload)
universalLinker.clearCache();
```

## Benefits

- ✅ **Centralized Management** - All resource paths in one place
- ✅ **Duplicate Prevention** - Automatically prevents loading same resource twice
- ✅ **Flexible Loading** - Bundles, individual files, or custom combinations
- ✅ **Promise-based** - Proper async handling with error catching
- ✅ **Auto-loading** - Set data-page attribute for automatic bundle loading
- ✅ **Easy Maintenance** - Update paths in one file, affects all pages

## Error Handling

Always handle potential errors:

```javascript
loadBundle('home')
    .then(() => {
        // Resources loaded successfully
        initializePageFunctions();
    })
    .catch(error => {
        console.error('Resource loading failed:', error);
        // Fallback behavior
    });
```

# How to Update File Paths in Universal Resource Linker

## Method 1: Direct Configuration Update (Recommended)

### Updating the main configuration in universal-linker.js:

```javascript
// In universal-linker.js, modify the initializeConfig() method
initializeConfig() {
    return {
        // CDN Resources
        cdn: {
            fontAwesome: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css',
            // Add new CDN resources
            bootstrap: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css'
        },

        // CSS Resources
        css: {
            main: {
                styles: '/Home/css/styles.css',           // ← Update these paths
                imageHover: '/Home/css/image-hover.css',  // ← Update these paths
                // Add new main styles
                typography: '/Home/css/typography.css'
            },
            components: {
                customCursor: '/web-extentions/Custom Cursor/custom-cursor.css',  // ← Update path
                // Add new components
                modal: '/components/css/modal.css',
                navbar: '/components/css/navbar.css'
            },
            pages: {
                stack: '/Stack/css/stack.css',                    // ← Update existing paths
                readMe: '/sketch/css/read-me.css',
                // Add new page styles
                dashboard: '/dashboard/css/dashboard.css',
                profile: '/profile/css/profile.css'
            }
        },

        // JavaScript Resources
        js: {
            modules: {
                animations: '/Home/js/animations.js',             // ← Update existing paths
                effects: '/Home/js/effects.js',
                // Add new modules
                validation: '/modules/js/validation.js',
                api: '/modules/js/api-handler.js'
            },
            pages: {
                stack: '/Stack/js/stack.js',                     // ← Update existing paths
                audio: '/book/js/audio.js',
                // Add new page scripts
                dashboard: '/dashboard/js/dashboard.js',
                profile: '/profile/js/profile.js'
            }
        }
    };
}
```

## Method 2: Runtime Path Updates

### Adding new resources at runtime:

```javascript
// In any of your JS files or HTML pages
document.addEventListener('DOMContentLoaded', () => {
    // Access the global instance
    const linker = universalLinker;
    
    // Add new CSS paths
    linker.config.css.pages.newPage = '/new-page/css/style.css';
    linker.config.css.components.accordion = '/components/css/accordion.css';
    
    // Add new JS paths
    linker.config.js.modules.charts = '/modules/js/charts.js';
    linker.config.js.pages.newPage = '/new-page/js/app.js';
    
    // Update existing paths
    linker.config.css.main.styles = '/updated/path/styles.css';
});
```

### Using the addResources method:

```javascript
// Add entire new sections
universalLinker.addResources({
    css: {
        themes: {
            dark: '/themes/css/dark.css',
            light: '/themes/css/light.css'
        },
        layouts: {
            grid: '/layouts/css/grid.css',
            flexbox: '/layouts/css/flexbox.css'
        }
    },
    js: {
        utils: {
            helpers: '/utils/js/helpers.js',
            validators: '/utils/js/validators.js'
        }
    }
});
```

## Method 3: Creating Custom Configuration Files

### Create a separate config file: `config/resource-paths.js`

```javascript
// config/resource-paths.js
const RESOURCE_PATHS = {
    // Base paths
    BASE_PATHS: {
        css: '/assets/css/',
        js: '/assets/js/',
        images: '/assets/images/'
    },
    
    // Custom paths for your project
    CUSTOM_PATHS: {
        css: {
            // Main styles
            main: {
                styles: '/Home/css/styles.css',
                imageHover: '/Home/css/image-hover.css'
            },
            // Your custom additions
            custom: {
                dashboard: '/dashboard/css/main.css',
                profile: '/user/css/profile.css'
            }
        },
        js: {
            // Your custom JS files
            custom: {
                dashboard: '/dashboard/js/app.js',
                profile: '/user/js/profile.js',
                api: '/core/js/api-client.js'
            }
        }
    }
};

// Export for use
if (typeof window !== 'undefined') {
    window.RESOURCE_PATHS = RESOURCE_PATHS;
}
```

### Then update your universal-linker.js to use it:

```javascript
// In universal-linker.js, modify initializeConfig()
initializeConfig() {
    // Merge with custom paths if available
    const customPaths = window.RESOURCE_PATHS?.CUSTOM_PATHS || {};
    
    return {
        cdn: { /* your CDN resources */ },
        
        css: {
            ...this.getDefaultCSSPaths(),
            ...customPaths.css  // Merge custom CSS paths
        },
        
        js: {
            ...this.getDefaultJSPaths(),
            ...customPaths.js   // Merge custom JS paths
        },
        
        bundles: { /* your bundles */ }
    };
}
```

## Method 4: Environment-Based Path Updates

### Create different configurations for different environments:

```javascript
// In universal-linker.js
initializeConfig() {
    const environment = this.getEnvironment();
    const basePaths = this.getBasePaths(environment);
    
    return {
        css: {
            main: {
                styles: `${basePaths.css}Home/css/styles.css`,
                imageHover: `${basePaths.css}Home/css/image-hover.css`
            }
        },
        js: {
            modules: {
                animations: `${basePaths.js}Home/js/animations.js`
            }
        }
    };
}

getEnvironment() {
    // Detect environment
    return window.location.hostname === 'localhost' ? 'development' : 'production';
}

getBasePaths(environment) {
    const paths = {
        development: {
            css: '/dev/',
            js: '/dev/'
        },
        production: {
            css: '/assets/',
            js: '/assets/'
        }
    };
    
    return paths[environment] || paths.production;
}
```

## Method 5: Bundle-Specific Path Updates

### Update paths for specific bundles:

```javascript
// Update bundle configurations
universalLinker.config.bundles.customBundle = {
    css: [
        'cdn.fontAwesome',
        '/custom/path/main.css',
        '/custom/path/components.css'
    ],
    js: [
        { path: '/custom/path/app.js', options: { type: 'module' } },
        '/custom/path/utilities.js'
    ]
};

// Or update existing bundles
universalLinker.config.bundles.home.css.push('/new/path/extra-styles.css');
universalLinker.config.bundles.home.js.push({
    path: '/new/path/extra-script.js',
    options: { defer: true }
});
```

## Method 6: Dynamic Path Resolution

### Create a path resolver function:

```javascript
// Add to universal-linker.js
class UniversalLinker {
    constructor() {
        this.loadedResources = new Set();
        this.pathResolver = this.createPathResolver();
        this.config = this.initializeConfig();
    }
    
    createPathResolver() {
        return {
            // Path transformation rules
            transformPath: (path) => {
                // Example: Convert relative paths to absolute
                if (path.startsWith('./')) {
                    return path.replace('./', '/current-dir/');
                }
                
                // Example: Add version numbers
                if (path.includes('/css/')) {
                    return path.replace('/css/', '/css/v2/');
                }
                
                return path;
            },
            
            // Resolve path based on environment
            resolvePath: (path) => {
                const transformed = this.transformPath(path);
                
                // Add environment-specific prefixes
                if (window.location.hostname === 'localhost') {
                    return `/dev${transformed}`;
                }
                
                return `/prod${transformed}`;
            }
        };
    }
}
```

## Practical Examples

### Example 1: Updating Stack Page Paths
```javascript
// Update all stack-related paths
universalLinker.config.css.pages.stack = '/new-stack/css/main.css';
universalLinker.config.js.pages.stack = '/new-stack/js/app.js';
universalLinker.config.js.pages.audio = '/new-stack/js/audio-player.js';

// Then reload the bundle
loadBundle('stack');
```

### Example 2: Adding New Page Bundle
```javascript
// Add completely new page
universalLinker.config.css.pages.blog = '/blog/css/blog.css';
universalLinker.config.js.pages.blog = '/blog/js/blog.js';

// Create new bundle
universalLinker.config.bundles.blog = {
    css: ['cdn.fontAwesome', 'main.styles', 'pages.blog'],
    js: ['modules.animations', 'pages.blog']
};

// Use it
loadBundle('blog');
```

### Example 3: Bulk Path Updates
```javascript
// Update multiple paths at once
const pathUpdates = {
    'css.main.styles': '/v2/Home/css/styles.css',
    'css.components.customCursor': '/v2/components/cursor.css',
    'js.modules.animations': '/v2/js/animations.js'
};

Object.entries(pathUpdates).forEach(([path, newPath]) => {
    const keys = path.split('.');
    let current = universalLinker.config;
    
    for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = newPath;
});
```

## Tips for Path Management

1. **Use consistent naming conventions** for your paths
2. **Group related resources** logically (by page, by component type)
3. **Use environment variables** for different deployment paths
4. **Keep a backup** of your original paths before making changes
5. **Test path updates** on a development environment first
6. **Document your path structure** for team members