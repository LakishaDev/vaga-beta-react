export default function ATCSeal({ size = 180, withGlow = true }) {
  const w = size;
  const h = Math.round(size * 250 / 200);

  return (
    <svg
      viewBox="0 0 200 250"
      width={w}
      height={h}
      aria-label="Pečat akreditovanog kontrolnog tela ATC 06-373 · SRPS ISO/IEC 17020"
      role="img"
      style={{ display: "block", flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="atcGold" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="200" y2="250">
          <stop offset="0%" stopColor="#a8814b" />
          <stop offset="50%" stopColor="#e8c98a" />
          <stop offset="100%" stopColor="#a8814b" />
        </linearGradient>
        <linearGradient id="atcGold2" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="200" y2="0">
          <stop offset="0%" stopColor="#c9a55a" />
          <stop offset="50%" stopColor="#f0d090" />
          <stop offset="100%" stopColor="#c9a55a" />
        </linearGradient>
        <radialGradient id="atcHolo" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0%" stopColor="rgba(240,235,226,0.09)" />
          <stop offset="60%" stopColor="rgba(212,181,116,0.04)" />
          <stop offset="100%" stopColor="rgba(212,181,116,0)" />
        </radialGradient>
        <filter id="atcShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="8" stdDeviation="14" floodColor="rgba(0,0,0,0.45)" />
        </filter>
        <filter id="atcGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <style>{`
          @keyframes atcPulse {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 1; }
          }
        `}</style>
      </defs>

      {/* Outer cartouche — double border */}
      <g filter="url(#atcShadow)">
        <rect x="8" y="8" width="184" height="234" rx="14" fill="#06101f" stroke="url(#atcGold)" strokeWidth="1.8" />
        <rect x="13" y="13" width="174" height="224" rx="11" fill="none" stroke="rgba(240,235,226,0.18)" strokeWidth="0.6" />
      </g>

      {/* Holographic overlay */}
      <rect x="8" y="8" width="184" height="234" rx="14" fill="url(#atcHolo)" />

      {/* ATC diamond symbol — top */}
      {/* Outer champagne diamond */}
      <path
        d="M100 18 L118 42 L100 58 L82 42 Z"
        fill="none"
        stroke="url(#atcGold)"
        strokeWidth="1.4"
        filter={withGlow ? "url(#atcGlow)" : undefined}
      />
      {/* Inner V-shapes (two overlapping V) */}
      <path
        d="M88 38 L100 54 L112 38"
        fill="none"
        stroke="url(#atcGold2)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M84 34 L100 52 L116 34"
        fill="none"
        stroke="url(#atcGold)"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
      />

      {/* ATC text */}
      <text
        x="100"
        y="84"
        textAnchor="middle"
        fontFamily="JetBrains Mono, monospace"
        fontSize="22"
        letterSpacing="7"
        fill="url(#atcGold)"
        fontWeight="500"
      >
        ATC
      </text>

      {/* 06-373 */}
      <text
        x="100"
        y="104"
        textAnchor="middle"
        fontFamily="JetBrains Mono, monospace"
        fontSize="18"
        letterSpacing="3"
        fill="rgba(240,235,226,0.9)"
      >
        06-373
      </text>

      {/* Divider line */}
      <line x1="30" y1="114" x2="170" y2="114" stroke="url(#atcGold)" strokeWidth="0.8" opacity="0.7" />

      {/* KONTROLNO TELO */}
      <text
        x="100"
        y="136"
        textAnchor="middle"
        fontFamily="Cormorant Garamond, serif"
        fontStyle="italic"
        fontSize="16"
        fill="rgba(240,235,226,0.88)"
        letterSpacing="1"
      >
        KONTROLNO
      </text>
      <text
        x="100"
        y="156"
        textAnchor="middle"
        fontFamily="Cormorant Garamond, serif"
        fontStyle="italic"
        fontSize="16"
        fill="rgba(240,235,226,0.88)"
        letterSpacing="1"
      >
        TELO
      </text>

      {/* Thin divider */}
      <line x1="40" y1="166" x2="160" y2="166" stroke="rgba(212,181,116,0.35)" strokeWidth="0.6" />

      {/* SRPS ISO/IEC 17020 */}
      <text
        x="100"
        y="183"
        textAnchor="middle"
        fontFamily="JetBrains Mono, monospace"
        fontSize="9.5"
        letterSpacing="2.5"
        fill="url(#atcGold)"
        opacity="0.9"
      >
        SRPS ISO/IEC 17020
      </text>

      {/* Bottom decorative rule */}
      <line x1="30" y1="196" x2="170" y2="196" stroke="url(#atcGold)" strokeWidth="0.7" opacity="0.5" />

      {/* ATS label */}
      <text
        x="100"
        y="214"
        textAnchor="middle"
        fontFamily="JetBrains Mono, monospace"
        fontSize="8"
        letterSpacing="2"
        fill="rgba(212,181,116,0.55)"
      >
        AKREDITACIONO TELO SRBIJE
      </text>

      {/* Pulsing gold dot — bottom right corner */}
      <circle
        cx="178"
        cy="232"
        r="3"
        fill="var(--champagne, #d4b574)"
        style={{ animation: "atcPulse 1.8s ease-in-out infinite" }}
      />
    </svg>
  );
}
