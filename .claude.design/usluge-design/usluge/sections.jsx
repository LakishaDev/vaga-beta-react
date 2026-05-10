// Hero, service cards, scale-class grid, CTA
const { useEffect: useEf, useRef: useRf, useState: useSt } = React;

// ---------- shared glass card style ----------
const glass = {
  background: "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
  border: "1px solid rgba(255,255,255,0.07)",
  boxShadow: "0 30px 60px -30px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
  backdropFilter: "blur(18px) saturate(1.2)",
  borderRadius: 18,
};

// ---------- Animated balance scale (hero) ----------
function BalanceScale() {
  const [tilt, setTilt] = useSt(0);
  useEf(() => {
    let t = 0; let raf;
    const tick = () => {
      t += 0.016;
      const v = Math.sin(t) * 4 * Math.exp(-((t % 6) * 0.35));
      setTilt(v);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  // Pivot point of the beam
  const PX = 200, PY = 110;
  // Beam half-length (where chains drop)
  const HALF = 130;
  // Compute rotated beam endpoints + chain anchors
  const rad = (tilt * Math.PI) / 180;
  const cos = Math.cos(rad), sin = Math.sin(rad);
  const lx = PX - HALF * cos, ly = PY - HALF * sin;
  const rx = PX + HALF * cos, ry = PY + HALF * sin;
  // Pan top centers (chains hang straight down by gravity)
  const CHAIN_LEN = 60;
  const lpx = lx, lpy = ly + CHAIN_LEN;
  const rpx = rx, rpy = ry + CHAIN_LEN;

  return (
    <svg viewBox="0 0 400 380" style={{ width: "100%", height: "auto", overflow: "visible" }} aria-hidden="true">
      <defs>
        <linearGradient id="goldStroke" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="400" y2="380">
          <stop offset="0%" stopColor="#a8814b"/>
          <stop offset="50%" stopColor="#e8c98a"/>
          <stop offset="100%" stopColor="#a8814b"/>
        </linearGradient>
        <linearGradient id="panFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(232,201,138,0.28)"/>
          <stop offset="100%" stopColor="rgba(212,181,116,0.04)"/>
        </linearGradient>
        <radialGradient id="halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="rgba(212,181,116,0.32)"/>
          <stop offset="100%" stopColor="rgba(212,181,116,0)"/>
        </radialGradient>
      </defs>

      <circle cx="200" cy="180" r="170" fill="url(#halo)"/>

      {/* base plate */}
      <ellipse cx="200" cy="332" rx="80" ry="6" fill="none" stroke="url(#goldStroke)" strokeWidth="1.4"/>
      <line x1="120" y1="328" x2="280" y2="328" stroke="url(#goldStroke)" strokeWidth="2.2" strokeLinecap="round"/>
      {/* pedestal */}
      <path d="M178 328 L188 280 L212 280 L222 328 Z" fill="none" stroke="url(#goldStroke)" strokeWidth="1.4"/>
      {/* column */}
      <line x1="200" y1="280" x2="200" y2={PY} stroke="url(#goldStroke)" strokeWidth="2"/>
      {/* pivot */}
      <circle cx={PX} cy={PY} r="6" fill="#0a1740" stroke="#e8c98a" strokeWidth="1.4"/>
      <circle cx={PX} cy={PY} r="2" fill="#e8c98a"/>

      {/* beam (rotates) */}
      <line x1={lx} y1={ly} x2={rx} y2={ry} stroke="url(#goldStroke)" strokeWidth="2.2" strokeLinecap="round"/>
      {/* beam end caps */}
      <circle cx={lx} cy={ly} r="3" fill="#e8c98a"/>
      <circle cx={rx} cy={ry} r="3" fill="#e8c98a"/>

      {/* left chain (gravity-straight) */}
      <line x1={lx} y1={ly} x2={lpx - 22} y2={lpy} stroke="url(#goldStroke)" strokeWidth="0.9"/>
      <line x1={lx} y1={ly} x2={lpx + 22} y2={lpy} stroke="url(#goldStroke)" strokeWidth="0.9"/>
      {/* right chain */}
      <line x1={rx} y1={ry} x2={rpx - 22} y2={rpy} stroke="url(#goldStroke)" strokeWidth="0.9"/>
      <line x1={rx} y1={ry} x2={rpx + 22} y2={rpy} stroke="url(#goldStroke)" strokeWidth="0.9"/>

      {/* left pan */}
      <ellipse cx={lpx} cy={lpy} rx="26" ry="4" fill="none" stroke="url(#goldStroke)" strokeWidth="1.2"/>
      <path d={`M ${lpx-26} ${lpy} Q ${lpx} ${lpy+24} ${lpx+26} ${lpy} Z`} fill="url(#panFill)" stroke="url(#goldStroke)" strokeWidth="1.6"/>
      <text x={lpx} y={lpy - 12} textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontSize="20" fill="#e8c98a">precizno</text>

      {/* right pan */}
      <ellipse cx={rpx} cy={rpy} rx="26" ry="4" fill="none" stroke="url(#goldStroke)" strokeWidth="1.2"/>
      <path d={`M ${rpx-26} ${rpy} Q ${rpx} ${rpy+24} ${rpx+26} ${rpy} Z`} fill="url(#panFill)" stroke="url(#goldStroke)" strokeWidth="1.6"/>
      <text x={rpx} y={rpy - 12} textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontSize="20" fill="#e8c98a">zakonito</text>

      {/* ground tick scale */}
      <g stroke="rgba(212,181,116,0.32)" strokeWidth="1">
        {Array.from({length: 21}).map((_,i)=>(
          <line key={i} x1={50+i*15} y1="358" x2={50+i*15} y2={i%5===0? 368 : 363}/>
        ))}
      </g>
    </svg>
  );
}

// ---------- Hero ----------
const heroStyles = {
  wrap: {
    position: "relative",
    maxWidth: 1280,
    margin: "0 auto",
    padding: "120px 32px 80px",
  },
  topbar: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginBottom: 90,
  },
  brand: {
    display: "flex", alignItems: "center", gap: 12,
    fontFamily: "Cormorant Garamond, serif", fontSize: 22, color: "var(--bone)", fontStyle: "italic",
  },
  brandMark: {
    width: 36, height: 36, borderRadius: 999,
    border: "1px solid var(--champagne)",
    display: "grid", placeItems: "center",
    color: "var(--champagne)",
  },
  nav: { display: "flex", gap: 32, fontSize: 13.5, color: "var(--ink-soft)", letterSpacing: "0.04em" },
  navItem: { textDecoration: "none", transition: "color 200ms" },
  navActive: { color: "var(--champagne)" },
  grid: {
    display: "grid",
    gridTemplateColumns: "1.15fr 0.85fr",
    gap: 60,
    alignItems: "center",
  },
  eyebrow: {
    display: "inline-flex", alignItems: "center", gap: 12,
    fontFamily: "JetBrains Mono, monospace",
    fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase",
    color: "var(--champagne)",
    padding: "8px 14px",
    border: "1px solid rgba(212,181,116,0.3)",
    borderRadius: 999,
    background: "rgba(212,181,116,0.05)",
    marginBottom: 28,
  },
  pulse: {
    width: 6, height: 6, borderRadius: 999, background: "var(--champagne)",
    boxShadow: "0 0 0 0 rgba(212,181,116,0.6)",
    animation: "pulse 2s ease-in-out infinite",
  },
  title: {
    fontSize: "clamp(48px, 7vw, 92px)",
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
    margin: "32px 0 24px",
  },
  lede: {
    fontSize: 18,
    lineHeight: 1.65,
    color: "var(--ink)",
    maxWidth: 540,
  },
  ctaRow: { display: "flex", gap: 14, marginTop: 36, flexWrap: "wrap" },
  ctaPrimary: {
    display: "inline-flex", alignItems: "center", gap: 10,
    padding: "14px 22px",
    background: "var(--champagne)",
    color: "var(--midnight)",
    fontWeight: 600, fontSize: 14, letterSpacing: "0.04em",
    borderRadius: 999, border: "none", cursor: "pointer",
    boxShadow: "0 12px 30px -10px rgba(212,181,116,0.5)",
  },
  ctaGhost: {
    display: "inline-flex", alignItems: "center", gap: 10,
    padding: "14px 22px",
    background: "transparent",
    color: "var(--bone)",
    fontWeight: 500, fontSize: 14, letterSpacing: "0.04em",
    borderRadius: 999, border: "1px solid rgba(255,255,255,0.16)", cursor: "pointer",
  },
  stats: {
    display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
    gap: 28, marginTop: 60,
    paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.07)",
    maxWidth: 540,
  },
  statNum: { fontFamily: "Cormorant Garamond", fontSize: 42, color: "var(--champagne)", lineHeight: 1, fontStyle: "italic", fontWeight: 500 },
  statLbl: { fontSize: 12, color: "var(--ink-soft)", marginTop: 6, letterSpacing: "0.06em", textTransform: "uppercase" },
};

function Hero() {
  return (
    <header style={heroStyles.wrap} data-screen-label="hero">
      <div style={heroStyles.topbar}>
        <a href="/" style={heroStyles.brand}>
          <span style={heroStyles.brandMark}><IconScale size={18}/></span>
          <span>Vaga<span style={{ color: "var(--champagne)" }}>Beta</span></span>
        </a>
        <nav style={heroStyles.nav}>
          <a style={heroStyles.navItem} href="/">Početna</a>
          <a style={{...heroStyles.navItem, ...heroStyles.navActive}} href="/usluge">Usluge</a>
          <a style={heroStyles.navItem} href="/onama">O nama</a>
          <a style={heroStyles.navItem} href="/prodavnica">Prodavnica</a>
          <a style={heroStyles.navItem} href="/kontakt">Kontakt</a>
        </nav>
      </div>

      <div style={heroStyles.grid}>
        <div>
          <div style={heroStyles.eyebrow}>
            <span style={heroStyles.pulse}/> Akreditovano telo · OIML standardi
          </div>
          <h1 style={heroStyles.title}>
            Tačnost koja<br/>
            ima <span style={heroStyles.italic}>zakonsku</span><br/>
            težinu.
          </h1>
          <div style={heroStyles.divider}/>
          <p style={heroStyles.lede}>
            Servis, kalibracija i zakonsko overavanje vaga svih klasa — od preciznih
            laboratorijskih do kamionskih sistema. Brinemo o tačnosti i zakonitosti
            svakog javnog merenja u Srbiji već <em style={{color:"var(--champagne)"}}>preko dve decenije</em>.
          </p>
          <div style={heroStyles.ctaRow}>
            <a href="#kontakt" style={heroStyles.ctaPrimary}>Zakaži intervenciju <IconArrow/></a>
            <a href="#usluge" style={heroStyles.ctaGhost}>Pogledaj usluge</a>
          </div>
          <div style={heroStyles.stats}>
            <div><div style={heroStyles.statNum}>22+</div><div style={heroStyles.statLbl}>Godina iskustva</div></div>
            <div><div style={heroStyles.statNum}>I–IIII</div><div style={heroStyles.statLbl}>Sve klase tačnosti</div></div>
            <div><div style={heroStyles.statNum}>24h</div><div style={heroStyles.statLbl}>Brz odziv</div></div>
          </div>
        </div>

        <div style={{ position: "relative" }}>
          <BalanceScale/>
        </div>
      </div>
    </header>
  );
}

// ---------- Service feature row ----------
const svcStyles = {
  section: {
    maxWidth: 1280, margin: "120px auto 0",
    padding: "0 32px",
  },
  header: { display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 32, marginBottom: 48 },
  eyebrow: {
    fontFamily: "JetBrains Mono, monospace", fontSize: 11, letterSpacing: "0.22em",
    textTransform: "uppercase", color: "var(--champagne)", marginBottom: 14,
  },
  title: { fontSize: "clamp(36px, 5vw, 64px)", lineHeight: 1.02, fontWeight: 400, maxWidth: 720, fontStyle: "italic" },
  grid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 },
  card: {
    ...glass,
    padding: 40,
    position: "relative",
    overflow: "hidden",
    transition: "transform 500ms cubic-bezier(.22,.61,.36,1), border-color 500ms",
  },
  cardSheen: {
    position: "absolute", top: 0, left: 0, right: 0, height: 1,
    background: "linear-gradient(90deg, transparent, rgba(212,181,116,0.4), transparent)",
  },
  cardNum: {
    fontFamily: "Cormorant Garamond", fontStyle: "italic", fontWeight: 500,
    fontSize: 18, color: "var(--champagne)", letterSpacing: "0.1em",
  },
  cardIcon: {
    width: 56, height: 56, borderRadius: 999,
    display: "grid", placeItems: "center",
    color: "var(--champagne)",
    background: "radial-gradient(circle at 30% 30%, rgba(212,181,116,0.18), rgba(212,181,116,0.02))",
    border: "1px solid rgba(212,181,116,0.3)",
    marginTop: 28,
  },
  cardTitle: {
    fontSize: 36, lineHeight: 1.05, marginTop: 22, color: "var(--bone)",
  },
  cardLead: {
    fontSize: 15, lineHeight: 1.65, color: "var(--ink)", marginTop: 14, marginBottom: 22,
  },
  bullets: {
    display: "grid", gap: 12, listStyle: "none",
    paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.07)",
  },
  bullet: { display: "flex", alignItems: "flex-start", gap: 12, fontSize: 14, lineHeight: 1.5, color: "var(--ink)" },
  bulletIcon: {
    flex: "0 0 auto",
    width: 22, height: 22, borderRadius: 999,
    display: "grid", placeItems: "center",
    background: "rgba(212,181,116,0.12)",
    color: "var(--champagne)",
    marginTop: 1,
  },
  link: {
    display: "inline-flex", alignItems: "center", gap: 10, marginTop: 28,
    color: "var(--champagne)", fontSize: 13, letterSpacing: "0.08em",
    textTransform: "uppercase", fontWeight: 500, textDecoration: "none",
  },
};

