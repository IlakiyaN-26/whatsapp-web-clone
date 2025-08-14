/**
 * Usage:
 * 1) Place JSON files in ./payloads (or give a path)
 * 2) node scripts/ingest.js ./payloads
 *
 * Reads payloads, inserts messages, applies status updates.
 */
const fs = require('fs');
const path = require('path');
const connectDB = require('../src/db/conn');
const { extractIncomingMessages, extractStatusUpdates } = require('../src/utils/normalize');
const Message = require('../src/models/Message');
const Contact = require('../src/models/Contact');
function fakeIO() { return { emit: () => {} }; }
const { insertIncoming, updateStatus } = require('../src/services/whatsapp.service');
(async () => {
await connectDB();
const dir = process.argv[2] || path.join(__dirname, 'payloads');
if (!fs.existsSync(dir)) { console.error('No payload folder found:', dir);
process.exit(1); }
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
console.log(` Processing ${files.length} files from`, dir);
const io = fakeIO();
for (const f of files) {
const raw = fs.readFileSync(path.join(dir, f), 'utf8');
const payload = JSON.parse(raw);
const incoming = extractIncomingMessages(payload);
const statuses = extractStatusUpdates(payload);
if (incoming.length) {
const docs = await insertIncoming(incoming, io);
console.log(`+ inserted ${docs.length} from ${f}`);
}
if (statuses.length) {
const res = await updateStatus(statuses, io);
console.log(`~ status updated matched:${res.matched} modified:$
{res.modified} from ${f}`);
}
}
console.log(' Done.');
process.exit(0);
})()