// Animated "Šta je žig?" explainer. Centerpiece scene.
// Auto-advancing storyboard with cinematic zoom + annotations on the real scale photo.

const { useEffect, useRef, useState } = React;

// Storyboard frames — each is a (transform, annotations) state
// The image is 1600×831; we crop with object-position + scale
const FRAMES = [
  {
    label: "01 — Tipska pločica",
    title: "Svaka legalna vaga nosi pločicu",
    body: "Identitet vage: tip, fabrički broj, klasa tačnosti, opseg. Bez ovoga — vaga nije u zakonskoj upotrebi.",
    // image transform
    scale: 1.0,
    x: 0, y: 0,
    // highlight rectangle in % of image
    box: null,
    // arrow target
    target: null,
  },
  {
    label: "02 — Žig overavanja",
    title: "Ovo je žig.",
    body: "Holografska nalepnica sa brojevima 1–12 oko mernog simbola. Brojevi označavaju mesec i godinu kada je vaga overena. Skidanje žiga ugrožava zakonski identitet vage.",
    scale: 2.6,
    x: -38, y: 12,
    box: { left: 7.5, top: 38, width: 13, height: 38 },
    target: "zig",
  },
  {
    label: "03 — Plomba akreditovanog tela",
    title: "Plomba i overavač.",
    body: "Narandžasta plomba potvrđuje da je vagu pregledalo ovlašćeno akreditovano telo. Bez plombe — merenje nije pravosnažno.",
    scale: 2.4,
    x: 38, y: 4,
    box: { left: 86.5, top: 50, width: 11, height: 32 },
    target: "plomba",
  },
  {
    label: "04 — Klasa tačnosti",
    title: "Klasa III — tržišna preciznost.",
    body: "OIML klasifikuje vage od I (laboratorijska) do IIII (gruba industrijska). Vaše obaveze zavise od klase i namene.",
    scale: 2.3,
    x: 0, y: -8,
    box: { left: 56, top: 50, width: 22, height: 14 },
    target: "klasa",
  },
];

const explStyles = {
  wrap: {
    position: "relative",
    margin: "0 auto",
    maxWidth: 1280,
    padding: "0 32px",
  },
  shell: {
    position: "relative",
    borderRadius: 22,
    overflow: "hidden",
    background: "linear-gradient(180deg, rgba(10,23,64,0.6), rgba(5,13,34,0.85))",
    border: "1px solid var(--line)",
    boxShadow: "0 60px 120px -40px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)",
    backdropFilter: "blur(14px)",
  },
  header: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    padding: "22px 28px 16px",
    borderBottom: "1px solid var(--line)",
    gap: 24,
  },
  eyebrow: {
    fontFamily: "JetBrains Mono, monospace",
    fontSize: 11,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "var(--champagne)",
  },
  frameLabel: {
    fontFamily: "JetBrains Mono, monospace",
    fontSize: 11,
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
    backgroundImage: "url(assets/scale.jpg)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    transformOrigin: "50% 50%",
    transition: "transform 1400ms cubic-bezier(.22,.61,.36,1), filter 800ms ease",
    filter: "saturate(0.95) contrast(1.05) brightness(0.92)",
  },
  vignette: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    background: "radial-gradient(ellipse at center, transparent 50%, rgba(3,8,26,0.55) 100%)",
    mixBlendMode: "multiply",
  },
  scanline: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    background: "repeating-linear-gradient(0deg, rgba(255,255,255,0.014) 0 1px, transparent 1px 3px)",
    opacity: 0.5,
  },
  highlight: {
    position: "absolute",
    border: "1.5px solid var(--champagne)",
    boxShadow: "0 0 0 1px rgba(212,181,116,0.18), 0 0 40px rgba(212,181,116,0.35)",
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
    padding: "20px 24px",
    background: "rgba(5,13,34,0.55)",
    backdropFilter: "blur(18px) saturate(1.4)",
    border: "1px solid rgba(212,181,116,0.22)",
    borderRadius: 14,
    transition: "opacity 500ms ease, transform 700ms cubic-bezier(.22,.61,.36,1)",
  },
  capNum: {
    fontFamily: "Cormorant Garamond, serif",
    fontSize: 56,
    lineHeight: 0.85,
    color: "var(--champagne)",
    fontWeight: 500,
    fontStyle: "italic",
  },
  capTitle: {
    fontFamily: "Cormorant Garamond, serif",
    fontSize: 28,
    lineHeight: 1.05,
    color: "var(--bone)",
    marginTop: 4,
  },
  capBody: {
    fontSize: 14.5,
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
    borderTop: "1px solid var(--line)",
    background: "rgba(5,13,34,0.5)",
  },
  dotRow: { display: "flex", gap: 8, marginLeft: 4 },
  dot: (active) => ({
    width: active ? 28 : 8,
    height: 8,
    borderRadius: 999,
    background: active ? "var(--champagne)" : "rgba(212,181,116,0.22)",
    border: "none",
    cursor: "pointer",
    transition: "all 400ms ease",
    padding: 0,
  }),
  playBtn: {
    width: 36, height: 36, borderRadius: 999,
    background: "rgba(212,181,116,0.12)",
    border: "1px solid rgba(212,181,116,0.4)",
    color: "var(--champagne)",
    display: "grid", placeItems: "center", cursor: "pointer",
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
    position: "absolute", inset: 0,
    background: "linear-gradient(90deg, transparent, var(--champagne))",
    transformOrigin: "left",
    transition: "transform 80ms linear",
  },
  legend: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    padding: "16px 28px 22px",
    borderTop: "1px solid var(--line)",
  },
  chip: (active) => ({
    fontFamily: "JetBrains Mono, monospace",
    fontSize: 11,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    padding: "8px 14px",
    borderRadius: 999,
    border: "1px solid",
    borderColor: active ? "rgba(212,181,116,0.6)" : "rgba(255,255,255,0.08)",
    background: active ? "rgba(212,181,116,0.12)" : "rgba(255,255,255,0.02)",
    color: active ? "var(--champagne)" : "var(--ink-soft)",
    cursor: "pointer",
    transition: "all 300ms ease",
  }),
};

