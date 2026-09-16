import { useState } from 'react';
import { useTodo } from '../context/TodoContext';
import { IconPicker } from '../components/IconPicker';
import { Plus, Edit2, Trash2, Save, X, Check, Repeat } from 'lucide-react';

export const DailyRoutinePage = () => {
  const { routines, addRoutine, toggleRoutine, removeRoutine, updateRoutine, playDoneSound } = useTodo();
  const [isAdding, setIsAdding] = useState(false);
  const [newRoutine, setNewRoutine] = useState({ title: '', description: '', icon: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newRoutine.title) return;
    addRoutine(newRoutine);
    setNewRoutine({ title: '', description: '', icon: '' });
    setIsAdding(false);
  };

  const handleToggle = (id) => {
    const routine = routines.find(r => r.id === id);
    if (routine && !routine.done) playDoneSound();
    toggleRoutine(id);
  };

  const doneCount = routines.filter(r => r.done).length;
  const totalCount = routines.length;
  const progressPct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="page-title">Rutinitas Harian</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Kebiasaan yang kamu lakukan setiap hari. Otomatis reset tengah malam.</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setIsAdding(!isAdding)}>
          <Plus size={20} /> Tambah Rutinitas
        </button>
      </div>

      {/* Progress bar */}
      {totalCount > 0 && (
        <div className="glass" style={{ padding: '16px 24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Repeat size={16} /> Progress Hari Ini
            </span>
            <span style={{ fontWeight: '600', color: progressPct === 100 ? 'var(--success-color)' : 'var(--text-primary)' }}>
              {doneCount}/{totalCount} ({progressPct}%)
            </span>
          </div>
          <div style={{ height: '8px', borderRadius: '999px', background: 'rgba(255,255,255,0.05)' }}>
            <div style={{
              height: '100%', borderRadius: '999px',
              width: `${progressPct}%`,
              background: progressPct === 100
                ? 'var(--success-color)'
                : 'linear-gradient(to right, var(--accent-color), #ec4899)',
              transition: 'width 0.5s ease'
            }} />
          </div>
          {progressPct === 100 && (
            <p style={{ textAlign: 'center', marginTop: '10px', color: 'var(--success-color)', fontSize: '0.9rem' }}>
              🎉 Semua rutinitas selesai hari ini! Luar biasa!
            </p>
          )}
        </div>
      )}

      {/* Form tambah */}
      {isAdding && (
        <form onSubmit={handleAdd} className="glass" style={{ padding: '20px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <IconPicker value={newRoutine.icon} onChange={v => setNewRoutine({...newRoutine, icon: v})} />
            <input
              type="text"
              placeholder="Nama rutinitas..."
              value={newRoutine.title}
              onChange={(e) => setNewRoutine({...newRoutine, title: e.target.value})}
              style={{ flex: 1 }}
              autoFocus
            />
          </div>
          <textarea
            placeholder="Deskripsi (opsional)"
            value={newRoutine.description}
            onChange={(e) => setNewRoutine({...newRoutine, description: e.target.value})}
            style={{ minHeight: '60px', resize: 'vertical' }}
          />
          <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-end' }}>Simpan</button>
        </form>
      )}

      {/* Daftar rutinitas */}
      <div>
        {routines.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            Belum ada rutinitas. Klik "Tambah Rutinitas" untuk memulai.
          </div>
        ) : (
          routines.map(routine => (
            <RoutineCard
              key={routine.id}
              routine={routine}
              onToggle={handleToggle}
              onRemove={removeRoutine}
              onUpdate={updateRoutine}
            />
          ))
        )}
      </div>
    </div>
  );
};

const RoutineCard = ({ routine, onToggle, onRemove, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited] = useState(routine);

  const handleSave = () => {
    onUpdate(routine.id, edited);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="glass-card animate-fade-in" style={{ marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <IconPicker value={edited.icon || ''} onChange={v => setEdited({...edited, icon: v})} />
          <input
            type="text"
            value={edited.title}
            onChange={e => setEdited({...edited, title: e.target.value})}
            style={{ flex: 1 }}
          />
        </div>
        <textarea
          value={edited.description || ''}
          onChange={e => setEdited({...edited, description: e.target.value})}
          placeholder="Deskripsi (opsional)"
          style={{ minHeight: '60px', resize: 'vertical' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="btn-icon danger" onClick={() => onRemove(routine.id)}><Trash2 size={20}/></button>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-icon" onClick={() => setIsEditing(false)}><X size={20}/></button>
            <button className="btn-icon success" onClick={handleSave}><Save size={20}/></button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="glass-card animate-fade-in"
      style={{
        display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px',
        opacity: routine.done ? 0.65 : 1, transition: 'all 0.3s',
        borderLeft: routine.done ? '3px solid var(--success-color)' : '3px solid transparent',
      }}
    >
      <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{routine.icon || '✅'}</span>
      <div style={{ flex: 1, textDecoration: routine.done ? 'line-through' : 'none' }}>
        <h3 style={{ fontSize: '1.05rem', marginBottom: '2px' }}>{routine.title}</h3>
        {routine.description && <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{routine.description}</p>}
      </div>
      <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
        <button className="btn-icon" onClick={() => setIsEditing(true)}><Edit2 size={20}/></button>
        <button
          className="btn-icon success"
          onClick={() => onToggle(routine.id)}
          style={{ color: routine.done ? 'var(--success-color)' : 'var(--text-secondary)' }}
        >
          <Check size={22}/>
        </button>
      </div>
    </div>
  );
};
