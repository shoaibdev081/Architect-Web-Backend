const mongoose = require('mongoose');
const Project = require('../models/Project');
const uploadOnCloudinary = require('../config/cloudinary');
const fs = require('fs');

// Predefined project types for recommendations and quick select
const VALID_PROJECT_TYPES = [
  'Residential',
  'Commercial',
  'Industrial',
  'Mixed Use',
  'Institutional',
  'Interior Design',
  'Architecture',
  'Landscape'
];

// Helper: simple slug generator
const makeSlug = (text) =>
  (text || '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

// Helper: robust array parser
const parseArray = (input) => {
  if (input === undefined || input === null) return [];
  if (Array.isArray(input)) {
    return input.flatMap(item => {
      if (typeof item === 'string' && item.startsWith('[') && item.endsWith(']')) {
        try {
          const parsed = JSON.parse(item);
          return Array.isArray(parsed) ? parsed : [item];
        } catch {
          return [item];
        }
      }
      return [item];
    }).filter(Boolean);
  }
  if (typeof input === 'string') {
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
      return [input];
    } catch {
      return [input];
    }
  }
  return [input];
};

// Helper: robust roomSizes parser
const parseRoomSizes = (input, body = {}) => {
  if (Array.isArray(input)) {
    return input.filter(r => r && (r.size || r.label));
  }
  if (typeof input === 'string') {
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) {
        return parsed.filter(r => r && (r.size || r.label));
      }
    } catch (e) {
      // not JSON string
    }
  }
  // Check indexed fields e.g. roomSizes[0][size]
  const roomSizes = [];
  Object.keys(body).forEach(key => {
    const match = key.match(/^roomSizes\[(\d+)\]\[(label|size)\]$/);
    if (match) {
      const idx = parseInt(match[1], 10);
      const field = match[2];
      if (!roomSizes[idx]) roomSizes[idx] = {};
      roomSizes[idx][field] = body[key];
    }
  });
  return roomSizes.filter(r => r && (r.size || r.label));
};

