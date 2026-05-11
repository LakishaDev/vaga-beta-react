export const glass = {
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
  border: "1px solid rgba(255,255,255,0.07)",
  boxShadow:
    "0 30px 60px -30px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
  backdropFilter: "blur(18px) saturate(1.2)",
  borderRadius: 18,
};

export const heroStyles = {
  wrap: {
    position: "relative",
    maxWidth: "min(85%, 96vw)",
    margin: "0 auto",
    padding:
      "clamp(80px, 8vw, 160px) clamp(20px, 2vw, 80px) clamp(60px, 5vw, 120px)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1.15fr 0.85fr",
    gap: "clamp(40px, 5vw, 100px)",
    alignItems: "center",
  },
  eyebrow: {
    display: "inline-flex",
    alignItems: "center",
    gap: 12,
    fontFamily: "JetBrains Mono, monospace",
    fontSize: "clamp(10px, 0.85vw, 17px)",
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: "var(--champagne)",
    padding: "8px 14px",
    border: "1px solid rgba(212,181,116,0.3)",
    borderRadius: 999,
    background: "rgba(212,181,116,0.05)",
    marginBottom: "clamp(20px, 2vw, 36px)",
  },
  pulse: {
    width: 6,
    height: 6,
    borderRadius: 999,
    background: "var(--champagne)",
    animation: "pulse 2s ease-in-out infinite",
  },
  title: {
    fontSize: "clamp(48px, 6.5vw, 160px)",
    lineHeight: 0.96,
    letterSpacing: "-0.02em",
    color: "var(--bone)",
    fontWeight: 400,
  },
  italic: { fontStyle: "italic", color: "var(--champagne)" },
  divider: {
    height: 1,
    width: 80,
    background: "linear-gradient(90deg, var(--champagne), transparent)",
    margin: "clamp(20px, 2.5vw, 40px) 0 clamp(16px, 1.5vw, 28px)",
  },
  lede: {
    fontSize: "clamp(16px, 1.6vw, 34px)",
    lineHeight: 1.65,
    color: "var(--ink)",
    maxWidth: "clamp(400px, 38vw, 800px)",
  },
  ctaRow: {
    display: "flex",
    gap: "clamp(10px, 1vw, 18px)",
    marginTop: "clamp(24px, 2.5vw, 48px)",
    flexWrap: "wrap",
  },
  ctaPrimary: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    padding: "clamp(12px, 1vw, 18px) clamp(18px, 1.5vw, 28px)",
    background: "var(--champagne)",
    color: "var(--midnight)",
    fontWeight: 600,
    fontSize: "clamp(13px, 1.3vw, 20px)",
    letterSpacing: "0.04em",
    borderRadius: 999,
    border: "none",
    cursor: "pointer",
    textDecoration: "none",
    boxShadow: "0 12px 30px -10px rgba(212,181,116,0.5)",
  },
  ctaGhost: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    padding: "clamp(12px, 1vw, 18px) clamp(18px, 1.5vw, 28px)",
    background: "transparent",
    color: "var(--bone)",
    fontWeight: 500,
    fontSize: "clamp(13px, 1.3vw, 20px)",
    letterSpacing: "0.04em",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.16)",
    cursor: "pointer",
    textDecoration: "none",
  },
  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "clamp(16px, 2vw, 36px)",
    marginTop: "clamp(40px, 4vw, 80px)",
    paddingTop: "clamp(20px, 2.5vw, 40px)",
    borderTop: "1px solid rgba(255,255,255,0.07)",
    maxWidth: "clamp(400px, 38vw, 800px)",
  },
  statNum: {
    fontFamily: "Cormorant Garamond, serif",
    fontSize: "clamp(36px, 3.2vw, 72px)",
    color: "var(--champagne)",
    lineHeight: 1,
    fontStyle: "italic",
    fontWeight: 500,
  },
  statLbl: {
    fontSize: "clamp(10px, 1.1vw, 18px)",
    color: "var(--ink-soft)",
    marginTop: 6,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
};

