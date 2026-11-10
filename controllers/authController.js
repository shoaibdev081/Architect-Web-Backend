const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role, isAdmin: true },
      process.env.JWT,
      { expiresIn: '7d' }
    );

    return res.status(200).json({ success: true, token });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    const existing = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const admin = new Admin({
      email: email.toLowerCase().trim(),
      password,
      role: 'admin'
    });
    await admin.save();

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role, isAdmin: true },
      process.env.JWT,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Admin account created successfully',
      token
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
