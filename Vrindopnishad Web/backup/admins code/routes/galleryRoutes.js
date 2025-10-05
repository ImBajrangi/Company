const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const authMiddleware = require('../middleware/authMiddleware');

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
};

// Get all gallery items
router.get('/', galleryController.getAllGalleryItems);

// Get a single gallery item
router.get('/:id', galleryController.getGalleryItem);

// Create a new gallery item
router.post('/', authMiddleware, galleryController.createGalleryItem);

// Update a gallery item
router.put('/:id', authMiddleware, galleryController.updateGalleryItem);

// Delete a gallery item
router.delete('/:id', authMiddleware, galleryController.deleteGalleryItem);

// Use error handling middleware
router.use(errorHandler);

module.exports = router; 