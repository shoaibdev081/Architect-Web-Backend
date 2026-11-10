const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const auth = require('../middleware/auth-middleware');
const { upload } = require('../middleware/multer_middleware');

// Public route to get home content for website
router.get('/', homeController.getHomeContent);

// Admin route to update home content
router.put('/', auth, homeController.updateHomeContent);

// Admin route to upload image
router.post('/upload-image', auth, upload.single('image'), homeController.uploadHomeImage);

module.exports = router;
