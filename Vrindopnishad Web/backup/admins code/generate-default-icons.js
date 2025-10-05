/**
 * Simple script to generate default placeholder icons for the admin panel
 * Run with: node generate-default-icons.js
 */

const fs = require('fs');
const path = require('path');

// Make sure icons directory exists
const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir);
}

// Create SVG image with specified color and title
function createIconSVG(color, title) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192">
        <rect width="192" height="192" fill="${color}" rx="16" ry="16"/>
        <text x="96" y="96" font-family="Arial, sans-serif" font-size="24" font-weight="bold" 
            fill="white" text-anchor="middle" dominant-baseline="middle">${title}</text>
    </svg>`;
}

// Define the icons to create
const icons = [
    { filename: 'default-gallery.svg', color: '#4361EE', title: 'Gallery' },
    { filename: 'default-books.svg', color: '#3A56D4', title: 'Books' },
    { filename: 'default-collections.svg', color: '#2C3E50', title: 'Collections' },
    { filename: 'default-pdfs.svg', color: '#E67E22', title: 'PDFs' },
    { filename: 'default-users.svg', color: '#27AE60', title: 'Users' },
    { filename: 'icon-192x192.svg', color: '#4361EE', title: 'V' },
    { filename: 'icon-512x512.svg', color: '#4361EE', title: 'V' }
];

// Create each icon and save
icons.forEach(icon => {
    const svgContent = createIconSVG(icon.color, icon.title);
    const filePath = path.join(iconsDir, icon.filename);
    
    fs.writeFileSync(filePath, svgContent);
    console.log(`Created ${icon.filename}`);
});

console.log('All default icons created successfully!');
console.log('To convert SVG to PNG, you can use ImageMagick or an online converter.'); 