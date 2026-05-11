import { standardsStyles, svcStyles } from "./uslugeStyles.js";
import { USLUGE_CONFIG } from "./uslugeConfig.js";
import ATCSeal from "./ATCSeal.jsx";

export default function Standards() {
  return (
    <section style={standardsStyles.section} data-screen-label="standards">
      <div style={svcStyles.header}>
        <div>
          <div style={svcStyles.eyebrow}>IV — Standardi i akreditacije</div>
          <h2 style={svcStyles.title}>
            Akreditovano{" "}
            <span style={{ color: "var(--champagne)" }}>kontrolno telo</span>.
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
          Akreditacija i usklađenost sa standardima — osnova poverenja u svako
          merenje koje overavamo.
        </p>
      </div>
      <div
        className="u-std-grid"
        style={{
          ...standardsStyles.grid,
          gridTemplateColumns: `repeat(${USLUGE_CONFIG.standards.length}, 1fr)`,
        }}
      >
        {USLUGE_CONFIG.standards.map((s, i) => {
          const isPrimary = s.accent === "primary";
          return (
            <article
              key={i}
              style={{
                ...standardsStyles.card,
                ...(isPrimary
                  ? {
                      border: "1px solid rgba(212,181,116,0.55)",
                      background:
                        "linear-gradient(135deg, rgba(212,181,116,0.06) 0%, rgba(10,23,64,0.55) 100%)",
                    }
                  : {}),
              }}
            >
              {isPrimary ? (
                <div
                  style={{
                    display: "flex",
                    gap: 16,
                    alignItems: "flex-start",
                    marginBottom: 14,
                  }}
                >
                  <ATCSeal size="100%" withGlow={true} />
                  {/* <div>
                    <div style={standardsStyles.code}>{s.code}</div>
                    <h3 style={standardsStyles.title}>{s.title}</h3>
                  </div> */}
                </div>
              ) : (
                <>
                  <div style={standardsStyles.pulseDot} />
                  <div style={standardsStyles.code}>{s.code}</div>
                  <h3 style={standardsStyles.title}>{s.title}</h3>
                </>
              )}
              <p style={standardsStyles.body}>{s.body}</p>
              <div style={standardsStyles.authority}>{s.authority}</div>
            </article>
          );
        })}
      </div>

      {/* SEO microdata block */}
      <dl
        style={{
          marginTop: 32,
          padding: "14px 20px",
          borderRadius: 8,
          border: "1px solid rgba(212,181,116,0.2)",
          background: "rgba(212,181,116,0.03)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "8px 24px",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 10,
          letterSpacing: "0.12em",
        }}
      >
        {[
          ["Akreditacioni broj", "06-373"],
          ["Standard", "SRPS ISO/IEC 17020"],
          ["Telo akreditacije", "Akreditaciono telo Srbije (ATS)"],
          ["Tip kontrolnog tela", "Tip C"],
        ].map(([dt, dd]) => (
          <div
            key={dt}
            style={{ display: "flex", gap: 8, alignItems: "baseline" }}
          >
            <dt
              style={{ color: "rgba(212,181,116,0.55)", whiteSpace: "nowrap" }}
            >
              {dt}:
            </dt>
            <dd style={{ color: "rgba(240,235,226,0.7)", margin: 0 }}>{dd}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
