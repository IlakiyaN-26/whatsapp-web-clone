import MessageBubble from './MessageBubble';
export default function ChatWindow({ contact, messages, onSend }) {
const [text, setText] = React.useState('');
const ref = React.useRef(null);
React.useEffect(() => { if (ref.current) ref.current.scrollTop =
ref.current.scrollHeight; }, [messages]);
if (!contact) return <div className="chat"/>;
return (
<div className="chat">
<div className="chat-header">
<div>
<div style={{fontWeight:700}}>{contact.name || contact.wa_id}</div>
<div style={{fontSize:12,opacity:.7}}>{contact.wa_id}</div>
</div>
</div>
<div className="messages" ref={ref}>
{messages.map((m) => <MessageBubble key={m._id || m.msg_id} m={m} />)}
</div>
<div className="inputbar">
<input value={text} onChange={(e)=>setText(e.target.value)}
placeholder="Type a message" onKeyDown={(e)=>{ if(e.key==='Enter' &&
text.trim()) { onSend(text); setText(''); } }} />
<button onClick={()=>{ if(text.trim()) { onSend(text); setText(''); } }}
>Send</button>
</div>
</div>
);
}
