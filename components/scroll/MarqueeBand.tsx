'use client';

import { useState } from 'react';
import Marquee from 'react-fast-marquee';
import { useReducedMotion } from 'framer-motion';

const TOP =
  'SHIP SOMETHING REAL · 28 PROJECTS · ENGINEER · BUILDER · INCOMING MS PORTSMOUTH · ';
const BOTTOM = 'AI · EDTECH · FORENSICS · COMMUNITY · 3D · PORTSMOUTH · 2026 · ';

export default function MarqueeBand() {
  const reduce = useReducedMotion();
  const [hover, setHover] = useState(false);

  const baseColor = hover ? 'var(--color-amber)' : 'var(--color-paper)';

  return (
    <section
      aria-label="Headline marquee"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative w-full overflow-hidden bg-ink"
      style={{ borderTop: '1px solid var(--color-rule)', borderBottom: '1px solid var(--color-rule)' }}
    >
      <div style={{ height: '16vh', minHeight: 120, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Marquee
          gradient={false}
          speed={reduce ? 0 : 55}
          play={!reduce}
          pauseOnHover
          direction="left"
        >
          <span
            className="font-display uppercase"
            style={{
              fontSize: 'clamp(2.4rem, 7vw, 5.5rem)',
              fontWeight: 300,
              letterSpacing: '-0.02em',
              color: baseColor,
              transition: 'color 0.4s ease',
              paddingRight: '2vw',
              lineHeight: 1,
            }}
          >
            {TOP.repeat(4)}
          </span>
        </Marquee>

        <div style={{ height: 1, background: 'var(--color-amber)', opacity: 0.4, margin: '0.4rem 0' }} />

        <Marquee
          gradient={false}
          speed={reduce ? 0 : 90}
          play={!reduce}
          pauseOnHover
          direction="right"
        >
          <span
            className="font-mono uppercase"
            style={{
              fontSize: 'clamp(1.4rem, 4vw, 3rem)',
              letterSpacing: '0.05em',
              color: baseColor,
              transition: 'color 0.4s ease',
              paddingRight: '2vw',
              lineHeight: 1,
            }}
          >
            {BOTTOM.repeat(5)}
          </span>
        </Marquee>
      </div>
    </section>
  );
}
