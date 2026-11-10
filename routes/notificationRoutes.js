const express = require('express');
const router = express.Router();
const { getNotifications, markNotificationRead, deleteNotification } = require('../controllers/notificationController');

// Get all notifications
router.get('/', getNotifications);

// Mark notification as read
router.patch('/:id/read', markNotificationRead);

// Delete notification
router.delete('/:id', deleteNotification);

module.exports = router;
