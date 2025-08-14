export default function Sidebar({ list, active, onSelect }) {
    return (
    <div className="sidebar">
    <div className="header"><strong>Chats</strong></div>
    <div className="chatlist">
    {list.map((c) => (
    <div key={c.wa_id} className="chatitem" onClick={() => onSelect(c)}>
    <div>
    <div className="name">{c.name || c.wa_id}</div>
    <div className="preview">{c.lastMessagePreview || 'No messagesyet'}</div>
    </div>
    </div>
    ))}
    </div>
    </div>
    );
    }
    