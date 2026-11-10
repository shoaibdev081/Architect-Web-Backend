require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

async function run() {
  const argv = process.argv.slice(2);
  let emailArg, passwordArg;
  argv.forEach(arg => {
    if (arg.startsWith('--email=')) emailArg = arg.split('=')[1];
    if (arg.startsWith('--password=')) passwordArg = arg.split('=')[1];
  });

  const email = process.env.ADMIN_EMAIL || "admin@email.com";
  const password = process.env.ADMIN_PASSWORD || "pass123";

  if (!email || !password) {
    console.error('Provide ADMIN_EMAIL and ADMIN_PASSWORD in env or use --email=... --password=...');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/architect-db").catch(err => {
    console.error('DB connection failed:', err.message);
    process.exit(1);
  });

  const exists = await Admin.findOne({ email: email.toLowerCase() });
  if (exists) {
    console.log('Admin already exists:', exists.email);
    process.exit(0);
  }

  const admin = new Admin({ email: email.toLowerCase(), password, role: 'admin' });
  await admin.save();
  console.log('Admin created:', admin.email);
  process.exit(0);
}

run();
