# Literary Hub - Admin Panel

## Overview

The Literary Hub Admin Panel is a comprehensive dashboard for managing the Literary Hub website. It provides tools for managing books, collections, users, and site settings. The admin panel has been enhanced with responsive design and Progressive Web App (PWA) capabilities to ensure it works effectively on all devices.

## Features

### Content Management
- **Books Management**: Add, edit, and delete books in the gallery
- **Collections Management**: Create and manage book collections
- **User Management**: Manage user accounts and permissions
- **Settings**: Configure site-wide settings

### Technical Features
- **Responsive Design**: Works on all device sizes from mobile to desktop
- **PWA Support**: Can be installed and used offline
- **API Integration**: Connects to the Literary Hub backend API
- **Authentication**: Secure JWT-based authentication
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Bilingual Support**: Error messages in both English and Hindi

## Accessibility Features

The admin panel has been enhanced with comprehensive accessibility features to ensure it can be used by everyone, including people with disabilities:

### Key Accessibility Features
- **Keyboard Navigation**: Full keyboard support with focus management
- **Screen Reader Support**: ARIA attributes and live regions for screen readers
- **Visual Accessibility**: High contrast mode and font size controls
- **Cognitive Accessibility**: Clear layout and simple language
- **Reduced Motion Support**: Respects user's motion preferences

For more details on accessibility features, see [ACCESSIBILITY-README.md](ACCESSIBILITY-README.md).

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Backend server running (see backend setup instructions)
- Node.js and npm (for development)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the admin panel directory:
   ```
   cd admins\ code/
   ```

3. Start a local server (for development):
   ```
   npx http-server
   ```
   
   Or use VS Code Live Server extension.

4. Access the admin panel:
   ```
   http://localhost:8080/admin.html
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd ../backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the backend server:
   ```
   npm run dev
   ```

4. Ensure the backend is running at `http://localhost:5000`

## Usage

### Login
1. Open the admin panel in your browser
2. Enter your admin credentials:
   - Email: admin@literaryhub.com
   - Password: (your admin password)
3. Click "Login"

### Managing Books
1. Navigate to the "Gallery Management" section
2. To add a new book:
   - Fill out the book details form
   - Click "Add Book"
3. To edit or delete a book:
   - Find the book in the list
   - Use the edit or delete buttons

### Managing Collections
1. Navigate to the "Collection Management" section
2. To add a new collection:
   - Fill out the collection details form
   - Select books to include
   - Click "Add Collection"
3. To edit or delete a collection:
   - Find the collection in the list
   - Use the edit or delete buttons

### Managing Users
1. Navigate to the "User Management" section
2. To add a new user:
   - Fill out the user details form
   - Select the user role
   - Click "Add User"
3. To edit or delete a user:
   - Find the user in the list
   - Use the edit or delete buttons

### Site Settings
1. Navigate to the "Settings" section
2. Update the site settings as needed
3. Click "Save Settings"

## PWA Features

The admin panel can be installed as a Progressive Web App (PWA) for an enhanced experience:

### Installation
- **Desktop**: Look for the install icon in the browser's address bar
- **Mobile**: Use "Add to Home Screen" option in your browser menu

### Offline Support
- Basic navigation works offline
- Cached content is available without internet
- Offline indicator shows connection status

For more details on PWA features, see [PWA-README.md](PWA-README.md).

## Responsive Design

The admin panel is fully responsive and works on all device sizes:

- **Mobile**: Optimized for small screens with touch-friendly controls
- **Tablet**: Balanced layout for medium-sized screens
- **Desktop**: Full-featured interface for large screens

The responsive design includes:
- Flexible layouts that adapt to screen size
- Touch-friendly buttons and controls
- Appropriate font sizes for readability
- Optimized forms for mobile input

## Development

### File Structure
- `admin.html` - Main HTML file
- `admin.css` - Styles for the admin panel
- `admin.js` - Main JavaScript functionality
- `admin-navigation.js` - Navigation handling
- `admin-sw.js` - Service Worker for PWA functionality
- `manifest.json` - Web App Manifest for PWA
- `offline.html` - Offline fallback page
- `icons/` - Icons for various sizes and purposes

### API Integration
The admin panel connects to the Literary Hub backend API. The base URL is configured in `admin.js` and should be updated to match your backend server.

### Adding New Features
1. Update the HTML to include new UI elements
2. Add corresponding styles in the CSS file
3. Implement functionality in the JavaScript files
4. Update the service worker if needed for offline support

## Troubleshooting

### Login Issues
- Ensure the backend server is running
- Check that your credentials are correct
- Verify the API URL in the admin.js file

### API Connection Problems
- Check that the backend server is running
- Verify the API URL in the admin.js file
- Check browser console for specific error messages

### Display Issues
- Try clearing your browser cache
- Ensure you're using a modern browser
- Check if the issue persists on different devices

## Security Notes

- The admin panel uses JWT for authentication
- Tokens are stored in localStorage (consider using more secure methods for production)
- Always access the admin panel over HTTPS in production
- Implement proper access controls on the backend

## License

[Include your license information here]

## Contact

For support or questions, contact [your contact information]. 