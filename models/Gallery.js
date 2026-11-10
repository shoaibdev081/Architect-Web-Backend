const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ['Bathroom', 'Living Room', 'Bedroom', 'Kitchen'], required: true },
  mainImage: { type: String, required: true },
  otherImages: {
    type: [String],
    required: true
  },
}, { timestamps: true });

module.exports = mongoose.model('Gallery', GallerySchema);
