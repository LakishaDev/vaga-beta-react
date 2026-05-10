import { IconLab, IconShield, IconScale, IconTruck } from "./icons.jsx";
import { klasaStyles, svcStyles } from "./uslugeStyles.js";
import { USLUGE_CONFIG } from "./uslugeConfig.js";

const KLASA_ICONS = [IconLab, IconShield, IconScale, IconTruck];

export default function Klase() {
  return (
    <section style={klasaStyles.section} data-screen-label="klase">
      <div style={svcStyles.header}>
        <div>
          <div style={svcStyles.eyebrow}>III — Klase tačnosti</div>
          <h2 style={svcStyles.title}>
            Od mikrograma do tona — pokrivamo{" "}
            <span style={{ color: "var(--champagne)" }}>sve četiri klase</span>.
          </h2>
        </div>
        <p
          style={{
            maxWidth: 380,
            color: "var(--ink)",
            fontSize: 15.5,
            lineHeight: 1.6,
          }}
        >
          Klase tačnosti neautomatskih merila mase. Kategorija određuje
          toleranciju, intervale overavanja i zahteve za servis.
        </p>
      </div>
      <div style={klasaStyles.grid} className="u-klase-grid">
        {USLUGE_CONFIG.klase.map((k, i) => {
          const Icon = KLASA_ICONS[i];
          const isSoon = k.status === "soon";
          return (
            <article
              key={i}
              style={{
                ...klasaStyles.card,
                opacity: isSoon ? 0.65 : 1,
                position: "relative",
              }}
            >
              {isSoon && (
                <span
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: 9,
                    letterSpacing: "0.18em",
                    color: "var(--champagne)",
                    border: "1px solid rgba(212,181,116,0.55)",
                    borderRadius: 4,
                    padding: "3px 7px",
                    animation: "pulse 1.6s ease-in-out infinite",
                  }}
                >
                  USKORO
                </span>
              )}
              <div style={{ color: "var(--champagne)", opacity: 0.65 }}>
                {Icon && <Icon />}
              </div>
              <div style={{ ...klasaStyles.roman, marginTop: 12 }}>
                {k.roman}
              </div>
              <h3 style={klasaStyles.klasaTitle}>{k.title}</h3>
              <p style={klasaStyles.klasaBody}>{k.body}</p>
              <span style={klasaStyles.klasaTag}>
                Klasa {k.roman} · tačnost
              </span>
              {k.note && (
                <p
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: 10,
                    color: "var(--ink-soft)",
                    letterSpacing: "0.12em",
                    marginTop: 10,
                    lineHeight: 1.5,
                  }}
                >
                  {k.note}
                </p>
              )}
              {k.highlight && (
                <div
                  style={{
                    marginTop: 14,
                    padding: "10px 14px",
                    borderRadius: 6,
                    border: "1px solid rgba(212,181,116,0.4)",
                    background: "rgba(212,181,116,0.06)",
                    display: "flex",
                    alignItems: "baseline",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Cormorant Garamond, serif",
                      fontStyle: "italic",
                      fontSize: 28,
                      color: "var(--champagne)",
                      lineHeight: 1,
                    }}
                  >
                    25 t
                  </span>
                  <span
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: 9,
                      color: "var(--ink-soft)",
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                    }}
                  >
                    etaloniranih tegova
                  </span>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
