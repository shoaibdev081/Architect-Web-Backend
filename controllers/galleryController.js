const Gallery = require('../models/Gallery');
const uploadOnCloudinary = require('../config/cloudinary');
const fs = require('fs');

const initialGalleryItems = [
  {
    title: 'Modern Minimalist Living Room',
    category: 'Living Room',
    mainImage: '/images/gallery-1.jpg',
    otherImages: [
      '/images/gallery-3.jpg',
      '/images/gallery-4.jpg',
      '/images/gallery-11.jpg'
    ]
  },
  {
    title: 'Luxury Executive Kitchen Suite',
    category: 'Kitchen',
    mainImage: '/images/gallery-6.jpg',
    otherImages: [
      '/images/gallery-7.jpg',
      '/images/gallery-9.jpg',
      '/images/gallery-3.jpg'
    ]
  },
  {
    title: 'Contemporary Master Bedroom Sanctuary',
    category: 'Bedroom',
    mainImage: '/images/gallery-11.jpg',
    otherImages: [
      '/images/gallery-12.jpg',
      '/images/gallery-7.jpg',
      '/images/gallery-1.jpg'
    ]
  },
  {
    title: 'Spa-Inspired Marble Bathroom Suite',
    category: 'Bathroom',
    mainImage: '/images/gallery-9.jpg',
    otherImages: [
      '/images/gallery-4.jpg',
      '/images/gallery-6.jpg',
      '/images/gallery-12.jpg'
    ]
  }
];

exports.createGalleryItem = async (req, res, next) => {
  try {
    const body = req.body || {};
    if (!body.title || !body.category) {
      return res.status(400).json({ success: false, message: 'Title and category are required' });
    }
    if (!req.files || !req.files.mainImage || !req.files.otherImages || req.files.otherImages.length < 1) {
      return res.status(400).json({ success: false, message: 'Main image and at least 1 other image are required' });
    }

    // Upload main image (Cloudinary or local fallback)
    const mainImageFile = req.files.mainImage[0];
    let mainImageUrl = '';
    try {
      const mainImageUpload = await uploadOnCloudinary(mainImageFile.path);
      if (mainImageUpload && (mainImageUpload.secure_url || mainImageUpload.url)) {
        mainImageUrl = mainImageUpload.secure_url || mainImageUpload.url;
      }
    } catch (_) {}

    if (!mainImageUrl && mainImageFile.filename) {
      mainImageUrl = `/uploads/${mainImageFile.filename}`;
    }

    if (!mainImageUrl) {
      return res.status(500).json({ success: false, message: 'Failed to upload main image' });
    }

    // Upload all other images (Cloudinary or local fallback)
    const otherImages = [];
    for (const file of req.files.otherImages) {
      let otherUrl = '';
      try {
        const uploadRes = await uploadOnCloudinary(file.path);
        if (uploadRes && (uploadRes.secure_url || uploadRes.url)) {
          otherUrl = uploadRes.secure_url || uploadRes.url;
        }
      } catch (_) {}

      if (!otherUrl && file.filename) {
        otherUrl = `/uploads/${file.filename}`;
      }

      if (otherUrl) {
        otherImages.push(otherUrl);
      }
    }

    if (otherImages.length === 0) {
      return res.status(500).json({ success: false, message: 'Failed to upload gallery images' });
    }

    const gallery = new Gallery({
      title: body.title,
      category: body.category,
      mainImage: mainImageUrl,
      otherImages,
    });

    await gallery.save();
    return res.status(201).json({ success: true, message: 'Gallery item created', data: gallery });
  } catch (error) {
    next(error);
  }
};

exports.getAllGalleryItems = async (req, res, next) => {
  try {
    const category = req.query.category;
    const query = category ? { category } : {};

    let count = await Gallery.countDocuments();
    if (count === 0) {
      await Gallery.insertMany(initialGalleryItems);
    }

    const items = await Gallery.find(query).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) { next(error); }
};

exports.getGalleryItemById = async (req, res, next) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Gallery item not found' });
    return res.status(200).json({ success: true, data: item });
  } catch (error) { next(error); }
};

exports.updateGalleryItem = async (req, res, next) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Gallery item not found' });

    const body = req.body || {};
    if (body.title) item.title = body.title;
    if (body.category) item.category = body.category;

    // If new main image is uploaded
    if (req.files && req.files.mainImage && req.files.mainImage[0]) {
      const f = req.files.mainImage[0];
      let newMain = '';
      try {
        const mainImageUpload = await uploadOnCloudinary(f.path);
        if (mainImageUpload && (mainImageUpload.secure_url || mainImageUpload.url)) {
          newMain = mainImageUpload.secure_url || mainImageUpload.url;
        }
      } catch (_) {}
      if (!newMain && f.filename) newMain = `/uploads/${f.filename}`;
      if (newMain) item.mainImage = newMain;
    }

    // If new other images are uploaded
    if (req.files && req.files.otherImages && req.files.otherImages.length > 0) {
      const otherImages = [];
      for (const file of req.files.otherImages) {
        let otherUrl = '';
        try {
          const uploadRes = await uploadOnCloudinary(file.path);
          if (uploadRes && (uploadRes.secure_url || uploadRes.url)) {
            otherUrl = uploadRes.secure_url || uploadRes.url;
          }
        } catch (_) {}
        if (!otherUrl && file.filename) otherUrl = `/uploads/${file.filename}`;
        if (otherUrl) otherImages.push(otherUrl);
      }
      if (otherImages.length > 0) item.otherImages = otherImages;
    }

    await item.save();
    return res.status(200).json({ success: true, message: 'Gallery item updated', data: item });
  } catch (error) { next(error); }
};

exports.deleteGalleryItem = async (req, res, next) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Gallery item not found' });
    await Gallery.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: 'Gallery item deleted' });
  } catch (error) { next(error); }
};
