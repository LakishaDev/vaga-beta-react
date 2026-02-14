// src/pages/home/HomeModern.jsx
// Modernizovana Home stranica sa Cobalt Navy paletom
// Svi elementi redesigned za OPCIJU D

import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProgressiveImage from "../../components/UI/ProgressiveImage";
import Slider from "../../components/Slider";
import EvagaVideoPlayer from "../../components/UI/EvagaVideoPlayer";
import { designTokens } from "../../configs/designTokens";
import {
  FaTools,
  FaShippingFast,
  FaCertificate,
  FaFlask,
  FaLaptopCode,
  FaIndustry,
  FaShieldAlt,
  FaClipboardCheck,
  FaStar,
  FaArrowRight,
} from "react-icons/fa";
import LepModal from "../../components/UI/LepModal";
import { motion, AnimatePresence } from "framer-motion";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../utils/firebase";

export default function HomeModern() {
  const [modalData, setModalData] = useState({
    open: false,
    src: "",
    text: "",
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [videoStats, setVideoStats] = useState({
    plays: 0,
    pauses: 0,
    ended: 0,
    shares: 0,
    rateChanges: 0,
    maxPercent: 0,
    seeks: 0,
  });
  const [ctaStats, setCtaStats] = useState({ test: 0, demo: 0 });

  const faqItems = [
    {
      q: "Da li sistem podržava više vaga?",
      a: "Da, možete umrežiti više vaga i pratiti ih iz jedinstvene aplikacije sa centralnom bazom podataka.",
    },
    {
      q: "Kako se vrši unos robe?",
      a: "Radnici unose merenja direktno sa tableta ili telefona, a podaci se čuvaju trajno i dostupni su 24/7.",
    },
    {
      q: "Da li postoji prilagođavanje po meri?",
      a: "Program je modularan i možemo ga prilagoditi specifičnim procesima i izveštajima vašeg poslovanja.",
    },
  ];

  const galleryShots = [
    { src: "/imgs/home/slika2.png", title: "Kontrolni panel" },
    { src: "/imgs/home/slika3.png", title: "Laboratorijsko merenje" },
    { src: "/imgs/home/slika8.jpg", title: "Industrijska vaga" },
  ];

  const testimonials = [
    {
      name: "Logistika Plus",
      text: "Centralizovali smo praćenje ulaza i izlaza robe, greške su svedene na minimum.",
    },
    {
      name: "Agro Trade",
      text: "Tablet unos na licu mesta ubrzao je rad za 30% i obezbedio potpunu trasu podataka.",
    },
  ];

  const features = [
    {
      icon: FaCertificate,
      title: "Evidencija robe",
      desc: "Pratite sve artikle sa detaljnom istorijom",
    },
    {
      icon: FaLaptopCode,
      title: "Mobilni unos",
      desc: "Tablet/telefon direktno u polju",
    },
    {
      icon: FaStar,
      title: "24/7 pristup",
      desc: "Centralna baza dostupna svaki čas",
    },
    {
      icon: FaTools,
      title: "Umrežavanje",
      desc: "Povezujeite više vaga u sistem",
    },
  ];

  const services = [
    {
      icon: FaTools,
      title: "Brza i efikasna popravka",
      color: designTokens.colors.brand.primaryHover,
    },
    {
      icon: FaCertificate,
      title: "Žigosanje vaga i sertifikati",
      color: designTokens.colors.brand.primary,
    },
    {
      icon: FaFlask,
      title: "Laboratorijsko ispitivanje",
      color: designTokens.colors.brand.primary,
    },
    {
      icon: FaShieldAlt,
      title: "Akreditovana garancija",
      color: designTokens.colors.text.secondary,
    },
  ];

  const openModal = ({ src, text }) => setModalData({ open: true, src, text });
  const closeModal = () => setModalData((prev) => ({ ...prev, open: false }));
  const navigate = useNavigate();

  useEffect(() => {
    const adminEmails =
      import.meta.env.VITE_ADMIN_EMAILS?.split(",").map((e) => e.trim()) || [];
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user && adminEmails.includes(user.email)) setIsAdmin(true);
      else setIsAdmin(false);
    });
    return () => unsub();
  }, []);

  const handleVideoAnalytics = useCallback((event, payload) => {
    setVideoStats((prev) => {
      const next = { ...prev };
      if (event === "play") next.plays += 1;
      if (event === "pause") next.pauses += 1;
      if (event === "ended") next.ended += 1;
      if (event === "share") next.shares += 1;
      if (event === "rate_change") next.rateChanges += 1;
      if (event === "seek") next.seeks += 1;
      if (event === "progress" && payload?.maxPercent !== undefined) {
        next.maxPercent = Math.max(next.maxPercent, payload.maxPercent || 0);
      }
      return next;
    });
  }, []);

  const handleCtaClick = (type) => {
    setCtaStats((prev) => ({ ...prev, [type]: (prev[type] || 0) + 1 }));
  };

  return (
    <>
      <main className="w-full bg-white">
        {/* HERO SEKCIJA */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <ProgressiveImage
              src="/imgs/home/slika8.jpg"
              alt="Vaga Beta Hero"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
          </div>

          <div className="relative z-10 w-full px-4 sm:px-8 md:px-16 text-white text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight"
            >
              Preciznost. Inovacija. Pouzdanost.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl sm:text-2xl opacity-90 mb-8 leading-relaxed"
            >
              Vaga Beta – lider u servisu elektronskih vaga, žigosanju i
              softverskim rešenjima za merenje
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                to="/prodavnica"
                onClick={() => handleCtaClick("test")}
                className="px-8 py-4 rounded-lg font-bold text-lg transition-all hover:shadow-xl hover:scale-105"
                style={{
                  backgroundColor: designTokens.colors.brand.primary,
                  color: "white",
                }}
              >
                Testiraj e-Vagu
              </Link>
              <Link
                to="/kontakt"
                onClick={() => handleCtaClick("demo")}
                className="px-8 py-4 rounded-lg font-bold text-lg border-2 transition-all hover:bg-white/10 hover:scale-105"
                style={{ borderColor: "white", color: "white" }}
              >
                Zakažite demo
              </Link>
            </motion.div>
          </div>
        </section>

        {/* GALERIJA SEKCIJA */}
        <section className="w-full px-4 sm:px-8 md:px-16 py-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-extrabold mb-2"
            style={{ color: designTokens.colors.brand.primary }}
          >
            Galerija naših radova
          </motion.h2>
          <p
            className="text-lg mb-12"
            style={{ color: designTokens.colors.text.secondary }}
          >
            Pogledajte proizvode, uređaje i sistema na kojima radimo
          </p>
          <Slider onImageClick={openModal} />
        </section>

        {/* FEATURES SEKCIJA */}
        <section
          className="py-16 px-4 sm:px-8"
          style={{
            backgroundColor: `${designTokens.colors.neutral.surfaceTint}99`,
          }}
        >
          <div className="w-full">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl font-extrabold mb-12 text-center"
              style={{ color: designTokens.colors.brand.primary }}
            >
              Ključne mogućnosti e-Vage
            </motion.h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all hover:scale-105"
                  >
                    <Icon
                      className="text-4xl mb-4"
                      style={{ color: designTokens.colors.brand.primary }}
                    />
                    <h3
                      className="text-xl font-bold mb-2"
                      style={{ color: designTokens.colors.brand.primary }}
                    >
                      {feature.title}
                    </h3>
                    <p style={{ color: designTokens.colors.text.secondary }}>
                      {feature.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* VIDEO SEKCIJA */}
        <section className="w-full px-4 sm:px-8 md:px-16 py-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-extrabold mb-8"
            style={{ color: designTokens.colors.brand.primary }}
          >
            e-Vaga Program Prezentacija
          </motion.h2>
          <EvagaVideoPlayer
            filename="eVaga Program 2026.mp4"
            namespace="videos"
            title="e-Vaga Program Prezentacija - Kontrola i Praćenje Merenja"
            description="Pogledajte kako e-Vaga radi u praksi"
            autoplay={true}
            enableAnalytics={isAdmin}
            onAnalyticsEvent={handleVideoAnalytics}
          />
        </section>

        {/* CTA SEKCIJA */}
        <section
          className="py-16 px-4 sm:px-8"
          style={{
            background: `linear-gradient(135deg, ${designTokens.colors.brand.primary}, ${designTokens.colors.brand.secondary})`,
          }}
        >
          <div className="w-full text-center text-white max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-6">
              Spremni za potpunu kontrolu?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Testirajte e-Vagu besplatno ili zakazite demo sa našim timom. Brzo
              postavljanje, jasni izveštaji, sigurni podaci.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/prodavnica"
                onClick={() => handleCtaClick("test")}
                className="px-8 py-4 rounded-lg font-bold bg-white text-lg transition-all hover:shadow-xl"
                style={{ color: designTokens.colors.brand.primary }}
              >
                Testiraj sada
              </Link>
              <Link
                to="/kontakt"
                onClick={() => handleCtaClick("demo")}
                className="px-8 py-4 rounded-lg font-bold border-2 border-white text-white text-lg transition-all hover:bg-white/10"
              >
                Kontaktiraj nas
              </Link>
            </div>
          </div>
        </section>

        {/* USLUGE SEKCIJA */}
        <section className="w-full px-4 sm:px-8 md:px-16 py-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-extrabold mb-12"
            style={{ color: designTokens.colors.brand.primary }}
          >
            Šta vam nudimo?
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all hover:scale-105 border-2"
                  style={{ borderColor: service.color }}
                >
                  <Icon
                    className="text-5xl mb-4"
                    style={{ color: service.color }}
                  />
                  <h3
                    className="text-lg font-bold"
                    style={{ color: service.color }}
                  >
                    {service.title}
                  </h3>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* FAQ SEKCIJA */}
        <section
          className="py-16 px-4 sm:px-8"
          style={{ backgroundColor: `${designTokens.colors.neutral.bg}99` }}
        >
          <div className="w-full">
            <h2
              className="text-3xl sm:text-4xl font-extrabold mb-12 text-center"
              style={{ color: designTokens.colors.brand.primary }}
            >
              Česta pitanja
            </h2>
            <div className="space-y-4">
              {faqItems.map((item, idx) => (
                <motion.details
                  key={idx}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group border-2 rounded-lg p-4 bg-white"
                  style={{
                    borderColor: designTokens.colors.neutral.borderLight,
                  }}
                >
                  <summary
                    className="cursor-pointer font-bold text-lg flex items-center justify-between hover:opacity-80"
                    style={{ color: designTokens.colors.brand.primary }}
                  >
                    {item.q}
                    <span
                      className="group-open:rotate-45 transition-transform"
                      style={{ color: designTokens.colors.brand.accent }}
                    >
                      +
                    </span>
                  </summary>
                  <p
                    className="mt-3"
                    style={{ color: designTokens.colors.text.secondary }}
                  >
                    {item.a}
                  </p>
                </motion.details>
              ))}
            </div>
          </div>
        </section>

        {/* WHY US SEKCIJA */}
        <section className="w-full px-4 sm:px-8 md:px-16 py-16">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <ProgressiveImage
                src="/imgs/home/slika3.png"
                alt="Zašto Vaga Beta"
                className="rounded-xl shadow-lg"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <h2
                className="text-3xl sm:text-4xl font-extrabold mb-6"
                style={{ color: designTokens.colors.brand.primaryHover }}
              >
                Zašto baš Vaga Beta?
              </h2>
              <ul
                className="space-y-3 text-lg"
                style={{ color: designTokens.colors.text.secondary }}
              >
                <li className="flex items-center gap-3">
                  <FaStar style={{ color: designTokens.colors.brand.accent }} />
                  Više od 20 godina iskustva
                </li>
                <li className="flex items-center gap-3">
                  <FaStar style={{ color: designTokens.colors.brand.accent }} />
                  Kompletan servis na jednom mestu
                </li>
                <li className="flex items-center gap-3">
                  <FaStar style={{ color: designTokens.colors.brand.accent }} />
                  Tim stručnjaka za elektroniku i softver
                </li>
                <li className="flex items-center gap-3">
                  <FaStar style={{ color: designTokens.colors.brand.accent }} />
                  Brzina i pouzdanost
                </li>
                <li className="flex items-center gap-3">
                  <FaStar style={{ color: designTokens.colors.brand.accent }} />
                  Individualni pristup svakom klijentu
                </li>
              </ul>
              <Link
                to="/kontakt"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-lg mt-8 transition-all hover:shadow-xl hover:scale-105 text-white"
                style={{ backgroundColor: designTokens.colors.brand.primary }}
              >
                Kontaktirajte nas
                <FaArrowRight />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ADMIN ANALYTICS */}
        {isAdmin && (
          <section
            className="w-full px-4 sm:px-8 md:px-16 py-8 border-t"
            style={{ borderColor: designTokens.colors.neutral.borderLight }}
          >
            <h3
              className="text-2xl font-bold mb-4"
              style={{ color: designTokens.colors.brand.primary }}
            >
              Analytics
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div
                className="p-3 rounded bg-white border"
                style={{ borderColor: designTokens.colors.neutral.borderLight }}
              >
                <span style={{ color: designTokens.colors.text.secondary }}>
                  Plays:
                </span>{" "}
                <strong>{videoStats.plays}</strong>
              </div>
              <div
                className="p-3 rounded bg-white border"
                style={{ borderColor: designTokens.colors.neutral.borderLight }}
              >
                <span style={{ color: designTokens.colors.text.secondary }}>
                  Pauses:
                </span>{" "}
                <strong>{videoStats.pauses}</strong>
              </div>
              <div
                className="p-3 rounded bg-white border"
                style={{ borderColor: designTokens.colors.neutral.borderLight }}
              >
                <span style={{ color: designTokens.colors.text.secondary }}>
                  Shares:
                </span>{" "}
                <strong>{videoStats.shares}</strong>
              </div>
              <div
                className="p-3 rounded bg-white border"
                style={{ borderColor: designTokens.colors.neutral.borderLight }}
              >
                <span style={{ color: designTokens.colors.text.secondary }}>
                  Max Watch:
                </span>{" "}
                <strong>{Math.round(videoStats.maxPercent)}%</strong>
              </div>
            </div>
          </section>
        )}
      </main>

      <AnimatePresence mode="wait">
        {modalData.open && (
          <LepModal
            key={modalData.src + modalData.text}
            open={modalData.open}
            onClose={closeModal}
            src={modalData.src}
            text={modalData.text}
          />
        )}
      </AnimatePresence>
    </>
  );
}