export const svcStyles = {
  section: {
    maxWidth: "min(85%, 96vw)",
    margin: "clamp(80px, 8vw, 160px) auto 0",
    padding: "0 clamp(20px, 2vw, 80px)",
  },
  header: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "clamp(20px, 2.5vw, 40px)",
    marginBottom: "clamp(32px, 3.5vw, 64px)",
  },
  eyebrow: {
    fontFamily: "JetBrains Mono, monospace",
    fontSize: "clamp(10px, 0.85vw, 17px)",
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: "var(--champagne)",
    marginBottom: 14,
  },
  title: {
    fontSize: "clamp(36px, 4.5vw, 100px)",
    lineHeight: 1.02,
    fontWeight: 400,
    maxWidth: "clamp(500px, 50vw, 1000px)",
    fontStyle: "italic",
    color: "var(--bone)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "clamp(16px, 1.8vw, 40px)",
  },
  card: {
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
    border: "1px solid rgba(255,255,255,0.07)",
    boxShadow:
      "0 30px 60px -30px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
    backdropFilter: "blur(18px) saturate(1.2)",
    borderRadius: 18,
    padding: "clamp(28px, 2.5vw, 72px)",
    position: "relative",
    overflow: "hidden",
    transition:
      "transform 500ms cubic-bezier(.22,.61,.36,1), border-color 500ms",
  },
  cardSheen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    background:
      "linear-gradient(90deg, transparent, rgba(212,181,116,0.4), transparent)",
  },
  cardNum: {
    fontFamily: "Cormorant Garamond, serif",
    fontStyle: "italic",
    fontWeight: 500,
    fontSize: "clamp(16px, 1.4vw, 26px)",
    color: "var(--champagne)",
    letterSpacing: "0.1em",
  },
  cardIcon: {
    width: "clamp(44px, 4vw, 80px)",
    height: "clamp(44px, 4vw, 80px)",
    borderRadius: 999,
    display: "grid",
    placeItems: "center",
    color: "var(--champagne)",
    background:
      "radial-gradient(circle at 30% 30%, rgba(212,181,116,0.18), rgba(212,181,116,0.02))",
    border: "1px solid rgba(212,181,116,0.3)",
    marginTop: "clamp(18px, 2vw, 36px)",
  },
  cardTitle: {
    fontSize: "clamp(26px, 2.6vw, 56px)",
    lineHeight: 1.05,
    marginTop: "clamp(14px, 1.5vw, 28px)",
    color: "var(--bone)",
  },
  cardLead: {
    fontSize: "clamp(14px, 1.5vw, 28px)",
    lineHeight: 1.65,
    color: "var(--ink)",
    marginTop: 14,
    marginBottom: 22,
  },
  bullets: {
    display: "grid",
    gap: "clamp(8px, 0.8vw, 16px)",
    listStyle: "none",
    paddingTop: 20,
    borderTop: "1px solid rgba(255,255,255,0.07)",
    margin: 0,
    padding: "20px 0 0",
  },
  bullet: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    fontSize: "clamp(13px, 1.4vw, 24px)",
    lineHeight: 1.5,
    color: "var(--ink)",
  },
  bulletIcon: {
    flex: "0 0 auto",
    width: "clamp(18px, 1.6vw, 28px)",
    height: "clamp(18px, 1.6vw, 28px)",
    borderRadius: 999,
    display: "grid",
    placeItems: "center",
    background: "rgba(212,181,116,0.12)",
    color: "var(--champagne)",
    marginTop: 1,
  },
  link: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    marginTop: "clamp(18px, 2vw, 36px)",
    color: "var(--champagne)",
    fontSize: "clamp(12px, 1.25vw, 22px)",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontWeight: 500,
    textDecoration: "none",
  },
};

