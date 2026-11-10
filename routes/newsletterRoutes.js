const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const newsletterController = require('../controllers/newsletterController');

// Validation middleware
const validateEmail = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
];

// Public routes
router.post('/subscribe', validateEmail, newsletterController.subscribe);

// Admin routes (protected)
router.get('/subscribers', newsletterController.getSubscribers);
router.get('/stats', newsletterController.getStats);
// Specific routes MUST come before param routes
router.delete('/subscribers/bulk-delete', newsletterController.bulkDeleteSubscribers);
router.delete('/subscribers/:id', newsletterController.deleteSubscriber);

module.exports = router;
