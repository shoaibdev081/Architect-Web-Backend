const nodemailer = require('nodemailer');
const ContactPage = require('../models/ContactPage');
const ContactMessage = require('../models/ContactMessage');
const Notification = require('../models/Notification');
const uploadOnCloudinary = require('../config/cloudinary');

// GET /api/contact/info - Retrieve contact page information
exports.getContactPageInfo = async (req, res, next) => {
  try {
    let info = await ContactPage.findOne();
    if (!info) {
      info = new ContactPage();
      await info.save();
    }
    return res.status(200).json({ success: true, data: info });
  } catch (err) {
    next(err);
  }
};

// PUT /api/contact/info - Update contact page settings (Admin)
exports.updateContactPageInfo = async (req, res, next) => {
  try {
    const body = req.body || {};
    let info = await ContactPage.findOne();
    if (!info) {
      info = new ContactPage();
    }

    const fields = [
      'badge',
      'heading',
      'subheading',
      'address',
      'phone',
      'secondaryPhone',
      'email',
      'supportEmail',
      'workingHours',
      'image',
      'mapUrl',
      'formButtonText'
    ];

    fields.forEach((field) => {
      if (body[field] !== undefined) {
        info[field] = body[field];
      }
    });

    await info.save();
    return res.status(200).json({
      success: true,
      message: 'Contact page settings updated successfully',
      data: info
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/contact/upload-image - Upload contact showcase image from laptop
exports.uploadContactImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }

    let imageUrl = '';
    try {
      const resp = await uploadOnCloudinary(req.file.path);
      if (resp && resp.url) {
        imageUrl = resp.url;
      }
    } catch (_) {}

    if (!imageUrl) {
      imageUrl = `/uploads/${req.file.filename}`;
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

// POST /api/contact - Submit new contact inquiry from website
exports.sendContact = async (req, res, next) => {
  try {
    const { fullName, phone, email, subject, message } = req.body || {};
    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Full Name, Email, Subject, and Message are required.'
      });
    }

    // 1. Save in dedicated ContactMessage collection so inquiry is permanently stored
    const newMessage = await ContactMessage.create({
      fullName: fullName.trim(),
      phone: (phone || 'N/A').trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      status: 'new',
      read: false
    });

    // 2. Also create notification for notification badge/bell
    try {
      await Notification.create({
        type: 'contact',
        message: `New inquiry from ${fullName}: ${subject}`,
        data: {
          fullName,
          phone: phone || 'N/A',
          email,
          subject,
          message,
          messageId: newMessage._id,
          receivedAt: new Date().toISOString()
        }
      });
    } catch (dbErr) {
      console.error('Error creating notification:', dbErr.message);
    }

    // 3. Optional SMTP email notification
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        const mailOptions = {
          from: `"Monda Brothers Website" <${process.env.EMAIL_USER}>`,
          to: process.env.EMAIL_USER,
          replyTo: email,
          subject: `[Client Inquiry] ${subject} - ${fullName}`,
          text: `You have received a new contact inquiry from the website:\n\n` +
                `Name: ${fullName}\n` +
                `Email: ${email}\n` +
                `Phone: ${phone || 'N/A'}\n` +
                `Subject: ${subject}\n\n` +
                `Message:\n${message}\n\n` +
                `Inquiry ID: ${newMessage._id}`
        };

        await transporter.sendMail(mailOptions);
      }
    } catch (mailErr) {
      console.warn('Mail sending failed or SMTP not configured:', mailErr.message);
    }

    return res.status(200).json({
      success: true,
      message: 'Your inquiry has been received successfully! Our team will contact you shortly.',
      data: newMessage
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/contact/messages - Admin: Get all inquiries
exports.getAllMessages = async (req, res, next) => {
  try {
    const { status, read, q } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    }
    if (read !== undefined && read !== 'all') {
      filter.read = read === 'true';
    }
    if (q) {
      filter.$or = [
        { fullName: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } },
        { subject: { $regex: q, $options: 'i' } },
        { message: { $regex: q, $options: 'i' } }
      ];
    }

    const messages = await ContactMessage.find(filter).sort({ createdAt: -1 });

    // Seed realistic sample inquiries if database is completely empty
    if (messages.length === 0 && !status && !q) {
      const sampleMessages = [
        {
          fullName: 'Malik Tariq',
          phone: '+92 321 8899112',
          email: 'tariq.malik@gmail.com',
          subject: 'Residential Villa Interior Architecture',
          message: 'Hello Monda Brothers team, I am planning a modern 2 Kanal villa in DHA Multan Phase 2 and would love to schedule a consultation regarding full interior design and space planning.',
          status: 'new',
          read: false
        },
        {
          fullName: 'Ayesha Khan',
          phone: '+92 300 4455667',
          email: 'ayesha.k@horizoncorp.pk',
          subject: 'Corporate Executive Office Renovation',
          message: 'We require turnkey architectural design for our 6,000 sq ft office in Gulberg. Kindly share your availability for a preliminary site inspection.',
          status: 'in-progress',
          read: true
        }
      ];
      const inserted = await ContactMessage.insertMany(sampleMessages);
      return res.status(200).json({ success: true, count: inserted.length, data: inserted });
    }

    return res.status(200).json({ success: true, count: messages.length, data: messages });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/contact/messages/:id/read - Admin: Toggle read state
exports.toggleMessageRead = async (req, res, next) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    message.read = req.body.read !== undefined ? req.body.read : !message.read;
    await message.save();

    return res.status(200).json({ success: true, data: message });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/contact/messages/:id/status - Admin: Update status ('new' | 'in-progress' | 'resolved')
exports.updateMessageStatus = async (req, res, next) => {
  try {
    const { status, notes, replied } = req.body;
    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    if (status) message.status = status;
    if (notes !== undefined) message.notes = notes;
    if (replied !== undefined) message.replied = replied;

    await message.save();
    return res.status(200).json({ success: true, message: 'Status updated successfully', data: message });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/contact/messages/:id - Admin: Delete inquiry
exports.deleteMessage = async (req, res, next) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    await ContactMessage.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: 'Message deleted successfully' });
  } catch (err) {
    next(err);
  }
};