require('dotenv').config();
const mongoose = require('mongoose');
const ClientReview = require('../models/ClientReview');

const initialReviews = [
  {
    name: 'Sarah Jenkins',
    role: 'CEO, Horizon Ventures',
    feedback: 'Monda Brothers completely revolutionized our corporate headquarters. Their attention to spatial harmony, lighting, and premium finishes exceeded every expectation. An absolute pleasure to partner with.',
    rating: 5.0,
    image: '/images/team-3.jpg'
  },
  {
    name: 'David Sterling',
    role: 'Managing Director, Sterling Capital',
    feedback: 'From initial architectural sketches to the final turnkey handover, their team exhibited unparalleled professionalism and creativity. Our luxury villa project was delivered ahead of schedule and within budget.',
    rating: 5.0,
    image: '/images/team-4.jpg'
  },
  {
    name: 'Elena Rostova',
    role: 'Lead Architect & Designer',
    feedback: 'As an architect myself, I hold extremely high standards for design detailing and material integrity. Monda Brothers delivered immaculate millwork and structural craftsmanship that truly impressed me.',
    rating: 4.9,
    image: '/images/team-5.jpg'
  },
  {
    name: 'Michael Chen',
    role: 'Private Estate Owner',
    feedback: 'The interior layout and modern aesthetics created for our residence are breathtaking. They listened carefully to all our family needs and translated them into an inspiring living sanctuary.',
    rating: 5.0,
    image: '/images/team-6.jpg'
  }
];

async function seedReviews() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/architect-db');
    console.log('Connected to MongoDB');

    for (const item of initialReviews) {
      const exists = await ClientReview.findOne({ name: item.name });
      if (!exists) {
        await ClientReview.create(item);
        console.log(`Created Client Review: ${item.name}`);
      } else {
        await ClientReview.updateOne({ _id: exists._id }, { $set: item });
        console.log(`Updated Client Review: ${item.name}`);
      }
    }

    console.log('Client reviews seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding reviews:', err);
    process.exit(1);
  }
}

seedReviews();

