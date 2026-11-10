const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const projectRoutes = require('./routes/projectRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const teamRoutes = require('./routes/teamRoutes');
const clientReviewRoutes = require('./routes/clientReviewRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const companyOwnerRoutes = require('./routes/companyOwnerRoutes');
const searchRoutes = require('./routes/searchRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');
const contactRoutes = require('./routes/contactRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const authRoutes = require('./routes/authRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const blogRoutes = require('./routes/blogRoutes');
const footerRoutes = require('./routes/footerRoutes');
const homeRoutes = require('./routes/homeRoutes');
const mainAreaRoutes = require('./routes/mainAreaRoutes');
const metaPixelRoutes = require('./routes/metaPixelRoutes');
const flashNewsRoutes = require('./routes/flashNewsRoutes');

const errorHandler = require('./middleware/errorHandler');
const app = express();

// Security and middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/', (req, res) => res.json({ message: 'API is running' }));
app.get('/api', (req, res) => res.json({ message: 'Architect API v1 is active' }));

// API routes
app.use('/api/projects', projectRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/client-reviews', clientReviewRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/company-owner', companyOwnerRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/footer', footerRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/main-areas', mainAreaRoutes);
app.use('/api/meta-pixel', metaPixelRoutes);
app.use('/api/flash-news', flashNewsRoutes);

// Central error handler
app.use(errorHandler);

module.exports = app;
