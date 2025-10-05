# Quick Notes Bar

A simple, lightweight notes widget that can be easily added to any website. The notes bar allows users to quickly jot down notes while browsing, with all notes saved in the browser's localStorage.

## Features

- 🚀 Easy to integrate - just one line of code
- 📝 Quick note-taking with a clean interface
- 💾 Notes are saved in localStorage
- 🌓 Automatically adapts to light/dark mode
- 📱 Fully responsive design
- 🔍 Collapsible interface to save space
- 🎨 Customizable appearance

## Installation

### Option 1: Direct Script Inclusion

Add the following line to your HTML file, just before the closing `</body>` tag:

```html
<script src="https://cdn.jsdelivr.net/gh/yourusername/quick-notes-bar/notes-bar.js"></script>
```

### Option 2: Download and Include Locally

1. Download the `notes-bar.js` file
2. Add it to your project
3. Include it in your HTML:

```html
<script src="path/to/notes-bar.js"></script>
```

## Usage

The notes bar will automatically appear in the bottom-right corner of your website. Users can:

- Click the header to collapse/expand the notes bar
- Type a note and press Enter or click "Add" to save it
- Click the "×" button on any note to delete it

## Customization

You can customize the appearance by adding CSS variables to your website's stylesheet:

```css
:root {
    --notes-bg: #ffffff;           /* Background color */
    --notes-text: #333333;         /* Text color */
    --notes-accent: #4a6cf7;       /* Accent color (header, buttons) */
    --notes-accent-rgb: 74, 108, 247; /* RGB values of accent color */
    --notes-accent-hover: #3a5ce6; /* Hover state for accent color */
    --notes-border: #e0e0e0;       /* Border color */
    --notes-shadow: rgba(0, 0, 0, 0.1); /* Shadow color */
}

/* Dark mode variables */
body.dark-mode {
    --notes-bg: #1a1a1a;
    --notes-text: #f0f0f0;
    --notes-accent: #6a8cff;
    --notes-accent-rgb: 106, 140, 255;
    --notes-accent-hover: #5a7cef;
    --notes-border: #333333;
    --notes-shadow: rgba(0, 0, 0, 0.3);
}
```

## Browser Support

The notes bar works in all modern browsers that support:
- localStorage
- CSS Variables
- Flexbox
- ES6 JavaScript

## License

MIT License - Feel free to use in any project, personal or commercial.

## Credits

Created by Vrindopnishad 