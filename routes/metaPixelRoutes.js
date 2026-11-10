const express = require('express');
const router = express.Router();
const metaPixelController = require('../controllers/metaPixelController');
const auth = require('../middleware/auth-middleware');

// Public route to fetch Meta Pixel ID for tracking
router.get('/', metaPixelController.getMetaPixel);

// Protected route for Admin to save/update Meta Pixel configuration
router.put('/', auth, metaPixelController.updateMetaPixel);

module.exports = router;

