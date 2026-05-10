import { useEffect, useState } from "react";
import {
  IconSeal,
  IconWrench,
  IconBolt,
  IconShield,
  IconLab,
} from "./icons.jsx";
import { mkoStyles } from "./uslugeStyles.js";

// === PCB Module SVG ===
function PCBModule({ phase }) {
  return (
    <svg
      viewBox="0 0 360 380"
      width="100%"
      height="auto"
      style={{
        display: "block",
        filter: "drop-shadow(0 30px 60px rgba(74,124,240,0.35))",
      }}
    >
      <defs>
        <linearGradient id="pcbBoard" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a1740" />
          <stop offset="100%" stopColor="#03081a" />
        </linearGradient>
        <linearGradient
          id="pcbEdge"
          x1="0"
          y1="0"
          x2="360"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="rgba(74,124,240,0.0)" />
          <stop offset="50%" stopColor="rgba(126,164,255,0.55)" />
          <stop offset="100%" stopColor="rgba(74,124,240,0.0)" />
        </linearGradient>
        <radialGradient id="chipGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="rgba(212,181,116,0.7)" />
          <stop offset="100%" stopColor="rgba(212,181,116,0)" />
        </radialGradient>
      </defs>
      <rect
        x="20"
        y="40"
        width="320"
        height="300"
        rx="14"
        fill="url(#pcbBoard)"
        stroke="url(#pcbEdge)"
        strokeWidth="1.2"
      />
      {[
        [42, 62],
        [318, 62],
        [42, 318],
        [318, 318],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle
            cx={x}
            cy={y}
            r="6"
            fill="none"
            stroke="rgba(126,164,255,0.4)"
            strokeWidth="1"
          />
          <circle cx={x} cy={y} r="2.5" fill="rgba(126,164,255,0.55)" />
        </g>
      ))}
      <g stroke="rgba(74,124,240,0.45)" strokeWidth="0.8" fill="none">
        <path d="M 60 80 L 60 130 L 110 130 L 110 170" />
        <path d="M 300 80 L 300 130 L 250 130 L 250 170" />
        <path d="M 60 300 L 60 250 L 110 250 L 110 230" />
        <path d="M 300 300 L 300 250 L 250 250 L 250 230" />
        <path d="M 30 200 L 90 200" />
        <path d="M 270 200 L 330 200" />
        <path d="M 180 50 L 180 90" />
        <path d="M 180 310 L 180 340" />
      </g>
      {[
        [60, 80],
        [300, 80],
        [60, 300],
        [300, 300],
        [30, 200],
        [330, 200],
        [180, 50],
        [180, 340],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2" fill="#7ea4ff" />
      ))}
      <g>
        <circle
          cx="180"
          cy="200"
          r="62"
          fill="url(#chipGlow)"
          opacity={0.55 + 0.4 * Math.sin(phase * Math.PI * 2)}
        />
        <rect
          x="130"
          y="170"
          width="100"
          height="60"
          rx="6"
          fill="#0a1740"
          stroke="rgba(212,181,116,0.6)"
          strokeWidth="1.2"
        />
        {Array.from({ length: 8 }).map((_, i) => (
          <g key={i}>
            <rect
              x={134 + i * 12}
              y={166}
              width="4"
              height="6"
              fill="rgba(212,181,116,0.6)"
            />
            <rect
              x={134 + i * 12}
              y={228}
              width="4"
              height="6"
              fill="rgba(212,181,116,0.6)"
            />
          </g>
        ))}
        {Array.from({ length: 4 }).map((_, i) => (
          <g key={i}>
            <rect
              x={126}
              y={176 + i * 12}
              width="6"
              height="4"
              fill="rgba(212,181,116,0.6)"
            />
            <rect
              x={228}
              y={176 + i * 12}
              width="6"
              height="4"
              fill="rgba(212,181,116,0.6)"
            />
          </g>
        ))}
        <text
          x="180"
          y="195"
          textAnchor="middle"
          fontFamily="JetBrains Mono, monospace"
          fontSize="9"
          fill="var(--champagne)"
          letterSpacing="2"
        >
          eVAGA
        </text>
        <text
          x="180"
          y="208"
          textAnchor="middle"
          fontFamily="Cormorant Garamond, serif"
          fontStyle="italic"
          fontSize="14"
          fill="var(--bone)"
        >
          MKO
        </text>
        <text
          x="180"
          y="220"
          textAnchor="middle"
          fontFamily="JetBrains Mono, monospace"
          fontSize="6"
          fill="rgba(165,189,242,0.7)"
          letterSpacing="2"
        >
          v2.4 / Ω
        </text>
      </g>
      <rect
        x="50"
        y="145"
        width="22"
        height="12"
        rx="2"
        fill="rgba(212,181,116,0.55)"
      />
      <rect
        x="288"
        y="145"
        width="22"
        height="12"
        rx="2"
        fill="rgba(212,181,116,0.55)"
      />
      <rect
        x="50"
        y="232"
        width="22"
        height="12"
        rx="2"
        fill="rgba(126,164,255,0.6)"
      />
      <rect
        x="288"
        y="232"
        width="22"
        height="12"
        rx="2"
        fill="rgba(126,164,255,0.6)"
      />
      <circle
        cx="100"
        cy="105"
        r="6"
        fill="#0a1740"
        stroke="rgba(126,164,255,0.6)"
        strokeWidth="1"
      />
      <circle
        cx="260"
        cy="105"
        r="6"
        fill="#0a1740"
        stroke="rgba(126,164,255,0.6)"
        strokeWidth="1"
      />
      <circle
        cx="100"
        cy="290"
        r="6"
        fill="#0a1740"
        stroke="rgba(212,181,116,0.7)"
        strokeWidth="1"
      />
      <circle
        cx="260"
        cy="290"
        r="6"
        fill="#0a1740"
        stroke="rgba(212,181,116,0.7)"
        strokeWidth="1"
      />
      <text
        x="40"
        y="32"
        fontFamily="JetBrains Mono, monospace"
        fontSize="9"
        fill="rgba(126,164,255,0.7)"
        letterSpacing="2"
      >
        eVaga · MKO · MODUL KONTROLE OVERE
      </text>
      <text
        x="40"
        y="362"
        fontFamily="JetBrains Mono, monospace"
        fontSize="8"
        fill="rgba(126,164,255,0.45)"
        letterSpacing="2"
      >
        PWR 3.3V · SRPS ISO/IEC 17020 · MADE IN RS
      </text>
      <text
        x="320"
        y="362"
        textAnchor="end"
        fontFamily="JetBrains Mono, monospace"
        fontSize="8"
        fill="var(--champagne)"
        letterSpacing="2"
      >
        SN 8B-2027
      </text>
      {(() => {
        const t = (phase * 2) % 1;
        const x = 30 + t * 60;
        return <circle cx={x} cy={200} r="3" fill="#fff5dc" opacity="0.9" />;
      })()}
    </svg>
  );
}

