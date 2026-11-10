require('dotenv').config();
const mongoose = require('mongoose');
const MainArea = require('../models/MainArea');

const initialAreas = [
  {
    name: 'Wapda Town Phase # 1, 2',
    slug: 'wapda-town-phase-1-2',
    category: 'Residential Society',
    tagline: 'Phase # 1, 2',
    badge: 'Prime Society',
    description: 'Specialized architectural designs, modern elevations, and luxury turnkey villa construction in Wapda Town Phase 1 & 2.',
    city: 'Multan',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    features: ['Luxury Villas', 'Modern Elevations', 'Turnkey Construction', 'Interior Design'],
    order: 1,
    isActive: true,
  },
  {
    name: 'PIA Housing Society',
    slug: 'pia-housing-society',
    category: 'Residential Society',
    tagline: 'Prime Residential Society',
    badge: 'Popular',
    description: 'Custom bespoke bungalows, modern structural layouts, and contemporary interior styling across PIA Housing Society.',
    city: 'Multan',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    features: ['Custom Bungalows', 'Structural Engineering', 'Interior Decor', 'Space Optimization'],
    order: 2,
    isActive: true,
  },
  {
    name: 'Sahar Villas',
    slug: 'sahar-villas',
    category: 'Residential Society',
    tagline: 'Exclusive Villa Community',
    badge: 'Luxury Living',
    description: 'Tailored villa architecture incorporating energy-efficient passive strategies and luxury finishes in Sahar Villas.',
    city: 'Multan',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
    features: ['Bespoke Villa Elevation', 'Sustainable Architecture', 'Landscape Design', 'Luxury Finishes'],
    order: 3,
    isActive: true,
  },
  {
    name: 'Royal Orchard',
    slug: 'royal-orchard',
    category: 'Residential Society',
    tagline: 'Modern Master-Planned Community',
    badge: 'High Demand',
    description: 'High-end architectural designs, modern elevations, and smart home automation projects in Royal Orchard Multan.',
    city: 'Multan',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    features: ['Contemporary Facades', 'Smart Homes', 'Interior Architecture', 'Turnkey Build'],
    order: 4,
    isActive: true,
  },
  {
    name: 'Buch Villas',
    slug: 'buch-villas',
    category: 'Residential Society',
    tagline: 'Executive Living Standards',
    badge: 'Executive',
    description: 'Premier architectural planning and high-end construction management for executive residences in Buch Villas.',
    city: 'Multan',
    image: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=800&q=80',
    features: ['Premium Architecture', 'Turnkey Construction', 'Luxury Interiors', '3D Walkthroughs'],
    order: 5,
    isActive: true,
  },
  {
    name: 'Citi Housing Society',
    slug: 'citi-housing-society',
    category: 'Residential Society',
    tagline: 'Gold Standard Urban Community',
    badge: 'Gold Standard',
    description: 'Iconic modern house designs, commercial plazas, and comprehensive interior execution in Citi Housing Multan.',
    city: 'Multan',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    features: ['Modern 1 Kanal & 10 Marla Homes', 'Commercial Plazas', 'Interior Aesthetics', 'Approval Support'],
    order: 6,
    isActive: true,
  },
  {
    name: 'DHA Multan',
    slug: 'dha-multan',
    category: 'Residential Society',
    tagline: "Multan's Premier Flagship Development",
    badge: 'Flagship Hub',
    description: "Extensive architectural experience delivering luxury 1 & 2 Kanal mansions, modern villas, and commercial ventures conforming to DHA's highest building bye-laws.",
    city: 'Multan',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
    features: ['Ultra-Modern Villas', 'DHA Approval Consultancy', 'Commercial Plazas', 'Luxury Mansions'],
    order: 7,
    isActive: true,
  },
  {
    name: 'Commercial High Rise Buildings',
    slug: 'commercial-high-rise-buildings',
    category: 'High-Rise Buildings',
    tagline: '7 Story Max Commercial Towers',
    badge: '7 Story Max',
    description: 'Specialized structural engineering and architectural design for commercial high-rise towers up to 7 stories with earthquake-resistant framing and modern glass facades.',
    city: 'Multan',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    features: ['7-Story High-Rise Design', 'Structural Rigidity Engineering', 'Facade Glazing', 'Commercial Code Approvals'],
    order: 8,
    isActive: true,
  },
  {
    name: 'Dream Garden',
    slug: 'dream-garden',
    category: 'Residential Society',
    tagline: 'Serene Gated Living',
    badge: 'Residential',
    description: 'Bespoke family residences combining smart space utilization, open courtyards, and clean modern elevations in Dream Garden.',
    city: 'Multan',
    image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=800&q=80',
    features: ['Family Homes', 'Modern Elevations', 'Interior Planning', 'Quality Craftsmanship'],
    order: 9,
    isActive: true,
  },
  {
    name: 'MPS Road Commercial',
    slug: 'mps-road-commercial',
    category: 'Commercial Hub',
    tagline: 'Fast-Paced Commercial Corridor',
    badge: 'Commercial Hub',
    description: 'Contemporary commercial plazas, retail showrooms, and multi-tenant office spaces along the high-traffic MPS Road corridor.',
    city: 'Multan',
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
    features: ['Retail Showrooms', 'Corporate Offices', 'Contemporary Plazas', 'Basement Parking Design'],
    order: 10,
    isActive: true,
  },
  {
    name: 'Northern Bypass (Multan Avenue Road)',
    slug: 'northern-bypass-multan-avenue-road',
    category: 'Road & Avenue',
    tagline: 'Multan Avenue Road Corridor',
    badge: 'Major Arterial',
    description: 'Road-front commercial hubs, expansive farmhouses, and modern mixed-use developments along Northern Bypass / Multan Avenue Road.',
    city: 'Multan',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=800&q=80',
    features: ['Strategic Commercial Fronts', 'Farmhouse Architecture', 'Mixed-Use Developments', 'Highway Visibility'],
    order: 11,
    isActive: true,
  },
  {
    name: 'Bosan Road Commercial',
    slug: 'bosan-road-commercial',
    category: 'Commercial Hub',
    tagline: "Multan's Main Commercial Spine",
    badge: 'Prime Commercial',
    description: 'Flagship commercial centers, corporate headquarters, and high-visibility retail outlets along Multan’s prestigious Bosan Road.',
    city: 'Multan',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    features: ['Flagship Commercial Centers', 'High-Footfall Showrooms', 'Corporate Offices', 'Facade Lighting'],
    order: 12,
    isActive: true,
  },
  {
    name: 'Mattital Road',
    slug: 'mattital-road',
    category: 'Road & Avenue',
    tagline: 'Expanding Urban Growth Sector',
    badge: 'Fast Growing',
    description: 'Forward-looking residential layouts and commercial frontage designs situated along the rapidly expanding Mattital Road.',
    city: 'Multan',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
    features: ['Emerging Developments', 'Commercial Frontage', 'Landscape Planning', 'Modern Construction'],
    order: 13,
    isActive: true,
  },
  {
    name: 'Adam Housing Society',
    slug: 'adam-housing-society',
    category: 'Residential Society',
    tagline: 'Affordable Modern Living',
    badge: 'Residential',
    description: 'Smart 5 and 10 Marla residence designs prioritizing space efficiency, natural illumination, and premium modern aesthetics in Adam Housing.',
    city: 'Multan',
    image: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=800&q=80',
    features: ['5 & 10 Marla Homes', 'Cost-Effective Engineering', 'Space Optimization', 'Turnkey Completion'],
    order: 14,
    isActive: true,
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

    for (const area of initialAreas) {
      const exists = await MainArea.findOne({ slug: area.slug });
      if (!exists) {
        await MainArea.create(area);
        console.log(`Created MainArea: ${area.name}`);
      } else {
        await MainArea.updateOne({ slug: area.slug }, { $set: area });
        console.log(`Updated MainArea: ${area.name}`);
      }
    }

    console.log('Main areas seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding main areas:', err);
    process.exit(1);
  }
}

seed();
