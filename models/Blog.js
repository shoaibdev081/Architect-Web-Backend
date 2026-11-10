const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
      maxlength: [300, 'Title cannot exceed 300 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      trim: true,
      unique: true,
      lowercase: true,
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: [600, 'Excerpt cannot exceed 600 characters'],
      default: '',
    },
    content: {
      type: String,
      required: [true, 'Blog content is required'],
    },
    author: {
      type: String,
      default: 'Monda Brothers',
      trim: true,
    },
    category: {
      type: String,
      default: 'Architecture',
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    coverImage: {
      type: String,
      trim: true,
      default: '',
    },
    videoUrl: {
      type: String,
      trim: true,
      default: '',
    },
    videoType: {
      type: String,
      enum: ['youtube', 'facebook', 'direct', 'other', 'none'],
      default: 'none',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'published',
    },
    views: {
      type: Number,
      default: 0,
    },
    readTime: {
      type: String,
      default: '4 min read',
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Blog', blogSchema);
