const cloudinary = require('cloudinary').v2;
const fs = require('fs');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath, options = {}) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: options.resource_type || 'auto'
    });
    // Remove local file ONLY after successful upload to cloud
    if (fs.existsSync(localFilePath)) {
      try {
        fs.unlinkSync(localFilePath);
      } catch (_) {}
    }
    return response;
  } catch (error) {
    // If Cloudinary fails or is offline, keep the local file on disk
    // so the controllers can cleanly use /uploads/... as fallback
    console.warn('Cloudinary upload warning:', error.message || error);
    return null;
  }
};

module.exports = uploadOnCloudinary;
