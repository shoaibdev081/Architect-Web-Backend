const Project = require('../models/Project');
const Service = require('../models/Service');
const Team = require('../models/Team');
const Gallery = require('../models/Gallery');
const ClientReview = require('../models/ClientReview');

const Blog = require('../models/Blog');
const MainArea = require('../models/MainArea');

exports.globalSearch = async (req, res, next) => {
  try {
    const query = req.query.q || '';
    if (!query || query.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }

    const searchRegex = new RegExp(query.trim(), 'i');

    // Search Projects
    const projects = await Project.find({
      $or: [
        { title: searchRegex },
        { location: searchRegex },
        { architect: searchRegex },
        { client: searchRegex },
        { resultDescription: searchRegex }
      ]
    }).limit(5);

    // Search Services
    const services = await Service.find({
      $or: [
        { title: searchRegex },
        { desc: searchRegex },
        { desc2: searchRegex }
      ]
    }).limit(5);

    // Search Team Members
    const team = await Team.find({
      $or: [
        { name: searchRegex },
        { role: searchRegex }
      ]
    }).limit(5);

    // Search Gallery
    const gallery = await Gallery.find({
      $or: [
        { title: searchRegex },
        { category: searchRegex },
        { description: searchRegex }
      ]
    }).limit(5);

    // Search Client Reviews
    const reviews = await ClientReview.find({
      $or: [
        { name: searchRegex },
        { role: searchRegex },
        { feedback: searchRegex }
      ]
    }).limit(5);

    // Search Blogs
    const blogs = await Blog.find({
      $or: [
        { title: searchRegex },
        { category: searchRegex },
        { excerpt: searchRegex },
        { tags: searchRegex }
      ]
    }).limit(5);

    // Search Main Areas
    const areas = await MainArea.find({
      $or: [
        { name: searchRegex },
        { tagline: searchRegex },
        { category: searchRegex },
        { badge: searchRegex },
        { description: searchRegex }
      ]
    }).limit(5);

    return res.status(200).json({
      success: true,
      query: query.trim(),
      results: {
        projects: {
          count: projects.length,
          data: projects
        },
        services: {
          count: services.length,
          data: services
        },
        team: {
          count: team.length,
          data: team
        },
        gallery: {
          count: gallery.length,
          data: gallery
        },
        reviews: {
          count: reviews.length,
          data: reviews
        },
        blogs: {
          count: blogs.length,
          data: blogs
        },
        areas: {
          count: areas.length,
          data: areas
        }
      },
      totalResults: projects.length + services.length + team.length + gallery.length + reviews.length + blogs.length + areas.length
    });
  } catch (error) {
    next(error);
  }
};
