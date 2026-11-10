require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('../models/Service');

const initialServices = [
  {
    slug: 'architectural-design',
    title: 'Architectural Design',
    desc: "Dream it, we'll design it! From big-picture layouts to the tiniest details, our architectural magic brings your ideas to life with creativity and precision! At Monda Brothers, our architectural design philosophy centers on uniting form, functionality, and timeless aesthetics.",
    desc2: 'From initial feasibility analysis and 3D building information modeling (BIM) to detailed structural engineering and civic permit compliance, our architectural studio guides every phase with uncompromised precision and creative innovation.',
    image: '/images/service-1.jpg',
    features: [
      {
        title: '3D Architectural Visualization',
        desc: 'Photorealistic 3D exterior renderings and immersive virtual walkthroughs to experience your space before breaking ground.'
      },
      {
        title: 'Structural & Elevation Planning',
        desc: 'Precision structural calculations, modern facades, and durable weather-resistant exterior finishes.'
      },
      {
        title: 'Permits & Municipal Approvals',
        desc: 'Comprehensive civic zoning compliance, regulatory authority submissions, and certified documentation.'
      },
      {
        title: 'Sustainable & Passive Strategies',
        desc: 'Passive solar orientation, cross-ventilation optimization, and energy-efficient building envelopes.'
      }
    ],
    points: [
      'Comprehensive site surveying and zoning feasibility analysis',
      'Schematic conceptual designs and bespoke layout planning',
      'Detailed structural, foundation, and MEP engineering blueprints',
      'Modern exterior facade treatments and sustainable materials selection',
      'Advanced photorealistic 3D architectural rendering & VR tours',
      'Full municipal regulatory compliance and permit approval assistance'
    ],
    faqs: [
      {
        q: 'What types of architectural projects do you handle?',
        a: 'We specialize in bespoke luxury villas, contemporary bungalows, corporate office headquarters, commercial shopping plazas, and multi-story urban developments.'
      },
      {
        q: 'Do you assist with civic and municipal approvals?',
        a: 'Yes! Our team prepares complete architectural blueprints, MEP coordination drawings, and structural stability certificates required for municipal and development authority approvals (e.g., DHA, Cantt, Municipal Corporations).'
      },
      {
        q: 'How early in our project should we involve the architectural team?',
        a: 'We recommend involving us before land acquisition or during early site evaluation so we can assess soil conditions, solar orientation, and local zoning bylaws to maximize project potential.'
      },
      {
        q: 'Can you provide 3D exterior walk-throughs before construction?',
        a: 'Yes, all our architectural design packages include comprehensive 3D photorealistic renderings and virtual walkthroughs so you can visualize every angle before construction starts.'
      }
    ]
  },
  {
    slug: 'interior-design-planning',
    title: 'Interior Design & Planning',
    desc: 'Make your space shine! Our team creates inviting, beautiful interiors that reflect your style and make every room a favorite place to be. We believe interior spaces should evoke warmth, sophistication, and harmonious flow.',
    desc2: 'Every detail—from curated mood boards, custom-built millwork, and layered ambient lighting to imported marble finishes and artisanal upholstery—is composed to reflect your personal narrative and operational needs.',
    image: '/images/service-2.jpg',
    features: [
      {
        title: 'Space Planning & Layout Optimization',
        desc: 'Ergonomic circulation analysis, room zoning, and seamless multifunctional residential layouts.'
      },
      {
        title: 'Custom Millwork & Cabinetry',
        desc: 'Handcrafted bespoke wardrobes, executive desks, designer kitchens, and architectural media walls.'
      },
      {
        title: 'Layered Architectural Lighting',
        desc: 'Dynamic ambient, task, and accent lighting layouts designed to accentuate textures and enhance mood.'
      },
      {
        title: 'Curated Material & Color Palettes',
        desc: 'Harmonious combinations of natural woods, honed stone, textured wall coverings, and bespoke furnishings.'
      }
    ],
    points: [
      'Tailored conceptual design mood boards and 3D interior walkthroughs',
      'Custom luxury kitchen and designer bathroom engineering',
      'Architectural false ceiling profiles and hidden LED cove lighting',
      'Curated designer furniture, textiles, rugs, and window treatments',
      'Acoustic tranquility engineering and custom wall paneling',
      'Turnkey on-site interior installation, styling, and supervision'
    ],
    faqs: [
      {
        q: 'Can you design custom furniture specifically for my rooms?',
        a: 'Absolutely. We design and fabricate bespoke cabinetry, beds, dining sets, and entertainment units tailored to the exact dimensions and aesthetic style of your home.'
      },
      {
        q: 'Do you work with existing structures or only new builds?',
        a: 'We work on both complete new construction fit-outs and full-scale interior renovations, breathing modern luxury and fresh functionality into existing spaces.'
      },
      {
        q: 'What is your typical interior design process?',
        a: 'Our process begins with an in-depth consultation and mood board creation, followed by 3D rendering, detailed technical drawings, material selection, and on-site turnkey installation.'
      },
      {
        q: 'Can we select our own materials and finishes?',
        a: 'Yes! We take you through physical material samples—including marble, tiles, veneers, and fabric swatches—guiding your choices to maintain cohesive luxury throughout.'
      }
    ]
  },
  {
    slug: 'consulting-services',
    title: 'Consulting Services',
    desc: 'Consider us your design whisperers! We provide expert advice to help your project sparkle with creativity, efficiency, and spot-on solutions. Navigating complex architectural decisions, material selections, and budget allocations can be daunting.',
    desc2: 'Whether evaluating land potential, auditing third-party contractor proposals, or diagnosing existing structural concerns, our senior architects and consultants offer objective, data-backed guidance at every stage.',
    image: '/images/service-3.jpg',
    features: [
      {
        title: 'Pre-Construction Feasibility Studies',
        desc: 'Detailed analysis of site constraints, return on investment (ROI), zoning regulations, and structural viability.'
      },
      {
        title: 'Value Engineering & Cost Optimization',
        desc: 'Intelligent material substitutions and design refinements that reduce construction expenditure without compromising aesthetic beauty.'
      },
      {
        title: 'Contractor Tender Review & Vetting',
        desc: 'Thorough examination of contractor bids, bill of quantities (BOQs), and contract agreements to prevent scope creep.'
      },
      {
        title: 'Sustainability & Energy Audits',
        desc: 'Expert advisory on passive energy design, solar integrations, and thermal insulation to lower long-term utility overhead.'
      }
    ],
    points: [
      'Unbiased technical assessment of architectural and structural drawings',
      'Accurate bill of quantities (BOQ) and cost estimation auditing',
      'Regulatory compliance checks and risk mitigation strategies',
      'Material durability evaluations and supplier vetting',
      'Structural health diagnostics and renovation feasibility roadmaps',
      'Vendor contract negotiations and milestone structuring'
    ],
    faqs: [
      {
        q: 'How does design consulting save money on construction?',
        a: 'By reviewing drawings and BOQs before construction begins, we identify inefficient structural choices, prevent costly on-site change orders, and negotiate competitive contractor bids.'
      },
      {
        q: 'Can we hire you for consulting if another architect created our initial plans?',
        a: 'Yes! Many clients engage our team for peer reviews, second opinions, and value engineering on existing drawings to verify safety, optimize layout, and cut construction costs.'
      },
      {
        q: 'Do you offer on-site consultation visits?',
        a: 'Yes, we conduct comprehensive on-site inspections to assess ground conditions, existing foundations, views, and structural orientation.'
      },
      {
        q: 'What deliverables do we receive from a consulting session?',
        a: 'You receive an executive audit report detailing layout optimizations, structural observations, BOQ cost benchmarks, and a recommended action roadmap.'
      }
    ]
  },
  {
    slug: 'project-management',
    title: 'Project Management',
    desc: 'We handle the hustle! From start to finish, we keep your project on track, on budget, and stress-free – so you can sit back and watch the magic happen. Successful construction requires meticulous coordination and unwavering schedule discipline.',
    desc2: 'We act as your dedicated owner representative on site—managing subcontractors, testing concrete and structural steel, tracking procurement timelines, and upholding the highest architectural standards.',
    image: '/images/service-4.jpg',
    features: [
      {
        title: 'Turnkey Construction Supervision',
        desc: 'Daily on-site management ensuring the project is executed precisely according to engineering blueprints.'
      },
      {
        title: 'Schedule & Milestone Governance',
        desc: 'Agile project scheduling and proactive risk management to ensure timely completion with zero unnecessary delays.'
      },
      {
        title: 'Rigorous Quality Assurance (QA/QC)',
        desc: 'Strict on-site testing of structural materials, concrete cube tests, MEP installations, and finishes.'
      },
      {
        title: 'Budget Stewardship & Milestone Payouts',
        desc: 'Transparent financial auditing, bill verification, and milestone-based subcontractor disbursements.'
      }
    ],
    points: [
      'Comprehensive project execution masterplan and timeline scheduling',
      'Daily on-site supervision and weekly client progress reports with photos',
      'Procurement management and supply chain logistics coordination',
      'Strict site safety, labor protocols, and quality standards enforcement',
      'Subcontractor accountability, conflict resolution, and quality vetting',
      'Comprehensive final punch-list auditing and formal turnkey project handover'
    ],
    faqs: [
      {
        q: 'How do you keep clients updated on site progress?',
        a: 'We provide weekly detailed progress reports accompanied by high-resolution site photography, drone footage, and updated milestone timeline charts.'
      },
      {
        q: 'How are contractor payments handled during project management?',
        a: 'Payments are tied strictly to physical verification of completed milestones. No contractor bill is approved without our project engineer verifying the work quality and quantity.'
      },
      {
        q: 'What happens if delays or material shortages occur?',
        a: 'Our agile management approach establishes buffer timelines and alternative certified supply channels to resolve disruptions before they impact your completion date.'
      },
      {
        q: 'Do you manage both residential and commercial construction?',
        a: 'Yes, our engineers and project managers have extensive experience overseeing luxury private residences, commercial buildings, corporate fit-outs, and mixed-use developments.'
      }
    ]
  }
];

async function seedServices() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/architect-db');
    console.log('Connected to MongoDB');

    for (const s of initialServices) {
      const exists = await Service.findOne({ slug: s.slug });
      if (!exists) {
        await Service.create(s);
        console.log(`Created Service: ${s.title}`);
      } else {
        await Service.updateOne({ slug: s.slug }, { $set: s });
        console.log(`Updated Service: ${s.title}`);
      }
    }

    console.log('Services seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding services:', err);
    process.exit(1);
  }
}

seedServices();