export const klasaStyles = {
  section: {
    maxWidth: "min(85%, 96vw)",
    margin: "clamp(80px, 8vw, 160px) auto 0",
    padding: "0 clamp(20px, 2vw, 80px)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "clamp(52px, 1.2vw, 24px)",
    marginTop: "clamp(32px, 3.5vw, 64px)",
  },
  card: {
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
    border: "1px solid rgba(255,255,255,0.07)",
    boxShadow:
      "0 30px 60px -30px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
    backdropFilter: "blur(18px) saturate(1.2)",
    borderRadius: 18,
    padding: "clamp(24px, 2.2vw, 62px) clamp(18px, 1.8vw, 46px)",
    minHeight: "clamp(220px, 20vw, 360px)",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    overflow: "hidden",
    transition: "transform 400ms ease",
  },
  roman: {
    fontFamily: "Cormorant Garamond, serif",
    fontStyle: "italic",
    fontSize: "clamp(60px, 5.5vw, 120px)",
    lineHeight: 0.85,
    color: "var(--champagne)",
    fontWeight: 500,
  },
  klasaTitle: {
    fontSize: "clamp(17px, 1.8vw, 30px)",
    marginTop: "clamp(12px, 1.2vw, 24px)",
    color: "var(--bone)",
    lineHeight: 1.2,
  },
  klasaBody: {
    fontSize: "clamp(12px, 1.4vw, 24px)",
    lineHeight: 1.55,
    color: "var(--ink-soft)",
    marginTop: 10,
  },
  klasaTag: {
    fontFamily: "JetBrains Mono, monospace",
    fontSize: "clamp(9px, 0.7vw, 13px)",
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "var(--ink-soft)",
    padding: "5px 10px",
    borderRadius: 4,
    border: "1px solid rgba(255,255,255,0.08)",
    alignSelf: "flex-start",
    marginTop: "auto",
  },
};

export const standardsStyles = {
  section: {
    maxWidth: "min(85%, 96vw)",
    margin: "clamp(80px, 8vw, 160px) auto 0",
    padding: "0 clamp(20px, 2vw, 80px)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "clamp(12px, 1.2vw, 24px)",
    marginTop: "clamp(32px, 3.5vw, 64px)",
  },
  card: {
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
    border: "1px solid rgba(255,255,255,0.07)",
    boxShadow:
      "0 30px 60px -30px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
    backdropFilter: "blur(18px) saturate(1.2)",
    borderRadius: 18,
    padding: "clamp(24px, 2.2vw, 62px) clamp(18px, 1.8vw, 46px)",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    transition: "transform 400ms ease",
  },
  code: {
    fontFamily: "Cormorant Garamond, serif",
    fontStyle: "italic",
    fontSize: "clamp(22px, 2.2vw, 48px)",
    lineHeight: 1,
    color: "var(--champagne)",
    fontWeight: 500,
    marginBottom: 10,
  },
  title: {
    fontSize: "clamp(14px, 1.5vw, 24px)",
    color: "var(--bone)",
    lineHeight: 1.3,
    marginBottom: 10,
  },
  body: {
    fontSize: "clamp(12px, 1.4vw, 24px)",
    lineHeight: 1.6,
    color: "var(--ink-soft)",
    flex: 1,
  },
  authority: {
    fontFamily: "JetBrains Mono, monospace",
    fontSize: "clamp(9px, 0.7vw, 13px)",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "var(--ink-soft)",
    marginTop: 14,
    paddingTop: 14,
    borderTop: "1px solid rgba(255,255,255,0.07)",
  },
  pulseDot: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 999,
    background: "var(--champagne)",
    opacity: 0.7,
    animation: "pulse 2.5s ease-in-out infinite",
  },
};

