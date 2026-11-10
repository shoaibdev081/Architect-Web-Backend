const express = require('express');
const router = express.Router();
const aboutController = require('../controllers/aboutController');
const auth = require('../middleware/auth-middleware');
const { upload } = require('../middleware/multer_middleware');

// Public route to get about page content for website
router.get('/', aboutController.getAboutContent);

// Admin route to update entire about page
router.put('/', auth, aboutController.updateAboutContent);

// Admin routes for timeline milestones CRUD
router.post('/timeline', auth, aboutController.addTimelineItem);
router.put('/timeline/:itemId', auth, aboutController.updateTimelineItem);
router.delete('/timeline/:itemId', auth, aboutController.deleteTimelineItem);

// Admin routes for awards CRUD
router.post('/awards', auth, aboutController.addAwardItem);
router.put('/awards/:itemId', auth, aboutController.updateAwardItem);
router.delete('/awards/:itemId', auth, aboutController.deleteAwardItem);

// Admin route to upload image from laptop
router.post('/upload-image', auth, upload.single('image'), aboutController.uploadAboutImage);

module.exports = router;
