const mongoose = require('mongoose');

const HeroSlideSchema = new mongoose.Schema({
  topHeading: { type: String, default: '' },
  bottomHeading: { type: String, default: '' },
  bgImage: { type: String, default: '' },
  thumbImage: { type: String, default: '' },
  statNumber: { type: String, default: '' },
  statText: { type: String, default: '' },
});

const HomePageSchema = new mongoose.Schema({
  hero: {
    badge: { type: String, default: 'Fast and Reliable' },
    description: {
      type: String,
      default: "Whether it's your home, office, or a commercial project, we are always dedicated to bringing your vision to life."
    },
    buttonText: { type: String, default: 'Take Counsel' },
    buttonLink: { type: String, default: '/contact' },
    features: {
      type: [String],
      default: ['Tech Specifications', 'Design Project', '3D Visualization']
    },
    slides: {
      type: [HeroSlideSchema],
      default: [
        {
          topHeading: 'Find Your Inspired',
          bottomHeading: 'Interior Design',
          bgImage: '/images/hero-bg.webp',
          thumbImage: '/images/hero-bg.webp',
          statNumber: '360 +',
          statText: 'Successful Projects And Counting'
        },
        {
          topHeading: 'Build Your Dream',
          bottomHeading: 'Spaces',
          bgImage: '/images/hero-bg2.webp',
          thumbImage: '/images/hero-bg2.webp',
          statNumber: '260 +',
          statText: 'Completed Designs And Projects'
        },
        {
          topHeading: 'Design For Life',
          bottomHeading: 'Excellence',
          bgImage: '/images/hero-bg-3.webp',
          thumbImage: '/images/hero-bg-3.webp',
          statNumber: '400 +',
          statText: 'Satisfied Clients Worldwide'
        }
      ]
    }
  },
  intro: {
    badge: { type: String, default: 'WHO WE ARE' },
    titlePrefix: { type: String, default: 'Experience ' },
    titleHighlight: { type: String, default: 'the Art of Interior' },
    titleSuffix: { type: String, default: 'Design' },
    description: {
      type: String,
      default: 'We specialize in transforming visions into reality. Explore our portfolio of innovative architectural and interior design projects crafted with precision.'
    },
    bgImage: { type: String, default: '/images/intro-bg.avif' }
  },
  history: {
    badge: { type: String, default: 'Started In 1991' },
    title1: { type: String, default: 'Where Spaces' },
    title2: { type: String, default: 'Inspire, and' },
    titleHighlight: { type: String, default: 'Design' },
    titleBottom: { type: String, default: 'Comes Alive' },
    highlights: {
      type: [String],
      default: [
        'Latest Technologies',
        '5 Years Warranty',
        'High-Quality Designs',
        'Residential Design'
      ]
    },
    description: {
      type: String,
      default: "Whether it's your home, office, or a commercial project, we are always dedicated to bringing your vision to life.Our numbers speak better than words:"
    },
    buttonText: { type: String, default: 'More About Us' },
    buttonLink: { type: String, default: '/about' },
    bgImage: { type: String, default: '/images/history-bg.png' },
    sideImage: { type: String, default: '/images/history-side.jpg' }
  },
  videoShowcase: {
    title: { type: String, default: 'Unlock Your Dream Home Today!' },
    subtitle: {
      type: String,
      default: 'We encourage clients to actively participate in discussions, share their ideas, preferences, and feedback.'
    },
    bgImage: { type: String, default: '/images/gallery-6.jpg' },
    videoUrl: { type: String, default: '/videos/Sample.mp4' }
  },
  panorama: {
    badge: { type: String, default: '360-DEGREE PANORAMAS' },
    titleNormal: { type: String, default: 'Create An Even ' },
    titleHighlight: { type: String, default: 'Greater Experience' },
    image: { type: String, default: '/images/gallery-1.jpg' }
  },
  stats: {
    type: [
      {
        number: { type: String, default: '' },
        label: { type: String, default: '' },
        description: { type: String, default: '' }
      }
    ],
    default: [
      {
        number: '30+',
        label: 'Years Experience',
        description: 'Improving homes with expert craftsmanship for years'
      },
      {
        number: '190+',
        label: 'Projects Completed',
        description: 'Over 250 successful projects delivered with quality and care'
      },
      {
        number: '260+',
        label: 'Skilled Tradespeople',
        description: 'Our team of 30 experts ensures top-quality results'
      },
      {
        number: '328+',
        label: 'Client Satisfaction',
        description: 'All of our clients are satisfied with our work and service'
      }
    ]
  },
  servicesOverview: {
    badge: { type: String, default: 'OUR SERVICES' },
    titlePrefix: { type: String, default: 'Trusted expert in ' },
    titleHighlight: { type: String, default: 'architectural design and innovation.' },
    description: {
      type: String,
      default: 'We specialize in transforming visions into reality. Explore our portfolio of innovative architectural and interior design projects crafted with precision.'
    },
    image: { type: String, default: '/images/ser-img-3.png' },
    skills: {
      type: [
        {
          name: { type: String, default: '' },
          percentage: { type: Number, default: 80 }
        }
      ],
      default: [
        { name: 'Interior Design', percentage: 85 },
        { name: '3D Modeling', percentage: 95 },
        { name: '2D Planning', percentage: 65 }
      ]
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('HomePage', HomePageSchema);
