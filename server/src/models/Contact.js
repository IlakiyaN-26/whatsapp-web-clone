const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  wa_id: { type: String, unique: true, required: true },
  name: String,
  lastMessageAt: Date,
  lastMessagePreview: String,
}, { timestamps: true });

module.exports = mongoose.model('Contact', ContactSchema, 'contacts');