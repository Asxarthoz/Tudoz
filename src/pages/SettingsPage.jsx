import { useState, useRef } from 'react';
import { useTodo } from '../context/TodoContext';
import { Settings, Moon, Sun, Palette, User, Volume2, VolumeX, Download, Upload, Trash2, Check } from 'lucide-react';

const ACCENT_COLORS = [
  { name: 'Ungu (Indigo)', value: '#8b5cf6' },
  { name: 'Hijau (Emerald)', value: '#10b981' },
  { name: 'Merah Muda (Rose)', value: '#f43f5e' },
  { name: 'Biru (Sky)', value: '#0ea5e9' },
  { name: 'Oranye (Amber)', value: '#f59e0b' }
];

export const SettingsPage = () => {
  const { settings, updateSettings, resetAllData, exportData, importData, tasks, events, goals, routines } = useTodo();
  const fileInputRef = useRef(null);
  
  // Local state for username input to avoid saving on every keystroke
  const [localUsername, setLocalUsername] = useState(settings.username || '');
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleUsernameBlur = () => {
    updateSettings({ username: localUsername });
  };

  const handleExport = () => {
    const data = {
      tasks, events, goals, routines, settings
    };
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tudoz-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        importData(parsed);
        alert('Data berhasil dipulihkan!');
      } catch (err) {
        alert('Gagal membaca file backup. Pastikan file JSON valid.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    if (showConfirmReset) {
      resetAllData();
      setShowConfirmReset(false);
      alert('Semua pekerjaan berhasil dihapus.');
    } else {
      setShowConfirmReset(true);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header">
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Settings size={32} /> Pengaturan
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Sesuaikan tampilan dan kelola data aplikasi Tudoz.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Tampilan (Appearance) */}
        <div className="glass" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Palette size={20} color="var(--accent-color)" /> Tampilan
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Tema */}
            <div>
              <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '10px', fontSize: '0.9rem' }}>Tema Aplikasi</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => updateSettings({ theme: 'dark' })}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    padding: '12px', borderRadius: '10px',
                    background: settings.theme === 'dark' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${settings.theme === 'dark' ? 'var(--accent-color)' : 'transparent'}`,
                    color: settings.theme === 'dark' ? 'var(--accent-color)' : 'var(--text-primary)'
                  }}
                >
                  <Moon size={18} /> Gelap
                </button>
                <button
                  onClick={() => updateSettings({ theme: 'light' })}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    padding: '12px', borderRadius: '10px',
                    background: settings.theme === 'light' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${settings.theme === 'light' ? 'var(--accent-color)' : 'transparent'}`,
                    color: settings.theme === 'light' ? 'var(--accent-color)' : 'var(--text-primary)'
                  }}
                >
                  <Sun size={18} /> Terang
                </button>
              </div>
            </div>

            {/* Warna Aksen */}
            <div>
              <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '10px', fontSize: '0.9rem' }}>Warna Aksen</label>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {ACCENT_COLORS.map(color => (
                  <button
                    key={color.value}
                    onClick={() => updateSettings({ accentColor: color.value })}
                    title={color.name}
                    style={{
                      width: '40px', height: '40px', borderRadius: '50%',
                      background: color.value,
                      border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: settings.accentColor === color.value ? `0 0 0 3px var(--bg-color), 0 0 0 5px ${color.value}` : 'none',
                      transition: 'all 0.2s'
                    }}
                  >
                    {settings.accentColor === color.value && <Check size={20} color="white" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Profil & Interaksi */}
        <div className="glass" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={20} color="var(--accent-color)" /> Personalisasi
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Nama Pengguna */}
            <div>
              <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '10px', fontSize: '0.9rem' }}>Nama Panggilan (Sapaan Dashboard)</label>
              <input 
                type="text" 
                value={localUsername}
                onChange={(e) => setLocalUsername(e.target.value)}
                onBlur={handleUsernameBlur}
                placeholder="Misal: Alex"
                style={{ width: '100%', padding: '12px', fontSize: '1rem' }}
              />
            </div>

            {/* Suara */}
            <div>
              <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '10px', fontSize: '0.9rem' }}>Efek Suara</label>
              <button
                onClick={() => {
                  updateSettings({ soundEnabled: !settings.soundEnabled });
                  if (!settings.soundEnabled) {
                    // Test sound immediately if turning on
                    try {
                      const AudioContext = window.AudioContext || window.webkitAudioContext;
                      const ctx = new AudioContext();
                      const osc = ctx.createOscillator();
                      const gain = ctx.createGain();
                      osc.type = 'sine';
                      osc.frequency.setValueAtTime(800, ctx.currentTime);
                      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
                      gain.gain.setValueAtTime(0, ctx.currentTime);
                      gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
                      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                      osc.connect(gain);
                      gain.connect(ctx.destination);
                      osc.start();
                      osc.stop(ctx.currentTime + 0.3);
                    } catch (e) {}
                  }
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 20px', borderRadius: '10px', width: '100%',
                  background: settings.soundEnabled ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${settings.soundEnabled ? 'var(--success-color)' : 'transparent'}`,
                  color: settings.soundEnabled ? 'var(--success-color)' : 'var(--text-secondary)',
                  justifyContent: 'center'
                }}
              >
                {settings.soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                {settings.soundEnabled ? 'Suara Aktif' : 'Suara Mati'}
              </button>
            </div>
          </div>
        </div>

        {/* Data & Backup */}
        <div className="glass" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={20} color="var(--accent-color)" /> Data & Cadangan
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <button
              onClick={handleExport}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '12px', borderRadius: '10px',
                background: 'rgba(14, 165, 233, 0.15)',
                border: '1px solid var(--accent-color)',
                color: 'var(--text-primary)'
              }}
            >
              <Download size={18} /> Export Data (.json)
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '12px', borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid var(--success-color)',
                color: 'var(--text-primary)'
              }}
            >
              <Upload size={18} /> Import Data
            </button>
            <input 
              type="file" 
              accept=".json" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleImport}
            />

            <button
              onClick={handleReset}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '12px', borderRadius: '10px',
                background: showConfirmReset ? 'var(--danger-color)' : 'rgba(239, 68, 68, 0.15)',
                border: `1px solid var(--danger-color)`,
                color: showConfirmReset ? '#fff' : 'var(--danger-color)',
                transition: 'all 0.2s'
              }}
            >
              <Trash2 size={18} /> 
              {showConfirmReset ? 'Yakin Hapus Semua?' : 'Reset Semua Data'}
            </button>
          </div>
          {showConfirmReset && (
            <p style={{ color: 'var(--danger-color)', fontSize: '0.85rem', marginTop: '10px', textAlign: 'right' }}>
              Tekan sekali lagi untuk menghapus seluruh tugas, goal, dan rutinitas secara permanen.
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