// === Storyboard scenes ===
const SCENES = [
  {
    label: "01 — Žigosanje",
    title: "Vaga dobija zakonski žig",
    body: "Akreditovano telo postavlja žig i plombu na overenu vagu. To je polazna tačka — fizička, zakonski validna potvrda tačnosti.",
  },
  {
    label: "02 — Period važenja",
    title: "Overa važi 2 godine",
    body: "Sistem evidentira datum overavanja i automatski izračunava period važenja. Brojač pokazuje koliko vremena je preostalo do sledeće kontrole.",
  },
  {
    label: "03 — MKO praćenje",
    title: "Status u realnom vremenu",
    body: "MKO modul prati status overe — Aktivna, Pred istekom, Istekla. Boje statusa menjaju se kako se rok primiče.",
  },
  {
    label: "04 — Servisna intervencija",
    title: "Najava sledećeg overavanja",
    body: "Serviser i vlasnik dobijaju jasnu informaciju kada je potrebno novo overavanje. Bez papira, bez nagađanja — sve u jednom evidencionom toku.",
  },
];

function Scene1({ phase }) {
  const dropY = phase < 0.5 ? -120 + (phase / 0.5) * 120 : 0;
  const stamped = phase > 0.55;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        placeItems: "center",
      }}
    >
      <div style={{ position: "relative", width: 360, height: 240 }}>
        <svg
          viewBox="0 0 360 240"
          width="360"
          height="240"
          style={{ position: "absolute", inset: 0 }}
        >
          <defs>
            <linearGradient
              id="s1gold"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="0"
              x2="360"
              y2="240"
            >
              <stop offset="0%" stopColor="#a8814b" />
              <stop offset="50%" stopColor="#e8c98a" />
              <stop offset="100%" stopColor="#a8814b" />
            </linearGradient>
          </defs>
          <line
            x1="80"
            y1="200"
            x2="280"
            y2="200"
            stroke="url(#s1gold)"
            strokeWidth="2"
          />
          <path
            d="M150 200 L150 150 L210 150 L210 200 Z"
            fill="none"
            stroke="url(#s1gold)"
            strokeWidth="1.4"
          />
          <line
            x1="180"
            y1="150"
            x2="180"
            y2="60"
            stroke="url(#s1gold)"
            strokeWidth="2"
          />
          <line
            x1="80"
            y1="60"
            x2="280"
            y2="60"
            stroke="url(#s1gold)"
            strokeWidth="2"
          />
          <path
            d="M60 110 Q100 140 140 110 Q100 125 60 110 Z"
            fill="rgba(212,181,116,0.1)"
            stroke="url(#s1gold)"
            strokeWidth="1.4"
          />
          <path
            d="M220 110 Q260 140 300 110 Q260 125 220 110 Z"
            fill="rgba(212,181,116,0.1)"
            stroke="url(#s1gold)"
            strokeWidth="1.4"
          />
          <line
            x1="100"
            y1="60"
            x2="100"
            y2="110"
            stroke="url(#s1gold)"
            strokeWidth="0.8"
          />
          <line
            x1="260"
            y1="60"
            x2="260"
            y2="110"
            stroke="url(#s1gold)"
            strokeWidth="0.8"
          />
        </svg>
        <div
          style={{
            position: "absolute",
            left: 130,
            top: 70 + dropY,
            width: 100,
            height: 100,
          }}
        >
          <svg
            viewBox="0 0 100 100"
            width="100"
            height="100"
            style={{
              filter: stamped
                ? "drop-shadow(0 0 24px rgba(232,201,138,0.7))"
                : "drop-shadow(0 0 8px rgba(232,201,138,0.3))",
            }}
          >
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="rgba(212,181,116,0.18)"
              stroke="rgba(232,201,138,0.7)"
              strokeWidth="1"
            />
            <circle
              cx="50"
              cy="50"
              r="34"
              fill="none"
              stroke="rgba(212,181,116,0.5)"
              strokeWidth="0.6"
            />
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
              return (
                <text
                  key={i}
                  x={50 + Math.cos(a) * 39}
                  y={50 + Math.sin(a) * 39 + 2}
                  textAnchor="middle"
                  fontFamily="JetBrains Mono, monospace"
                  fontSize="5"
                  fill="rgba(232,201,138,0.85)"
                >
                  {(i + 1).toString().padStart(2, "0")}
                </text>
              );
            })}
            <g
              stroke="#0a1740"
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
            >
              <line x1="50" y1="40" x2="50" y2="62" />
              <line x1="42" y1="46" x2="58" y2="46" />
              <path
                d="M42 46 L38 54 L46 54 Z"
                fill="rgba(232,201,138,0.7)"
                stroke="none"
              />
              <path
                d="M58 46 L54 54 L62 54 Z"
                fill="rgba(232,201,138,0.7)"
                stroke="none"
              />
            </g>
          </svg>
          {stamped && (
            <div
              style={{
                position: "absolute",
                inset: -4,
                borderRadius: "50%",
                border: "2px solid rgba(232,201,138,0.7)",
                animation: "stampRipple 1.2s ease-out forwards",
              }}
            />
          )}
        </div>
        <div
          style={{
            position: "absolute",
            top: -10,
            right: -8,
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 10,
            color: "var(--champagne)",
            letterSpacing: "0.2em",
          }}
        >
          ◆ ŽIG · POSTAVLJEN
        </div>
      </div>
    </div>
  );
}

