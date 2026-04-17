import type { CSSProperties } from 'react';

const bubbles = [
  { size: 220, top: '6%', left: '6%', duration: '28s', delay: '-8s', opacity: '0.34' },
  { size: 120, top: '14%', left: '78%', duration: '24s', delay: '-14s', opacity: '0.22' },
  { size: 88, top: '36%', left: '12%', duration: '20s', delay: '-6s', opacity: '0.28' },
  { size: 64, top: '28%', left: '58%', duration: '18s', delay: '-12s', opacity: '0.3' },
  { size: 172, top: '54%', left: '86%', duration: '30s', delay: '-18s', opacity: '0.2' },
  { size: 96, top: '72%', left: '24%', duration: '22s', delay: '-10s', opacity: '0.24' },
  { size: 70, top: '80%', left: '68%', duration: '19s', delay: '-16s', opacity: '0.22' },
];

export function AmbientBubbles() {
  return (
    <div className="ambient-bubbles" aria-hidden="true">
      {bubbles.map((bubble, index) => (
        <span
          className="ambient-bubble"
          key={`${bubble.top}-${bubble.left}-${index}`}
          style={
            {
              '--bubble-size': `${bubble.size}px`,
              '--bubble-top': bubble.top,
              '--bubble-left': bubble.left,
              '--bubble-duration': bubble.duration,
              '--bubble-delay': bubble.delay,
              '--bubble-opacity': bubble.opacity,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
