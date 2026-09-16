import { useState, useEffect } from 'react';
import { useTodo } from '../context/TodoContext';
import { Target, CalendarDays, CheckSquare, Clock, AlertCircle, Repeat, Check } from 'lucide-react';

const MOTIVATIONAL_QUOTES = [
  { text: "Semuanya selalu terlihat mustahil sampai akhirnya berhasil dilakukan.", author: "Nelson Mandela" },
  { text: "Di tengah kesulitan terdapat sebuah kesempatan.", author: "Albert Einstein" },
  { text: "Cara untuk memulai adalah berhenti berbicara dan mulai bertindak.", author: "Walt Disney" },
  { text: "Satu-satunya cara untuk menghasilkan karya hebat adalah mencintai apa yang kamu kerjakan.", author: "Steve Jobs" },
  { text: "Aku telah gagal berulang kali dalam hidupku. Dan itulah alasan aku berhasil.", author: "Michael Jordan" },
  { text: "Entah kamu berpikir bisa atau tidak bisa, kamu benar.", author: "Henry Ford" },
  { text: "Percayalah bahwa kamu bisa, dan kamu sudah setengah jalan menuju keberhasilan.", author: "Theodore Roosevelt" },
  { text: "Kelemahan terbesar kita adalah ketika kita menyerah.", author: "Thomas Edison" },
  { text: "Kesuksesan bukanlah akhir, kegagalan bukanlah kehancuran; yang terpenting adalah keberanian untuk terus melangkah.", author: "Winston Churchill" },
  { text: "Tidak masalah seberapa lambat kamu berjalan, selama kamu tidak berhenti.", author: "Confucius" },
  { text: "Di depan memberi teladan, di tengah membangun semangat, di belakang memberi dorongan.", author: "Ki Hajar Dewantara" },
  { text: "Keberhasilan bukanlah milik orang yang pintar. Keberhasilan adalah kepunyaan mereka yang senantiasa berusaha.", author: "B.J. Habibie" },
  { text: "Habis gelap terbitlah terang.", author: "R.A. Kartini" },
  { text: "Gantungkan cita-citamu setinggi langit! Bermimpilah setinggi langit. Jika engkau jatuh, engkau akan jatuh di antara bintang-bintang.", author: "Soekarno" },
  { text: "Kurang cerdas dapat diperbaiki dengan belajar, kurang cakap dapat dihilangkan dengan pengalaman. Namun kurang jujur sulit diperbaiki.", author: "Mohammad Hatta" },
  { text: "Kalau hidup sekadar hidup, babi di hutan juga hidup. Kalau bekerja sekadar bekerja, kera juga bekerja.", author: "Buya Hamka" }
];

