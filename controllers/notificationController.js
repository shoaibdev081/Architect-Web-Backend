const Notification = require('../models/Notification');

// Get all notifications (optionally filter by unread)
exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json({ success: true, notifications });
  } catch (error) {
    next(error);
  }
};

// Mark a notification as read or toggle
exports.markNotificationRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
    notification.read = req.body.read !== undefined ? req.body.read : true;
    await notification.save();
    res.json({ success: true, notification });
  } catch (error) {
    next(error);
  }
};

// Delete notification / contact inquiry
exports.deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Notification.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Notification not found' });
    res.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (error) {
    next(error);
  }
};
