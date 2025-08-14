import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import { getConversations, getMessages, sendMessage } from './api';
import { socket } from './store';
export default function App(){
const [list, setList] = useState([]);
const [active, setActive] = useState(null);
const [messages, setMessages] = useState([]);
async function refreshList(){ setList(await getConversations()); }
async function openContact(c){ setActive(c); setMessages(await
getMessages(c.wa_id)); }
async function onSend(text){
const name = active?.name;
const { message } = await sendMessage({ wa_id: active.wa_id, text, name });
setMessages(prev => [...prev, message]);
refreshList();
}
useEffect(()=>{ refreshList(); }, []);
useEffect(()=>{
socket.on('message:new', (m)=>{
// If current chat matches, append; else just refresh list
if (active && m.wa_id === active.wa_id) setMessages(prev => [...prev, m]);
refreshList();
});
socket.on('message:status', ()=>{ if (active) openContact(active); });
return ()=>{ socket.off('message:new'); socket.off('message:status'); };
}, [active]);
return (
<div className="app">
<Sidebar list={list} active={active} onSelect={openContact} />
<ChatWindow contact={active} messages={messages} onSend={onSend} />
</div>
);
}