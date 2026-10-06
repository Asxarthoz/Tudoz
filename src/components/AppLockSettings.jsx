import { useState } from 'react';
import { Shield, Lock, Unlock, KeyRound } from 'lucide-react';
import { useTodo } from '../context/TodoContext';
import { createAppLock, verifyPassword, withNewPassword, validateNewPassword } from '../utils/appLock';

const EMPTY_FORM = { current: '', password: '', confirm: '', question: '', answer: '' };

const labelStyle = { display: 'block', color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '0.9rem' };
const inputStyle = { width: '100%', padding: '12px', fontSize: '1rem' };
const actionButton = (color, filled) => ({
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
  padding: '12px 20px', borderRadius: '10px',
  background: filled ? color : 'rgba(255, 255, 255, 0.05)',
  border: `1px solid ${filled ? 'transparent' : color}`,
  color: filled ? '#fff' : color
});

// mode: null (tampilan status) | 'enable' | 'change' | 'disable'
export const AppLockSettings = () => {
  const { settings, updateSettings } = useTodo();
  const lock = settings.appLock;

  const [mode, setMode] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  const open = (next) => {
    setMode(next);
    setForm(EMPTY_FORM);
    setError('');
    setNotice('');
  };

  const field = (name) => ({
    value: form[name],
    onChange: (e) => setForm(prev => ({ ...prev, [name]: e.target.value }))
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (mode === 'enable') {
        const problem = validateNewPassword(form.password, form.confirm)
          || (!form.question.trim() && 'Pertanyaan keamanan wajib diisi.')
          || (!form.answer.trim() && 'Jawaban keamanan wajib diisi.');
        if (problem) return setError(problem);
        updateSettings({ appLock: await createAppLock(form) });
        open(null);
        setNotice('Kunci aplikasi aktif. Password akan diminta saat Tudoz dibuka.');
        return;
      }

      if (!(await verifyPassword(lock, form.current))) return setError('Password saat ini salah.');

      if (mode === 'change') {
        const problem = validateNewPassword(form.password, form.confirm);
        if (problem) return setError(problem);
        updateSettings({ appLock: await withNewPassword(lock, form.password) });
        open(null);
        setNotice('Password berhasil diganti.');
      } else {
        updateSettings({ appLock: null });
        open(null);
        setNotice('Kunci aplikasi dimatikan.');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="glass" style={{ padding: '24px' }}>
      <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Shield size={20} color="var(--accent-color)" /> Keamanan
      </h2>

      {!mode && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              {lock ? <Lock size={18} color="var(--success-color)" /> : <Unlock size={18} color="var(--text-secondary)" />}
              Kunci Aplikasi {lock ? 'Aktif' : 'Mati'}
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
              {lock ? 'Tudoz meminta password setiap kali dibuka.' : 'Minta password setiap kali Tudoz dibuka.'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {lock ? (
              <>
                <button onClick={() => open('change')} style={actionButton('var(--accent-color)', false)}>
                  <KeyRound size={18} /> Ganti Password
                </button>
                <button onClick={() => open('disable')} style={actionButton('var(--danger-color)', false)}>
                  <Unlock size={18} /> Matikan
                </button>
              </>
            ) : (
              <button onClick={() => open('enable')} style={actionButton('var(--accent-color)', true)}>
                <Lock size={18} /> Aktifkan Kunci
              </button>
            )}
          </div>
        </div>
      )}

      {mode && (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {mode !== 'enable' && (
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Password Saat Ini</label>
              <input type="password" autoFocus style={inputStyle} {...field('current')} />
            </div>
          )}

          {mode !== 'disable' && (
            <>
              <div>
                <label style={labelStyle}>{mode === 'change' ? 'Password Baru' : 'Password'}</label>
                <input type="password" autoFocus={mode === 'enable'} style={inputStyle} {...field('password')} />
              </div>
              <div>
                <label style={labelStyle}>Ulangi Password</label>
                <input type="password" style={inputStyle} {...field('confirm')} />
              </div>
            </>
          )}

          {mode === 'enable' && (
            <>
              <div>
                <label style={labelStyle}>Pertanyaan Keamanan (jika lupa password)</label>
                <input type="text" placeholder="Misal: Nama hewan peliharaan pertama?" style={inputStyle} {...field('question')} />
              </div>
              <div>
                <label style={labelStyle}>Jawaban</label>
                <input type="text" placeholder="Tidak membedakan huruf besar/kecil" style={inputStyle} {...field('answer')} />
              </div>
            </>
          )}

          {error && <p style={{ gridColumn: '1 / -1', color: 'var(--danger-color)', fontSize: '0.85rem' }}>{error}</p>}

          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={() => open(null)} style={actionButton('var(--text-secondary)', false)}>
              Batal
            </button>
            <button
              type="submit"
              disabled={busy}
              style={{ ...actionButton(mode === 'disable' ? 'var(--danger-color)' : 'var(--accent-color)', true), opacity: busy ? 0.7 : 1 }}
            >
              {busy ? 'Memproses...' : mode === 'enable' ? 'Aktifkan' : mode === 'change' ? 'Simpan' : 'Matikan Kunci'}
            </button>
          </div>
        </form>
      )}

      {!mode && notice && (
        <p style={{ color: 'var(--success-color)', fontSize: '0.85rem', marginTop: '12px' }}>{notice}</p>
      )}
    </div>
  );
};