export const mkoStyles = {
  section: {
    position: "relative",
    maxWidth: "min(85%, 96vw)",
    margin: "clamp(100px, 10vw, 180px) auto 0",
    padding: "0 clamp(20px, 2vw, 80px)",
  },
  intro: {
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr",
    gap: "clamp(32px, 4vw, 80px)",
    alignItems: "end",
    marginBottom: 36,
  },
  eyebrow: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 14px",
    background: "rgba(74,124,240,0.08)",
    border: "1px solid rgba(74,124,240,0.35)",
    borderRadius: 999,
    fontFamily: "JetBrains Mono, monospace",
    fontSize: "clamp(10px, 0.8vw, 14px)",
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: "#7ea4ff",
    marginBottom: 22,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    background: "#7ea4ff",
    boxShadow: "0 0 8px #7ea4ff",
    animation: "pulse 2s ease-in-out infinite",
  },
  h2: {
    fontSize: "clamp(40px, 5vw, 110px)",
    lineHeight: 0.98,
    fontWeight: 400,
    color: "var(--bone)",
    fontStyle: "italic",
    paddingBottom: 14,
  },
  sub: {
    fontSize: "clamp(15px, 1.6vw, 26px)",
    lineHeight: 1.55,
    color: "var(--ink)",
    maxWidth: "clamp(360px, 35vw, 680px)",
    fontStyle: "italic",
    fontFamily: "Cormorant Garamond, serif",
  },
  desc: {
    fontSize: "clamp(14px, 1.6vw, 30px)",
    lineHeight: 1.7,
    color: "var(--ink)",
    maxWidth: "clamp(320px, 32vw, 600px)",
  },
  shell: {
    position: "relative",
    borderRadius: 24,
    overflow: "hidden",
    background:
      "linear-gradient(180deg, rgba(10,23,64,0.85), rgba(3,8,26,0.95))",
    border: "1px solid rgba(74,124,240,0.25)",
    boxShadow:
      "0 80px 140px -50px rgba(30,58,138,0.55), inset 0 1px 0 rgba(255,255,255,0.04)",
  },
  pcbGrid: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    backgroundImage: `
      linear-gradient(rgba(74,124,240,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(74,124,240,0.05) 1px, transparent 1px),
      radial-gradient(circle at 25% 30%, rgba(74,124,240,0.18) 0, transparent 40%),
      radial-gradient(circle at 80% 70%, rgba(212,181,116,0.10) 0, transparent 45%)
    `,
    backgroundSize: "24px 24px, 24px 24px, 100% 100%, 100% 100%",
    maskImage:
      "radial-gradient(ellipse at center, black 50%, rgba(0,0,0,0.4) 100%)",
    WebkitMaskImage:
      "radial-gradient(ellipse at center, black 50%, rgba(0,0,0,0.4) 100%)",
  },
  inner: {
    position: "relative",
    display: "grid",
    gridTemplateColumns: "1.05fr 0.95fr",
    gap: "clamp(24px, 2.5vw, 56px)",
    padding: "clamp(32px, 3.5vw, 72px) clamp(28px, 3vw, 64px)",
  },
  statusPanel: {
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
    border: "1px solid rgba(74,124,240,0.25)",
    borderRadius: 16,
    backdropFilter: "blur(20px) saturate(1.3)",
    overflow: "hidden",
  },
  statusHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 22px",
    borderBottom: "1px solid rgba(74,124,240,0.18)",
    fontFamily: "JetBrains Mono, monospace",
    fontSize: "clamp(9px, 1vw, 15px)",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
  },
  statusRows: { padding: "8px 22px 22px" },
  statusRow: {
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    alignItems: "center",
    gap: 14,
    padding: "16px 0",
    borderBottom: "1px solid rgba(74,124,240,0.08)",
  },
  statusIcon: {
    width: "clamp(26px, 2.2vw, 44px)",
    height: "clamp(26px, 2.2vw, 44px)",
    borderRadius: 8,
    border: "1px solid rgba(212,181,116,0.4)",
    background: "rgba(212,181,116,0.08)",
    color: "var(--champagne)",
    display: "grid",
    placeItems: "center",
  },
  statusLbl: {
    fontFamily: "JetBrains Mono, monospace",
    fontSize: "clamp(9px, 1vw, 15px)",
    letterSpacing: "0.16em",
    color: "var(--ink-soft)",
    textTransform: "uppercase",
  },
  statusVal: {
    fontFamily: "Cormorant Garamond, serif",
    fontStyle: "italic",
    fontSize: "clamp(16px, 1.8vw, 30px)",
    color: "var(--bone)",
    marginTop: 3,
  },
  pillOk: {
    fontFamily: "JetBrains Mono, monospace",
    fontSize: "clamp(9px, 0.7vw, 12px)",
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    padding: "5px 10px",
    borderRadius: 4,
    background: "rgba(92,220,148,0.12)",
    color: "#5cdc94",
    border: "1px solid rgba(92,220,148,0.4)",
  },
  pillGold: {
    fontFamily: "JetBrains Mono, monospace",
    fontSize: "clamp(9px, 0.7vw, 12px)",
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    padding: "5px 10px",
    borderRadius: 4,
    background: "rgba(212,181,116,0.12)",
    color: "var(--champagne)",
    border: "1px solid rgba(212,181,116,0.4)",
  },
  cards: {
    marginTop: "clamp(32px, 3.5vw, 64px)",
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "clamp(10px, 1.1vw, 22px)",
  },
  card: {
    padding: "clamp(16px, 1.5vw, 42px) clamp(14px, 1.3vw, 34px)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))",
    border: "1px solid rgba(74,124,240,0.18)",
    borderRadius: 14,
    backdropFilter: "blur(14px)",
    minHeight: "clamp(160px, 15vw, 280px)",
    display: "flex",
    flexDirection: "column",
    transition: "transform 400ms ease, border-color 400ms",
  },
  cardIcon: {
    width: "clamp(30px, 2.8vw, 52px)",
    height: "clamp(30px, 2.8vw, 52px)",
    borderRadius: 10,
    background: "rgba(74,124,240,0.12)",
    border: "1px solid rgba(126,164,255,0.35)",
    color: "#a5bdf2",
    display: "grid",
    placeItems: "center",
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: "clamp(14px, 1.45vw, 24px)",
    color: "var(--bone)",
    lineHeight: 1.25,
    fontWeight: 500,
    marginBottom: 8,
  },
  cardBody: {
    fontSize: "clamp(11px, 1.25vw, 22px)",
    lineHeight: 1.55,
    color: "var(--ink-soft)",
  },
  note: {
    marginTop: 32,
    padding: "clamp(14px, 1.5vw, 28px) clamp(18px, 1.8vw, 36px)",
    background: "rgba(212,181,116,0.05)",
    border: "1px solid rgba(212,181,116,0.22)",
    borderRadius: 12,
    display: "flex",
    gap: 16,
    alignItems: "flex-start",
    fontSize: "clamp(13px, 1.45vw, 22px)",
    lineHeight: 1.6,
    color: "var(--ink)",
  },
  noteIcon: {
    flex: "0 0 auto",
    width: "clamp(26px, 2.2vw, 44px)",
    height: "clamp(26px, 2.2vw, 44px)",
    borderRadius: 999,
    background: "rgba(212,181,116,0.12)",
    color: "var(--champagne)",
    display: "grid",
    placeItems: "center",
    border: "1px solid rgba(212,181,116,0.35)",
  },
};

