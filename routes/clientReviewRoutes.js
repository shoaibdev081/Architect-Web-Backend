const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/multer_middleware');
const controller = require('../controllers/clientReviewController');

router.post('/', upload.single('image'), controller.createReview);
router.get('/', controller.getAllReviews);
router.get('/:id', controller.getReviewById);
router.put('/:id', upload.single('image'), controller.updateReview);
router.delete('/:id', controller.deleteReview);

module.exports = router;
