import { useState } from 'react';
import { useTodo } from '../context/TodoContext';
import { Dumbbell, Plus, Trash2, Edit3, X, Check, Clock } from 'lucide-react';

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

const DAY_COLORS = {
  Senin: '#8b5cf6',
  Selasa: '#06b6d4',
  Rabu: '#10b981',
  Kamis: '#f59e0b',
  Jumat: '#ef4444',
  Sabtu: '#ec4899',
  Minggu: '#6366f1'
};

export const SportsPage = () => {
  const { sports, addSport, updateSport, removeSport } = useTodo();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newSport, setNewSport] = useState({ title: '', day: 'Senin', time: '07:00', description: '' });
  const [editSport, setEditSport] = useState({});

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newSport.title.trim()) return;
    addSport(newSport);
    setNewSport({ title: '', day: 'Senin', time: '07:00', description: '' });
    setIsAdding(false);
  };

  const handleEdit = (sport) => {
    setEditingId(sport.id);
    setEditSport({ title: sport.title, day: sport.day, time: sport.time, description: sport.description || '' });
  };

  const handleSaveEdit = (id) => {
    if (!editSport.title.trim()) return;
    updateSport(id, editSport);
    setEditingId(null);
  };

  // Group sports by day
  const sportsByDay = DAYS.reduce((acc, day) => {
    acc[day] = sports.filter(s => s.day === day).sort((a, b) => a.time.localeCompare(b.time));
    return acc;
  }, {});

  const activeDays = DAYS.filter(day => sportsByDay[day].length > 0);

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Dumbbell size={28} style={{ color: 'var(--accent-color)' }} />
            Jadwal Olahraga
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Atur jadwal olahraga mingguan kamu.</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? <X size={20} /> : <Plus size={20} />}
          {isAdding ? 'Batal' : 'Tambah Jadwal'}
        </button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <form onSubmit={handleAdd} className="glass" style={{ padding: '20px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <input
            type="text"
            placeholder="Nama olahraga (cth: Jogging, Gym, Renang)..."
            value={newSport.title}
            onChange={(e) => setNewSport({ ...newSport, title: e.target.value })}
            autoFocus
            style={{ fontSize: '1rem' }}
          />
          <textarea
            placeholder="Deskripsi / catatan (opsional)"
            value={newSport.description}
            onChange={(e) => setNewSport({ ...newSport, description: e.target.value })}
            style={{ minHeight: '50px', resize: 'vertical' }}
          />
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 180px' }}>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Hari</label>
              <select
                value={newSport.day}
                onChange={(e) => setNewSport({ ...newSport, day: e.target.value })}
                style={{ width: '100%' }}
              >
                {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div style={{ flex: '1 1 140px' }}>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Jam</label>
              <input
                type="time"
                value={newSport.time}
                onChange={(e) => setNewSport({ ...newSport, time: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
          </div>
          <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-end' }}>Simpan</button>
        </form>
      )}

      {/* Sports List grouped by day */}
      {sports.length === 0 ? (
        <div className="glass" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
          <Dumbbell size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
          <p style={{ fontSize: '1.05rem', marginBottom: '8px' }}>Belum ada jadwal olahraga.</p>
          <p style={{ fontSize: '0.88rem' }}>Klik "Tambah Jadwal" untuk mulai mengatur rutinitas olahragamu!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {activeDays.map(day => (
            <div key={day} className="glass" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div style={{
                  width: '10px', height: '10px', borderRadius: '50%',
                  background: DAY_COLORS[day],
                  boxShadow: `0 0 8px ${DAY_COLORS[day]}60`
                }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: '600', color: 'var(--text-primary)' }}>{day}</h3>
                <span style={{
                  marginLeft: 'auto', fontSize: '0.8rem',
                  background: `${DAY_COLORS[day]}20`, color: DAY_COLORS[day],
                  padding: '2px 10px', borderRadius: '999px', fontWeight: '600'
                }}>
                  {sportsByDay[day].length} jadwal
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {sportsByDay[day].map(sport => (
                  <div key={sport.id} style={{
                    padding: '14px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px',
                    borderLeft: `3px solid ${DAY_COLORS[day]}`,
                    display: 'flex', alignItems: 'center', gap: '12px',
                    transition: 'all 0.2s ease'
                  }}>
                    {editingId === sport.id ? (
                      // Edit mode
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input
                          type="text"
                          value={editSport.title}
                          onChange={(e) => setEditSport({ ...editSport, title: e.target.value })}
                          style={{ fontSize: '0.95rem' }}
                          autoFocus
                        />
                        <textarea
                          placeholder="Deskripsi (opsional)"
                          value={editSport.description}
                          onChange={(e) => setEditSport({ ...editSport, description: e.target.value })}
                          style={{ minHeight: '40px', resize: 'vertical' }}
                        />
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                          <select
                            value={editSport.day}
                            onChange={(e) => setEditSport({ ...editSport, day: e.target.value })}
                            style={{ flex: '1 1 120px' }}
                          >
                            {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                          <input
                            type="time"
                            value={editSport.time}
                            onChange={(e) => setEditSport({ ...editSport, time: e.target.value })}
                            style={{ flex: '1 1 100px' }}
                          />
                        </div>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button className="btn-icon" onClick={() => setEditingId(null)} title="Batal">
                            <X size={18} />
                          </button>
                          <button className="btn-icon success" onClick={() => handleSaveEdit(sport.id)} title="Simpan">
                            <Check size={18} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View mode
                      <>
                        <div style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          width: '36px', height: '36px', borderRadius: '10px',
                          background: `${DAY_COLORS[day]}15`, flexShrink: 0
                        }}>
                          <Dumbbell size={18} style={{ color: DAY_COLORS[day] }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontWeight: '600', fontSize: '0.95rem', marginBottom: sport.description ? '4px' : 0 }}>{sport.title}</p>
                          {sport.description && (
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {sport.description}
                            </p>
                          )}
                        </div>
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: '4px',
                          fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500',
                          background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '8px', flexShrink: 0
                        }}>
                          <Clock size={14} />
                          {sport.time}
                        </div>
                        <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                          <button className="btn-icon" onClick={() => handleEdit(sport)} title="Edit" style={{ color: 'var(--text-secondary)' }}>
                            <Edit3 size={16} />
                          </button>
                          <button className="btn-icon danger" onClick={() => removeSport(sport.id)} title="Hapus" style={{ color: 'var(--text-secondary)' }}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