export const explStyles = {
  wrap: {
    position: "relative",
    margin: "0 auto",
    maxWidth: "min(85%, 96vw)",
    padding: "0 clamp(20px, 2vw, 80px)",
  },
  shell: {
    position: "relative",
    borderRadius: 22,
    overflow: "hidden",
    background:
      "linear-gradient(180deg, rgba(10,23,64,0.6), rgba(5,13,34,0.85))",
    border: "1px solid rgba(255,255,255,0.07)",
    boxShadow:
      "0 60px 120px -40px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)",
    backdropFilter: "blur(14px)",
  },
  header: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    padding: "22px 28px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    gap: 24,
  },
  eyebrow: {
    fontFamily: "JetBrains Mono, monospace",
    fontSize: "clamp(10px, 1.05vw, 16px)",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "var(--champagne)",
  },
  frameLabel: {
    fontFamily: "JetBrains Mono, monospace",
    fontSize: "clamp(10px, 1.05vw, 16px)",
    letterSpacing: "0.16em",
    color: "var(--ink-soft)",
  },
  stage: {
    position: "relative",
    aspectRatio: "16/9",
    overflow: "hidden",
    background: "#000",
  },
  imageLayer: {
    position: "absolute",
    inset: 0,
    backgroundSize: "cover",
    backgroundPosition: "center",
    transformOrigin: "50% 50%",
    transition:
      "transform 1400ms cubic-bezier(.22,.61,.36,1), filter 800ms ease",
    filter: "saturate(0.95) contrast(1.05) brightness(0.92)",
  },
  vignette: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    background:
      "radial-gradient(ellipse at center, transparent 50%, rgba(3,8,26,0.55) 100%)",
    mixBlendMode: "multiply",
  },
  scanline: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    background:
      "repeating-linear-gradient(0deg, rgba(255,255,255,0.014) 0 1px, transparent 1px 3px)",
    opacity: 0.5,
  },
  highlight: {
    position: "absolute",
    border: "1.5px solid var(--champagne)",
    boxShadow:
      "0 0 0 1px rgba(212,181,116,0.18), 0 0 40px rgba(212,181,116,0.35)",
    borderRadius: 4,
    transition: "all 900ms cubic-bezier(.22,.61,.36,1), opacity 600ms ease",
  },
  caption: {
    position: "absolute",
    left: "5%",
    right: "5%",
    bottom: 28,
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    columnGap: 22,
    rowGap: 6,
    padding: "clamp(14px, 1.5vw, 28px) clamp(18px, 1.8vw, 36px)",
    background: "rgba(5,13,34,0.55)",
    backdropFilter: "blur(18px) saturate(1.4)",
    border: "1px solid rgba(212,181,116,0.22)",
    borderRadius: 14,
    transition:
      "opacity 500ms ease, transform 700ms cubic-bezier(.22,.61,.36,1)",
  },
  capNum: {
    fontFamily: "Cormorant Garamond, serif",
    fontSize: "clamp(40px, 4.5vw, 90px)",
    lineHeight: 0.85,
    color: "var(--champagne)",
    fontWeight: 500,
    fontStyle: "italic",
  },
  capTitle: {
    fontFamily: "Cormorant Garamond, serif",
    fontSize: "clamp(22px, 2.2vw, 48px)",
    lineHeight: 1.05,
    color: "var(--bone)",
    marginTop: 4,
  },
  capBody: {
    fontSize: "clamp(13px, 1.45vw, 22px)",
    lineHeight: 1.55,
    color: "var(--ink)",
    maxWidth: 640,
    gridColumn: "2",
  },
  controls: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "16px 28px",
    borderTop: "1px solid rgba(255,255,255,0.07)",
    background: "rgba(5,13,34,0.5)",
  },
  dotRow: { display: "flex", gap: 8, marginLeft: 4 },
  playBtn: {
    width: 36,
    height: 36,
    borderRadius: 999,
    background: "rgba(212,181,116,0.12)",
    border: "1px solid rgba(212,181,116,0.4)",
    color: "var(--champagne)",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
  },
  progress: {
    flex: 1,
    height: 2,
    background: "rgba(212,181,116,0.14)",
    borderRadius: 2,
    overflow: "hidden",
    position: "relative",
  },
  progressFill: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(90deg, transparent, var(--champagne))",
    transformOrigin: "left",
    transition: "transform 80ms linear",
  },
  legend: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    padding: "16px 28px 22px",
    borderTop: "1px solid rgba(255,255,255,0.07)",
  },
};

