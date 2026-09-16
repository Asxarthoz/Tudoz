import { useState } from 'react';
import { Check, Edit2, Calendar, X, Trash2 } from 'lucide-react';
import { IconPicker } from './IconPicker';

export const EventCard = ({ event, onToggle, onRemove, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState(event);

  const handleSave = () => {
    onUpdate(event.id, editedEvent);
    setIsEditing(false);
  };

  const getEventCountdown = (dateStr) => {
    if (!dateStr) return null;
    const today = new Date();
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const parts = dateStr.split('-');
    if (parts.length !== 3) return null;
    const targetMidnight = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])).getTime();
    const diffDays = Math.round((targetMidnight - todayMidnight) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Hari-H';
    if (diffDays > 0) return `H-${diffDays}`;
    return `H+${Math.abs(diffDays)}`;
  };

  const countdown = getEventCountdown(event.date);
  const isDDay = countdown === 'Hari-H';

  if (isEditing) {
    return (
      <div className="glass-card animate-fade-in" style={{ marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <IconPicker value={editedEvent.icon || ''} onChange={v => setEditedEvent({...editedEvent, icon: v})} />
          <input
            type="text"
            value={editedEvent.title}
            onChange={e => setEditedEvent({...editedEvent, title: e.target.value})}
            style={{ flex: 1 }}
          />
        </div>
        <textarea
          placeholder="Deskripsi event (opsional)"
          value={editedEvent.description || ''}
          onChange={e => setEditedEvent({...editedEvent, description: e.target.value})}
          style={{ width: '100%', minHeight: '60px', resize: 'vertical' }}
        />
        <input type="date" value={editedEvent.date} onChange={e => setEditedEvent({...editedEvent, date: e.target.value})} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="btn-icon danger" onClick={() => onRemove(event.id)} title="Hapus Permanen"><Trash2 size={20}/></button>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button className="btn-icon" onClick={() => setIsEditing(false)} title="Batal"><X size={20}/></button>
            <button className="btn-primary" onClick={handleSave} style={{ padding: '6px 16px', fontSize: '0.88rem' }}>Simpan</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card animate-fade-in" style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '12px', opacity: event.completed ? 0.6 : 1, transition: 'all 0.3s' }}>
      {event.icon && (
        <span style={{ fontSize: '1.5rem', flexShrink: 0, marginTop: '2px' }}>{event.icon}</span>
      )}
      <div style={{ flex: 1, textDecoration: event.completed ? 'line-through' : 'none' }}>
        <h3 style={{ fontSize: '1.05rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {event.title}
        </h3>
        {event.description && <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>{event.description}</p>}
        <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {event.date && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14}/> {event.date}</span>}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {countdown && (
          <span style={{
            fontSize: '0.8rem',
            fontWeight: '700',
            padding: '3px 8px',
            borderRadius: '6px',
            background: isDDay ? 'rgba(16, 185, 129, 0.2)' : 'rgba(139, 92, 246, 0.15)',
            color: isDDay ? 'var(--success-color)' : 'var(--accent-color)',
            border: isDDay ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(139, 92, 246, 0.25)'
          }}>
            {countdown}
          </span>
        )}
        <button className="btn-icon" onClick={() => setIsEditing(true)} title="Edit"><Edit2 size={20}/></button>
        <button className="btn-icon success" onClick={() => onToggle(event.id)} style={{ color: event.completed ? 'var(--success-color)' : 'var(--text-secondary)' }}>
          <Check size={20}/>
        </button>
      </div>
    </div>
  );
};
