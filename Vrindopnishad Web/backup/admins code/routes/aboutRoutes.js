const express = require('express');
const router = express.Router();
const aboutController = require('../controllers/aboutController');

// Update About Content
router.put('/', aboutController.updateAbout);

module.exports = router; 