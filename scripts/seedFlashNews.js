require('dotenv').config({ path: 'e:/Monda-Brother/Architect-Web-Backend/.env' });
const mongoose = require('mongoose');
const FlashNews = require('../models/FlashNews');

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

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/architect-db');
    console.log('Connected to MongoDB');

    for (const item of initialNews) {
      const exists = await FlashNews.findOne({ slug: item.slug });
      if (!exists) {
        await FlashNews.create(item);
        console.log('Created news:', item.title);
      } else {
        await FlashNews.updateOne({ _id: exists._id }, { $set: item });
        console.log('Updated news:', item.title);
      }
    }

    console.log('Flash News seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding news:', err);
    process.exit(1);
  }
}

seed();

