const router = require('express').Router();
const { extractIncomingMessages, extractStatusUpdates } = require('../utils/normalize');
const { insertIncoming, updateStatus } = require('../services/whatsapp.service');
module.exports = (io) => {
// Receive webhook-like payloads (POSTed from script or UI for demo)
router.post('/whatsapp', async (req, res, next) => {
try {
const payload = req.body;
const incoming = extractIncomingMessages(payload);
const statusUpdates = extractStatusUpdates(payload);
const results = {};
if (incoming.length) results.inserted = (await insertIncoming(incoming,
io)).length;
if (statusUpdates.length) results.status = await
updateStatus(statusUpdates, io);
res.json({ ok: true, results });
} catch (e) { next(e); }
});
return router;
};