// Create project (admin)
exports.createProject = async (req, res, next) => {
  try {
    const body = req.body || {};

    if (!body.title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    // Generate unique slug
    let baseSlug = body.slug ? makeSlug(body.slug) : makeSlug(body.title);
    if (!baseSlug) baseSlug = `project-${Date.now()}`;
    
    let slug = baseSlug;
    let count = 1;
    while (await Project.findOne({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    // Handle single `mainImage`
    if (req.files?.mainImage?.[0]) {
      const file = req.files.mainImage[0];
      try {
        const resp = await uploadOnCloudinary(file.path);
        if (resp?.url) body.mainImage = resp.url;
        else body.mainImage = `/uploads/${file.filename}`;
      } catch {
        body.mainImage = `/uploads/${file.filename}`;
      }
    }

    // Handle `photos` array upload
    let photos = parseArray(body.photos);
    if (req.files?.photos) {
      for (const f of req.files.photos) {
        try {
          const resp = await uploadOnCloudinary(f.path);
          if (resp?.url) photos.push(resp.url);
          else photos.push(`/uploads/${f.filename}`);
        } catch {
          photos.push(`/uploads/${f.filename}`);
        }
      }
    }

    // Handle `videos` array upload
    let videos = parseArray(body.videos);
    if (req.files?.videos) {
      for (const f of req.files.videos) {
        try {
          const resp = await uploadOnCloudinary(f.path, { resource_type: 'video' });
          if (resp?.url) videos.push(resp.url);
          else videos.push(`/uploads/${f.filename}`);
        } catch {
          videos.push(`/uploads/${f.filename}`);
        }
      }
    }

    const details = parseArray(body.details);
    const relatedProjects = parseArray(body.relatedProjects).filter(id => mongoose.Types.ObjectId.isValid(id));
    const roomSizes = parseRoomSizes(body.roomSizes, body);

    const projectData = {
      slug,
      title: body.title,
      location: body.location || '',
      year: body.year || '',
      architect: body.architect || '',
      projectType: body.projectType || 'Residential',
      client: body.client || '',
      terms: body.terms || '',
      strategy: body.strategy || '',
      date: body.date || '',
      mainImage: body.mainImage || body.image || '',
      image: body.image || body.mainImage || '',
      photos,
      videos,
      details,
      relatedProjects,
      roomSizes,
      resultDescription: body.resultDescription || ''
    };

    const project = new Project(projectData);
    await project.save();

    return res.status(201).json({ success: true, message: 'Project created successfully', data: project });
  } catch (error) {
    if (req.files) {
      Object.values(req.files).flat().forEach(f => {
        if (f?.path && fs.existsSync(f.path)) {
          try { fs.unlinkSync(f.path); } catch (_) {}
        }
      });
    }
    next(error);
  }
};

// Get all projects
exports.getAllProjects = async (req, res, next) => {
  try {
    const { projectType, q } = req.query;
    const filter = {};
    if (projectType) filter.projectType = projectType;
    if (q) filter.title = { $regex: q, $options: 'i' };

    // Auto-seed initial 3 high quality projects if empty
    const totalCount = await Project.countDocuments();
    if (totalCount === 0) {
      const initialProjects = [
        {
          slug: 'minimalist-villa-residence',
          title: 'Minimalist Villa Residence',
          location: 'Lahore, Pakistan',
          year: '2024',
          architect: 'Monda Brothers Studio',
          projectType: 'Residential',
          client: 'Private Owner',
          terms: '6 Months',
          strategy: 'Modern Minimalist',
          date: 'October 2024',
          mainImage: '/images/gallery-1.jpg',
          image: '/images/gallery-1.jpg',
          photos: [
            '/images/gallery-1.jpg',
            '/images/gallery-3.jpg',
            '/images/gallery-4.jpg'
          ],
          videos: ['/videos/Sample.mp4'],
          details: [
            'Bespoke interior and exterior architectural styling',
            'Floor-to-ceiling panoramic insulated glass facades',
            'Sustainable solar-integrated structural design',
            'Custom Italian marble flooring with radiant heating'
          ],
          roomSizes: [
            { size: '55 m²', label: 'Living Lounge' },
            { size: '32 m²', label: 'Master Suite' },
            { size: '22 m²', label: 'Modern Kitchen' },
            { size: '18 m²', label: 'Open Terrace' }
          ],
          resultDescription: 'A timeless contemporary residence harmonizing sleek lines, organic textures, and natural sunlight to craft an inspiring sanctuary.'
        },
        {
          slug: 'skyline-commercial-tower',
          title: 'Skyline Commercial Tower',
          location: 'Islamabad, Pakistan',
          year: '2023',
          architect: 'Monda Architecture Group',
          projectType: 'Commercial',
          client: 'Apex Corporate Group',
          terms: '14 Months',
          strategy: 'Biophilic Urbanism',
          date: 'June 2023',
          mainImage: '/images/gallery-6.jpg',
          image: '/images/gallery-6.jpg',
          photos: [
            '/images/gallery-6.jpg',
            '/images/gallery-7.jpg',
            '/images/gallery-9.jpg'
          ],
          videos: ['/videos/Sample.mp4'],
          details: [
            'LEED Platinum energy-efficient certification standards',
            'Acoustically optimized executive workspaces and lounges',
            'Integrated smart HVAC and automated ambient lighting',
            'Earthquake-resistant lightweight steel framing'
          ],
          roomSizes: [
            { size: '120 m²', label: 'Grand Lobby' },
            { size: '85 m²', label: 'Executive Boardroom' },
            { size: '240 m²', label: 'Open Workspace' }
          ],
          resultDescription: 'An iconic commercial landmark engineered for collaborative excellence, sustainability, and unparalleled operational efficiency.'
        },
        {
          slug: 'serene-urban-penthouse',
          title: 'Serene Urban Penthouse',
          location: 'Karachi, Pakistan',
          year: '2024',
          architect: 'Monda Brothers Studio',
          projectType: 'Residential',
          client: 'Al-Noor Holdings',
          terms: '4 Months',
          strategy: 'Luxury Interior',
          date: 'August 2024',
          mainImage: '/images/gallery-11.jpg',
          image: '/images/gallery-11.jpg',
          photos: [
            '/images/gallery-11.jpg',
            '/images/gallery-12.jpg',
            '/images/gallery-1.jpg'
          ],
          videos: ['/videos/Sample.mp4'],
          details: [
            'Handcrafted walnut wall paneling with concealed storage',
            'Private rooftop infinity plunge pool with skyline views',
            'Smart home automation and automated climate control',
            'Architectural cove lighting with tailored mood presets'
          ],
          roomSizes: [
            { size: '65 m²', label: 'Penthouse Salon' },
            { size: '38 m²', label: 'Sky Bedroom' },
            { size: '40 m²', label: 'Rooftop Deck' }
          ],
          resultDescription: 'A pinnacle of contemporary urban living featuring seamless indoor-outdoor transitions and bespoke material selections.'
        }
      ];
      await Project.insertMany(initialProjects);
    }

    const projects = await Project
      .find(filter)
      .populate('relatedProjects', 'slug title mainImage image location year')
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    next(error);
  }
};

// Get project by database id
exports.getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('relatedProjects', 'slug title mainImage image location year');
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    return res.status(200).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// Get project by slug (frontend uses slug routes)
exports.getProjectBySlug = async (req, res, next) => {
  try {
    let project = await Project.findOne({ slug: req.params.slug })
      .populate('relatedProjects', 'slug title mainImage image location year');
    if (!project && mongoose.Types.ObjectId.isValid(req.params.slug)) {
      project = await Project.findById(req.params.slug)
        .populate('relatedProjects', 'slug title mainImage image location year');
    }
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    return res.status(200).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// Update project (admin)
exports.updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const body = req.body || {};

    if (body.title) project.title = body.title;
    if (body.location !== undefined) project.location = body.location;
    if (body.year !== undefined) project.year = body.year;
    if (body.architect !== undefined) project.architect = body.architect;
    if (body.projectType !== undefined) project.projectType = body.projectType;
    if (body.client !== undefined) project.client = body.client;
    if (body.terms !== undefined) project.terms = body.terms;
    if (body.strategy !== undefined) project.strategy = body.strategy;
    if (body.date !== undefined) project.date = body.date;
    if (body.resultDescription !== undefined) project.resultDescription = body.resultDescription;

    if (body.details !== undefined) {
      project.details = parseArray(body.details);
    }

    if (body.roomSizes !== undefined) {
      project.roomSizes = parseRoomSizes(body.roomSizes, body);
    }

    if (body.relatedProjects !== undefined) {
      project.relatedProjects = parseArray(body.relatedProjects).filter(id => mongoose.Types.ObjectId.isValid(id));
    }

    // Direct JSON assignment for images/media (from Laptop Image Pickers)
    if (body.mainImage !== undefined) {
      project.mainImage = body.mainImage;
      project.image = body.mainImage;
    }
    if (body.image !== undefined && !body.mainImage) {
      project.mainImage = body.image;
      project.image = body.image;
    }
    if (body.photos !== undefined) {
      project.photos = parseArray(body.photos);
    }
    if (body.videos !== undefined) {
      project.videos = parseArray(body.videos);
    }

    // Slug update with collision check
    if (body.slug && body.slug !== project.slug) {
      const cleanSlug = makeSlug(body.slug);
      const exists = await Project.findOne({ slug: cleanSlug, _id: { $ne: project._id } });
      if (exists) {
        return res.status(400).json({ success: false, message: 'Slug is already used by another project' });
      }
      project.slug = cleanSlug;
    }

    // Multipart upload overrides if files sent in request
    if (req.files?.mainImage?.[0]) {
      const f = req.files.mainImage[0];
      try {
        const resp = await uploadOnCloudinary(f.path);
        project.mainImage = resp?.url || `/uploads/${f.filename}`;
        project.image = project.mainImage;
      } catch {
        project.mainImage = `/uploads/${f.filename}`;
        project.image = project.mainImage;
      }
    }

    if (req.files?.photos && req.files.photos.length > 0) {
      const newPhotos = [];
      for (const f of req.files.photos) {
        try {
          const resp = await uploadOnCloudinary(f.path);
          newPhotos.push(resp?.url || `/uploads/${f.filename}`);
        } catch {
          newPhotos.push(`/uploads/${f.filename}`);
        }
      }
      project.photos = [...(project.photos || []), ...newPhotos];
    }

    if (req.files?.videos && req.files.videos.length > 0) {
      const newVideos = [];
      for (const f of req.files.videos) {
        try {
          const resp = await uploadOnCloudinary(f.path, { resource_type: 'video' });
          newVideos.push(resp?.url || `/uploads/${f.filename}`);
        } catch {
          newVideos.push(`/uploads/${f.filename}`);
        }
      }
      project.videos = [...(project.videos || []), ...newVideos];
    }

    await project.save();
    return res.status(200).json({ success: true, message: 'Project updated successfully', data: project });
  } catch (error) {
    next(error);
  }
};

// Get valid project types
exports.getProjectTypes = async (req, res, next) => {
  try {
    const existingTypes = await Project.distinct('projectType');
    const combined = Array.from(new Set([...VALID_PROJECT_TYPES, ...(existingTypes.filter(Boolean))]));
    return res.status(200).json({
      success: true,
      data: combined
    });
  } catch (error) {
    next(error);
  }
};

// Delete project (admin)
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    await Project.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};