function Scene2({ phase }) {
  const months = Math.floor(phase * 24);
  const startYear = new Date().getFullYear();
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        placeItems: "center",
      }}
    >
      <div style={{ position: "relative", width: 460, textAlign: "center" }}>
        <div
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 11,
            color: "#7ea4ff",
            letterSpacing: "0.22em",
            marginBottom: 10,
          }}
        >
          PERIOD VAŽENJA OVERE
        </div>
        <div
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontStyle: "italic",
            fontSize: 96,
            lineHeight: 1,
            color: "var(--bone)",
          }}
        >
          {String(months).padStart(2, "0")}
          <span style={{ color: "var(--champagne)" }}>/</span>
          <span>24</span>
        </div>
        <div style={{ marginTop: 8, fontSize: 14, color: "var(--ink)" }}>
          meseci · od {startYear} do{" "}
          <span style={{ color: "var(--champagne)" }}>{startYear + 2}</span>
        </div>
        <div
          style={{
            marginTop: 28,
            height: 4,
            background: "rgba(74,124,240,0.18)",
            borderRadius: 4,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(90deg, #7ea4ff, var(--champagne))",
              transformOrigin: "left",
              transform: `scaleX(${phase})`,
              transition: "transform 80ms linear",
              boxShadow: "0 0 12px rgba(212,181,116,0.6)",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 8,
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 9,
            color: "var(--ink-soft)",
            letterSpacing: "0.14em",
          }}
        >
          <span>{startYear}</span>
          <span>{startYear + 1}</span>
          <span style={{ color: "var(--champagne)" }}>
            {startYear + 2} · NOVA OVERA
          </span>
        </div>
      </div>
    </div>
  );
}

