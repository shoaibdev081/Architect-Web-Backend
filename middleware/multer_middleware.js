const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + unique + path.extname(file.originalname));
  }
});


const fileFilter = (req, file, cb) => {
  // Allow images and videos
  const imageTypes = /jpeg|jpg|png|gif|webp/;
  const videoTypes = /mp4|mov|avi|mkv|webm/;
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  const mime = file.mimetype;
  if (imageTypes.test(ext) && imageTypes.test(mime)) return cb(null, true);
  if (videoTypes.test(ext) && mime.startsWith('video/')) return cb(null, true);
  cb(new Error('Only image and video files are allowed'));
};

// Custom file size limit: 5MB for images, 100MB for videos
const upload = multer({
  storage,
  limits: {
    fileSize: (req, file, cb) => {
      const imageTypes = /jpeg|jpg|png|gif|webp/;
      const videoTypes = /mp4|mov|avi|mkv|webm/;
      const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
      if (imageTypes.test(ext)) return cb(null, 5 * 1024 * 1024); // 5MB
      if (videoTypes.test(ext)) return cb(null, 100 * 1024 * 1024); // 100MB
      // Default fallback
      return cb(null, 5 * 1024 * 1024);
    }
  },
  fileFilter
});

// For gallery: mainImage (single), otherImages (array, flexible count)
const galleryUpload = upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'otherImages', maxCount: 20 }, // allow up to 20 images, adjust as needed
]);

module.exports = { upload, galleryUpload };
