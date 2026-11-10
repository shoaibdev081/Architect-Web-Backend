const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  phone: { type: String, default: 'N/A', trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  status: {
    type: String,
    enum: ['new', 'in-progress', 'resolved'],
    default: 'new'
  },
  read: { type: Boolean, default: false },
  notes: { type: String, default: '' },
  replied: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
