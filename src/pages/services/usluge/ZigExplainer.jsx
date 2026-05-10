import { useEffect, useRef, useState } from "react";
import { explStyles, svcStyles } from "./uslugeStyles.js";
import { USLUGE_CONFIG } from "./uslugeConfig.js";

const { frames: FRAMES, image, imageAlt, frameMs: FRAME_MS } = USLUGE_CONFIG.zigExplainer;

function chipStyle(active) {
  return {
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
  };
}

function dotStyle(active) {
  return {
    width: active ? 28 : 8,
    height: 8,
    borderRadius: 999,
    background: active ? "var(--champagne)" : "rgba(212,181,116,0.22)",
    border: "none",
    cursor: "pointer",
    transition: "all 400ms ease",
    padding: 0,
  };
}

export default function ZigExplainer() {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const startRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    startRef.current = performance.now();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
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
    <section style={{ ...explStyles.wrap, marginTop: 120 }} data-screen-label="zig-explainer">
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28, gap: 32, flexWrap: "wrap" }}>
        <div>
          <div style={{ ...explStyles.eyebrow, marginBottom: 12 }}>I — Anatomija žiga</div>
          <h2 style={{ fontSize: "clamp(36px, 5vw, 64px)", lineHeight: 1.02, maxWidth: 720, fontStyle: "italic", fontWeight: 400, color: "var(--bone)" }}>
            Šta je <span style={{ color: "var(--champagne)" }}>žig</span>, a šta{" "}
            <span style={{ color: "var(--champagne)" }}>overavanje</span>?
          </h2>
        </div>
        <p style={{ maxWidth: 380, color: "var(--ink)", fontSize: 15.5, lineHeight: 1.6 }}>
          Pogledajte stvarnu vagu iz našeg servisa. Kratak vizuelni vodič kroz elemente
          koje proverava akreditovano telo prilikom zakonske verifikacije.
        </p>
      </div>

      <div style={explStyles.shell}>
        <div style={explStyles.header}>
          <div style={explStyles.eyebrow}>Vizuelni vodič · ELICOM EVL-LB · Kl. III</div>
          <div style={explStyles.frameLabel}>{f.label}</div>
        </div>

        <div style={explStyles.stage}>
          <div style={{ ...explStyles.imageLayer, backgroundImage: `url(${image})`, transform }} />
          <div style={explStyles.vignette} />
          <div style={explStyles.scanline} />

          {f.box && (
            <div style={{
              position: "absolute", inset: 0, transform, transformOrigin: "50% 50%",
              transition: "transform 1400ms cubic-bezier(.22,.61,.36,1)",
            }}>
              <div style={{
                ...explStyles.highlight,
                left: `${f.box.left}%`,
                top: `${f.box.top}%`,
                width: `${f.box.width}%`,
                height: `${f.box.height}%`,
              }}>
                {["tl", "tr", "bl", "br"].map((c) => {
                  const pos = {
                    tl: { left: -6, top: -6 },
                    tr: { right: -6, top: -6 },
                    bl: { left: -6, bottom: -6 },
                    br: { right: -6, bottom: -6 },
                  }[c];
                  return (
                    <div key={c} style={{
                      position: "absolute", width: 10, height: 10,
                      border: "1.5px solid var(--champagne)", ...pos,
                      background: "var(--midnight)",
                    }} />
                  );
                })}
              </div>
            </div>
          )}

          <div key={idx} style={{ ...explStyles.caption, animation: "capRise 700ms cubic-bezier(.22,.61,.36,1) both" }}>
            <div style={explStyles.capNum}>{String(idx + 1).padStart(2, "0")}</div>
            <h3 style={explStyles.capTitle}>{f.title}</h3>
            <p style={explStyles.capBody}>{f.body}</p>
          </div>
        </div>

        <div style={explStyles.controls}>
          <button style={explStyles.playBtn} onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pauziraj" : "Pusti"}>
            {playing ? (
              <svg width="12" height="12" viewBox="0 0 12 12">
                <rect x="2" y="1.5" width="3" height="9" fill="currentColor" />
                <rect x="7" y="1.5" width="3" height="9" fill="currentColor" />
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 12 12">
                <path d="M2.5 1.5l8 4.5-8 4.5z" fill="currentColor" />
              </svg>
            )}
          </button>
          <div style={explStyles.progress}>
            <div style={{ ...explStyles.progressFill, transform: `scaleX(${progress})` }} />
          </div>
          <div style={explStyles.dotRow}>
            {FRAMES.map((_, i) => (
              <button key={i} style={dotStyle(i === idx)} onClick={() => {
                setIdx(i);
                startRef.current = typeof performance !== "undefined" ? performance.now() : 0;
                setProgress(0);
              }} aria-label={`Frame ${i + 1}`} />
            ))}
          </div>
        </div>

        <div style={explStyles.legend}>
          {FRAMES.map((fr, i) => (
            <button key={i} style={chipStyle(i === idx)} onClick={() => {
              setIdx(i);
              startRef.current = typeof performance !== "undefined" ? performance.now() : 0;
              setProgress(0);
            }}>
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
