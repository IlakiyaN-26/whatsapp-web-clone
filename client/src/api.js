import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE });
export const getConversations = () => api.get('/api/conversations').then(r=>r.data);
export const getMessages = (wa_id) => api.get(`/api/messages/${wa_id}
`).then(r=>r.data);
export const sendMessage = (payload) => api.post('/api/messages/send',
payload).then(r=>r.data);
export const postWebhook = (payload) => api.post('/webhooks/whatsapp',
payload).then(r=>r.data);