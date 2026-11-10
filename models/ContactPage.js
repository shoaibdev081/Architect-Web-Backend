const mongoose = require('mongoose');

const contactPageSchema = new mongoose.Schema({
  badge: { type: String, default: 'GET IN TOUCH' },
  heading: { type: String, default: "Have a Project in Mind? Let's Make It Happen" },
  subheading: {
    type: String,
    default: "We're excited to hear about your vision. Contact us today and let's discuss how we can transform your space into something extraordinary."
  },
  address: { type: String, default: 'DHA Multan, Punjab, Pakistan' },
  phone: { type: String, default: '+92 301 6624449' },
  secondaryPhone: { type: String, default: '+92 300 1234567' },
  email: { type: String, default: 'monda_brothers@outlook.com' },
  supportEmail: { type: String, default: 'info@mondabrothers.com' },
  workingHours: { type: String, default: 'Monday – Saturday: 9:00 AM – 7:00 PM' },
  image: { type: String, default: '/images/service-detail.jpg' },
  mapUrl: {
    type: String,
    default: 'https://www.google.com/maps?q=Momda%20Brothers%20DHA%20Multan%20Punjab%20Pakistan&output=embed'
  },
  formButtonText: { type: String, default: 'Request Quote' }
}, { timestamps: true });

module.exports = mongoose.model('ContactPage', contactPageSchema);
