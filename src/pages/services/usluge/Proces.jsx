import { procStyles, svcStyles } from "./uslugeStyles.js";
import { USLUGE_CONFIG } from "./uslugeConfig.js";

export default function Proces() {
  const { steps } = USLUGE_CONFIG;
  return (
    <section style={procStyles.section} data-screen-label="proces">
      <div style={svcStyles.header}>
        <div>
          <div style={svcStyles.eyebrow}>VI — Proces</div>
          <h2 style={svcStyles.title}>
            Od poziva do žiga<br />
            — u <span style={{ color: "var(--champagne)" }}>četiri koraka</span>.
          </h2>
        </div>
      </div>
      <ol style={procStyles.list} className="u-proc-list">
        {steps.map((s, i) => (
          <li key={i} style={procStyles.step}>
            <div style={procStyles.stepDot}>
              {i < steps.length - 1 && <div style={procStyles.stepLine} className="step-line" />}
            </div>
            <div style={procStyles.stepNum}>{s.n}</div>
            <h3 style={procStyles.stepTitle}>{s.t}</h3>
            <p style={procStyles.stepBody}>{s.b}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
