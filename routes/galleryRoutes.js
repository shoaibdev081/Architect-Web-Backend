const express = require('express');
const router = express.Router();
const { galleryUpload } = require('../middleware/multer_middleware');
const controller = require('../controllers/galleryController');

router.post('/', galleryUpload, controller.createGalleryItem);
router.get('/', controller.getAllGalleryItems);
router.get('/:id', controller.getGalleryItemById);
router.put('/:id', galleryUpload, controller.updateGalleryItem);
router.delete('/:id', controller.deleteGalleryItem);

module.exports = router;
