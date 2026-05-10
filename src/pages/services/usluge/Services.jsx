import { IconSeal, IconWrench, IconCheck, IconArrow } from "./icons.jsx";
import { svcStyles } from "./uslugeStyles.js";
import { USLUGE_CONFIG } from "./uslugeConfig.js";

const ICONS = { seal: IconSeal, wrench: IconWrench };

function ServiceCard({ num, iconType, title, lead, bullets, screenLabel }) {
  const Icon = ICONS[iconType];
  return (
    <article style={svcStyles.card} data-screen-label={screenLabel}>
      <div style={svcStyles.cardSheen} />
      <div style={svcStyles.cardNum}>— {num}</div>
      <div style={svcStyles.cardIcon}>{Icon && <Icon size={26} />}</div>
      <h3 style={svcStyles.cardTitle}>{title}</h3>
      <p style={svcStyles.cardLead}>{lead}</p>
      <ul style={svcStyles.bullets}>
        {bullets.map((b, i) => (
          <li key={i} style={svcStyles.bullet}>
            <span style={svcStyles.bulletIcon}><IconCheck size={12} /></span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <a href="#kontakt" style={svcStyles.link}>Zatražite ponudu <IconArrow size={14} /></a>
    </article>
  );
}

export default function Services() {
  return (
    <section id="usluge" style={svcStyles.section} data-screen-label="services">
      <div style={svcStyles.header}>
        <div>
          <div style={svcStyles.eyebrow}>II — Naše usluge</div>
          <h2 style={svcStyles.title}>
            Dva osnovna lica posla:<br />
            <span style={{ color: "var(--champagne)" }}>overavanje</span> i{" "}
            <span style={{ color: "var(--champagne)" }}>servis</span>.
          </h2>
        </div>
      </div>
      <div style={svcStyles.grid}>
        {USLUGE_CONFIG.services.map((s, i) => (
          <ServiceCard key={i} {...s} />
        ))}
      </div>
    </section>
  );
}
