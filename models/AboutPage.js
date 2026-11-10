const mongoose = require('mongoose');

const timelineItemSchema = new mongoose.Schema({
  year: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
}, { timestamps: true });

const awardItemSchema = new mongoose.Schema({
  year: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String, default: '' },
  image: { type: String, default: '' },
}, { timestamps: true });

const aboutPageSchema = new mongoose.Schema({
  hero: {
    badge: { type: String, default: 'STARTED IN 1989' },
    heading: { type: String, default: 'We Shape Interior Designs, Crafting Timeless And Inspiring Spaces' },
    experienceYears: { type: String, default: '26' },
    experienceTitle: { type: String, default: 'Years Of' },
    experienceSubtitle: { type: String, default: 'Experience' },
    featureImage: { type: String, default: '/images/gallery-11.jpg' },
    heroImage: { type: String, default: '/images/hero-bg-3.webp' },
    description: {
      type: String,
      default: 'We believe that every space has the power to inspire, and that great design brings that inspiration to life. Our mission is to craft environments that stir creativity, evoke emotion, and reflect the essence of those who inhabit them.'
    },
    buttonText: { type: String, default: 'Learn More' },
    buttonLink: { type: String, default: '/team' }
  },
  video: {
    videoUrl: { type: String, default: '/videos/Sample.mp4' },
    title: { type: String, default: 'Design In Motion' }
  },
  timeline: [timelineItemSchema],
  awards: {
    badge: { type: String, default: 'AWARD & ACHIEVEMENT' },
    title: { type: String, default: 'Design that speaks our industry awards' },
    description: {
      type: String,
      default: 'Our commitment to excellence has been recognized with numerous prestigious awards and accolades from around the industry.'
    },
    items: [awardItemSchema]
  }
}, { timestamps: true });

module.exports = mongoose.model('AboutPage', aboutPageSchema);