export const procStyles = {
  section: {
    maxWidth: "min(90%, 96vw)",
    margin: "clamp(80px, 8vw, 160px) auto 0",
    padding: "0 clamp(20px, 2vw, 80px)",
  },
  list: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 0,
    marginTop: "clamp(40px, 5vw, 96px)",
    position: "relative",
    listStyle: "none",
    padding: 0,
  },
  step: { padding: "0 clamp(16px, 2vw, 36px)", position: "relative" },
  stepDot: {
    width: 14,
    height: 14,
    borderRadius: 999,
    border: "1.5px solid var(--champagne)",
    background: "var(--midnight)",
    position: "relative",
    zIndex: 2,
  },
  stepLine: {
    position: "absolute",
    top: 6,
    left: 14,
    right: -24,
    height: 1,
    background:
      "linear-gradient(90deg, var(--champagne) 0%, rgba(212,181,116,0.15) 100%)",
  },
  stepNum: {
    fontFamily: "JetBrains Mono, monospace",
    fontSize: "clamp(10px, 1.05vw, 16px)",
    letterSpacing: "0.18em",
    color: "var(--ink-soft)",
    marginTop: "clamp(16px, 1.8vw, 32px)",
  },
  stepTitle: {
    fontSize: "clamp(18px, 2.1vw, 40px)",
    marginTop: 8,
    color: "var(--bone)",
    lineHeight: 1.15,
  },
  stepBody: {
    fontSize: "clamp(12px, 1.4vw, 24px)",
    lineHeight: 1.6,
    color: "var(--ink-soft)",
    marginTop: 10,
  },
};

