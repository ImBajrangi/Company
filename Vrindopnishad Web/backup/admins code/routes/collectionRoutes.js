const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collectionController');

// Add Collection Item
router.post('/', collectionController.addCollectionItem);

// View Collection
router.get('/', collectionController.getCollection);

module.exports = router;