function ServiceCard({ num, icon, title, lead, bullets, screenLabel }) {
  return (
    <article style={svcStyles.card} data-screen-label={screenLabel}>
      <div style={svcStyles.cardSheen}/>
      <div style={svcStyles.cardNum}>— {num}</div>
      <div style={svcStyles.cardIcon}>{icon}</div>
      <h3 style={svcStyles.cardTitle}>{title}</h3>
      <p style={svcStyles.cardLead}>{lead}</p>
      <ul style={svcStyles.bullets}>
        {bullets.map((b, i) => (
          <li key={i} style={svcStyles.bullet}>
            <span style={svcStyles.bulletIcon}><IconCheck size={12}/></span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <a href="#kontakt" style={svcStyles.link}>Zatražite ponudu <IconArrow size={14}/></a>
    </article>
  );
}

function Services() {
  return (
    <section id="usluge" style={svcStyles.section} data-screen-label="services">
      <div style={svcStyles.header}>
        <div>
          <div style={svcStyles.eyebrow}>II — Naše usluge</div>
          <h2 style={svcStyles.title}>Dva osnovna lica posla:<br/><span style={{ color: "var(--champagne)" }}>overavanje</span> i <span style={{ color: "var(--champagne)" }}>servis</span>.</h2>
        </div>
      </div>
      <div style={svcStyles.grid}>
        <ServiceCard
          num="01 / Overavanje"
          icon={<IconSeal size={26}/>}
          title="Zakonska verifikacija i žigosanje"
          lead="Akreditovani smo za zakonsko overavanje i žigosanje vaga svih klasa. Brinemo o tačnosti i zakonitosti svakog javnog merenja."
          bullets={[
            "Akreditovani za sva održavanja i žigosanja",
            "Zakonska verifikacija po OIML standardima",
            "Sve klase vaga — od I do IIII",
            "Brzo i efikasno — bez nepotrebnog čekanja",
          ]}
          screenLabel="card-overavanje"
        />
        <ServiceCard
          num="02 / Servis"
          icon={<IconWrench size={26}/>}
          title="Stručno servisiranje i kalibracija"
          lead="Stručno servisiranje, kalibracija i održavanje vaga — od trgovinskih do industrijskih i kamionskih sistema. Naš tim obezbeđuje preciznost i dugotrajnost svakog merila."
          bullets={[
            "Stručan i brz servis uz originalne delove",
            "Sve vrste vaga — industrijske, trgovinske, kamionske",
            "Redovno održavanje i kalibracija",
            "Garant na sve servisne intervencije",
          ]}
          screenLabel="card-servis"
        />
      </div>
    </section>
  );
}

// ---------- Klasa I-IIII ----------
const klasaStyles = {
  section: { maxWidth: 1280, margin: "120px auto 0", padding: "0 32px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 48 },
  card: {
    ...glass,
    padding: "32px 24px",
    minHeight: 280,
    display: "flex", flexDirection: "column",
    position: "relative", overflow: "hidden",
    transition: "transform 400ms ease",
  },
  roman: {
    fontFamily: "Cormorant Garamond", fontStyle: "italic",
    fontSize: 84, lineHeight: 0.85, color: "var(--champagne)",
    fontWeight: 500,
  },
  klasaTitle: { fontSize: 19, marginTop: 18, color: "var(--bone)", lineHeight: 1.2 },
  klasaBody: { fontSize: 13.5, lineHeight: 1.55, color: "var(--ink-soft)", marginTop: 10 },
  klasaTag: {
    fontFamily: "JetBrains Mono, monospace", fontSize: 10,
    letterSpacing: "0.16em", textTransform: "uppercase",
    color: "var(--ink-soft)",
    padding: "5px 10px", borderRadius: 4,
    border: "1px solid rgba(255,255,255,0.08)",
    alignSelf: "flex-start", marginTop: "auto",
  },
};

const KLASE = [
  { roman: "I", title: "Specijalna tačnost", body: "Analitičke i etalon vage. Najveća preciznost, laboratorijska upotreba.", icon: <IconLab/> },
  { roman: "II", title: "Visoka tačnost", body: "Zlatarske i precizne tehničke vage. Tehnologija i istraživanja.", icon: <IconShield/> },
  { roman: "III", title: "Srednja tačnost", body: "Trgovinske, kontrolne i automatske vage. Najčešće u prometu.", icon: <IconScale/> },
  { roman: "IIII", title: "Obična tačnost", body: "Kamionske, stočarske i grube industrijske vage velikih opterećenja.", icon: <IconTruck/> },
];

function Klase() {
  return (
    <section style={klasaStyles.section} data-screen-label="klase">
      <div style={svcStyles.header}>
        <div>
          <div style={svcStyles.eyebrow}>III — Klase tačnosti</div>
          <h2 style={svcStyles.title}>Od mikrograma do tona — pokrivamo <span style={{ color: "var(--champagne)" }}>sve četiri klase</span>.</h2>
        </div>
        <p style={{ maxWidth: 380, color: "var(--ink)", fontSize: 15.5, lineHeight: 1.6 }}>
          OIML R76 klasifikacija. Kategorija određuje toleranciju, intervale overavanja i zahteve za servis.
        </p>
      </div>
      <div style={klasaStyles.grid}>
        {KLASE.map((k, i) => (
          <article key={i} style={klasaStyles.card}>
            <div style={{ color: "var(--champagne)", opacity: 0.65 }}>{k.icon}</div>
            <div style={{ ...klasaStyles.roman, marginTop: 12 }}>{k.roman}</div>
            <h3 style={klasaStyles.klasaTitle}>{k.title}</h3>
            <p style={klasaStyles.klasaBody}>{k.body}</p>
            <span style={klasaStyles.klasaTag}>OIML · Klasa {k.roman}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

// ---------- Process timeline ----------
const procStyles = {
  section: { maxWidth: 1280, margin: "120px auto 0", padding: "0 32px" },
  list: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, marginTop: 64, position: "relative" },
  step: { padding: "0 24px", position: "relative" },
  stepDot: {
    width: 14, height: 14, borderRadius: 999,
    border: "1.5px solid var(--champagne)",
    background: "var(--midnight)",
    position: "relative", zIndex: 2,
  },
  stepLine: {
    position: "absolute", top: 6, left: 14, right: -24, height: 1,
    background: "linear-gradient(90deg, var(--champagne) 0%, rgba(212,181,116,0.15) 100%)",
  },
  stepNum: {
    fontFamily: "JetBrains Mono, monospace", fontSize: 11,
    letterSpacing: "0.18em", color: "var(--ink-soft)",
    marginTop: 24,
  },
  stepTitle: { fontSize: 22, marginTop: 8, color: "var(--bone)", lineHeight: 1.15 },
  stepBody: { fontSize: 13.5, lineHeight: 1.6, color: "var(--ink-soft)", marginTop: 10 },
};

const STEPS = [
  { n: "Step 01", t: "Prijava", b: "Pošaljete tip vage, lokaciju i razlog (overa, kvar, kalibracija). Odgovaramo u toku radnog dana." },
  { n: "Step 02", t: "Pregled", b: "Tehničar dolazi na lokaciju ili vagu primamo u radionicu. Dijagnostika i procena obima posla." },
  { n: "Step 03", t: "Intervencija", b: "Servis, podešavanje, kalibracija sa etaloniranim tegovima. Sve sa originalnim delovima." },
  { n: "Step 04", t: "Žigosanje", b: "Akreditovano overavanje, izdavanje uverenja i postavljanje žiga sa rokom važenja." },
];

function Proces() {
  return (
    <section style={procStyles.section} data-screen-label="proces">
      <div style={svcStyles.header}>
        <div>
          <div style={svcStyles.eyebrow}>VI — Proces</div>
          <h2 style={svcStyles.title}>Od poziva do žiga<br/>— u <span style={{ color: "var(--champagne)" }}>četiri koraka</span>.</h2>
        </div>
      </div>
      <ol style={procStyles.list}>
        {STEPS.map((s, i) => (
          <li key={i} style={procStyles.step}>
            <div style={procStyles.stepDot}>
              {i < STEPS.length - 1 && <div style={procStyles.stepLine}/>}
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

// ---------- CTA ----------
const ctaStyles = {
  section: { maxWidth: 1280, margin: "140px auto 80px", padding: "0 32px" },
  card: {
    ...glass,
    padding: "72px 56px",
    display: "grid",
    gridTemplateColumns: "1.4fr 1fr",
    gap: 48,
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  bg: {
    position: "absolute", top: -100, right: -100,
    width: 500, height: 500, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(212,181,116,0.18) 0%, transparent 60%)",
    pointerEvents: "none",
  },
  title: {
    fontSize: "clamp(36px, 4.5vw, 56px)",
    lineHeight: 1.02, fontWeight: 400,
    color: "var(--bone)",
    fontStyle: "italic",
  },
  body: { fontSize: 15.5, lineHeight: 1.65, color: "var(--ink)", marginTop: 18, maxWidth: 480 },
  side: { display: "grid", gap: 18 },
  contact: {
    ...glass,
    padding: "20px 22px",
    display: "flex", alignItems: "center", gap: 16,
  },
  contactLabel: { fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-soft)", fontFamily: "JetBrains Mono, monospace" },
  contactValue: { fontSize: 18, color: "var(--bone)", marginTop: 4, fontFamily: "Cormorant Garamond, serif", fontStyle: "italic" },
  contactIcon: { width: 40, height: 40, borderRadius: 999, display: "grid", placeItems: "center", color: "var(--champagne)", border: "1px solid rgba(212,181,116,0.3)", background: "rgba(212,181,116,0.06)" },
};

const PhoneIcon = () => (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M5 4h4l2 5-2 1a12 12 0 005 5l1-2 5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/></svg>);
const MailIcon = () => (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>);
const PinIcon = () => (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M12 22s7-7 7-12a7 7 0 10-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>);

function CTA() {
  return (
    <section id="kontakt" style={ctaStyles.section} data-screen-label="cta">
      <div style={ctaStyles.card}>
        <div style={ctaStyles.bg}/>
        <div>
          <div style={{ ...svcStyles.eyebrow, marginBottom: 16 }}>VII — Kontakt</div>
          <h2 style={ctaStyles.title}>Imate vagu kojoj ističe žig?<br/>Mi dolazimo.</h2>
          <p style={ctaStyles.body}>
            Pozovite ili pošaljite poruku — odgovaramo u toku radnog dana. Servisni
            tim pokriva celu Srbiju, sa istim standardom i u Beogradu i u najmanjoj
            opštini.
          </p>
          <div style={{ display: "flex", gap: 14, marginTop: 32, flexWrap: "wrap" }}>
            <a href="tel:+381" style={heroStyles.ctaPrimary}>Pozovi sada <IconArrow/></a>
            <a href="/kontakt" style={heroStyles.ctaGhost}>Pošalji poruku</a>
          </div>
        </div>
        <div style={ctaStyles.side}>
          <div style={ctaStyles.contact}>
            <div style={ctaStyles.contactIcon}><PhoneIcon/></div>
            <div>
              <div style={ctaStyles.contactLabel}>Telefon</div>
              <div style={ctaStyles.contactValue}>+381 — pozovite nas</div>
            </div>
          </div>
          <div style={ctaStyles.contact}>
            <div style={ctaStyles.contactIcon}><MailIcon/></div>
            <div>
              <div style={ctaStyles.contactLabel}>E-mail</div>
              <div style={ctaStyles.contactValue}>info@vagabeta.rs</div>
            </div>
          </div>
          <div style={ctaStyles.contact}>
            <div style={ctaStyles.contactIcon}><PinIcon/></div>
            <div>
              <div style={ctaStyles.contactLabel}>Pokrivamo</div>
              <div style={ctaStyles.contactValue}>celu Srbiju</div>
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

Object.assign(window, { Hero, Services, Klase, Proces, CTA });
