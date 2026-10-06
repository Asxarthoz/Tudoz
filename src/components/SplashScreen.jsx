import { useEffect, useState } from 'react';
import { AppLogo } from './AppLogo';

const prefersReducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Animasi pembuka: badan ikon muncul → cincin tergambar → centang tertulis → kilau → memudar
export const SplashScreen = ({ onDone }) => {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const leaveAt = reduced ? 400 : 1800;
    const doneAt = leaveAt + 450;
    const leaveTimer = setTimeout(() => setLeaving(true), leaveAt);
    const doneTimer = setTimeout(onDone, doneAt);
    return () => {
      clearTimeout(leaveTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div className={`splash${leaving ? ' splash--leaving' : ''}`} aria-hidden="true">
      <div className="splash__logo">
        <AppLogo size={168} animated />
      </div>
      <div className="splash__title">Tudoz</div>
    </div>
  );
};
