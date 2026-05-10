import { useEffect, useState } from "react";
import { IconScale, IconArrow } from "./icons.jsx";
import { heroStyles } from "./uslugeStyles.js";
import { USLUGE_CONFIG } from "./uslugeConfig.js";

function BalanceScale() {
  const [tilt, setTilt] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let t = 0;
    let raf;
    const tick = () => {
      t += 0.016;
      const v = Math.sin(t) * 4 * Math.exp(-((t % 6) * 0.35));
      setTilt(v);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const PX = 200, PY = 110;
  const HALF = 130;
  const rad = (tilt * Math.PI) / 180;
  const cos = Math.cos(rad), sin = Math.sin(rad);
  const lx = PX - HALF * cos, ly = PY - HALF * sin;
  const rx = PX + HALF * cos, ry = PY + HALF * sin;
  const CHAIN_LEN = 60;
  const lpx = lx, lpy = ly + CHAIN_LEN;
  const rpx = rx, rpy = ry + CHAIN_LEN;

  return (
    <svg viewBox="0 0 400 380" style={{ width: "100%", height: "auto", overflow: "visible" }} aria-hidden="true">
      <defs>
        <linearGradient id="goldStroke" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="400" y2="380">
          <stop offset="0%" stopColor="#a8814b" />
          <stop offset="50%" stopColor="#e8c98a" />
          <stop offset="100%" stopColor="#a8814b" />
        </linearGradient>
        <linearGradient id="panFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(232,201,138,0.28)" />
          <stop offset="100%" stopColor="rgba(212,181,116,0.04)" />
        </linearGradient>
        <radialGradient id="halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="rgba(212,181,116,0.32)" />
          <stop offset="100%" stopColor="rgba(212,181,116,0)" />
        </radialGradient>
      </defs>

      <circle cx="200" cy="180" r="170" fill="url(#halo)" />
      <ellipse cx="200" cy="332" rx="80" ry="6" fill="none" stroke="url(#goldStroke)" strokeWidth="1.4" />
      <line x1="120" y1="328" x2="280" y2="328" stroke="url(#goldStroke)" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M178 328 L188 280 L212 280 L222 328 Z" fill="none" stroke="url(#goldStroke)" strokeWidth="1.4" />
      <line x1="200" y1="280" x2="200" y2={PY} stroke="url(#goldStroke)" strokeWidth="2" />
      <circle cx={PX} cy={PY} r="6" fill="#0a1740" stroke="#e8c98a" strokeWidth="1.4" />
      <circle cx={PX} cy={PY} r="2" fill="#e8c98a" />
      <line x1={lx} y1={ly} x2={rx} y2={ry} stroke="url(#goldStroke)" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx={lx} cy={ly} r="3" fill="#e8c98a" />
      <circle cx={rx} cy={ry} r="3" fill="#e8c98a" />
      <line x1={lx} y1={ly} x2={lpx - 22} y2={lpy} stroke="url(#goldStroke)" strokeWidth="0.9" />
      <line x1={lx} y1={ly} x2={lpx + 22} y2={lpy} stroke="url(#goldStroke)" strokeWidth="0.9" />
      <line x1={rx} y1={ry} x2={rpx - 22} y2={rpy} stroke="url(#goldStroke)" strokeWidth="0.9" />
      <line x1={rx} y1={ry} x2={rpx + 22} y2={rpy} stroke="url(#goldStroke)" strokeWidth="0.9" />
      <ellipse cx={lpx} cy={lpy} rx="26" ry="4" fill="none" stroke="url(#goldStroke)" strokeWidth="1.2" />
      <path d={`M ${lpx - 26} ${lpy} Q ${lpx} ${lpy + 24} ${lpx + 26} ${lpy} Z`} fill="url(#panFill)" stroke="url(#goldStroke)" strokeWidth="1.6" />
      <text x={lpx} y={lpy - 12} textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontSize="20" fill="#e8c98a">precizno</text>
      <ellipse cx={rpx} cy={rpy} rx="26" ry="4" fill="none" stroke="url(#goldStroke)" strokeWidth="1.2" />
      <path d={`M ${rpx - 26} ${rpy} Q ${rpx} ${rpy + 24} ${rpx + 26} ${rpy} Z`} fill="url(#panFill)" stroke="url(#goldStroke)" strokeWidth="1.6" />
      <text x={rpx} y={rpy - 12} textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontSize="20" fill="#e8c98a">zakonito</text>
      <g stroke="rgba(212,181,116,0.32)" strokeWidth="1">
        {Array.from({ length: 21 }).map((_, i) => (
          <line key={i} x1={50 + i * 15} y1="358" x2={50 + i * 15} y2={i % 5 === 0 ? 368 : 363} />
        ))}
      </g>
    </svg>
  );
}

export default function Hero() {
  const yearsOfExperience = new Date().getFullYear() - USLUGE_CONFIG.foundedYear;
  const { hero } = USLUGE_CONFIG;

  return (
    <header style={heroStyles.wrap} data-screen-label="hero">
      <div style={heroStyles.grid} className="u-hero-grid">
        <div>
          <div style={heroStyles.eyebrow}>
            <span style={heroStyles.pulse} />
            {hero.eyebrow}
          </div>
          <h1 style={heroStyles.title}>
            Tačnost koja<br />
            ima <span style={heroStyles.italic}>zakonsku</span><br />
            težinu.
          </h1>
          <div style={heroStyles.divider} />
          <p style={heroStyles.lede}>
            Servis, kalibracija i zakonsko overavanje vaga svih klasa — od preciznih
            laboratorijskih do kamionskih sistema. Brinemo o tačnosti i zakonitosti
            svakog javnog merenja u Srbiji već{" "}
            <em style={{ color: "var(--champagne)" }}>preko {yearsOfExperience} godina</em>.
          </p>
          <div style={heroStyles.ctaRow}>
            <a href={hero.primaryCta.href} style={heroStyles.ctaPrimary}>
              {hero.primaryCta.label} <IconArrow />
            </a>
            <a href={hero.secondaryCta.href} style={heroStyles.ctaGhost}>
              {hero.secondaryCta.label}
            </a>
          </div>
          <div style={heroStyles.stats} className="u-hero-stats">
            <div>
              <div style={heroStyles.statNum} suppressHydrationWarning>{yearsOfExperience}+</div>
              <div style={heroStyles.statLbl}>Godina iskustva</div>
            </div>
            <div>
              <div style={heroStyles.statNum}>II–IIII</div>
              <div style={heroStyles.statLbl}>Klase tačnosti · Klasa I uskoro</div>
            </div>
            <div>
              <div style={heroStyles.statNum}>{USLUGE_CONFIG.responseTimeHours}h</div>
              <div style={heroStyles.statLbl}>Brz odziv</div>
            </div>
          </div>
        </div>

        <div style={{ position: "relative" }} className="u-hero-art">
          <BalanceScale />
        </div>
      </div>
    </header>
  );
}
