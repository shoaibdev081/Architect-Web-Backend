const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { upload } = require('../middleware/multer_middleware');
const auth = require('../middleware/auth-middleware');
const admin = require('../middleware/admin-middleware');

// Public routes
router.get('/', serviceController.getAllServices);
router.get('/slug/:slug', serviceController.getServiceBySlug);
router.get('/:id', serviceController.getServiceBySlug);

// Protected admin routes
router.post('/', auth, admin, upload.single('image'), serviceController.createService);
router.put('/:id', auth, admin, upload.single('image'), serviceController.updateService);
router.delete('/:id', auth, admin, serviceController.deleteService);

module.exports = router;
