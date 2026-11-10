const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., 'contact'
  message: { type: String, required: true },
  data: { type: Object }, // extra info (e.g., contact details)
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notification', notificationSchema);