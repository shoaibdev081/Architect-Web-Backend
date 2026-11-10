const mongoose = require('mongoose');

const mainAreaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Area name is required'],
      trim: true,
      maxlength: [200, 'Area name cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        'Residential Society',
        'Commercial Hub',
        'High-Rise Buildings',
        'Road & Avenue',
        'Other',
      ],
      default: 'Residential Society',
      trim: true,
    },
    tagline: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    badge: {
      type: String,
      trim: true,
      default: '',
    },
    city: {
      type: String,
      default: 'Multan',
      trim: true,
    },
    image: {
      type: String,
      trim: true,
      default: '',
    },
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MainArea', mainAreaSchema);
