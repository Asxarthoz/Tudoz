import { useState } from 'react';
import { Lock, KeyRound, ArrowLeft } from 'lucide-react';
import { useTodo } from '../context/TodoContext';
import { AppLogo } from './AppLogo';
import { verifyPassword, verifyAnswer, withNewPassword, validateNewPassword } from '../utils/appLock';

// mode: 'password' → masuk biasa, 'recover' → jawab pertanyaan keamanan, 'reset' → buat password baru
export const LockScreen = ({ onUnlock }) => {
  const { settings, updateSettings } = useTodo();
  const lock = settings.appLock;

  const [mode, setMode] = useState('password');
  const [value, setValue] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const switchMode = (next) => {
    setMode(next);
    setValue('');
    setConfirm('');
    setError('');
  };

  const fail = (message) => {
    setError(message);
    setShakeKey(k => k + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      if (mode === 'password') {
        if (await verifyPassword(lock, value)) onUnlock();
        else fail('Password salah. Coba lagi.');
      } else if (mode === 'recover') {
        if (await verifyAnswer(lock, value)) switchMode('reset');
        else fail('Jawaban tidak cocok.');
      } else {
        const problem = validateNewPassword(value, confirm);
        if (problem) {
          fail(problem);
        } else {
          updateSettings({ appLock: await withNewPassword(lock, value) });
          onUnlock();
        }
      }
    } finally {
      setBusy(false);
    }
  };

  const greeting = settings.username ? `Halo, ${settings.username}` : 'Selamat datang kembali';

  return (
    <div className="lock-screen">
      <form key={shakeKey} className={`lock-card glass${shakeKey ? ' lock-card--shake' : ''}`} onSubmit={handleSubmit}>
        <AppLogo size={72} />

        {mode === 'password' && (
          <>
            <h1 className="lock-card__title">{greeting}</h1>
            <p className="lock-card__subtitle">Masukkan password untuk membuka Tudoz.</p>
            <input
              type="password"
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Password"
              className="lock-card__input"
            />
          </>
        )}

        {mode === 'recover' && (
          <>
            <h1 className="lock-card__title">Pertanyaan Keamanan</h1>
            <p className="lock-card__subtitle">{lock.question}</p>
            <input
              type="text"
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Jawaban kamu"
              className="lock-card__input"
            />
          </>
        )}

        {mode === 'reset' && (
          <>
            <h1 className="lock-card__title">Buat Password Baru</h1>
            <p className="lock-card__subtitle">Jawaban benar. Silakan atur password baru.</p>
            <input
              type="password"
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Password baru"
              className="lock-card__input"
            />
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Ulangi password baru"
              className="lock-card__input"
            />
          </>
        )}

        {error && <p className="lock-card__error">{error}</p>}

        <button type="submit" className="lock-card__submit" disabled={busy || !value}>
          {mode === 'password' && <><Lock size={18} /> {busy ? 'Memeriksa...' : 'Buka'}</>}
          {mode === 'recover' && <><KeyRound size={18} /> {busy ? 'Memeriksa...' : 'Verifikasi'}</>}
          {mode === 'reset' && <>{busy ? 'Menyimpan...' : 'Simpan & Masuk'}</>}
        </button>

        {mode === 'password' ? (
          <button type="button" className="lock-card__link" onClick={() => switchMode('recover')}>
            Lupa password?
          </button>
        ) : (
          <button type="button" className="lock-card__link" onClick={() => switchMode('password')}>
            <ArrowLeft size={14} /> Kembali
          </button>
        )}
      </form>
    </div>
  );
};