export const USLUGE_RESPONSIVE_CSS = `
  @media (min-width: 1680px) {
    .usluge-page {
      --u-fs-body: 19px;
      --u-fs-body-lg: 24px;
      --u-fs-ui: 17px;
      --u-fs-label: 13px;
    }
    .u-hero-grid { gap: clamp(60px, 5vw, 100px) !important; }
    .u-svc-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 48px !important; }
    .u-klase-grid, .u-std-grid { grid-template-columns: repeat(5, 1fr) !important; }
    .u-mko-cards { grid-template-columns: repeat(5, 1fr) !important; }
    .u-proc-list { grid-template-columns: repeat(4, 1fr) !important; }
  }

  @media (min-width: 1920px) {
    .usluge-page {
      --u-fs-body: 22px;
      --u-fs-body-lg: 28px;
      --u-fs-ui: 19px;
      --u-fs-label: 14px;
    }
    .u-hero-grid { grid-template-columns: 1fr 1fr !important; gap: clamp(80px, 6vw, 120px) !important; }
    .u-svc-grid { gap: clamp(32px, 2.5vw, 56px) !important; }
    .u-klase-grid, .u-std-grid { grid-template-columns: repeat(4, 1fr) !important; gap: clamp(16px, 1.5vw, 32px) !important; }
    .u-mko-cards { grid-template-columns: repeat(5, 1fr) !important; gap: clamp(14px, 1.3vw, 28px) !important; }
    .u-proc-list { grid-template-columns: repeat(4, 1fr) !important; }
    .u-cta-card { padding: clamp(64px, 6vw, 120px) clamp(56px, 5vw, 100px) !important; }
  }

  @media (min-width: 2560px) {
    .usluge-page {
      --u-fs-body: 26px;
      --u-fs-body-lg: 34px;
      --u-fs-ui: 22px;
      --u-fs-label: 16px;
    }
    .u-hero-grid { gap: clamp(100px, 7vw, 140px) !important; }
    .u-klase-grid, .u-std-grid { grid-template-columns: repeat(6, 1fr) !important; }
    .u-svc-grid { grid-template-columns: repeat(3, 1fr) !important; }
  }

  @media (max-width: 1200px) {
    .u-klase-grid, .u-std-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .u-mko-cards { grid-template-columns: repeat(3, 1fr) !important; }
    .u-proc-list { grid-template-columns: repeat(2, 1fr) !important; gap: 40px 0 !important; }
    .u-proc-list .step-line { display: none !important; }
  }

  @media (max-width: 900px) {
    .u-hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
    .u-hero-art { max-width: 360px; margin: 0 auto; }
    .u-hero-stats { grid-template-columns: repeat(2, 1fr) !important; }
    .u-svc-grid { grid-template-columns: 1fr !important; }
    .u-mko-intro { grid-template-columns: 1fr !important; gap: 24px !important; align-items: start !important; }
    .u-mko-inner { grid-template-columns: 1fr !important; padding: 32px !important; }
    .u-mko-cards { grid-template-columns: repeat(2, 1fr) !important; }
    .u-mko-pad { padding: 0 24px 32px !important; }
    .u-cta-card { grid-template-columns: 1fr !important; padding: 48px 32px !important; }
    .u-zig-header { flex-direction: column !important; align-items: flex-start !important; gap: 20px !important; }
    .u-zig-stage { aspect-ratio: auto !important; display: flex !important; flex-direction: column !important; }
    .u-zig-img { position: relative !important; aspect-ratio: 4/3 !important; width: 100% !important; inset: auto !important; }
    .u-zig-vignette, .u-zig-scanline { bottom: auto !important; aspect-ratio: 4/3 !important; }
    .u-zig-cap { position: relative !important; left: 0 !important; right: 0 !important; bottom: 0 !important; border-radius: 0 !important; border-left: none !important; border-right: none !important; grid-template-columns: 1fr !important; row-gap: 6px !important; padding: 18px 22px !important; backdrop-filter: none !important; background: rgba(5,13,34,0.7) !important; }
    .u-zig-cap-num { font-size: 36px !important; }
    .u-zig-cap-title { font-size: 22px !important; }
    .u-zig-cap-body { grid-column: 1 !important; font-size: 13.5px !important; }
    .u-zig-controls, .u-zig-legend { padding: 14px 20px !important; }
    .u-mko-stage { aspect-ratio: 4/3 !important; }
    .u-mko-scene-zoom { transform: scale(0.68) !important; transform-origin: 50% 50% !important; }
    .u-mko-storycap { position: relative !important; left: auto !important; right: auto !important; bottom: auto !important; grid-template-columns: 1fr !important; border-radius: 0 !important; margin: 0 !important; }
  }

  @media (max-width: 600px) {
    .u-mko-stage { aspect-ratio: 16/9 !important; }
    .u-mko-scene-zoom { transform: scale(0.58) !important; transform-origin: 50% 50% !important; }
    .u-mko-storycap { text-align: center !important; padding: 16px 18px !important; }
    .u-mko-storycap > div:first-child { font-size: 32px !important; opacity: 0.7; }
    .u-mko-pad { padding: 0 16px 24px !important; }
    .u-hero-stats { grid-template-columns: 1fr !important; }
    .u-klase-grid, .u-std-grid, .u-mko-cards { grid-template-columns: 1fr !important; }
    .u-proc-list { grid-template-columns: 1fr !important; gap: 32px 0 !important; }
    .u-proc-list .step-line { display: none !important; }
    .u-cta-side { gap: 12px !important; }
    .u-cta-card { padding: 36px 22px !important; }
    .u-zig-img { aspect-ratio: 3/2 !important; }
    .u-zig-header h2, .u-mko-intro h2, .u-cta-card h2 { font-size: clamp(28px, 8vw, 40px) !important; }
    .usluge-page > * { padding-left: 16px !important; padding-right: 16px !important; }
  }
`;

