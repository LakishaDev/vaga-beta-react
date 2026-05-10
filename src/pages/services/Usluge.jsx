import SEO from "@/components/SEO";
import { SEO_CONFIGS } from "@/configs/seoConfigs";
import Hero from "./usluge/Hero.jsx";
import ZigExplainer from "./usluge/ZigExplainer.jsx";
import Services from "./usluge/Services.jsx";
import Klase from "./usluge/Klase.jsx";
import Standards from "./usluge/Standards.jsx";
import MKOSection from "./usluge/MKOSection.jsx";
import Proces from "./usluge/Proces.jsx";
import CTA from "./usluge/CTA.jsx";
import { USLUGE_CONFIG } from "./usluge/uslugeConfig.js";

// Mapiranje FAQ u FAQPage JSON-LD format
function buildFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: USLUGE_CONFIG.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

const seoConfig = SEO_CONFIGS.usluge;
const structuredData = [
  ...(seoConfig.structuredData || []).filter((d) => d["@type"] !== "FAQPage"),
  buildFaqJsonLd(),
];

export default function Usluge() {
  return (
    <>
      <SEO
        {...seoConfig}
        structuredData={structuredData}
      />
      <div className="usluge-page">
        <Hero />
        <ZigExplainer />
        <Services />
        <Klase />
        <Standards />
        <MKOSection />
        <Proces />
        <CTA />
        <style>{`
          .usluge-page {
            --midnight: #03081a;
            --abyss: #050d22;
            --royal: #0a1740;
            --champagne: #d4b574;
            --bone: #f0ebe2;
            --ink: rgba(240,235,226,0.62);
            --ink-soft: rgba(240,235,226,0.38);
            --line: rgba(255,255,255,0.07);
            background: linear-gradient(180deg, var(--royal) 0%, var(--abyss) 40%, var(--midnight) 100%);
            min-height: 100vh;
            font-family: 'DM Sans', sans-serif;
          }
          .usluge-page h1, .usluge-page h2, .usluge-page h3 {
            font-family: 'Cormorant Garamond', serif;
          }
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(212,181,116,0.6); }
            70% { box-shadow: 0 0 0 14px rgba(212,181,116,0); }
            100% { box-shadow: 0 0 0 0 rgba(212,181,116,0); }
          }
          @media (max-width: 900px) {
            .usluge-page > * { padding-left: 22px !important; padding-right: 22px !important; }
          }
        `}</style>
      </div>
    </>
  );
}
