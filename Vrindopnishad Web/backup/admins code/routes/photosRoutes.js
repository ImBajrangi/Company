const express = require('express');
const router = express.Router();
const photosController = require('../controllers/photosController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Upload Photo
router.post('/', upload.single('photo'), photosController.uploadPhoto);

// View Photos
router.get('/', photosController.getPhotos);

module.exports = router;