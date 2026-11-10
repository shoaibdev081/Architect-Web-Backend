const FlashNews = require('../models/FlashNews');
const uploadOnCloudinary = require('../config/cloudinary');

// Helper: slug generator
const makeSlug = (text) =>
  (text || '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

// Initial news for auto-seed if database is empty
const initialNews = [
  {
    title: 'Groundbreaking Milestone: DHA Multan Luxury Commercial Mall Phase 2 Commenced',
    slug: 'dha-multan-luxury-commercial-mall-phase-2-commenced',
    category: 'Milestone',
    badge: 'BREAKING UPDATE',
    summary: 'Monda Brothers officially begins structural excavation and architectural implementation for the iconic Phase 2 development in DHA Multan.',
    content: `We are thrilled to announce that Monda Brothers has officially commenced structural work on the DHA Multan Luxury Commercial Complex (Phase 2). 

This state-of-the-art architectural landmark features cutting-edge glass facade engineering, seismic-resistant structural planning, sustainable atrium ventilation, and premium interior shopping zones. 

Our engineering and site management teams have completed ground testing and basement foundation reinforcement. The project is tracking ahead of schedule with handover planned for early 2027.`,
    image: '/images/service-1.jpg',
    isFlash: true,
    priority: 10,
    status: 'published',
    relatedProject: 'DHA Commercial Complex',
    publishedAt: new Date(),
  },
  {
    title: 'Monda Brothers Awarded Best Luxury Residential Interior Design Award 2026',
    slug: 'monda-brothers-awarded-best-luxury-residential-interior-design-award-2026',
    category: 'Award & Recognition',
    badge: 'HONOR & AWARD',
    summary: 'Recognized at the National Architectural & Design Excellence Summit 2026 for revolutionary modern minimalist villa designs.',
    content: `At the prestigious Architectural Excellence Summit 2026, Monda Brothers was honored with the coveted 'Best Luxury Residential Interior Design' trophy.

The award honors our contemporary villa project featuring open-concept bioclimatic courtyards, custom Italian marble flooring, and smart automated interior mood lighting. We express sincere gratitude to our visionary clients and passionate craftsmanship team who make every creation extraordinary.`,
    image: '/images/gallery-1.jpg',
    isFlash: true,
    priority: 8,
    status: 'published',
    relatedProject: 'Royal Palm Villa',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Exclusive Launch: Eco-Friendly Smart Sustainable Living Villa Collection',
    slug: 'exclusive-launch-eco-friendly-smart-sustainable-living-villa-collection',
    category: 'New Launch',
    badge: 'PROJECT LAUNCH',
    summary: 'Introducing our 2026 collection of energy-positive, solar-integrated luxury residential estates with zero carbon footprint.',
    content: `Monda Brothers is proud to announce the official launch of our Eco-Friendly Villa Blueprint Collection. 

Key architectural innovations include:
1. Passive solar heat dissipation using recessed balconies and double-glazed low-E thermal windows.
2. Rainwater harvesting and greywater filtration systems integrated into landscape architecture.
3. Fully integrated smart-home automation for centralized lighting, security, and climate management.

Bookings for architectural consultations and bespoke interior design packages are now open through our website contact form.`,
    image: '/images/service-3.jpg',
    isFlash: false,
    priority: 5,
    status: 'published',
    relatedProject: 'Eco-Living Villa Series',
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
];

// 1. GET /api/flash-news (Public)
exports.getAllNews = async (req, res, next) => {
  try {
    // Auto-seed if empty
    const count = await FlashNews.countDocuments();
    if (count === 0) {
      await FlashNews.insertMany(initialNews);
    }

    const { category, isFlash, status, search, limit = 50, page = 1 } = req.query;
    const filter = {};

    // For public website, only show published unless status is explicitly queried
    if (status) {
      filter.status = status;
    } else {
      filter.status = 'published';
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (isFlash !== undefined) {
      filter.isFlash = isFlash === 'true' || isFlash === true;
    }

    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { summary: { $regex: q, $options: 'i' } },
        { relatedProject: { $regex: q, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [news, total] = await Promise.all([
      FlashNews.find(filter)
        .sort({ priority: -1, publishedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10)),
      FlashNews.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      count: news.length,
      total,
      data: news,
    });
  } catch (error) {
    next(error);
  }
};

// 2. GET /api/flash-news/admin/all (Admin - returns all statuses: published, draft, archived)
exports.getAdminAllNews = async (req, res, next) => {
  try {
    const count = await FlashNews.countDocuments();
    if (count === 0) {
      await FlashNews.insertMany(initialNews);
    }

    const news = await FlashNews.find().sort({ priority: -1, publishedAt: -1 });
    return res.status(200).json({
      success: true,
      count: news.length,
      data: news,
    });
  } catch (error) {
    next(error);
  }
};

// 3. GET /api/flash-news/:idOrSlug
exports.getNewsByIdOrSlug = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    let news = null;

    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      news = await FlashNews.findById(idOrSlug);
    }
    if (!news) {
      news = await FlashNews.findOne({ slug: idOrSlug });
    }

    if (!news) {
      return res.status(404).json({ success: false, message: 'News item not found' });
    }

    return res.status(200).json({ success: true, data: news });
  } catch (error) {
    next(error);
  }
};

// 4. POST /api/flash-news (Admin)
exports.createNews = async (req, res, next) => {
  try {
    const body = req.body || {};

    if (!body.title || !body.title.trim()) {
      return res.status(400).json({ success: false, message: 'News title is required' });
    }
    if (!body.summary || !body.summary.trim()) {
      return res.status(400).json({ success: false, message: 'Summary is required' });
    }
    if (!body.content || !body.content.trim()) {
      return res.status(400).json({ success: false, message: 'Content is required' });
    }

    // Generate unique slug
    let baseSlug = body.slug ? makeSlug(body.slug) : makeSlug(body.title);
    if (!baseSlug) baseSlug = `news-${Date.now()}`;
    let slug = baseSlug;
    let counter = 1;
    while (await FlashNews.findOne({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    // Handle image upload
    let image = body.image || '';
    if (req.file) {
      try {
        const uploadRes = await uploadOnCloudinary(req.file.path);
        if (uploadRes?.secure_url || uploadRes?.url) {
          image = uploadRes.secure_url || uploadRes.url;
        } else {
          image = `/uploads/${req.file.filename}`;
        }
      } catch {
        image = `/uploads/${req.file.filename}`;
      }
    }

    const newsItem = new FlashNews({
      title: body.title.trim(),
      slug,
      category: body.category || 'Project Update',
      badge: body.badge ? body.badge.trim() : 'FLASH NEWS',
      summary: body.summary.trim(),
      content: body.content.trim(),
      image,
      isFlash: body.isFlash === 'true' || body.isFlash === true,
      priority: body.priority !== undefined ? Number(body.priority) : 0,
      status: body.status || 'published',
      relatedProject: body.relatedProject ? body.relatedProject.trim() : '',
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
    });

    await newsItem.save();

    return res.status(201).json({
      success: true,
      message: 'News update published successfully',
      data: newsItem,
    });
  } catch (error) {
    next(error);
  }
};

// 5. PUT /api/flash-news/:id (Admin)
exports.updateNews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const news = await FlashNews.findById(id);

    if (!news) {
      return res.status(404).json({ success: false, message: 'News item not found' });
    }

    const body = req.body || {};

    if (body.title !== undefined) news.title = body.title.trim();
    if (body.category !== undefined) news.category = body.category;
    if (body.badge !== undefined) news.badge = body.badge.trim();
    if (body.summary !== undefined) news.summary = body.summary.trim();
    if (body.content !== undefined) news.content = body.content.trim();
    if (body.relatedProject !== undefined) news.relatedProject = body.relatedProject.trim();
    if (body.priority !== undefined) news.priority = Number(body.priority);
    if (body.status !== undefined) news.status = body.status;
    if (body.publishedAt) news.publishedAt = new Date(body.publishedAt);

    if (body.isFlash !== undefined) {
      news.isFlash = body.isFlash === 'true' || body.isFlash === true;
    }

    // Handle image update
    if (req.file) {
      try {
        const uploadRes = await uploadOnCloudinary(req.file.path);
        if (uploadRes?.secure_url || uploadRes?.url) {
          news.image = uploadRes.secure_url || uploadRes.url;
        } else {
          news.image = `/uploads/${req.file.filename}`;
        }
      } catch {
        news.image = `/uploads/${req.file.filename}`;
      }
    } else if (body.image !== undefined) {
      news.image = body.image;
    }

    await news.save();

    return res.status(200).json({
      success: true,
      message: 'News update modified successfully',
      data: news,
    });
  } catch (error) {
    next(error);
  }
};

// 6. DELETE /api/flash-news/:id (Admin)
exports.deleteNews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await FlashNews.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'News item not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'News item deleted successfully',
      data: { id },
    });
  } catch (error) {
    next(error);
  }
};

