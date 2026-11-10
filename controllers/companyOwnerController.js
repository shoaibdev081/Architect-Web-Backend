const CompanyOwner = require('../models/CompanyOwner');
const uploadOnCloudinary = require('../config/cloudinary');
const fs = require('fs');

exports.createOrUpdateOwner = async (req, res, next) => {
  try {
    const body = req.body || {};
    if (!body.name || !body.quote) {
      return res.status(400).json({ success: false, message: 'Name and quote are required' });
    }

    let owner = await CompanyOwner.findOne();
    if (!owner) {
      owner = new CompanyOwner({
        name: body.name,
        role: body.role || '',
        quote: body.quote,
        image: body.image || '',
        logo: body.logo || ''
      });
    } else {
      owner.name = body.name;
      owner.role = body.role || owner.role;
      owner.quote = body.quote;
      if (body.image) owner.image = body.image;
      if (body.logo) owner.logo = body.logo;
    }

    // Handle image upload (main image)
    if (req.files && req.files.image && req.files.image[0]) {
      const file = req.files.image[0];
      const uploaded = await uploadOnCloudinary(file.path);
      if (uploaded && (uploaded.secure_url || uploaded.url)) {
        owner.image = uploaded.secure_url || uploaded.url;
      } else if (file.filename) {
        owner.image = `/uploads/${file.filename}`;
      }
    }

    // Handle logo upload
    if (req.files && req.files.logo && req.files.logo[0]) {
      const file = req.files.logo[0];
      const uploaded = await uploadOnCloudinary(file.path);
      if (uploaded && (uploaded.secure_url || uploaded.url)) {
        owner.logo = uploaded.secure_url || uploaded.url;
      } else if (file.filename) {
        owner.logo = `/uploads/${file.filename}`;
      }
    }

    await owner.save();
    return res.status(200).json({ success: true, message: 'Company owner info saved', data: owner });
  } catch (error) {
    if (req.files) {
      Object.values(req.files).forEach(fileArray => {
        fileArray.forEach(file => {
          if (file.path && fs.existsSync(file.path)) {
            try { fs.unlinkSync(file.path); } catch (_) {}
          }
        });
      });
    }
    next(error);
  }
};

exports.getOwner = async (req, res, next) => {
  try {
    const owner = await CompanyOwner.findOne();
    return res.status(200).json({ success: true, data: owner || null });
  } catch (error) { next(error); }
};

exports.deleteOwner = async (req, res, next) => {
  try {
    const owner = await CompanyOwner.findOne();
    if (!owner) {
      return res.status(404).json({ success: false, message: 'Company owner info not found' });
    }
    await CompanyOwner.deleteOne({});
    return res.status(200).json({ success: true, message: 'Company owner info deleted' });
  } catch (error) { next(error); }
};
