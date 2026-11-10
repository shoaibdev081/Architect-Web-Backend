const AboutPage = require('../models/AboutPage');
const uploadOnCloudinary = require('../config/cloudinary');
const fs = require('fs');

// Default initial data matching the exact website UI
const getDefaultAboutData = () => ({
  hero: {
    badge: 'STARTED IN 1989',
    heading: 'We Shape Interior Designs, Crafting Timeless And Inspiring Spaces',
    experienceYears: '26',
    experienceTitle: 'Years Of',
    experienceSubtitle: 'Experience',
    featureImage: '/images/gallery-11.jpg',
    heroImage: '/images/hero-bg-3.webp',
    description: 'We believe that every space has the power to inspire, and that great design brings that inspiration to life. Our mission is to craft environments that stir creativity, evoke emotion, and reflect the essence of those who inhabit them.',
    buttonText: 'Learn More',
    buttonLink: '/team'
  },
  video: {
    videoUrl: '/videos/Sample.mp4',
    title: 'Design In Motion'
  },
  timeline: [
    {
      year: '1990',
      title: 'Founded',
      description: 'The company is founded by a visionary designer with a focus on personalized, high-quality residential interiors. The first few projects are local homes.',
      image: '/images/gallery-1.jpg'
    },
    {
      year: '1995',
      title: 'Expansion',
      description: 'Opens multiple offices across the region to meet growing demand. Begins taking on larger commercial projects.',
      image: '/images/gallery-3.jpg'
    },
    {
      year: '2000',
      title: 'Digital Revolution',
      description: 'Adopts cutting-edge 3D modeling technology to enhance design presentations and client experiences.',
      image: '/images/gallery-4.jpg'
    },
    {
      year: '2005',
      title: 'Awards & Recognition',
      description: 'Receives multiple national design awards and gains international recognition for innovative projects.',
      image: '/images/gallery-6.jpg'
    },
    {
      year: '2010',
      title: 'Global Reach',
      description: 'Opens a second office in a neighboring city to meet growing demand and takes on larger projects, such as retail spaces and restaurants.',
      image: '/images/gallery-7.jpg'
    },
    {
      year: '2015',
      title: 'Sustainability Focus',
      description: 'Commits to sustainable design practices and green building materials in all future projects.',
      image: '/images/gallery-9.jpg'
    },
    {
      year: '2020',
      title: 'Design Excellence',
      description: 'Wins a prestigious national design award for an innovative mixed-use development project.',
      image: '/images/gallery-11.jpg'
    },
    {
      year: '2025',
      title: 'Milestone Anniversary',
      description: "Celebrates 35 years with a retrospective showcase of the company's most iconic projects and milestones.",
      image: '/images/gallery-12.jpg'
    }
  ],
  awards: {
    badge: 'AWARD & ACHIEVEMENT',
    title: 'Design that speaks our industry awards',
    description: 'Our commitment to excellence has been recognized with numerous prestigious awards and accolades from around the industry.',
    items: [
      {
        year: '2025',
        title: 'Best Residential Design',
        category: 'Interior Design',
        image: '/images/gallery-1.jpg'
      },
      {
        year: '2024',
        title: 'Top Commercial Design',
        category: 'Architecture',
        image: '/images/gallery-3.jpg'
      },
      {
        year: '2023',
        title: 'Sustainable Design Award',
        category: 'Community Center',
        image: '/images/gallery-4.jpg'
      },
      {
        year: '2022',
        title: 'Creative Office Space Award',
        category: 'Corporation Building',
        image: '/images/gallery-6.jpg'
      },
      {
        year: '2020',
        title: 'Emerging Designer Of The Year',
        category: 'Interior Design',
        image: '/images/gallery-7.jpg'
      }
    ]
  }
});

// GET /api/about - Retrieve about page content (with automatic initialization)
exports.getAboutContent = async (req, res, next) => {
  try {
    let about = await AboutPage.findOne();
    if (!about) {
      about = new AboutPage(getDefaultAboutData());
      await about.save();
    }
    return res.status(200).json({ success: true, data: about });
  } catch (err) {
    next(err);
  }
};

