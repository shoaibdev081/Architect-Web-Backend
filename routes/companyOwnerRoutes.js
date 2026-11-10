const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const controller = require('../controllers/companyOwnerController');

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
  const allowed = /jpeg|jpg|png|gif|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) return cb(null, true);
  cb(new Error('Only image files are allowed'));
};

const uploadMulti = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter });

router.post('/', uploadMulti.fields([{ name: 'image', maxCount: 1 }, { name: 'logo', maxCount: 1 }]), controller.createOrUpdateOwner);
router.get('/', controller.getOwner);
router.delete('/', controller.deleteOwner);

module.exports = router;