const getPriorityColor = (p) => {
  switch(p) {
    case 'Tinggi': return 'var(--danger-color)';
    case 'Sedang': return '#f59e0b';
    default: return 'var(--success-color)';
  }
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

export const Dashboard = () => {
  const { tasks, events, goals, routines, removeTask, toggleRoutine, settings, playDoneSound } = useTodo();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [randomQuote] = useState(() => {
    return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pendingTasks = tasks.filter(t => !t.completed);
  const upcomingEvents = events.filter(e => !e.completed);
  const doneRoutines = routines.filter(r => r.done).length;
  const routineProgress = routines.length > 0 ? Math.round((doneRoutines / routines.length) * 100) : 0;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">
          {settings.username ? `Halo, ${settings.username}! Semangat mencapai tujuan hidupmu!` : 'Semangat dalam mencapai tujuan hidupmu!'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '8px', lineHeight: '1.5' }}>
          "{randomQuote.text}" — <strong style={{ color: 'var(--text-primary)' }}>{randomQuote.author}</strong>
        </p>
      </div>

      {/* Jam & Tanggal */}
      <div className="glass" style={{ padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ fontSize: '3.5rem', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '2px', color: 'var(--accent-color)' }}>
          {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\./g, ':')}
        </div>
        <div style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', textAlign: 'right', fontWeight: '500' }}>
          {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* Goals & Events (berdampingan) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Goals */}
        <div className="glass" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Target size={18} color="var(--accent-color)" />
            <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Goals</h3>
            <span style={{ marginLeft: 'auto', fontSize: '0.85rem', background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-color)', padding: '2px 10px', borderRadius: '999px' }}>{goals.length}</span>
          </div>
          {goals.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', padding: '16px 0' }}>Belum ada goal yang ditambahkan.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '220px', overflowY: 'auto' }}>
              {goals.map(goal => (
                <div key={goal.id} style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', borderLeft: '3px solid var(--accent-color)' }}>
                  <p style={{ fontWeight: '600', fontSize: '0.95rem', marginBottom: goal.description ? '4px' : 0 }}>{goal.title}</p>
                  {goal.description && <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{goal.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Events Mendatang */}
        <div className="glass" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <CalendarDays size={18} color="#10b981" />
            <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Event Mendatang</h3>
            <span style={{ marginLeft: 'auto', fontSize: '0.85rem', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success-color)', padding: '2px 10px', borderRadius: '999px' }}>{upcomingEvents.length}</span>
          </div>
          {upcomingEvents.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', padding: '16px 0' }}>Tidak ada event mendatang.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '220px', overflowY: 'auto' }}>
              {upcomingEvents.map(event => {
                const countdown = getEventCountdown(event.date);
                const isDDay = countdown === 'Hari-H';
                return (
                  <div key={event.id} style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', borderLeft: `3px solid ${isDDay ? 'var(--success-color)' : 'var(--accent-color)'}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {event.icon && <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{event.icon}</span>}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: '600', fontSize: '0.95rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {event.title}
                      </p>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CalendarDays size={12} /> {event.date || 'Tanggal belum diatur'}
                      </p>
                    </div>
                    {countdown && (
                      <span style={{
                        marginLeft: 'auto',
                        flexShrink: 0,
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
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Tugas Tertunda (full width) */}
      <div className="glass" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <CheckSquare size={18} color="var(--danger-color)" />
          <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Tugas Belum Selesai</h3>
          <span style={{ marginLeft: 'auto', fontSize: '0.85rem', background: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger-color)', padding: '2px 10px', borderRadius: '999px' }}>{pendingTasks.length}</span>
        </div>
        {pendingTasks.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', padding: '16px 0' }}>Wow, tidak ada tugas! Atau mungkin belum :{")"}</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '260px', overflowY: 'auto' }}>
            {pendingTasks.map(task => (
              <div key={task.id} style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', borderLeft: `3px solid ${getPriorityColor(task.priority)}`, display: 'flex', alignItems: 'center', gap: '12px' }}>
                {task.icon && <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{task.icon}</span>}
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: '600', fontSize: '0.95rem', marginBottom: task.description ? '4px' : 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {task.title}
                    {task.deadline && task.deadline < new Date().toISOString().split('T')[0] && (
                      <span style={{ fontSize: '0.65rem', background: 'var(--danger-color)', color: 'white', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>Terlewat!</span>
                    )}
                  </p>
                  {task.description && <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{task.description}</p>}
                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {task.deadline && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {task.deadline}</span>}
                    {task.priority && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: getPriorityColor(task.priority) }}><AlertCircle size={12} /> {task.priority}</span>}
                  </div>
                </div>
                <button 
                  className="btn-icon success" 
                  onClick={() => {
                    playDoneSound();
                    removeTask(task.id);
                  }}
                  title="Tandai selesai & hapus"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <Check size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rutinitas Harian Summary */}
      {routines.length > 0 && (
        <div className="glass" style={{ padding: '20px', marginTop: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Repeat size={18} color="#ec4899" />
            <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Rutinitas Harian</h3>
            <span style={{ marginLeft: 'auto', fontSize: '0.85rem', fontWeight: '600', color: routineProgress === 100 ? 'var(--success-color)' : 'var(--text-primary)' }}>
              {doneRoutines}/{routines.length} ({routineProgress}%)
            </span>
          </div>
          <div style={{ height: '6px', borderRadius: '999px', background: 'rgba(255,255,255,0.05)', marginBottom: '14px' }}>
            <div style={{
              height: '100%', borderRadius: '999px',
              width: `${routineProgress}%`,
              background: routineProgress === 100 ? 'var(--success-color)' : 'linear-gradient(to right, #8b5cf6, #ec4899)',
              transition: 'width 0.5s ease'
            }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {routines.map(routine => (
              <div key={routine.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', opacity: routine.done ? 0.6 : 1, transition: 'opacity 0.3s' }}>
                <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{routine.icon || '✅'}</span>
                <p style={{ flex: 1, fontSize: '0.92rem', fontWeight: '500', textDecoration: routine.done ? 'line-through' : 'none', color: routine.done ? 'var(--text-secondary)' : 'var(--text-primary)' }}>{routine.title}</p>
                <button 
                  className="btn-icon success" 
                  onClick={() => {
                    if (!routine.done) playDoneSound();
                    toggleRoutine(routine.id);
                  }}
                  title={routine.done ? 'Batalkan' : 'Tandai selesai'}
                  style={{ color: routine.done ? 'var(--success-color)' : 'var(--text-secondary)' }}
                >
                  <Check size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
