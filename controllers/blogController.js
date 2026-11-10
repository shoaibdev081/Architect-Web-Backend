const Blog = require('../models/Blog');
const uploadOnCloudinary = require('../config/cloudinary');

// Helper: slug generator
const makeSlug = (text) =>
  (text || '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

// Helper: detect video type from URL
const detectVideoType = (url) => {
  if (!url || typeof url !== 'string' || !url.trim()) return 'none';
  const u = url.trim().toLowerCase();
  if (u.includes('youtube.com') || u.includes('youtu.be')) return 'youtube';
  if (u.includes('facebook.com') || u.includes('fb.watch')) return 'facebook';
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(u)) return 'direct';
  return 'other';
};

// Helper: calculate read time from content
const calculateReadTime = (content) => {
  if (!content) return '2 min read';
  const words = content.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).length;
  const mins = Math.max(1, Math.ceil(words / 180));
  return `${mins} min read`;
};

// Helper: parse tags
const parseTags = (input) => {
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

// 1. Get all blogs (with search, category filter, pagination)
exports.getAllBlogs = async (req, res, next) => {
  try {
    const { category, search, tag, status, featured, page, limit } = req.query;

    const query = {};

    // By default, if status isn't specified, public receives only published blogs
    if (status && status !== 'all') {
      query.status = status;
    } else if (!status && !req.query.isAdmin) {
      query.status = 'published';
    }

    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (tag) {
      query.tags = { $in: [tag] };
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: regex },
        { excerpt: regex },
        { content: regex },
        { category: regex },
        { author: regex },
        { tags: regex },
      ];
    }

    // Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || (limit === 'all' ? 0 : 50);

    let blogQuery = Blog.find(query).sort({ createdAt: -1 });

    if (limitNum > 0) {
      blogQuery = blogQuery.skip((pageNum - 1) * limitNum).limit(limitNum);
    }

    const [blogs, total] = await Promise.all([
      blogQuery.exec(),
      Blog.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      count: blogs.length,
      total,
      page: pageNum,
      totalPages: limitNum > 0 ? Math.ceil(total / limitNum) : 1,
      data: blogs,
    });
  } catch (error) {
    next(error);
  }
};

// 2. Get single blog by slug
exports.getBlogBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOneAndUpdate(
      { slug },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    // Related blogs (same category or recent)
    const related = await Blog.find({
      _id: { $ne: blog._id },
      status: 'published',
      $or: [{ category: blog.category }, { tags: { $in: blog.tags || [] } }],
    })
      .limit(3)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: blog,
      related,
    });
  } catch (error) {
    next(error);
  }
};

// 3. Get single blog by ID
exports.getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    return res.status(200).json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
};

