const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

// Update Banner
router.put('/banner', homeController.updateBanner);

// Add/Update Menu Item
router.post('/menu', homeController.addMenuItem);

// View Menu
router.get('/menu', homeController.getMenu);

module.exports = router;