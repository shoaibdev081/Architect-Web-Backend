require('dotenv').config();
const mongoose = require('mongoose');
const Gallery = require('../models/Gallery');

const initialGalleryItems = [
  {
    title: 'Modern Minimalist Living Room',
    category: 'Living Room',
    mainImage: '/images/gallery-1.jpg',
    otherImages: [
      '/images/gallery-3.jpg',
      '/images/gallery-4.jpg',
      '/images/gallery-11.jpg'
    ]
  },
  {
    title: 'Luxury Executive Kitchen Suite',
    category: 'Kitchen',
    mainImage: '/images/gallery-6.jpg',
    otherImages: [
      '/images/gallery-7.jpg',
      '/images/gallery-9.jpg',
      '/images/gallery-3.jpg'
    ]
  },
  {
    title: 'Contemporary Master Bedroom Sanctuary',
    category: 'Bedroom',
    mainImage: '/images/gallery-11.jpg',
    otherImages: [
      '/images/gallery-12.jpg',
      '/images/gallery-7.jpg',
      '/images/gallery-1.jpg'
    ]
  },
  {
    title: 'Spa-Inspired Marble Bathroom Suite',
    category: 'Bathroom',
    mainImage: '/images/gallery-9.jpg',
    otherImages: [
      '/images/gallery-4.jpg',
      '/images/gallery-6.jpg',
      '/images/gallery-12.jpg'
    ]
  }
];

async function seedGallery() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/architect-db');
    console.log('Connected to MongoDB');

    for (const item of initialGalleryItems) {
      const exists = await Gallery.findOne({ title: item.title });
      if (!exists) {
        await Gallery.create(item);
        console.log(`Created Gallery Item: ${item.title}`);
      } else {
        await Gallery.updateOne({ _id: exists._id }, { $set: item });
        console.log(`Updated Gallery Item: ${item.title}`);
      }
    }

    console.log('Gallery seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding gallery:', err);
    process.exit(1);
  }
}

seedGallery();

