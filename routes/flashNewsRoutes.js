const express = require('express');
const router = express.Router();
const flashNewsController = require('../controllers/flashNewsController');
const auth = require('../middleware/auth-middleware');
const { upload } = require('../middleware/multer_middleware');

// Public routes
router.get('/', flashNewsController.getAllNews);
router.get('/admin/all', auth, flashNewsController.getAdminAllNews);
router.get('/:idOrSlug', flashNewsController.getNewsByIdOrSlug);

// Admin protected routes
router.post('/', auth, upload.single('image'), flashNewsController.createNews);
router.put('/:id', auth, upload.single('image'), flashNewsController.updateNews);
router.delete('/:id', auth, flashNewsController.deleteNews);

module.exports = router;

