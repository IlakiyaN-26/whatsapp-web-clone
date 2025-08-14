const router = require('express').Router();
const { listConversations, getMessagesByWaId, sendDemoMessage } = require('../services/whatsapp.service');
module.exports = (io) => {
router.get('/conversations', async (req, res, next) => {
try { res.json(await listConversations()); } catch (e) { next(e); }
});
router.get('/messages/:wa_id', async (req, res, next) => {
try { res.json(await getMessagesByWaId(req.params.wa_id)); } catch (e) {
next(e); }
});
router.post('/messages/send', async (req, res, next) => {
try {
const { wa_id, text, name } = req.body;
if (!wa_id || !text) return res.status(400).json({ ok: false, error:
'wa_id and text required' });
const msg = await sendDemoMessage({ wa_id, text, name }, io);
res.json({ ok: true, message: msg });
} catch (e) { next(e); }
});
// Optional: update status directly
router.patch('/messages/status', async (req, res, next) => {
try {
const { updates } = req.body; // [{ id/meta_msg_id, status }]
const { updateStatus } = require('../services/whatsapp.service');
const result = await updateStatus(updates, io);
res.json({ ok: true, result });
} catch (e) { next(e); }
});
return router;
};
