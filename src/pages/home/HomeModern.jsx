// src/pages/home/HomeModern.jsx
// Modernizovana Home stranica sa Cobalt Navy paletom
// Svi elementi redesigned za OPCIJU D

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  Suspense,
  lazy,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import ProgressiveImage from "../../components/UI/ProgressiveImage";
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
  FaQuoteLeft,
  FaCheckCircle,
} from "react-icons/fa";
import LepModal from "../../components/UI/LepModal";
import { motion, AnimatePresence } from "framer-motion";

const Slider = lazy(() => import("../../components/Slider"));
const EvagaVideoPlayer = lazy(
  () => import("../../components/UI/EvagaVideoPlayer"),
);

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
  const [openFaqIdx, setOpenFaqIdx] = useState(null);
  const gallerySectionRef = useRef(null);
  const videoSectionRef = useRef(null);
  const [isGalleryReady, setIsGalleryReady] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

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

  const statsData = [
    { value: "500+", label: "Zadovoljnih klijenata" },
    { value: "20+", label: "Godina iskustva" },
    { value: "24/7", label: "Tehnička podrška" },
    { value: "98%", label: "Stopa zadovoljstva" },
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
      desc: "Dijagnostika i potpun servis svih elektronskih vaga u najkraćem mogućem roku.",
      color: designTokens.colors.brand.primaryHover,
    },
    {
      icon: FaCertificate,
      title: "Žigosanje i sertifikati",
      desc: "Ovlašćeno žigosanje vaga i izdavanje zvaničnih mernih sertifikata.",
      color: designTokens.colors.brand.primary,
    },
    {
      icon: FaFlask,
      title: "Laboratorijsko ispitivanje",
      desc: "Precizna kalibracija i ispitivanje u akreditovanoj laboratoriji.",
      color: designTokens.colors.brand.primary,
    },
    {
      icon: FaClipboardCheck,
      title: "Akreditovana garancija",
      desc: "Pisana garancija na svaki servisiran i prodat uređaj uz punu podršku.",
      color: designTokens.colors.text.secondary,
    },
  ];

  // Hero animation variants
  const heroContainerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.18, delayChildren: 0.5 },
    },
  };

  const heroItemVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.72, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  const openModal = ({ src, text }) => setModalData({ open: true, src, text });
  const closeModal = () => setModalData((prev) => ({ ...prev, open: false }));
  const navigate = useNavigate();

  useEffect(() => {
    const adminAnalyticsEnabled =
      import.meta.env.VITE_ENABLE_HOME_ADMIN_ANALYTICS === "true";

    if (!adminAnalyticsEnabled) {
      setIsAdmin(false);
      return;
    }

    const adminEmails =
      import.meta.env.VITE_ADMIN_EMAILS?.split(",").map((e) => e.trim()) || [];

    let unsub = () => {};
    let mounted = true;

    (async () => {
      try {
        const [{ onAuthStateChanged }, { auth }] = await Promise.all([
          import("firebase/auth"),
          import("../../utils/firebase"),
        ]);

        if (!mounted) return;

        unsub = onAuthStateChanged(auth, (user) => {
          if (user && adminEmails.includes(user.email)) setIsAdmin(true);
          else setIsAdmin(false);
        });
      } catch {
        setIsAdmin(false);
      }
    })();

    return () => {
      mounted = false;
      unsub();
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          if (entry.target === gallerySectionRef.current) {
            setIsGalleryReady(true);
          }

          if (entry.target === videoSectionRef.current) {
            setIsVideoReady(true);
          }
        });
      },
      { rootMargin: "450px 0px" },
    );

    if (gallerySectionRef.current) observer.observe(gallerySectionRef.current);
    if (videoSectionRef.current) observer.observe(videoSectionRef.current);

    return () => observer.disconnect();
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
        <section className="relative h-screen flex items-center justify-center overflow-hidden -mt-24 sm:-mt-28">
          <div className="absolute inset-0">
            <ProgressiveImage
              src="/imgs/home/slika8.jpg"
              alt="Vaga Beta Hero"
              width={1920}
              height={1080}
              sizes="100vw"
              imageLoading="eager"
              decoding="async"
              fetchPriority="high"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-black/10" />
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            {/* Veliki outer atmosphere orb — levo od centra, gornji deo */}
            <motion.div
              className="hero-halo-breath absolute left-[42%] top-[38%] h-[44rem] w-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-primary/40 blur-[140px] sm:h-[56rem] sm:w-[56rem]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
            />
            {/* Mid secondary orb — desno od centra */}
            <motion.div
              className="hero-halo-pulse-delayed absolute left-[58%] top-[52%] h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-secondary/55 blur-[100px] sm:h-[36rem] sm:w-[36rem]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            />
            {/* Core accent orb — centriran iza teksta */}
            <motion.div
              className="hero-halo-pulse absolute left-[48%] top-[50%] h-[18rem] w-[18rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-accent/50 blur-[75px] sm:h-[24rem] sm:w-[24rem]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.0, ease: "easeOut", delay: 0.4 }}
            />
            {/* Mali hot-spot direktno iza teksta za depth */}
            <motion.div
              className="hero-halo-pulse absolute left-[50%] top-[50%] h-[10rem] w-[10rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-secondary/70 blur-[40px] sm:h-[14rem] sm:w-[14rem]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.6 }}
            />
          </div>

          <div className="relative z-10 w-full px-4 sm:px-8 md:px-16 text-white">
            <motion.div
              className="mx-auto max-w-4xl text-center md:-translate-y-6"
              variants={heroContainerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Trust eyebrow badge */}
              <motion.div
                variants={heroItemVariants}
                className="mb-5 flex justify-center"
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
                  <FaShieldAlt className="text-brand-accent" />
                  Ovlašćeni servis · 20+ godina iskustva
                </span>
              </motion.div>

              <motion.h1
                variants={heroItemVariants}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight"
              >
                Preciznost. Inovacija. Pouzdanost.
              </motion.h1>
              <motion.p
                variants={heroItemVariants}
                className="text-xl sm:text-2xl opacity-90 mb-8 leading-relaxed"
              >
                Vaga Beta – lider u servisu elektronskih vaga, žigosanju i
                softverskim rešenjima za merenje
              </motion.p>
              <motion.div
                variants={heroItemVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    to="/prodavnica"
                    onClick={() => handleCtaClick("test")}
                    className="block px-8 py-4 rounded-lg font-bold text-lg text-white transition-colors shadow-lg hover:shadow-xl"
                    style={{
                      backgroundColor: designTokens.colors.brand.primary,
                    }}
                  >
                    Testiraj e-Vagu
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    to="/kontakt"
                    onClick={() => handleCtaClick("demo")}
                    className="block px-8 py-4 rounded-lg font-bold text-lg border-2 transition-all hover:bg-white/15"
                    style={{ borderColor: "white", color: "white" }}
                  >
                    Zakažite demo
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll indikator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/60"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.6 }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.8,
                ease: "easeInOut",
              }}
              className="flex flex-col items-center gap-1 text-xs font-medium tracking-widest uppercase"
            >
              <span>Skrolujte</span>
              <FaArrowRight className="rotate-90 text-lg" />
            </motion.div>
          </motion.div>
        </section>

        {/* STATS STRIP SEKCIJA */}
        <section
          className="w-full py-10 px-4 sm:px-8"
          style={{
            background: `linear-gradient(135deg, ${designTokens.colors.brand.primary}, ${designTokens.colors.brand.secondary})`,
          }}
        >
          <div className="mx-auto max-w-5xl grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {statsData.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="text-white"
              >
                <div className="text-3xl sm:text-4xl font-extrabold mb-1">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base opacity-80 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* GALERIJA SEKCIJA */}
        <section
          className="w-full px-4 sm:px-8 md:px-16 py-16"
          ref={gallerySectionRef}
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
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
          {isGalleryReady ? (
            <Suspense
              fallback={
                <div className="w-full mt-4 mb-6 h-[clamp(18rem,28vw,26rem)] rounded-2xl bg-gray-100 animate-pulse" />
              }
            >
              <Slider onImageClick={openModal} />
            </Suspense>
          ) : (
            <div className="w-full mt-4 mb-6 h-[clamp(18rem,28vw,26rem)] rounded-2xl bg-gray-100 animate-pulse" />
          )}
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
              viewport={{ once: true }}
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
                    viewport={{ once: true }}
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
        <section
          className="w-full px-4 sm:px-8 md:px-16 py-16"
          ref={videoSectionRef}
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-extrabold mb-8"
            style={{ color: designTokens.colors.brand.primary }}
          >
            e-Vaga Program Prezentacija
          </motion.h2>
          {isVideoReady ? (
            <Suspense
              fallback={
                <div className="w-full max-w-4xl mx-auto aspect-video rounded-2xl bg-gray-100 animate-pulse" />
              }
            >
              <EvagaVideoPlayer
                filename="eVaga Program 2026.mp4"
                namespace="videos"
                title="e-Vaga Program Prezentacija - Kontrola i Praćenje Merenja"
                description="Pogledajte kako e-Vaga radi u praksi"
                autoplay={false}
                videoPreload="metadata"
                enableAnalytics={isAdmin}
                onAnalyticsEvent={handleVideoAnalytics}
              />
            </Suspense>
          ) : (
            <div className="w-full max-w-4xl mx-auto aspect-video rounded-2xl bg-gray-100 animate-pulse" />
          )}
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
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  to="/prodavnica"
                  onClick={() => handleCtaClick("test")}
                  className="block px-8 py-4 rounded-lg font-bold bg-white text-lg transition-all hover:shadow-xl"
                  style={{ color: designTokens.colors.brand.primary }}
                >
                  Testiraj sada
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  to="/kontakt"
                  onClick={() => handleCtaClick("demo")}
                  className="block px-8 py-4 rounded-lg font-bold border-2 border-white text-white text-lg transition-all hover:bg-white/10"
                >
                  Kontaktiraj nas
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* USLUGE SEKCIJA */}
        <section className="w-full px-4 sm:px-8 md:px-16 py-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
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
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all hover:scale-105 border-t-4 flex flex-col gap-3"
                  style={{ borderTopColor: service.color }}
                >
                  <Icon className="text-4xl" style={{ color: service.color }} />
                  <h3
                    className="text-lg font-bold"
                    style={{ color: service.color }}
                  >
                    {service.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: designTokens.colors.text.secondary }}
                  >
                    {service.desc}
                  </p>
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
            <div className="space-y-4 max-w-3xl mx-auto">
              {faqItems.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="rounded-xl border-2 bg-white overflow-hidden"
                  style={{
                    borderColor: designTokens.colors.neutral.borderLight,
                  }}
                >
                  <button
                    onClick={() =>
                      setOpenFaqIdx(openFaqIdx === idx ? null : idx)
                    }
                    className="w-full flex items-center justify-between px-6 py-5 font-bold text-lg text-left focus:outline-none focus-visible:ring-2"
                    style={{ color: designTokens.colors.brand.primary }}
                    aria-expanded={openFaqIdx === idx}
                  >
                    {item.q}
                    <motion.span
                      animate={{ rotate: openFaqIdx === idx ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-xl ml-4 flex-shrink-0"
                      style={{ color: designTokens.colors.brand.accent }}
                    >
                      +
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {openFaqIdx === idx && (
                      <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        style={{ overflow: "hidden" }}
                      >
                        <p
                          className="px-6 pb-5 text-base leading-relaxed"
                          style={{ color: designTokens.colors.text.secondary }}
                        >
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
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
              viewport={{ once: true }}
            >
              <ProgressiveImage
                src="/imgs/home/slika3.png"
                alt="Zašto Vaga Beta"
                width={1280}
                height={853}
                sizes="(min-width: 1024px) 50vw, 100vw"
                imageLoading="lazy"
                decoding="async"
                className="rounded-xl shadow-lg"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
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
                <li className="flex items-start gap-3">
                  <FaCheckCircle
                    className="mt-1 flex-shrink-0 text-lg"
                    style={{ color: designTokens.colors.brand.accent }}
                  />
                  Više od 20 godina iskustva
                </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle
                    className="mt-1 flex-shrink-0 text-lg"
                    style={{ color: designTokens.colors.brand.accent }}
                  />
                  Kompletan servis na jednom mestu
                </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle
                    className="mt-1 flex-shrink-0 text-lg"
                    style={{ color: designTokens.colors.brand.accent }}
                  />
                  Tim stručnjaka za elektroniku i softver
                </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle
                    className="mt-1 flex-shrink-0 text-lg"
                    style={{ color: designTokens.colors.brand.accent }}
                  />
                  Brzina i pouzdanost
                </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle
                    className="mt-1 flex-shrink-0 text-lg"
                    style={{ color: designTokens.colors.brand.accent }}
                  />
                  Individualni pristup svakom klijentu
                </li>
              </ul>
              <Link
                to="/kontakt"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-lg mt-8 transition-all hover:shadow-xl hover:scale-105 text-white"
                style={{ backgroundColor: designTokens.colors.brand.primary }}
              >
                Kontaktujte nas
                <FaArrowRight />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* TESTIMONIALS SEKCIJA */}
        <section
          className="w-full px-4 sm:px-8 md:px-16 py-16"
          style={{
            backgroundColor: `${designTokens.colors.neutral.surfaceTint}99`,
          }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-extrabold mb-12 text-center"
            style={{ color: designTokens.colors.brand.primary }}
          >
            Šta kažu naši klijenti?
          </motion.h2>
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {testimonials.map((t, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.6 }}
                className="bg-white rounded-2xl p-8 shadow-md border-l-4 flex flex-col gap-4"
                style={{ borderLeftColor: designTokens.colors.brand.accent }}
              >
                <FaQuoteLeft
                  className="text-2xl"
                  style={{ color: designTokens.colors.brand.accent }}
                />
                <p
                  className="text-lg leading-relaxed italic"
                  style={{ color: designTokens.colors.text.secondary }}
                >
                  &ldquo;{t.text}&rdquo;
                </p>
                <p
                  className="font-bold text-base"
                  style={{ color: designTokens.colors.brand.primary }}
                >
                  — {t.name}
                </p>
              </motion.div>
            ))}
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
