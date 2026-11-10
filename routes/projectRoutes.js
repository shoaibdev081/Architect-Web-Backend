const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { upload } = require('../middleware/multer_middleware');
const auth = require('../middleware/auth-middleware');
const admin = require('../middleware/admin-middleware');

// public
router.get('/', projectController.getAllProjects);
router.get('/types', projectController.getProjectTypes);
router.get('/slug/:slug', projectController.getProjectBySlug);
router.get('/:id', projectController.getProjectById);

// protected (admin)
// accepts multipart: mainImage (single) and photos (multiple)
router.post('/', auth, admin, upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'photos', maxCount: 10 },
  { name: 'videos', maxCount: 5 } // allow up to 5 videos
]), projectController.createProject);
router.put('/:id', auth, admin, upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'photos', maxCount: 10 },
  { name: 'videos', maxCount: 5 } // allow up to 5 videos
]), projectController.updateProject);
router.delete('/:id', auth, admin, projectController.deleteProject);

module.exports = router;