const express = require('express');
const router = express.Router();
const mainAreaController = require('../controllers/mainAreaController');
const { upload } = require('../middleware/multer_middleware');
const auth = require('../middleware/auth-middleware');
const admin = require('../middleware/admin-middleware');

// Public routes
router.get('/', mainAreaController.getAllAreas);
router.get('/:id', mainAreaController.getAreaById);

// Protected Admin routes
router.post(
  '/',
  auth,
  admin,
  upload.single('image'),
  mainAreaController.createArea
);

router.put(
  '/:id',
  auth,
  admin,
  upload.single('image'),
  mainAreaController.updateArea
);

router.patch(
  '/:id/toggle',
  auth,
  admin,
  mainAreaController.toggleAreaStatus
);

router.delete(
  '/:id',
  auth,
  admin,
  mainAreaController.deleteArea
);

module.exports = router;
