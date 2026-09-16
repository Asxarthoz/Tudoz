import { useState } from 'react';
import { useTodo } from '../context/TodoContext';
import { TaskCard } from '../components/TaskCard';
import { IconPicker } from '../components/IconPicker';
import { Plus } from 'lucide-react';

export const TasksPage = () => {
  const { tasks, addTask, toggleTask, removeTask, updateTask, playDoneSound } = useTodo();
  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', deadline: '', priority: 'Sedang', icon: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newTask.title) return;
    addTask(newTask);
    setNewTask({ title: '', description: '', deadline: '', priority: 'Sedang', icon: '' });
    setIsAdding(false);
  };

  const handleToggle = (id) => {
    const task = tasks.find(t => t.id === id);
    if (task) playDoneSound();
    removeTask(id);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Daftar Tugas</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Kelola tugas-tugas Anda dengan mudah.</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setIsAdding(!isAdding)}>
          <Plus size={20} /> Tambah Tugas
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="glass" style={{ padding: '20px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <IconPicker value={newTask.icon} onChange={v => setNewTask({...newTask, icon: v})} />
            <input
              style={{ flex: 1 }}
              type="text"
              placeholder="Nama tugas..."
              value={newTask.title}
              onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              autoFocus
            />
          </div>
          <textarea
            placeholder="Deskripsi tugas (opsional)"
            value={newTask.description}
            onChange={(e) => setNewTask({...newTask, description: e.target.value})}
            style={{ minHeight: '60px', resize: 'vertical' }}
          />
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input
              style={{ flex: '1 1 150px' }}
              type="date"
              value={newTask.deadline}
              onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
            />
            <select
              style={{ flex: '1 1 100px' }}
              value={newTask.priority}
              onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
            >
              <option value="Rendah">Rendah</option>
              <option value="Sedang">Sedang</option>
              <option value="Tinggi">Tinggi</option>
            </select>
          </div>
          <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-end' }}>Simpan</button>
        </form>
      )}

      <div>
        {tasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            Belum ada tugas. Klik "Tambah Tugas" untuk memulai.
          </div>
        ) : (
          tasks.map(task => (
            <TaskCard key={task.id} task={task} onToggle={handleToggle} onRemove={removeTask} onUpdate={updateTask} />
          ))
        )}
      </div>
    </div>
  );
};
