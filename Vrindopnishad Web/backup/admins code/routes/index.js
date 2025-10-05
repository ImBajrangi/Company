const express = require('express');
const router = express.Router();

// Import route files
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const bookRoutes = require('./book.routes');
const collectionRoutes = require('./collection.routes');
const pdfRoutes = require('./pdf.routes');
const settingsRoutes = require('./settings.routes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/books', bookRoutes);
router.use('/collections', collectionRoutes);
router.use('/pdfs', pdfRoutes);
router.use('/settings', settingsRoutes);

module.exports = router; 