function Scene3({ phase }) {
  const stage = phase < 0.4 ? 0 : phase < 0.75 ? 1 : 2;
  const labels = [
    {
      t: "AKTIVNA",
      c: "#5cdc94",
      note: "Overa važi punim kapacitetom · 18 meseci preostalo",
    },
    {
      t: "PRED ISTEKOM",
      c: "var(--champagne)",
      note: "Preporučeno zakazivanje servisa · 2 meseca preostalo",
    },
    {
      t: "ISTEKLA",
      c: "#f08a8a",
      note: "Vaga ne sme biti u javnom prometu · obavezno overavanje",
    },
  ];
  const cur = labels[stage];
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        placeItems: "center",
      }}
    >
      <div
        style={{
          width: 520,
          padding: 28,
          borderRadius: 16,
          background: "rgba(10,23,64,0.6)",
          border: "1px solid rgba(74,124,240,0.3)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 11,
            color: "var(--ink-soft)",
            letterSpacing: "0.2em",
          }}
        >
          MKO · LIVE STATUS
        </div>
        <div
          style={{
            marginTop: 14,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: cur.c,
              boxShadow: `0 0 16px ${cur.c}`,
              animation: "pulse 1.4s ease-in-out infinite",
            }}
          />
          <span
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontStyle: "italic",
              fontSize: 44,
              color: "var(--bone)",
            }}
          >
            {cur.t}
          </span>
        </div>
        <div style={{ marginTop: 12, color: "var(--ink)", fontSize: 14 }}>
          {cur.note}
        </div>
        <div
          style={{
            marginTop: 24,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 10,
          }}
        >
          {labels.map((l, i) => (
            <div
              key={i}
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background:
                  i === stage
                    ? "rgba(74,124,240,0.12)"
                    : "rgba(255,255,255,0.02)",
                border: `1px solid ${i === stage ? l.c : "rgba(74,124,240,0.15)"}`,
                opacity: i === stage ? 1 : 0.55,
                transition: "all 400ms",
              }}
            >
              <div
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 9,
                  color: l.c,
                  letterSpacing: "0.18em",
                }}
              >
                STAGE {String(i + 1).padStart(2, "0")}
              </div>
              <div
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontStyle: "italic",
                  fontSize: 16,
                  color: "var(--bone)",
                  marginTop: 2,
                }}
              >
                {l.t}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Scene4({ phase }) {
  const reveal = Math.min(1, phase * 1.3);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        placeItems: "center",
      }}
    >
      <div
        style={{
          width: 520,
          padding: 24,
          borderRadius: 16,
          background: "rgba(10,23,64,0.7)",
          border: "1px solid rgba(212,181,116,0.4)",
          backdropFilter: "blur(20px)",
          boxShadow: `0 30px 80px rgba(0,0,0,0.5), 0 0 60px rgba(212,181,116,${0.15 + 0.2 * reveal})`,
          transform: `translateY(${(1 - reveal) * 16}px)`,
          opacity: reveal,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 10,
            color: "var(--ink-soft)",
            letterSpacing: "0.18em",
          }}
        >
          <span>SERVISER · OBAVEŠTENJE</span>
          <span style={{ color: "var(--champagne)" }}>◆ NOTIFIKACIJA</span>
        </div>
        <div
          style={{
            marginTop: 18,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 999,
              background: "rgba(212,181,116,0.14)",
              border: "1px solid rgba(212,181,116,0.5)",
              color: "var(--champagne)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <IconWrench size={22} />
          </div>
          <div>
            <div
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontStyle: "italic",
                fontSize: 26,
                color: "var(--bone)",
                lineHeight: 1.1,
              }}
            >
              Vreme je za novo overavanje
            </div>
            <div
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 10.5,
                color: "var(--ink-soft)",
                letterSpacing: "0.16em",
                marginTop: 4,
              }}
            >
              OBJEKAT 03 · KAMIONSKA VAGA · M-3-663
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: 18,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 10,
          }}
        >
          {[
            ["Predlog", "12.06.2028"],
            ["Lokacija", "Niš · objekat 03"],
            ["Servis", "Evidentiran ✓"],
          ].map(([k, v], i) => (
            <div
              key={i}
              style={{
                padding: "10px 12px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(74,124,240,0.18)",
                borderRadius: 8,
              }}
            >
              <div
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 9,
                  color: "var(--ink-soft)",
                  letterSpacing: "0.16em",
                }}
              >
                {k}
              </div>
              <div
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontStyle: "italic",
                  fontSize: 17,
                  color: "var(--bone)",
                  marginTop: 2,
                }}
              >
                {v}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SceneStage({ idx, phase }) {
  const zoom = 1 + phase * 0.08;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: `scale(${zoom})`,
        transformOrigin: "50% 50%",
        transition: "transform 200ms linear",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(74,124,240,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(74,124,240,0.08) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(74,124,240,0.18), transparent 60%)",
        }}
      />
      {idx === 0 && <Scene1 phase={phase} />}
      {idx === 1 && <Scene2 phase={phase} />}
      {idx === 2 && <Scene3 phase={phase} />}
      {idx === 3 && <Scene4 phase={phase} />}
    </div>
  );
}

