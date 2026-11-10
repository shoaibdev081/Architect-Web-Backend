const mongoose = require('mongoose');

const roomSizeSchema = new mongoose.Schema({
  size: { type: String, required: true },
  label: { type: String, required: true }
}, { _id: false });

const projectSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: [true, 'Project slug is required'],
    trim: true,
    unique: true,
    lowercase: true
  },
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  location: { type: String, trim: true },
  year: { type: String, trim: true },
  architect: { type: String, trim: true },
  projectType: { type: String, trim: true },
  client: { type: String, trim: true },
  terms: { type: String, trim: true },
  date: { type: String, trim: true },
  mainImage: { type: String, trim: true },
  image: { type: String, trim: true },
  photos: [{ type: String, trim: true }],
  videos: [{ type: String, trim: true }],
  details: [{ type: String, trim: true }],
  roomSizes: [roomSizeSchema],
  resultDescription: { type: String, trim: true },
  strategy: { type: String, trim: true },
  relatedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }]
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);