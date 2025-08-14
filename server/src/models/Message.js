const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  wa_id: { type: String, index: true, required: true }, // user id (phone)
  name: String,                                         // contact name if known
  direction: { type: String, enum: ['in', 'out'], required: true },
  type: { type: String, default: 'text' },
  text: String,
  msg_id: { type: String, index: true },                // "id" from webhook (wamid...)
  meta_msg_id: { type: String, index: true },           // if status payload uses meta id
  timestamp: { type: Date, required: true },
  status: { type: String, enum: ['queued','sent','delivered','read','failed'], default: 'sent' },
  phone_number_id: String,                              // business phone
}, { timestamps: true });

MessageSchema.index({ wa_id: 1, timestamp: 1 });
module.exports = mongoose.model('Message', MessageSchema, 'processed_messages');