// 4. Create blog (Admin)
exports.createBlog = async (req, res, next) => {
  try {
    const body = req.body || {};

    if (!body.title || !body.title.trim()) {
      return res.status(400).json({ success: false, message: 'Blog title is required' });
    }
    if (!body.content || !body.content.trim()) {
      return res.status(400).json({ success: false, message: 'Blog content is required' });
    }

    // Generate unique slug
    let baseSlug = body.slug ? makeSlug(body.slug) : makeSlug(body.title);
    if (!baseSlug) baseSlug = `blog-${Date.now()}`;
    let slug = baseSlug;
    let count = 1;
    while (await Blog.findOne({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    // Handle cover image
    let coverImage = body.coverImage || '';
    if (req.file) {
      try {
        const uploadRes = await uploadOnCloudinary(req.file.path);
        if (uploadRes?.secure_url || uploadRes?.url) {
          coverImage = uploadRes.secure_url || uploadRes.url;
        } else {
          coverImage = `/uploads/${req.file.filename}`;
        }
      } catch {
        coverImage = `/uploads/${req.file.filename}`;
      }
    } else if (req.files?.coverImage?.[0]) {
      const f = req.files.coverImage[0];
      try {
        const uploadRes = await uploadOnCloudinary(f.path);
        if (uploadRes?.secure_url || uploadRes?.url) {
          coverImage = uploadRes.secure_url || uploadRes.url;
        } else {
          coverImage = `/uploads/${f.filename}`;
        }
      } catch {
        coverImage = `/uploads/${f.filename}`;
      }
    }

    const videoUrl = (body.videoUrl || '').trim();
    const videoType = body.videoType && body.videoType !== 'auto'
      ? body.videoType
      : detectVideoType(videoUrl);

    const tags = parseTags(body.tags);
    const readTime = body.readTime || calculateReadTime(body.content);

    const blog = new Blog({
      title: body.title.trim(),
      slug,
      excerpt: body.excerpt ? body.excerpt.trim() : body.content.slice(0, 160).replace(/<[^>]*>/g, '') + '...',
      content: body.content,
      author: body.author ? body.author.trim() : 'Monda Brothers',
      category: body.category ? body.category.trim() : 'Architecture',
      tags,
      coverImage,
      videoUrl,
      videoType,
      featured: body.featured === true || body.featured === 'true',
      status: body.status === 'draft' ? 'draft' : 'published',
      readTime,
    });

    await blog.save();

    return res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

// 5. Update blog (Admin)
exports.updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body || {};

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    if (body.title && body.title.trim()) {
      blog.title = body.title.trim();
    }

    if (body.slug && body.slug.trim()) {
      const newSlug = makeSlug(body.slug);
      if (newSlug !== blog.slug) {
        let slug = newSlug;
        let count = 1;
        while (await Blog.findOne({ slug, _id: { $ne: id } })) {
          slug = `${newSlug}-${count++}`;
        }
        blog.slug = slug;
      }
    }

    if (body.excerpt !== undefined) {
      blog.excerpt = body.excerpt.trim();
    }

    if (body.content !== undefined) {
      blog.content = body.content;
      if (!body.readTime) {
        blog.readTime = calculateReadTime(body.content);
      }
    }

    if (body.author !== undefined) blog.author = body.author.trim();
    if (body.category !== undefined) blog.category = body.category.trim();
    if (body.readTime !== undefined) blog.readTime = body.readTime.trim();

    if (body.tags !== undefined) {
      blog.tags = parseTags(body.tags);
    }

    if (body.featured !== undefined) {
      blog.featured = body.featured === true || body.featured === 'true';
    }

    if (body.status !== undefined) {
      blog.status = body.status === 'draft' ? 'draft' : 'published';
    }

    // Video URL & Type
    if (body.videoUrl !== undefined) {
      const vUrl = body.videoUrl.trim();
      blog.videoUrl = vUrl;
      blog.videoType = body.videoType && body.videoType !== 'auto'
        ? body.videoType
        : detectVideoType(vUrl);
    } else if (body.videoType !== undefined) {
      blog.videoType = body.videoType;
    }

    // Cover image handling
    if (req.file) {
      try {
        const uploadRes = await uploadOnCloudinary(req.file.path);
        if (uploadRes?.secure_url || uploadRes?.url) {
          blog.coverImage = uploadRes.secure_url || uploadRes.url;
        } else {
          blog.coverImage = `/uploads/${req.file.filename}`;
        }
      } catch {
        blog.coverImage = `/uploads/${req.file.filename}`;
      }
    } else if (req.files?.coverImage?.[0]) {
      const f = req.files.coverImage[0];
      try {
        const uploadRes = await uploadOnCloudinary(f.path);
        if (uploadRes?.secure_url || uploadRes?.url) {
          blog.coverImage = uploadRes.secure_url || uploadRes.url;
        } else {
          blog.coverImage = `/uploads/${f.filename}`;
        }
      } catch {
        blog.coverImage = `/uploads/${f.filename}`;
      }
    } else if (body.coverImage !== undefined) {
      blog.coverImage = body.coverImage;
    }

    await blog.save();

    return res.status(200).json({
      success: true,
      message: 'Blog post updated successfully',
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

// 6. Delete blog (Admin)
exports.deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// 7. Get distinct categories and stats
exports.getBlogCategories = async (req, res, next) => {
  try {
    const categories = await Blog.distinct('category', { status: 'published' });
    const defaultCategories = [
      'Architecture',
      'Interior Design',
      'Urban Planning',
      'Sustainability',
      'Construction',
      'Tips & Guides',
    ];
    const combined = Array.from(new Set([...defaultCategories, ...categories.filter(Boolean)]));
    return res.status(200).json({ success: true, data: combined });
  } catch (error) {
    next(error);
  }
};
