const mongoose = require('mongoose');

const footerSchema = new mongoose.Schema({
  companyName: { 
    type: String, 
    default: 'Monda brothers' 
  },
  tagline: { 
    type: String, 
    default: 'We Transform Your Vision Into Beautifully Crafted Spaces.' 
  },
  address: { 
    type: String, 
    default: 'DHA Multan, Punjab, Pakistan' 
  },
  phone: { 
    type: String, 
    default: '+923016624449' 
  },
  phoneDisplay: { 
    type: String, 
    default: '+92 301 6624449' 
  },
  whatsapp: { 
    type: String, 
    default: '+923150111999' 
  },
  whatsappDisplay: { 
    type: String, 
    default: '+92 315 0111999' 
  },
  email: { 
    type: String, 
    default: 'monda_brothers@outlook.com' 
  },
  facebookUrl: { 
    type: String, 
    default: 'https://www.facebook.com/monda.brother/' 
  },
  instagramUrl: { 
    type: String, 
    default: 'https://www.instagram.com/monda_brothers/' 
  },
  youtubeUrl: { 
    type: String, 
    default: 'https://www.youtube.com/@MondaBrothersBuilder' 
  },
  linkedinUrl: { 
    type: String, 
    default: 'https://www.linkedin.com/company/monda-brothers/' 
  },
  copyrightText: { 
    type: String, 
    default: '© Copyright 2026 Monda brothers. All rights reserved.' 
  },
  quickLinks: {
    type: [
      {
        label: { type: String, required: true },
        href: { type: String, required: true }
      }
    ],
    default: [
      { label: 'About Us', href: '/about' },
      { label: 'Services', href: '/services' },
      { label: 'Our Team', href: '/team' },
      { label: 'Projects', href: '/projects' },
      { label: 'Main Areas', href: '/main-areas' },
      { label: 'Blogs & Insights', href: '/blogs' },
      { label: 'Contact Us', href: '/contact' }
    ]
  },
  metaPixelId: {
    type: String,
    default: ''
  },
  metaPixelEnabled: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Footer', footerSchema);
