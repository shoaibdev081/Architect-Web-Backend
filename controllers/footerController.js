const Footer = require('../models/Footer');

const DEFAULT_FOOTER_VALUES = {
  companyName: 'Monda brothers',
  tagline: 'We Transform Your Vision Into Beautifully Crafted Spaces.',
  address: 'DHA Multan, Punjab, Pakistan',
  phone: '+923016624449',
  phoneDisplay: '+92 301 6624449',
  whatsapp: '+923150111999',
  whatsappDisplay: '+92 315 0111999',
  email: 'monda_brothers@outlook.com',
  facebookUrl: 'https://www.facebook.com/monda.brother/',
  instagramUrl: 'https://www.instagram.com/monda_brothers/',
  youtubeUrl: 'https://www.youtube.com/@MondaBrothersBuilder',
  linkedinUrl: 'https://www.linkedin.com/company/monda-brothers/',
  copyrightText: '© Copyright 2026 Monda brothers. All rights reserved.',
  quickLinks: [
    { label: 'About Us', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Our Team', href: '/team' },
    { label: 'Projects', href: '/projects' },
    { label: 'Main Areas', href: '/main-areas' },
    { label: 'Blogs & Insights', href: '/blogs' },
    { label: 'Contact Us', href: '/contact' }
  ],
  metaPixelId: '',
  metaPixelEnabled: true
};

// GET /api/footer (Public)
exports.getFooter = async (req, res, next) => {
  try {
    let footer = await Footer.findOne();
    if (!footer) {
      footer = await Footer.create(DEFAULT_FOOTER_VALUES);
    }
    return res.status(200).json({
      success: true,
      data: footer
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/footer (Admin protected)
exports.updateFooter = async (req, res, next) => {
  try {
    const updateData = req.body || {};
    let footer = await Footer.findOne();

    if (!footer) {
      footer = new Footer({ ...DEFAULT_FOOTER_VALUES, ...updateData });
    } else {
      if (updateData.companyName !== undefined) footer.companyName = updateData.companyName;
      if (updateData.tagline !== undefined) footer.tagline = updateData.tagline;
      if (updateData.address !== undefined) footer.address = updateData.address;
      if (updateData.phone !== undefined) footer.phone = updateData.phone;
      if (updateData.phoneDisplay !== undefined) footer.phoneDisplay = updateData.phoneDisplay;
      if (updateData.whatsapp !== undefined) footer.whatsapp = updateData.whatsapp;
      if (updateData.whatsappDisplay !== undefined) footer.whatsappDisplay = updateData.whatsappDisplay;
      if (updateData.email !== undefined) footer.email = updateData.email;
      if (updateData.facebookUrl !== undefined) footer.facebookUrl = updateData.facebookUrl;
      if (updateData.instagramUrl !== undefined) footer.instagramUrl = updateData.instagramUrl;
      if (updateData.youtubeUrl !== undefined) footer.youtubeUrl = updateData.youtubeUrl;
      if (updateData.linkedinUrl !== undefined) footer.linkedinUrl = updateData.linkedinUrl;
      if (updateData.copyrightText !== undefined) footer.copyrightText = updateData.copyrightText;
      if (Array.isArray(updateData.quickLinks)) footer.quickLinks = updateData.quickLinks;
      if (updateData.metaPixelId !== undefined) footer.metaPixelId = updateData.metaPixelId.trim();
      if (updateData.metaPixelEnabled !== undefined) footer.metaPixelEnabled = Boolean(updateData.metaPixelEnabled);
    }

    await footer.save();
    return res.status(200).json({
      success: true,
      message: 'Footer updated successfully',
      data: footer
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/footer (Admin protected - resets or clears footer to defaults)
exports.resetFooter = async (req, res, next) => {
  try {
    await Footer.deleteMany({});
    const defaultFooter = await Footer.create(DEFAULT_FOOTER_VALUES);
    return res.status(200).json({
      success: true,
      message: 'Footer settings reset to default successfully',
      data: defaultFooter
    });
  } catch (error) {
    next(error);
  }
};
