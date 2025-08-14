export default function MessageBubble({ m }) {
    const isMe = m.direction === 'out';
    const time = new Date(m.timestamp).toLocaleString();
    const statusClass = m.status === 'read' ? 'status-read' : m.status ===
    'delivered' ? 'status-delivered' : 'status-sent';
    return (
    <div className={`bubble ${isMe ? 'me' : 'them'}`}>
    <div>{m.text}</div>
    <div className="meta">
    <span>{time}</span>
    {isMe && <span> · <span className={`status-dot ${statusClass}`} /></
    span>}
    </div>
    </div>
    );
    }
    