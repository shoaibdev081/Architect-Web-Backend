const mongoose = require('mongoose');

const featureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true }
}, { _id: false });

const faqSchema = new mongoose.Schema({
  q: { type: String, required: true },
  a: { type: String, required: true }
}, { _id: false });

const serviceSchema = new mongoose.Schema({
  slug: { type: String, required: true, trim: true, unique: true, lowercase: true },
  title: { type: String, required: true, trim: true },
  image: { type: String, trim: true },
  desc: { type: String, trim: true },
  desc2: { type: String, trim: true },
  features: [featureSchema],
  points: [{ type: String }],
  faqs: [faqSchema]
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);