const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const auth = require('../middleware/auth-middleware');
const { upload } = require('../middleware/multer_middleware');

// Public routes for website
router.get('/info', contactController.getContactPageInfo);
router.post('/', contactController.sendContact);

// Admin routes for contact settings
router.put('/info', auth, contactController.updateContactPageInfo);
router.post('/upload-image', auth, upload.single('image'), contactController.uploadContactImage);

// Admin routes for inquiries (Form Data)
router.get('/messages', auth, contactController.getAllMessages);
router.patch('/messages/:id/read', auth, contactController.toggleMessageRead);
router.patch('/messages/:id/status', auth, contactController.updateMessageStatus);
router.delete('/messages/:id', auth, contactController.deleteMessage);

module.exports = router;