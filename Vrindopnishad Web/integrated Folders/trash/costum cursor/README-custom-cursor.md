# Custom Cursor Implementation Guide

This guide explains how to use the custom cursor in your web projects. The cursor automatically detects touch devices and only enables the custom cursor for devices with hover capability (desktop/laptop).

## Features

- ✨ Smooth cursor following mouse movement
- 🔍 Automatically detects and disables on touch devices
- 🎨 Changes style when hovering over interactive elements
- 🌙 Dark mode support
- 🎭 Multiple style variations
- 📱 Fully responsive
- 💻 Easy to implement in any project

## Quick Implementation

### Step 1: Include the Files

Download `customCursor.js` and `customCursor.css` files, then add them to your project.

Link them in your HTML file:

```html
<link rel="stylesheet" href="path/to/customCursor.css">
<script src="path/to/customCursor.js" defer></script>
```

### Step 2: Add HTML Element (Optional)

The cursor element is created automatically by the script, but you can also add it manually:

```html
<div id="cursor" class="cursor"></div>
```

### Step 3: That's it!

The custom cursor will automatically initialize when the DOM is loaded, detect the device capabilities, and enable itself only on appropriate devices.

## Advanced Usage

### Customizing the Cursor

You can customize the cursor appearance by modifying the CSS variables:

```css
:root {
    --cursor-primary-color: #ff5722;  /* Change cursor color */
    --cursor-size: 40px;              /* Change cursor size */
    --cursor-border-width: 2px;       /* Change border width */
    --cursor-transition-speed: 0.2s;  /* Change transition speed */
}
```

### Style Variations

The CSS includes several predefined style variations:

```html
<!-- Larger cursor -->
<div id="cursor" class="cursor cursor-lg"></div>

<!-- Smaller cursor -->
<div id="cursor" class="cursor cursor-sm"></div>

<!-- Dot cursor (small dot with no border) -->
<div id="cursor" class="cursor cursor-dot"></div>

<!-- Ring cursor (just border, no fill) -->
<div id="cursor" class="cursor cursor-ring"></div>

<!-- Square cursor -->
<div id="cursor" class="cursor cursor-square"></div>
```

### JavaScript API

The `CustomCursor` object provides methods to control the cursor:

```javascript
// Manually initialize
CustomCursor.init();

// Enable cursor
CustomCursor.enable();

// Disable cursor
CustomCursor.disable();

// Check if cursor is enabled
if (CustomCursor.isEnabled) {
    // Do something
}
```

### Adding Active State to Custom Elements

You can make the cursor change to its active state when hovering over any element by:

1. Adding the `clickable` class:
```html
<div class="clickable">This will trigger the active cursor state</div>
```

2. Adding the `data-cursor-active` attribute:
```html
<div data-cursor-active>This will also trigger the active cursor state</div>
```

### Responsive Behavior

The cursor is automatically hidden on touch devices using CSS media queries and JavaScript detection.

## Implementation Examples

### Basic Implementation

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Custom Cursor Demo</title>
    <link rel="stylesheet" href="customCursor.css">
</head>
<body>
    <h1>Custom Cursor Demo</h1>
    <p>Move your mouse around to see the custom cursor in action!</p>
    <a href="#">Hover me to see the active state</a>
    
    <script src="customCursor.js"></script>
</body>
</html>
```

### With Custom Color

```html
<style>
    :root {
        --cursor-primary-color: #3498db;  /* Blue cursor */
    }
</style>
```

### For Specific Sections Only

If you want the custom cursor only in specific sections:

```javascript
// Disable the global cursor
CustomCursor.disable();

// Enable only in a specific section
document.querySelector('.cursor-section').addEventListener('mouseenter', () => {
    CustomCursor.enable();
});

document.querySelector('.cursor-section').addEventListener('mouseleave', () => {
    CustomCursor.disable();
});
```

## Compatibility

- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Opera
- ✅ Mobile browsers (cursor is disabled automatically)

## Troubleshooting

### The cursor doesn't appear

- Check if your device supports hover (not a touch-only device)
- Ensure JavaScript is enabled
- Check the console for any errors

### The cursor lags/jumps

- Reduce the delay in the JavaScript file (default is 50ms)
- Check for performance issues on your page

### The cursor appears on mobile devices

- Make sure you're using both the JavaScript detection and CSS media queries
- Test with different mobile browsers

## License

This custom cursor implementation is free to use in both personal and commercial projects.

---

Created by Bhaktweb 2024 