export const ctaStyles = {
  section: {
    maxWidth: "min(90%, 96vw)",
    margin: "clamp(100px, 10vw, 180px) auto clamp(60px, 6vw, 120px)",
    padding: "0 clamp(20px, 2vw, 80px)",
  },
  card: {
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
    border: "1px solid rgba(255,255,255,0.07)",
    boxShadow:
      "0 30px 60px -30px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
    backdropFilter: "blur(18px) saturate(1.2)",
    borderRadius: 18,
    padding: "clamp(48px, 5vw, 96px) clamp(40px, 4.5vw, 88px)",
    display: "grid",
    gridTemplateColumns: "1.4fr 1fr",
    gap: "clamp(32px, 4vw, 72px)",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  bg: {
    position: "absolute",
    top: -100,
    right: -100,
    width: 500,
    height: 500,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(212,181,116,0.18) 0%, transparent 60%)",
    pointerEvents: "none",
  },
  title: {
    fontSize: "clamp(36px, 4vw, 96px)",
    lineHeight: 1.02,
    fontWeight: 400,
    color: "var(--bone)",
    fontStyle: "italic",
  },
  body: {
    fontSize: "clamp(14px, 1.6vw, 32px)",
    lineHeight: 1.65,
    color: "var(--ink)",
    marginTop: 18,
    maxWidth: "clamp(360px, 36vw, 720px)",
  },
  side: { display: "grid", gap: "clamp(12px, 1.2vw, 24px)" },
  contact: {
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
    border: "1px solid rgba(255,255,255,0.07)",
    boxShadow:
      "0 30px 60px -30px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
    backdropFilter: "blur(18px) saturate(1.2)",
    borderRadius: 18,
    padding: "clamp(16px, 1.5vw, 30px) clamp(18px, 1.8vw, 36px)",
    display: "flex",
    alignItems: "center",
    gap: "clamp(12px, 1.2vw, 24px)",
  },
  contactLabel: {
    fontSize: "clamp(9px, 1vw, 16px)",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "var(--ink-soft)",
    fontFamily: "JetBrains Mono, monospace",
  },
  contactValue: {
    fontSize: "clamp(16px, 1.9vw, 30px)",
    color: "var(--bone)",
    marginTop: 4,
    fontFamily: "Cormorant Garamond, serif",
    fontStyle: "italic",
  },
  contactIcon: {
    width: "clamp(32px, 3vw, 56px)",
    height: "clamp(32px, 3vw, 56px)",
    borderRadius: 999,
    display: "grid",
    placeItems: "center",
    color: "var(--champagne)",
    border: "1px solid rgba(212,181,116,0.3)",
    background: "rgba(212,181,116,0.06)",
  },
};
