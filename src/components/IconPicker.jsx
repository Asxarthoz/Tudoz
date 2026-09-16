import { useState, useRef, useEffect } from 'react';

const EMOJI_LIST = [
  '📚', '📖', '✏️', '📝', '💡', '🎯', '🏆', '💼', '📊', '📈', '🖥️', '⌨️', '🔬', '🧪', '📐',
  '💪', '🏃', '🚴', '🏊', '⚽', '🏀', '🎾', '🧘', '🥗', '💊', '🛌', '🚶', '🏋️', '🤸', '🧗',
  '☕', '🍳', '🍽️', '🚿', '🧹', '🛒', '🚗', '✈️', '🏠', '🌱', '💧', '😴', '🧴', '👕', '🪴',
  '👨‍👩‍👧', '📞', '💬', '🎵', '🎮', '🎬', '📺', '📷', '✍️', '🎨', '🎭', '🎤', '🎸', '🎹', '🎲',
  '💰', '💳', '📑', '🏦', '🤝', '📅', '⏰', '🔔', '📌', '🗂️', '📂', '🗓️', '✅', '⭐', '🚀',
  '🌟', '🌞', '🌙', '🌈', '🌍', '🍀', '🔥', '❤️', '😊', '🙏', '💎', '🦋', '🌺', '🌊', '⚡',
];

export const IconPicker = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width: '42px', height: '42px', fontSize: '1.4rem',
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '10px', cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          transition: 'all 0.2s'
        }}
        title="Pilih ikon"
      >
        {value || '➕'}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: '48px', left: 0, zIndex: 100,
          background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '14px', padding: '12px', width: '260px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '4px',
        }}>
          {/* Tombol hapus ikon */}
          <button
            type="button"
            onClick={() => { onChange(''); setOpen(false); }}
            style={{
              fontSize: '0.65rem', padding: '4px', borderRadius: '6px', cursor: 'pointer',
              background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: 'none',
              gridColumn: '1 / -1', marginBottom: '6px', fontFamily: 'inherit'
            }}
          >
            Hapus Ikon
          </button>
          {EMOJI_LIST.map(emoji => (
            <button
              key={emoji}
              type="button"
              onClick={() => { onChange(emoji); setOpen(false); }}
              style={{
                fontSize: '1.3rem', padding: '4px', borderRadius: '6px', cursor: 'pointer',
                background: value === emoji ? 'rgba(139,92,246,0.3)' : 'transparent',
                border: value === emoji ? '1px solid var(--accent-color)' : '1px solid transparent',
                transition: 'all 0.15s', lineHeight: 1
              }}
              title={emoji}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
