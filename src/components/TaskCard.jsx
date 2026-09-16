import { useState } from 'react';
import { Check, Edit2, Clock, AlertCircle, Save, X, Trash2 } from 'lucide-react';
import { IconPicker } from './IconPicker';

const getPriorityColor = (p) => {
  switch(p) {
    case 'Tinggi': return 'var(--danger-color)';
    case 'Sedang': return '#f59e0b';
    default: return 'var(--success-color)';
  }
};

export const TaskCard = ({ task, onToggle, onRemove, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const handleSave = () => {
    onUpdate(task.id, editedTask);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="glass-card animate-fade-in" style={{ marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <IconPicker value={editedTask.icon || ''} onChange={v => setEditedTask({...editedTask, icon: v})} />
          <input
            type="text"
            value={editedTask.title}
            onChange={e => setEditedTask({...editedTask, title: e.target.value})}
            style={{ flex: 1 }}
          />
        </div>
        <textarea
          placeholder="Deskripsi tugas (opsional)"
          value={editedTask.description || ''}
          onChange={e => setEditedTask({...editedTask, description: e.target.value})}
          style={{ width: '100%', minHeight: '60px', resize: 'vertical' }}
        />
        <div style={{ display: 'flex', gap: '12px' }}>
          <input type="date" value={editedTask.deadline} onChange={e => setEditedTask({...editedTask, deadline: e.target.value})} />
          <select value={editedTask.priority} onChange={e => setEditedTask({...editedTask, priority: e.target.value})}>
            <option value="Rendah">Rendah</option>
            <option value="Sedang">Sedang</option>
            <option value="Tinggi">Tinggi</option>
          </select>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="btn-icon danger" onClick={() => onRemove(task.id)} title="Hapus Permanen"><Trash2 size={20}/></button>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-icon" onClick={() => setIsEditing(false)}><X size={20}/></button>
            <button className="btn-icon success" onClick={handleSave}><Save size={20}/></button>
          </div>
        </div>
      </div>
    );
  }

  const isPastDeadline = task.deadline && task.deadline < new Date().toISOString().split('T')[0];

  return (
    <div className="glass-card animate-fade-in" style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '12px', opacity: task.completed ? 0.6 : 1, transition: 'all 0.3s' }}>
      {task.icon && (
        <span style={{ fontSize: '1.5rem', flexShrink: 0, marginTop: '2px' }}>{task.icon}</span>
      )}
      <div style={{ flex: 1, textDecoration: task.completed ? 'line-through' : 'none' }}>
        <h3 style={{ fontSize: '1.05rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {task.title}
          {isPastDeadline && !task.completed && (
            <span style={{ fontSize: '0.7rem', background: 'var(--danger-color)', color: 'white', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
              Melewati Deadline
            </span>
          )}
        </h3>
        {task.description && <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>{task.description}</p>}
        <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {task.deadline && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14}/> {task.deadline}</span>}
          {task.priority && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: getPriorityColor(task.priority) }}><AlertCircle size={14}/> {task.priority}</span>}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
        <button className="btn-icon" onClick={() => setIsEditing(true)}><Edit2 size={20}/></button>
        <button className="btn-icon success" onClick={() => onToggle(task.id)} style={{ color: task.completed ? 'var(--success-color)' : 'var(--text-secondary)' }}>
          <Check size={20}/>
        </button>
      </div>
    </div>
  );
};
