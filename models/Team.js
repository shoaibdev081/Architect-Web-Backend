const mongoose = require('mongoose');


const teamSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Member name is required'], trim: true },
  role: { type: String, required: [true, 'Member role is required'], trim: true },
  image: { type: String, trim: true },
  bio: { type: String, default: '' },
  responsibility: { type: String, default: '' },
  address: { type: String, default: '' },
  experience: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  education: { type: String, default: '' },
  specializedDesignAreas: { type: Number, default: 0 },
  stylesAndTrends: { type: Number, default: 0 },
  designPrinciples: { type: Number, default: 0 },
  social_facebook: { type: String, default: '' },
  social_instagram: { type: String, default: '' },
  social_linkedin: { type: String, default: '' },
  // Removed social_twitter and social_website fields
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);