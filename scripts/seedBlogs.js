require('dotenv').config();
const mongoose = require('mongoose');
const Blog = require('../models/Blog');

const sampleBlogs = [
  {
    title: 'Modern Architectural Principles in Luxury Living',
    slug: 'modern-architectural-principles-in-luxury-living',
    excerpt: 'Explore how contemporary design bridges structural aesthetics and sustainable functionality in modern urban residences.',
    content: `Architecture in the 21st century is undergoing a revolutionary transformation. By synthesizing minimalist forms with functional organic textures, modern architects are redefining what luxury living looks and feels like.

### Harmonic Structural Flow
Every room should communicate with the adjacent space without compromising privacy or energy dynamics. The integration of high-performance glass facades allows natural light to bathe the living areas, radically cutting lighting energy consumption.

### Passive Thermal Strategies
Orientation, cantilevered overhangs, and cross-ventilation are no longer afterthought enhancements—they form the core foundation of our design philosophy at Monda Brothers.

Watch the complete design breakdown in the accompanying walkthrough video below.`,
    author: 'Monda Brothers',
    category: 'Architecture',
    tags: ['Architecture', 'Luxury Living', 'Modern Design', 'Urban'],
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    videoType: 'youtube',
    featured: true,
    status: 'published',
    readTime: '4 min read',
  },
  {
    title: 'Transformative Interior Design Concepts for 2026',
    slug: 'transformative-interior-design-concepts-2026',
    excerpt: 'Discover our curated palette of earth-tones, artisan woodwork, and biophilic interior spaces crafted for tranquility.',
    content: `Interior spaces should tell a story of comfort, elegance, and purpose. In this feature, we delve into how thoughtful materials, bespoke acoustic panels, and warm camel accents elevate everyday routines.

### Key Highlights
- **Biophilic Harmony:** Incorporating living botanical partitions and ambient skylights.
- **Natural Finishes:** Honed travertine, brushed brass accents, and rift-sawn oak cabinetry.
- **Lighting Dynamics:** Multi-tiered circadian lighting systems that adjust hue and intensity automatically throughout the day.

Experience the behind-the-scenes walkthrough and craftsmanship video below.`,
    author: 'Monda Brothers Design Studio',
    category: 'Interior Design',
    tags: ['Interior Design', 'Biophilic', 'Aesthetics', 'Home Styling'],
    coverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://www.facebook.com/facebook/videos/10153231379946729/',
    videoType: 'facebook',
    featured: true,
    status: 'published',
    readTime: '3 min read',
  },
  {
    title: 'Sustainable Material Innovation in Construction',
    slug: 'sustainable-material-innovation-in-construction',
    excerpt: 'How carbon-negative concrete, engineered timber, and smart thermal envelopes are setting new benchmarks for our future projects.',
    content: `Sustainable architecture is not just a trend—it is a responsibility. At Monda Brothers, our commitment to future generations drives us to push the boundaries of eco-conscious engineering.

### Cross-Laminated Timber (CLT)
CLT provides exceptional structural rigidity while sequestering atmospheric carbon for the lifetime of the structure.

### Smart Envelopes
Self-shading facade panels react to ambient solar exposure, drastically reducing HVAC requirements in extreme summer climates.`,
    author: 'Monda Brothers Engineering Team',
    category: 'Sustainability',
    tags: ['Sustainability', 'Construction', 'Green Building', 'Engineering'],
    coverImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=7wtfhZwyrcc',
    videoType: 'youtube',
    featured: false,
    status: 'published',
    readTime: '5 min read',
  },
];

async function seed() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('MONGO_URI missing in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    for (const blog of sampleBlogs) {
      const exists = await Blog.findOne({ slug: blog.slug });
      if (!exists) {
        await Blog.create(blog);
        console.log(`Created blog: ${blog.title}`);
      } else {
        console.log(`Blog already exists: ${blog.slug}`);
      }
    }

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