function Storyboard() {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!playing) return;
    let raf;
    let t0 = performance.now();
    const dur = 6000;
    const tick = () => {
      const elapsed = performance.now() - t0;
      const p = elapsed / dur;
      if (p >= 1) {
        setIdx((i) => (i + 1) % SCENES.length);
        t0 = performance.now();
        setPhase(0);
      } else setPhase(p);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, idx]);

  const scene = SCENES[idx];

  return (
    <div
      className="u-mko-story"
      style={{
        marginTop: 36,
        position: "relative",
        borderRadius: 18,
        overflow: "hidden",
        background:
          "linear-gradient(180deg, rgba(10,23,64,0.6), rgba(3,8,26,0.85))",
        border: "1px solid rgba(74,124,240,0.22)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 22px",
          borderBottom: "1px solid rgba(74,124,240,0.15)",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 10.5,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--ink-soft)",
        }}
      >
        <span style={{ color: "var(--champagne)" }}>
          ◆ Od žiga do digitalne kontrole
        </span>
        <span>{scene.label}</span>
      </div>
      <div className="u-mko-stage-outer" style={{ position: "relative" }}>
        <div
          className="u-mko-stage"
          style={{
            position: "relative",
            aspectRatio: "21/9",
            overflow: "hidden",
            background: "#03081a",
          }}
        >
          <div
            className="u-mko-scene-zoom"
            style={{ position: "absolute", inset: 0 }}
          >
            <SceneStage idx={idx} phase={phase} />
          </div>
        </div>
        <div
          key={idx}
          className="u-mko-storycap"
          style={{
            position: "absolute",
            left: 32,
            right: 32,
            bottom: 28,
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            columnGap: 22,
            padding: "18px 22px",
            background: "rgba(5,13,34,0.6)",
            backdropFilter: "blur(18px) saturate(1.3)",
            border: "1px solid rgba(212,181,116,0.22)",
            borderRadius: 12,
            animation: "capRise 700ms cubic-bezier(.22,.61,.36,1) both",
          }}
        >
          <div
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontStyle: "italic",
              fontSize: 48,
              lineHeight: 0.85,
              color: "var(--champagne)",
            }}
          >
            {String(idx + 1).padStart(2, "0")}
          </div>
          <div>
            <div
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: 22,
                color: "var(--bone)",
                lineHeight: 1.1,
              }}
            >
              {scene.title}
            </div>
            <div
              style={{
                fontSize: 13.5,
                color: "var(--ink)",
                marginTop: 6,
                lineHeight: 1.55,
                maxWidth: 720,
              }}
            >
              {scene.body}
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: 10,
          padding: "14px 22px",
          borderTop: "1px solid rgba(74,124,240,0.15)",
        }}
      >
        <button
          onClick={() => setPlaying((p) => !p)}
          style={{
            width: 32,
            height: 32,
            borderRadius: 999,
            border: "1px solid rgba(212,181,116,0.4)",
            background: "rgba(212,181,116,0.1)",
            color: "var(--champagne)",
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
          }}
        >
          {playing ? (
            <svg width="10" height="10" viewBox="0 0 12 12">
              <rect x="2" y="1.5" width="3" height="9" fill="currentColor" />
              <rect x="7" y="1.5" width="3" height="9" fill="currentColor" />
            </svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 12 12">
              <path d="M2.5 1.5l8 4.5-8 4.5z" fill="currentColor" />
            </svg>
          )}
        </button>
        <div
          style={{
            flex: 1,
            height: 2,
            background: "rgba(212,181,116,0.14)",
            borderRadius: 2,
            overflow: "hidden",
            alignSelf: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(90deg, transparent, var(--champagne))",
              transform: `scaleX(${phase})`,
              transformOrigin: "left",
            }}
          />
        </div>
        {SCENES.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setIdx(i);
              setPhase(0);
            }}
            aria-label={`Scena ${i + 1}`}
            style={{
              width: i === idx ? 28 : 8,
              height: 8,
              borderRadius: 999,
              border: "none",
              background:
                i === idx ? "var(--champagne)" : "rgba(212,181,116,0.22)",
              cursor: "pointer",
              transition: "all 300ms",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function LockIcon({ closing }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path
        d="M8 11V7a4 4 0 018 0v4"
        style={{
          transition: "transform 600ms ease",
          transformOrigin: "12px 11px",
          transform: closing ? "scaleY(1)" : "scaleY(0.7) translateY(-2px)",
        }}
      />
      <circle cx="12" cy="16" r="1.5" fill="currentColor" />
    </svg>
  );
}

function StatusPanel() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let raf;
    const t0 = performance.now();
    const tick = () => {
      setPhase(((performance.now() - t0) / 4000) % 1);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const lockClosing = phase > 0.3;
  const CalIcon = () => (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v4M16 3v4" />
    </svg>
  );

  return (
    <div style={mkoStyles.statusPanel}>
      <div style={mkoStyles.statusHead}>
        <span
          style={{
            display: "inline-flex",
            gap: 8,
            alignItems: "center",
            color: "#5cdc94",
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: "#5cdc94",
              boxShadow: "0 0 10px #5cdc94",
              animation: "pulse 1.6s ease-in-out infinite",
            }}
          />
          LIVE · MKO-Ω
        </span>
        <span style={{ color: "var(--ink-soft)" }}>NODE-7B</span>
      </div>
      <div style={mkoStyles.statusRows}>
        {[
          {
            icon: <IconSeal size={16} />,
            lbl: "Žig",
            val: "Aktivan",
            pill: (
              <span style={mkoStyles.pillOk}>
                ● {Math.floor(80 + Math.sin(phase * Math.PI * 2) * 5)}%
              </span>
            ),
          },
          {
            icon: <CalIcon />,
            lbl: "Overa važi do",
            val: "2028 · jun",
            pill: <span style={mkoStyles.pillGold}>◆ 22 mes</span>,
          },
          {
            icon: <IconShield size={16} />,
            lbl: "Status",
            val: "Validno",
            pill: (
              <span
                style={{
                  ...mkoStyles.pillOk,
                  display: "inline-flex",
                  gap: 6,
                  alignItems: "center",
                }}
              >
                <LockIcon closing={lockClosing} /> Sealed
              </span>
            ),
          },
          {
            icon: <IconBolt size={16} />,
            lbl: "Sledeća kontrola",
            val: "Planirana",
            pill: <span style={mkoStyles.pillGold}>◆ Q2 / 2028</span>,
          },
          {
            icon: <IconWrench size={16} />,
            lbl: "Servis",
            val: "Evidentiran",
            pill: <span style={mkoStyles.pillOk}>● 02 / 2026</span>,
            last: true,
          },
        ].map((r, i) => (
          <div
            key={i}
            style={{
              ...mkoStyles.statusRow,
              ...(r.last ? { borderBottom: "none" } : {}),
            }}
          >
            <span style={mkoStyles.statusIcon}>{r.icon}</span>
            <span>
              <div style={mkoStyles.statusLbl}>{r.lbl}</div>
              <div style={mkoStyles.statusVal}>{r.val}</div>
            </span>
            {r.pill}
          </div>
        ))}
      </div>
    </div>
  );
}

const MKO_CARDS = [
  {
    icon: <IconSeal size={18} />,
    t: "Praćenje važenja žiga",
    b: "Realan uvid u preostali rok važenja overe i jasna vizuelizacija statusa.",
  },
  {
    icon: <IconWrench size={18} />,
    t: "Evidencija servisnih intervencija",
    b: "Hronološki zapis svih servisa, kalibracija i podešavanja.",
  },
  {
    icon: <IconBolt size={18} />,
    t: "Status overe u realnom vremenu",
    b: "Aktivna · Pred istekom · Istekla — bez nagađanja.",
  },
  {
    icon: <IconShield size={18} />,
    t: "Dodatni sigurnosni sloj",
    b: "Tamper-evident sloj iznad zakonskog žiga, ne umesto njega.",
  },
  {
    icon: <IconLab size={18} />,
    t: "Priprema za buduću digitalizaciju",
    b: "Spreman temelj kada zakonski okvir krene ka digitalnim zapisima.",
  },
];

export default function MKOSection() {
  const [pcbPhase, setPcbPhase] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let raf;
    const t0 = performance.now();
    const tick = () => {
      setPcbPhase(((performance.now() - t0) / 5000) % 1);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section style={mkoStyles.section} data-screen-label="mko">
      <div style={mkoStyles.intro} className="u-mko-intro">
        <div>
          <div style={mkoStyles.eyebrow}>
            <span style={mkoStyles.pulseDot} /> V — Modul Kontrole Overe
          </div>
          <h2 style={mkoStyles.h2}>
            eVaga <span style={{ color: "#7ea4ff" }}>MKO</span> — digitalni
            <br />
            sigurnosni sloj za{" "}
            <span style={{ color: "var(--champagne)" }}>kontrolu overe</span>.
          </h2>
          <p style={mkoStyles.sub}>
            Modul Kontrole Overe razvijen je kao dodatni sistem za praćenje
            statusa žiga, servisne istorije i perioda važenja overe na vagama.
          </p>
        </div>
        <p style={mkoStyles.desc}>
          Kod vaga koje se koriste u javnom prometu, zakonska overa i žig imaju
          ograničen rok važenja. eVaga MKO uvodi dodatni nivo kontrole tako što
          omogućava jasniji pregled statusa overe, planiranje naredne kontrole i
          bolju evidenciju servisnih intervencija.
        </p>
      </div>

      <div style={mkoStyles.shell}>
        <div style={mkoStyles.pcbGrid} />
        <div style={mkoStyles.inner} className="u-mko-inner">
          <div style={{ position: "relative" }}>
            <div
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 10.5,
                letterSpacing: "0.2em",
                color: "#7ea4ff",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              ◆ Modul · MKO-Ω · v2.4
            </div>
            <PCBModule phase={pcbPhase} />
            <div
              style={{
                marginTop: 14,
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 10,
                letterSpacing: "0.16em",
                color: "var(--ink-soft)",
                textTransform: "uppercase",
                textAlign: "center",
              }}
            >
              ←—— ŽIG ·· MKO ·· REGISTAR ——→
            </div>
          </div>
          <div>
            <div
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 10.5,
                letterSpacing: "0.2em",
                color: "var(--champagne)",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              ◆ Status panel · Realtime
            </div>
            <StatusPanel />
          </div>
        </div>
        <div style={{ padding: "0 48px 48px" }} className="u-mko-pad">
          <Storyboard />
        </div>
      </div>

      <div style={mkoStyles.cards} className="u-mko-cards">
        {MKO_CARDS.map((c, i) => (
          <article key={i} style={mkoStyles.card}>
            <div style={mkoStyles.cardIcon}>{c.icon}</div>
            <h4 style={mkoStyles.cardTitle}>{c.t}</h4>
            <p style={mkoStyles.cardBody}>{c.b}</p>
          </article>
        ))}
      </div>

      <div style={mkoStyles.note}>
        <span style={mkoStyles.noteIcon}>
          <IconShield size={14} />
        </span>
        <span>
          <strong
            style={{
              color: "var(--champagne)",
              fontFamily: "Cormorant Garamond, serif",
              fontStyle: "italic",
              fontSize: 17,
            }}
          >
            Napomena.
          </strong>{" "}
          MKO ne zamenjuje zakonsko overavanje — već ga dopunjuje kroz bolju
          kontrolu, evidenciju i sigurnost.
        </span>
      </div>

      <style>{`
        @keyframes stampRipple {
          0% { transform: scale(0.85); opacity: 1; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes capRise {
          0% { opacity: 0; transform: translateY(14px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