function ZigExplainer() {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const FRAME_MS = 6500;
  const startRef = useRef(performance.now());

  useEffect(() => {
    if (!playing) return;
    startRef.current = performance.now();
    let raf;
    const tick = () => {
      const t = (performance.now() - startRef.current) / FRAME_MS;
      if (t >= 1) {
        setIdx((i) => (i + 1) % FRAMES.length);
        startRef.current = performance.now();
        setProgress(0);
      } else {
        setProgress(t);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, idx]);

  const f = FRAMES[idx];
  const transform = `scale(${f.scale}) translate(${f.x}%, ${f.y}%)`;

  return (
    <section style={explStyles.wrap} data-screen-label="zig-explainer">
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28, gap: 32, flexWrap: "wrap" }}>
        <div>
          <div style={{ ...explStyles.eyebrow, marginBottom: 12 }}>I — Anatomija žiga</div>
          <h2 style={{ fontSize: "clamp(36px, 5vw, 64px)", lineHeight: 1.02, maxWidth: 720, fontStyle: "italic", fontWeight: 400 }}>
            Šta je <span style={{ color: "var(--champagne)" }}>žig</span>, a šta <span style={{ color: "var(--champagne)" }}>overavanje</span>?
          </h2>
        </div>
        <p style={{ maxWidth: 380, color: "var(--ink)", fontSize: 15.5, lineHeight: 1.6 }}>
          Pogledajte stvarnu vagu iz našeg servisa. Kratak vizuelni vodič kroz elemente koje proverava akreditovano telo prilikom zakonske verifikacije.
        </p>
      </div>

      <div style={explStyles.shell}>
        <div style={explStyles.header}>
          <div style={explStyles.eyebrow}>Vizuelni vodič · ELICOM EVL-LB · Kl. III</div>
          <div style={explStyles.frameLabel}>{f.label}</div>
        </div>

        <div style={explStyles.stage}>
          <div style={{ ...explStyles.imageLayer, transform }} />
          <div style={explStyles.vignette} />
          <div style={explStyles.scanline} />

          {/* Highlight box, transformed in sync with image */}
          {f.box && (
            <div style={{ position: "absolute", inset: 0, transform, transformOrigin: "50% 50%", transition: "transform 1400ms cubic-bezier(.22,.61,.36,1)" }}>
              <div style={{
                ...explStyles.highlight,
                left: `${f.box.left}%`,
                top: `${f.box.top}%`,
                width: `${f.box.width}%`,
                height: `${f.box.height}%`,
              }}>
                {/* Corner ticks */}
                {["tl","tr","bl","br"].map((c) => {
                  const pos = {
                    tl: { left: -6, top: -6 },
                    tr: { right: -6, top: -6 },
                    bl: { left: -6, bottom: -6 },
                    br: { right: -6, bottom: -6 },
                  }[c];
                  return <div key={c} style={{ position: "absolute", width: 10, height: 10, border: "1.5px solid var(--champagne)", ...pos, background: "var(--midnight)" }} />;
                })}
              </div>
            </div>
          )}

          {/* Caption card */}
          <div key={idx} style={{ ...explStyles.caption, animation: "capRise 700ms cubic-bezier(.22,.61,.36,1) both" }}>
            <div style={explStyles.capNum}>{String(idx + 1).padStart(2, "0")}</div>
            <h3 style={explStyles.capTitle}>{f.title}</h3>
            <p style={explStyles.capBody}>{f.body}</p>
          </div>
        </div>

        <div style={explStyles.controls}>
          <button style={explStyles.playBtn} onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pauziraj" : "Pusti"}>
            {playing ? (
              <svg width="12" height="12" viewBox="0 0 12 12"><rect x="2" y="1.5" width="3" height="9" fill="currentColor"/><rect x="7" y="1.5" width="3" height="9" fill="currentColor"/></svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2.5 1.5l8 4.5-8 4.5z" fill="currentColor"/></svg>
            )}
          </button>
          <div style={explStyles.progress}>
            <div style={{ ...explStyles.progressFill, transform: `scaleX(${progress})` }} />
          </div>
          <div style={explStyles.dotRow}>
            {FRAMES.map((_, i) => (
              <button key={i} style={explStyles.dot(i === idx)} onClick={() => { setIdx(i); startRef.current = performance.now(); setProgress(0); }} aria-label={`Frame ${i+1}`} />
            ))}
          </div>
        </div>

        <div style={explStyles.legend}>
          {FRAMES.map((fr, i) => (
            <button key={i} style={explStyles.chip(i === idx)} onClick={() => { setIdx(i); startRef.current = performance.now(); setProgress(0); }}>
              {fr.label}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes capRise {
          0% { opacity: 0; transform: translateY(14px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

window.ZigExplainer = ZigExplainer;
