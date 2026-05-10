import { IconArrow } from "./icons.jsx";
import { ctaStyles, heroStyles, svcStyles } from "./uslugeStyles.js";
import { USLUGE_CONFIG } from "./uslugeConfig.js";

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M5 4h4l2 5-2 1a12 12 0 005 5l1-2 5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
  </svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.4">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </svg>
);
const PinIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M12 22s7-7 7-12a7 7 0 10-14 0c0 5 7 12 7 12z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

export default function CTA() {
  const { contact } = USLUGE_CONFIG;
  const primaryPhone = contact.phones[0];

  return (
    <section id="kontakt" style={ctaStyles.section} data-screen-label="cta">
      <div style={ctaStyles.card} className="u-cta-card">
        <div style={ctaStyles.bg} />
        <div>
          <div style={{ ...svcStyles.eyebrow, marginBottom: 16 }}>VII — Kontakt</div>
          <h2 style={ctaStyles.title}>
            Imate vagu kojoj ističe žig?<br />Mi dolazimo.
          </h2>
          <p style={ctaStyles.body}>
            Pozovite ili pošaljite poruku — odgovaramo u toku radnog dana. Servisni
            tim pokriva celu Srbiju, sa istim standardom i u Beogradu i u najmanjoj
            opštini.
          </p>
          <div style={{ display: "flex", gap: 14, marginTop: 32, flexWrap: "wrap" }}>
            <a href={primaryPhone.href} style={heroStyles.ctaPrimary}>
              Pozovi sada <IconArrow />
            </a>
            <a href="/kontakt" style={heroStyles.ctaGhost}>Pošalji poruku</a>
          </div>
        </div>
        <div style={ctaStyles.side} className="u-cta-side">
          {contact.phones.map((p, i) => (
            <div key={i} style={ctaStyles.contact}>
              <div style={ctaStyles.contactIcon}><PhoneIcon /></div>
              <div>
                <div style={ctaStyles.contactLabel}>{p.label}</div>
                <a href={p.href} style={{ ...ctaStyles.contactValue, textDecoration: "none" }}>{p.value}</a>
              </div>
            </div>
          ))}
          <div style={ctaStyles.contact}>
            <div style={ctaStyles.contactIcon}><MailIcon /></div>
            <div>
              <div style={ctaStyles.contactLabel}>E-mail</div>
              <a href={`mailto:${contact.email}`} style={{ ...ctaStyles.contactValue, textDecoration: "none" }}>{contact.email}</a>
            </div>
          </div>
          <div style={ctaStyles.contact}>
            <div style={ctaStyles.contactIcon}><PinIcon /></div>
            <div>
              <div style={ctaStyles.contactLabel}>Adresa</div>
              <div style={ctaStyles.contactValue}>{contact.location}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "40px 4px 0", color: "var(--ink-soft)", fontSize: 12.5, fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.08em", flexWrap: "wrap", gap: 16 }}>
        <span>© {new Date().getFullYear()} VagaBeta · Akreditovan servis</span>
        <span>OIML R76 · ISO 17025 · Sve klase tačnosti</span>
      </div>
    </section>
  );
}