// PUT /api/about - Update entire about page content (Admin)
exports.updateAboutContent = async (req, res, next) => {
  try {
    const { hero, video, timeline, awards } = req.body;
    let about = await AboutPage.findOne();

    if (!about) {
      about = new AboutPage(getDefaultAboutData());
    }

    if (hero) {
      about.hero = { ...about.hero.toObject(), ...hero };
    }

    if (video) {
      about.video = { ...about.video.toObject(), ...video };
    }

    if (timeline && Array.isArray(timeline)) {
      about.timeline = timeline;
    }

    if (awards) {
      if (awards.badge !== undefined) about.awards.badge = awards.badge;
      if (awards.title !== undefined) about.awards.title = awards.title;
      if (awards.description !== undefined) about.awards.description = awards.description;
      if (Array.isArray(awards.items)) about.awards.items = awards.items;
    }

    await about.save();
    return res.status(200).json({
      success: true,
      message: 'About page updated successfully',
      data: about
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/about/timeline - Add a timeline milestone
exports.addTimelineItem = async (req, res, next) => {
  try {
    const { year, title, description, image } = req.body;
    if (!year || !title) {
      return res.status(400).json({ success: false, message: 'Year and Title are required' });
    }

    let about = await AboutPage.findOne();
    if (!about) {
      about = new AboutPage(getDefaultAboutData());
    }

    about.timeline.push({ year, title, description: description || '', image: image || '' });
    await about.save();

    return res.status(201).json({
      success: true,
      message: 'Milestone added successfully',
      data: about.timeline
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/about/timeline/:itemId - Update a timeline milestone
exports.updateTimelineItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { year, title, description, image } = req.body;

    let about = await AboutPage.findOne();
    if (!about) return res.status(404).json({ success: false, message: 'About page not found' });

    const item = about.timeline.id(itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Milestone not found' });

    if (year !== undefined) item.year = year;
    if (title !== undefined) item.title = title;
    if (description !== undefined) item.description = description;
    if (image !== undefined) item.image = image;

    await about.save();
    return res.status(200).json({
      success: true,
      message: 'Milestone updated successfully',
      data: item
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/about/timeline/:itemId - Delete a timeline milestone
exports.deleteTimelineItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    let about = await AboutPage.findOne();
    if (!about) return res.status(404).json({ success: false, message: 'About page not found' });

    about.timeline = about.timeline.filter(t => t._id.toString() !== itemId);
    await about.save();

    return res.status(200).json({
      success: true,
      message: 'Milestone deleted successfully',
      data: about.timeline
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/about/awards - Add an award item
exports.addAwardItem = async (req, res, next) => {
  try {
    const { year, title, category, image } = req.body;
    if (!year || !title) {
      return res.status(400).json({ success: false, message: 'Year and Title are required' });
    }

    let about = await AboutPage.findOne();
    if (!about) {
      about = new AboutPage(getDefaultAboutData());
    }

    about.awards.items.push({ year, title, category: category || '', image: image || '' });
    await about.save();

    return res.status(201).json({
      success: true,
      message: 'Award added successfully',
      data: about.awards.items
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/about/awards/:itemId - Update an award item
exports.updateAwardItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { year, title, category, image } = req.body;

    let about = await AboutPage.findOne();
    if (!about) return res.status(404).json({ success: false, message: 'About page not found' });

    const item = about.awards.items.id(itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Award item not found' });

    if (year !== undefined) item.year = year;
    if (title !== undefined) item.title = title;
    if (category !== undefined) item.category = category;
    if (image !== undefined) item.image = image;

    await about.save();
    return res.status(200).json({
      success: true,
      message: 'Award updated successfully',
      data: item
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/about/awards/:itemId - Delete an award item
exports.deleteAwardItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    let about = await AboutPage.findOne();
    if (!about) return res.status(404).json({ success: false, message: 'About page not found' });

    about.awards.items = about.awards.items.filter(a => a._id.toString() !== itemId);
    await about.save();

    return res.status(200).json({
      success: true,
      message: 'Award deleted successfully',
      data: about.awards.items
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/about/upload-image - Upload image from laptop
exports.uploadAboutImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
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
