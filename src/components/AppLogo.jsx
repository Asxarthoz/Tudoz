import { useId } from 'react';

// Versi React dari build/icon.svg. `animated` memberi class untuk animasi splash.
export const AppLogo = ({ size = 96, animated = false }) => {
  const uid = useId().replace(/:/g, '');
  const id = (name) => `${name}-${uid}`;

  return (
    <svg
      viewBox="0 0 1024 1024"
      width={size}
      height={size}
      className={animated ? 'app-logo app-logo--animated' : 'app-logo'}
      aria-label="Tudoz"
      role="img"
    >
      <defs>
        <linearGradient id={id('bg')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2b2375" />
          <stop offset="0.55" stopColor="#151538" />
          <stop offset="1" stopColor="#0a0f22" />
        </linearGradient>
        <radialGradient id={id('glow')} cx="0.28" cy="0.2" r="0.8">
          <stop offset="0" stopColor="#8b5cf6" stopOpacity="0.5" />
          <stop offset="1" stopColor="#8b5cf6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id('sheen')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.13" />
          <stop offset="0.45" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={id('ring')} x1="230" y1="800" x2="800" y2="230" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#6366f1" />
          <stop offset="0.5" stopColor="#a855f7" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
        <linearGradient id={id('check')} x1="350" y1="630" x2="740" y2="300" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#cffafe" />
        </linearGradient>
        <filter id={id('soft')} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
      </defs>

      <g className="app-logo__body">
        <rect x="32" y="32" width="960" height="960" rx="224" fill={`url(#${id('bg')})`} />
        <rect x="32" y="32" width="960" height="960" rx="224" fill={`url(#${id('glow')})`} />
        <rect x="32" y="32" width="960" height="960" rx="224" fill={`url(#${id('sheen')})`} />
        <rect x="34" y="34" width="956" height="956" rx="222" fill="none" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="4" />
      </g>

      <circle cx="512" cy="512" r="290" fill="none" stroke="#ffffff" strokeOpacity="0.06" strokeWidth="64" />
      <g className="app-logo__ring">
        <circle cx="512" cy="512" r="290" fill="none" stroke={`url(#${id('ring')})`} strokeWidth="64"
          strokeLinecap="round" pathLength="100" strokeDasharray="75 100" filter={`url(#${id('soft')})`} opacity="0.7" />
        <circle cx="512" cy="512" r="290" fill="none" stroke={`url(#${id('ring')})`} strokeWidth="64"
          strokeLinecap="round" pathLength="100" strokeDasharray="75 100" />
      </g>

      <g className="app-logo__check">
        <path d="M356 512 L468 624 L752 300" fill="none" stroke="#a5f3fc" strokeOpacity="0.55" strokeWidth="80"
          strokeLinecap="round" strokeLinejoin="round" pathLength="100" strokeDasharray="100" filter={`url(#${id('soft')})`} />
        <path d="M356 512 L468 624 L752 300" fill="none" stroke={`url(#${id('check')})`} strokeWidth="80"
          strokeLinecap="round" strokeLinejoin="round" pathLength="100" strokeDasharray="100" />
      </g>
    </svg>
  );
};
