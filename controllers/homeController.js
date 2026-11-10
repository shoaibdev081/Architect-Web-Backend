const HomePage = require('../models/HomePage');
const uploadOnCloudinary = require('../config/cloudinary');

// Get home content (creates default document if none exists yet)
exports.getHomeContent = async (req, res, next) => {
  try {
    let home = await HomePage.findOne();
    if (!home) {
      home = await HomePage.create({});
    }
    return res.status(200).json({ success: true, data: home });
  } catch (err) {
    next(err);
  }
};

// Update home content (authenticated admin)
exports.updateHomeContent = async (req, res, next) => {
  try {
    const updateData = req.body || {};
    let home = await HomePage.findOne();
    if (!home) {
      home = new HomePage(updateData);
    } else {
      // Deep merge or update sections
      if (updateData.hero) home.hero = updateData.hero;
      if (updateData.intro) home.intro = updateData.intro;
      if (updateData.history) home.history = updateData.history;
      if (updateData.videoShowcase) home.videoShowcase = updateData.videoShowcase;
      if (updateData.panorama) home.panorama = updateData.panorama;
      if (updateData.stats) home.stats = updateData.stats;
      if (updateData.servicesOverview) home.servicesOverview = updateData.servicesOverview;
    }

    await home.save();
    return res.status(200).json({ success: true, message: 'Home content updated successfully', data: home });
  } catch (err) {
    next(err);
  }
};

// Single image upload for any home section
exports.uploadHomeImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    const localPath = req.file.path;
    let imageUrl = '';

    // Attempt upload to Cloudinary
    try {
      const uploadRes = await uploadOnCloudinary(localPath);
      if (uploadRes && (uploadRes.secure_url || uploadRes.url)) {
        imageUrl = uploadRes.secure_url || uploadRes.url;
      }
    } catch (e) {
      // Cloudinary error
    }

    // Fallback to local server URL if Cloudinary was not used or failed
    if (!imageUrl) {
      const filename = req.file.filename;
      imageUrl = `/uploads/${filename}`;
    }

    return res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      url: imageUrl
    });
  } catch (err) {
    next(err);
  }
};
