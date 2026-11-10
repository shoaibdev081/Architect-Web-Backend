const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const auth = require('../middleware/auth-middleware');
const admin = require('../middleware/admin-middleware');

// All analytics endpoints require admin authentication
router.get('/overview', auth, admin, analyticsController.getOverviewStats);
router.get('/monthly-growth', auth, admin, analyticsController.getMonthlyGrowth);
router.get('/project-categories', auth, admin, analyticsController.getProjectCategories);
router.get('/weekly-activity', auth, admin, analyticsController.getWeeklyActivity);
router.get('/trends', auth, admin, analyticsController.getTrends);

module.exports = router;
