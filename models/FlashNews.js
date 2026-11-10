const mongoose = require('mongoose');

const flashNewsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'News title is required'],
      trim: true,
      maxlength: [250, 'Title cannot exceed 250 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      trim: true,
      unique: true,
      lowercase: true,
    },
    category: {
      type: String,
      default: 'Project Update',
      trim: true,
      enum: [
        'Project Update',
        'Breaking News',
        'New Launch',
        'Milestone',
        'Award & Recognition',
        'Event',
        'Announcement',
      ],
    },
    badge: {
      type: String,
      default: 'FLASH NEWS',
      trim: true,
    },
    summary: {
      type: String,
      required: [true, 'Short summary is required'],
      trim: true,
      maxlength: [500, 'Summary cannot exceed 500 characters'],
    },
    content: {
      type: String,
      required: [true, 'Full content is required'],
    },
    image: {
      type: String,
      default: '',
      trim: true,
    },
    isFlash: {
      type: Boolean,
      default: true,
    },
    priority: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['published', 'draft', 'archived'],
      default: 'published',
    },
    relatedProject: {
      type: String,
      default: '',
      trim: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FlashNews', flashNewsSchema);

