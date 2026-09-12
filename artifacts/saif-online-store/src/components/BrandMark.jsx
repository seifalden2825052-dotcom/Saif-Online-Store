import { useId } from "react";

export default function BrandMark({ size = 32, className = "" }) {
  const id = useId().replace(/:/g, "");
  const nightId = `${id}-night`;
  const auroraId = `${id}-aurora`;
  const copperId = `${id}-copper`;
  const glowId = `${id}-glow`;
  const smallGlowId = `${id}-small-glow`;

  return (
    <span
      aria-hidden="true"
      className={`brand-mark ${className}`}
      style={{ "--brand-mark-size": `${size}px` }}
    >
      <svg viewBox="0 0 128 128" role="presentation">
        <defs>
          <linearGradient id={nightId} x1="10" y1="4" x2="118" y2="124" gradientUnits="userSpaceOnUse">
            <stop stopColor="#111f39" />
            <stop offset=".48" stopColor="#090c18" />
            <stop offset="1" stopColor="#03040a" />
          </linearGradient>
          <linearGradient id={auroraId} x1="28" y1="26" x2="96" y2="101" gradientUnits="userSpaceOnUse">
            <stop stopColor="#69f6ff" />
            <stop offset=".4" stopColor="#5f9dff" />
            <stop offset=".74" stopColor="#9671ff" />
            <stop offset="1" stopColor="#e84fca" />
          </linearGradient>
          <linearGradient id={copperId} x1="42" y1="72" x2="88" y2="80" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffe1ae" />
            <stop offset=".42" stopColor="#f59b68" />
            <stop offset="1" stopColor="#b84e4e" />
          </linearGradient>
          <filter id={glowId} x="-55%" y="-55%" width="210%" height="210%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id={smallGlowId} x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect width="128" height="128" rx="32" fill={`url(#${nightId})`} />
        <rect x="6" y="6" width="116" height="116" rx="26" fill="none" stroke="#7eefff" strokeOpacity=".2" strokeWidth="2" />
        <circle cx="64" cy="64" r="43" fill="#4f67ff" fillOpacity=".12" filter={`url(#${glowId})`} />
        <path d="M28 98 56.4 29.9c2.6-6.2 12.6-6.2 15.2 0L100 98H82.8l-6.5-17.4H51.7L45.2 98H28Zm28.5-31h14.9L64 47.2 56.5 67Z" fill={`url(#${auroraId})`} filter={`url(#${glowId})`} />
        <path d="M48.5 75.8h31" stroke={`url(#${copperId})`} strokeLinecap="round" strokeWidth="6" />
        <path d="M64 38 59.5 49.5h9L64 38Z" fill="#f7ffff" fillOpacity=".9" />
        <circle cx="103" cy="25" r="4.5" fill="#ffe3b8" filter={`url(#${smallGlowId})`} />
        <path d="M103 17v16M95 25h16" stroke="#ffe3b8" strokeLinecap="round" strokeOpacity=".5" />
      </svg>
    </span>
  );
}