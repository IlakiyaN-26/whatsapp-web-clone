const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config/env');

async function connectDB() {
  if (!MONGODB_URI) throw new Error('MONGODB_URI missing');
  await mongoose.connect(MONGODB_URI, {
    autoIndex: true,
  });
  console.log('✅ MongoDB connected');
}

module.exports = connectDB;