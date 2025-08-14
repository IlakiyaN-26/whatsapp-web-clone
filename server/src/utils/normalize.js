// Helpers to normalize WhatsApp payloads (messages + status)
function toDate(ts) {
    // Payload timestamp is usually seconds. If too large, treat as ms.
    const n = Number(ts);
    return new Date(n < 2e10 ? n * 1000 : n);
    }
    function pick(obj, path, def = undefined) {
    try {
    return path.split('.').reduce((a, k) => (a ? a[k] : undefined), obj) ?? def;
    } catch {
    return def;
    }
    }
    // Extract incoming text messages from the webhook shape given in the brief
    function extractIncomingMessages(payload) {
    const entries = pick(payload, 'metaData.entry', []);
    const out = [];
    entries.forEach((entry) => {
    (entry.changes || []).forEach((ch) => {
    const value = ch.value || {};
    const contacts = value.contacts || [];
    const messages = value.messages || [];
    const metadata = value.metadata || {};
    const name = pick(contacts[0], 'profile.name');
    const wa_id = pick(contacts[0], 'wa_id');
    messages.forEach((m) => {
    if (m.type === 'text') {
    out.push({
    direction: 'in',
    wa_id,
    name,
    type: 'text',
    text: pick(m, 'text.body', ''),
    msg_id: m.id,
    timestamp: toDate(m.timestamp),
    status: 'delivered',
    phone_number_id: metadata.phone_number_id,
});
}
});
});
});
return out;
}
// Extract status updates (sent/delivered/read) – simple, adaptable
function extractStatusUpdates(payload) {
// Example shape:
// { metaData.entry[].changes[].value.statuses[]: [{ id/meta_msg_id, status:
// 'delivered'|'read'|'sent' }] }
const entries = pick(payload, 'metaData.entry', []);
const out = [];
entries.forEach((entry) => {
(entry.changes || []).forEach((ch) => {
const value = ch.value || {};
const statuses = value.statuses || [];
statuses.forEach((s) => {
out.push({
id: s.id, // may be original message id (wamid...)
meta_msg_id: s.meta_msg_id, // sometimes present
status: s.status, // 'sent' | 'delivered' | 'read' | 'failed'
timestamp: s.timestamp ? toDate(s.timestamp) : undefined,
});
});
});
});
return out;
}

module.exports = { extractIncomingMessages, extractStatusUpdates, toDate,
pick };