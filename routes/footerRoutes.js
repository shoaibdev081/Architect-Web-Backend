const express = require('express');
const router = express.Router();
const footerController = require('../controllers/footerController');
const auth = require('../middleware/auth-middleware');

// Public route to get footer data for the website
router.get('/', footerController.getFooter);

// Protected routes for admin management
router.put('/', auth, footerController.updateFooter);
router.delete('/', auth, footerController.resetFooter);

module.exports = router;
