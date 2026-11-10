const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { upload } = require('../middleware/multer_middleware');
const auth = require('../middleware/auth-middleware');
const admin = require('../middleware/admin-middleware');

// Public routes
router.get('/', blogController.getAllBlogs);
router.get('/categories', blogController.getBlogCategories);
router.get('/slug/:slug', blogController.getBlogBySlug);
router.get('/:id', blogController.getBlogById);

// Protected Admin routes (supports coverImage upload)
router.post(
  '/',
  auth,
  admin,
  upload.single('coverImage'),
  blogController.createBlog
);

router.put(
  '/:id',
  auth,
  admin,
  upload.single('coverImage'),
  blogController.updateBlog
);

router.delete(
  '/:id',
  auth,
  admin,
  blogController.deleteBlog
);

module.exports = router;
