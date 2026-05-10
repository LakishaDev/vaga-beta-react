// Inline luxury-line icons. Stroke-based, gold accent.
const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" };

const IconSeal = (p) => (
  <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} {...stroke}>
    <path d="M12 2.5l2.4 2 3.1-.4.4 3.1 2 2.4-2 2.4-.4 3.1-3.1-.4-2.4 2-2.4-2-3.1.4-.4-3.1-2-2.4 2-2.4.4-3.1 3.1.4z"/>
    <path d="M9 12l2.2 2.2L15.5 10"/>
  </svg>
);
const IconWrench = (p) => (
  <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} {...stroke}>
    <path d="M14.7 6.3a4 4 0 015 5l-2.5-.7-1.8 1.8.7 2.5a4 4 0 01-5-5l2.5.7 1.8-1.8z"/>
    <path d="M13 13l-7 7-3-3 7-7"/>
  </svg>
);
const IconScale = (p) => (
  <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} {...stroke}>
    <path d="M12 4v16M5 4h14"/>
    <path d="M5 4l-2.5 6h5L5 4zM19 4l-2.5 6h5L19 4z"/>
    <path d="M2.5 10a2.5 2.5 0 005 0M16.5 10a2.5 2.5 0 005 0M8 20h8"/>
  </svg>
);
const IconShield = (p) => (
  <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} {...stroke}>
    <path d="M12 3l8 3v6c0 4.5-3.4 8.4-8 9-4.6-.6-8-4.5-8-9V6l8-3z"/>
    <path d="M9 12l2.2 2.2L15.5 10"/>
  </svg>
);
const IconBolt = (p) => (
  <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} {...stroke}>
    <path d="M13 3L5 14h6l-1 7 8-11h-6l1-7z"/>
  </svg>
);
const IconArrow = (p) => (
  <svg viewBox="0 0 24 24" width={p.size||18} height={p.size||18} {...stroke}>
    <path d="M5 12h14M13 6l6 6-6 6"/>
  </svg>
);
const IconPlus = (p) => (
  <svg viewBox="0 0 24 24" width={p.size||14} height={p.size||14} {...stroke}>
    <path d="M12 5v14M5 12h14"/>
  </svg>
);
const IconCheck = (p) => (
  <svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} {...stroke}>
    <path d="M5 12.5l4.5 4.5L19 7"/>
  </svg>
);
const IconTruck = (p) => (
  <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} {...stroke}>
    <path d="M2 7h11v9H2zM13 10h5l3 3v3h-8zM6 19a2 2 0 100-4 2 2 0 000 4zM17 19a2 2 0 100-4 2 2 0 000 4z"/>
  </svg>
);
const IconLab = (p) => (
  <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} {...stroke}>
    <path d="M9 3h6M10 3v6L4.5 18a2 2 0 001.7 3h11.6a2 2 0 001.7-3L14 9V3"/>
    <path d="M7.5 14h9"/>
  </svg>
);

Object.assign(window, { IconSeal, IconWrench, IconScale, IconShield, IconBolt, IconArrow, IconPlus, IconCheck, IconTruck, IconLab });
