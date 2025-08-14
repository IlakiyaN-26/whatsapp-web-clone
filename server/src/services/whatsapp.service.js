const Message = require('../models/Message');
const Contact = require('../models/Contact');
async function upsertContact({ wa_id, name, preview, at }) {
const update = {
...(name ? { name } : {}),
lastMessageAt: at,
...(preview ? { lastMessagePreview: preview } : {}),
};
await Contact.updateOne({ wa_id }, { $set: update }, { upsert: true });
}
async function insertIncoming(messages, io) {
if (!messages.length) return [];
const docs = await Message.insertMany(messages, { ordered: false }).catch(() => []);
// Update contacts
await Promise.all(docs.map((d) => upsertContact({
wa_id: d.wa_id,
name: d.name,
preview: d.text,
at: d.timestamp,
})));
// Notify clients
docs.forEach((d) => io.emit('message:new', d));
return docs;
}
async function updateStatus(updates, io) {
const ops = updates.map((u) => ({
updateOne: {
filter: { $or: [ { msg_id: u.id }, { meta_msg_id: u.meta_msg_id } ] },
update: {
$set: { status: u.status, ...(u.timestamp ? { updatedAt:
u.timestamp } : {}) },
},
},
}));
if (!ops.length) return { matched: 0, modified: 0 };
const res = await Message.bulkWrite(ops, { ordered: false });
if (res.modifiedCount) io.emit('message:status', updates);
return { matched: res.matchedCount, modified: res.modifiedCount };
}
async function listConversations() {
// Use contacts for sidebar list
return Contact.find({}).sort({ lastMessageAt: -1 }).lean();
}
async function getMessagesByWaId(wa_id) {
return Message.find({ wa_id }).sort({ timestamp: 1 }).lean();
}
async function sendDemoMessage({ wa_id, text, name }, io) {
const msg = await Message.create({
wa_id,
name,
direction: 'out',
type: 'text',
text,
msg_id: `local-${Date.now()}`,
timestamp: new Date(),
status: 'sent',
});
await upsertContact({ wa_id, name, preview: text, at: msg.timestamp });
io.emit('message:new', msg);
return msg;
}
module.exports = { insertIncoming, updateStatus, listConversations,
getMessagesByWaId, sendDemoMessage };