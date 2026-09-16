import { useState } from 'react';
import { useTodo } from '../context/TodoContext';
import { Plus, Target, Edit2, Trash2, Save, X } from 'lucide-react';
import { IconPicker } from '../components/IconPicker';

export const GoalsPage = () => {
  const { goals, addGoal, updateGoal, removeGoal } = useTodo();
  const [isAdding, setIsAdding] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', description: '', icon: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newGoal.title) return;
    addGoal(newGoal);
    setNewGoal({ title: '', description: '', icon: '' });
    setIsAdding(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="page-title">Goals</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Tujuan jangka panjang Anda.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn-icon"
            onClick={() => setIsEditMode(!isEditMode)}
            title="Mode Edit Goals"
            style={{ background: isEditMode ? 'rgba(139, 92, 246, 0.2)' : 'transparent', color: isEditMode ? 'var(--accent-color)' : 'var(--text-secondary)' }}
          >
            <Edit2 size={20} />
          </button>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setIsAdding(!isAdding)}>
            <Plus size={20} /> Tambah Goal
          </button>
        </div>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="glass" style={{ padding: '20px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <IconPicker value={newGoal.icon} onChange={v => setNewGoal({...newGoal, icon: v})} />
            <input
              type="text"
              placeholder="Judul Goal..."
              value={newGoal.title}
              onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
              style={{ flex: 1 }}
              autoFocus
            />
          </div>
          <textarea
            placeholder="Deskripsi/langkah-langkah (opsional)"
            value={newGoal.description}
            onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
            style={{ minHeight: '80px', resize: 'vertical' }}
          />
          <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-end' }}>Simpan</button>
        </form>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {goals.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            Belum ada goal. Klik "Tambah Goal" untuk memulai.
          </div>
        ) : (
          goals.map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              isEditMode={isEditMode}
              onRemove={removeGoal}
              onUpdate={updateGoal}
            />
          ))
        )}
      </div>
    </div>
  );
};

const GoalCard = ({ goal, isEditMode, onRemove, onUpdate }) => {
  const [isEditingCard, setIsEditingCard] = useState(false);
  const [editedGoal, setEditedGoal] = useState(goal);

  if (isEditMode && isEditingCard) {
    return (
      <div className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <IconPicker value={editedGoal.icon || ''} onChange={v => setEditedGoal({...editedGoal, icon: v})} />
          <input
            type="text"
            value={editedGoal.title}
            onChange={(e) => setEditedGoal({...editedGoal, title: e.target.value})}
            style={{ flex: 1 }}
          />
        </div>
        <textarea
          value={editedGoal.description}
          onChange={(e) => setEditedGoal({...editedGoal, description: e.target.value})}
          style={{ minHeight: '60px', resize: 'vertical' }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button className="btn-icon" onClick={() => { setEditedGoal(goal); setIsEditingCard(false); }}><X size={18}/></button>
          <button className="btn-icon success" onClick={() => { onUpdate(goal.id, editedGoal); setIsEditingCard(false); }}><Save size={18}/></button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%', position: 'relative' }}>
      {isEditMode && (
        <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '4px', background: 'var(--surface-color)', borderRadius: '8px', padding: '2px', zIndex: 1 }}>
          <button className="btn-icon" onClick={() => setIsEditingCard(true)}><Edit2 size={16}/></button>
          <button className="btn-icon danger" onClick={() => onRemove(goal.id)}><Trash2 size={16}/></button>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '1.8rem', flexShrink: 0 }}>
          {goal.icon || <Target size={24} color="var(--accent-color)" />}
        </span>
        <h3 style={{ fontSize: '1.15rem', paddingRight: isEditMode ? '60px' : '0', lineHeight: 1.3 }}>{goal.title}</h3>
      </div>
      {goal.description && (
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
          {goal.description}
        </p>
      )}
    </div>
  );
};
