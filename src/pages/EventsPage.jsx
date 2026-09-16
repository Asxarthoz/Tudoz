import { useState } from 'react';
import { useTodo } from '../context/TodoContext';
import { EventCard } from '../components/EventCard';
import { IconPicker } from '../components/IconPicker';
import { Plus } from 'lucide-react';

export const EventsPage = () => {
  const { events, addEvent, toggleEvent, removeEvent, updateEvent } = useTodo();
  const [isAdding, setIsAdding] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '', icon: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newEvent.title) return;
    addEvent(newEvent);
    setNewEvent({ title: '', description: '', date: '', icon: '' });
    setIsAdding(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Event Mendatang</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Agenda kegiatan yang akan Anda ikuti.</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setIsAdding(!isAdding)}>
          <Plus size={20} /> Tambah Event
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="glass" style={{ padding: '20px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <IconPicker value={newEvent.icon} onChange={v => setNewEvent({...newEvent, icon: v})} />
            <input
              style={{ flex: 1 }}
              type="text"
              placeholder="Nama event..."
              value={newEvent.title}
              onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
              autoFocus
            />
          </div>
          <textarea
            placeholder="Deskripsi event (opsional)"
            value={newEvent.description}
            onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
            style={{ minHeight: '60px', resize: 'vertical' }}
          />
          <input
            type="date"
            value={newEvent.date}
            onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
          />
          <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-end' }}>Simpan</button>
        </form>
      )}

      <div>
        {events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            Belum ada event. Klik "Tambah Event" untuk memulai.
          </div>
        ) : (
          events.map(event => (
            <EventCard key={event.id} event={event} onToggle={toggleEvent} onRemove={removeEvent} onUpdate={updateEvent} />
          ))
        )}
      </div>
    </div>
  );
};
