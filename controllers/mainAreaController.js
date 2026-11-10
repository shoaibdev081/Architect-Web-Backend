const MainArea = require('../models/MainArea');
const uploadOnCloudinary = require('../config/cloudinary');

// Helper: slug generator
const makeSlug = (text) =>
  (text || '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

// Helper: parse array
const parseArray = (input) => {
  if (!input) return [];
  if (Array.isArray(input)) return input.map((t) => String(t).trim()).filter(Boolean);
  if (typeof input === 'string') {
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) return parsed.map((t) => String(t).trim()).filter(Boolean);
    } catch {}
    return input
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
};

// 1. Get all areas
exports.getAllAreas = async (req, res, next) => {
  try {
    const { category, search, active, all } = req.query;
    const query = {};

    // If 'all' is not true and active is not explicitly 'all', show only active by default
    if (active === 'true') {
      query.isActive = true;
    } else if (active === 'false') {
      query.isActive = false;
    } else if (all !== 'true' && !req.query.isAdmin) {
      query.isActive = true;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: regex },
        { tagline: regex },
        { description: regex },
        { badge: regex },
        { city: regex },
        { features: regex },
      ];
    }

    const areas = await MainArea.find(query).sort({ order: 1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: areas.length,
      data: areas,
    });
  } catch (error) {
    next(error);
  }
};

// 2. Get single area by ID or slug
exports.getAreaById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let area;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      area = await MainArea.findById(id);
    } else {
      area = await MainArea.findOne({ slug: id });
    }

    if (!area) {
      return res.status(404).json({ success: false, message: 'Main area not found' });
    }

    return res.status(200).json({ success: true, data: area });
  } catch (error) {
    next(error);
  }
};

// 3. Create area (Admin)
exports.createArea = async (req, res, next) => {
  try {
    const body = req.body || {};

    if (!body.name || !body.name.trim()) {
      return res.status(400).json({ success: false, message: 'Area name is required' });
    }

    // Generate unique slug
    let baseSlug = body.slug ? makeSlug(body.slug) : makeSlug(body.name);
    if (!baseSlug) baseSlug = `area-${Date.now()}`;
    let slug = baseSlug;
    let count = 1;
    while (await MainArea.findOne({ slug })) {
      slug = `${baseSlug}-${count++}`;
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

    const features = parseArray(body.features);

    const area = new MainArea({
      name: body.name.trim(),
      slug,
      category: body.category || 'Residential Society',
      tagline: (body.tagline || '').trim(),
      description: (body.description || '').trim(),
      badge: (body.badge || '').trim(),
      city: (body.city || 'Multan').trim(),
      image,
      features,
      order: Number(body.order) || 0,
      isActive: body.isActive !== false && body.isActive !== 'false',
    });

    await area.save();

    return res.status(201).json({
      success: true,
      message: 'Main area created successfully',
      data: area,
    });
  } catch (error) {
    next(error);
  }
};

// 4. Update area (Admin)
exports.updateArea = async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body || {};

    const area = await MainArea.findById(id);
    if (!area) {
      return res.status(404).json({ success: false, message: 'Main area not found' });
    }

    if (body.name && body.name.trim()) {
      area.name = body.name.trim();
    }

    if (body.slug && body.slug.trim()) {
      const newSlug = makeSlug(body.slug);
      if (newSlug !== area.slug) {
        let slug = newSlug;
        let count = 1;
        while (await MainArea.findOne({ slug, _id: { $ne: id } })) {
          slug = `${newSlug}-${count++}`;
        }
        area.slug = slug;
      }
    }

    if (body.category !== undefined) area.category = body.category;
    if (body.tagline !== undefined) area.tagline = body.tagline.trim();
    if (body.description !== undefined) area.description = body.description.trim();
    if (body.badge !== undefined) area.badge = body.badge.trim();
    if (body.city !== undefined) area.city = body.city.trim();
    if (body.order !== undefined) area.order = Number(body.order) || 0;
    if (body.isActive !== undefined) {
      area.isActive = body.isActive === true || body.isActive === 'true';
    }

    if (body.features !== undefined) {
      area.features = parseArray(body.features);
    }

    // Image handling
    if (req.file) {
      try {
        const uploadRes = await uploadOnCloudinary(req.file.path);
        if (uploadRes?.secure_url || uploadRes?.url) {
          area.image = uploadRes.secure_url || uploadRes.url;
        } else {
          area.image = `/uploads/${req.file.filename}`;
        }
      } catch {
        area.image = `/uploads/${req.file.filename}`;
      }
    } else if (body.image !== undefined) {
      area.image = body.image;
    }

    await area.save();

    return res.status(200).json({
      success: true,
      message: 'Main area updated successfully',
      data: area,
    });
  } catch (error) {
    next(error);
  }
};

// 5. Delete area (Admin)
exports.deleteArea = async (req, res, next) => {
  try {
    const { id } = req.params;
    const area = await MainArea.findByIdAndDelete(id);
    if (!area) {
      return res.status(404).json({ success: false, message: 'Main area not found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Main area deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// 6. Toggle Status
exports.toggleAreaStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const area = await MainArea.findById(id);
    if (!area) {
      return res.status(404).json({ success: false, message: 'Main area not found' });
    }
    area.isActive = !area.isActive;
    await area.save();
    return res.status(200).json({
      success: true,
      message: `Area ${area.isActive ? 'activated' : 'deactivated'} successfully`,
      data: area,
    });
  } catch (error) {
    next(error);
  }
};
