const ClientReview = require('../models/ClientReview');
const uploadOnCloudinary = require('../config/cloudinary');
const fs = require('fs');

const initialReviews = [
  {
    name: 'Sarah Jenkins',
    role: 'CEO, Horizon Ventures',
    feedback: 'Monda Brothers completely revolutionized our corporate headquarters. Their attention to spatial harmony, lighting, and premium finishes exceeded every expectation. An absolute pleasure to partner with.',
    rating: 5.0,
    image: '/images/team-3.jpg'
  },
  {
    name: 'David Sterling',
    role: 'Managing Director, Sterling Capital',
    feedback: 'From initial architectural sketches to the final turnkey handover, their team exhibited unparalleled professionalism and creativity. Our luxury villa project was delivered ahead of schedule and within budget.',
    rating: 5.0,
    image: '/images/team-4.jpg'
  },
  {
    name: 'Elena Rostova',
    role: 'Lead Architect & Designer',
    feedback: 'As an architect myself, I hold extremely high standards for design detailing and material integrity. Monda Brothers delivered immaculate millwork and structural craftsmanship that truly impressed me.',
    rating: 4.9,
    image: '/images/team-5.jpg'
  },
  {
    name: 'Michael Chen',
    role: 'Private Estate Owner',
    feedback: 'The interior layout and modern aesthetics created for our residence are breathtaking. They listened carefully to all our family needs and translated them into an inspiring living sanctuary.',
    rating: 5.0,
    image: '/images/team-6.jpg'
  }
];

exports.createReview = async (req, res, next) => {
  try {
    const body = req.body || {};
    if (!body.name && !body.CName) return res.status(400).json({ success: false, message: 'Client name is required' });

    const review = new ClientReview({
      name: body.name || body.CName,
      role: body.role || body.CDesignation || body.designation || '',
      feedback: body.feedback || body.CDescription || body.description || '',
      rating: body.rating !== undefined ? Number(body.rating) : (body.stars ? Number(body.stars) : 0),
      reviews: body.reviews !== undefined ? Number(body.reviews) : 0
    });

    if (req.file && req.file.path) {
      const uploaded = await uploadOnCloudinary(req.file.path);
      if (uploaded && (uploaded.secure_url || uploaded.url)) review.image = uploaded.secure_url || uploaded.url;
    }

    await review.save();
    // Always return user-friendly field names
    return res.status(201).json({
      success: true,
      message: 'Client review created',
      data: {
        _id: review._id,
        name: review.name,
        role: review.role,
        feedback: review.feedback,
        image: review.image,
        rating: review.rating,
        reviews: review.reviews
      }
    });
  } catch (error) {
    if (req.file && req.file.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    next(error);
  }
};

exports.getAllReviews = async (req, res, next) => {
  try {
    let reviews = await ClientReview.find().sort({ createdAt: -1 });
    if (!reviews || reviews.length === 0) {
      await ClientReview.insertMany(initialReviews);
      reviews = await ClientReview.find().sort({ createdAt: -1 });
    }
    // Map to user-friendly field names
    const mapped = reviews.map(r => ({
      _id: r._id,
      name: r.name,
      role: r.role,
      feedback: r.feedback,
      image: r.image,
      rating: r.rating,
      reviews: r.reviews
    }));
    return res.status(200).json({ success: true, count: mapped.length, data: mapped });
  } catch (error) { next(error); }
};

exports.getReviewById = async (req, res, next) => {
  try {
    const review = await ClientReview.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Client review not found' });
    return res.status(200).json({
      success: true,
      data: {
        _id: review._id,
        name: review.name,
        role: review.role,
        feedback: review.feedback,
        image: review.image,
        rating: review.rating,
        reviews: review.reviews
      }
    });
  } catch (error) { next(error); }
};

exports.updateReview = async (req, res, next) => {
  try {
    const review = await ClientReview.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Client review not found' });

    const body = req.body || {};
    if (body.name || body.CName) review.name = body.name || body.CName;
    if (body.role || body.CDesignation || body.designation) review.role = body.role || body.CDesignation || body.designation;
    if (body.feedback || body.CDescription || body.description) review.feedback = body.feedback || body.CDescription || body.description;
    if (body.rating !== undefined) review.rating = Number(body.rating);
    else if (body.stars !== undefined) review.rating = Number(body.stars);
    // reviews field removed

    if (req.file && req.file.path) {
      const uploaded = await uploadOnCloudinary(req.file.path);
      if (uploaded && (uploaded.secure_url || uploaded.url)) review.image = uploaded.secure_url || uploaded.url;
    }

    await review.save();
    return res.status(200).json({
      success: true,
      message: 'Client review updated',
      data: {
        _id: review._id,
        name: review.name,
        role: review.role,
        feedback: review.feedback,
        image: review.image,
        rating: review.rating,
        // reviews removed
      }
    });
  } catch (error) { next(error); }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const review = await ClientReview.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Client review not found' });
    await ClientReview.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: 'Client review deleted' });
  } catch (error) { next(error); }
};
