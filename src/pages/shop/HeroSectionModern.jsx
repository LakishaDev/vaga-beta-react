// src/pages/shop/HeroSectionModern.jsx
// Modernizovana Hero sekcija za shop
// Full-width sa Cobalt Navy paletom i Framer Motion animacijama

import { Link } from "react-router-dom";
import { designTokens } from "../../configs/designTokens";
import ProgressiveImage from "../../components/UI/ProgressiveImage";
import { motion } from "framer-motion";
import { usePromo } from "../../contexts/PromoContext";
import {
  FaShoppingCart,
  FaStar,
  FaShippingFast,
  FaArrowRight,
} from "react-icons/fa";

export default function HeroSectionModern() {
  const { isActive: isPromoActive } = usePromo();
  const stats = [
    { number: "500+", label: "Zadovoljnih klijent" },
    { number: "1000+", label: "Aktivnih proizvoda" },
    { number: "20+", label: "Godina iskustva" },
  ];

  const features = [
    {
      icon: FaShippingFast,
      title: "Brza dostava",
      description: "Slanje u 24-48h na teritoriji Srbije",
    },
    {
      icon: FaStar,
      title: "Top kvalitet",
      description: "Svi proizvodi su verifikovani i garantovani",
    },
    {
      icon: FaShoppingCart,
      title: "Jednostavna kupovina",
      description: "Intuitivan proces od izbora do dostave",
    },
  ];

  return (
    <main className="w-full bg-white">
      {/* MAIN HERO SEKCIJA */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${designTokens.colors.brand.primary}, ${designTokens.colors.brand.secondary})`,
            }}
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {isPromoActive && (
            <motion.div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(120deg, rgba(232,213,245,0.28) 0%, rgba(213,245,227,0.25) 48%, rgba(255,249,196,0.24) 100%)",
              }}
              animate={{ opacity: [0.55, 0.7, 0.55] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
          )}

          {/* Animated shapes */}
          <motion.div
            className="absolute top-10 right-10 w-72 h-72 rounded-full opacity-20"
            style={{
              background: `${designTokens.colors.brand.accent}33`,
            }}
            animate={{
              y: [0, 20, 0],
              x: [0, 10, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 left-10 w-80 h-80 rounded-full opacity-10"
            style={{
              background: `white`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, -10, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {isPromoActive && (
            <>
              <motion.div
                className="absolute left-[8%] top-[24%] text-3xl"
                animate={{ y: [0, -12, 0], rotate: [0, -6, 0] }}
                transition={{
                  duration: 4.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                🥚
              </motion.div>
              <motion.div
                className="absolute right-[10%] bottom-[22%] text-3xl"
                animate={{ y: [0, 10, 0], rotate: [0, 8, 0] }}
                transition={{
                  duration: 4.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                🐣
              </motion.div>
            </>
          )}
        </div>

        {/* Content */}
        <div className="relative z-10 w-full text-white text-center px-4 sm:px-8 md:px-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8 flex justify-center"
          >
            <ProgressiveImage
              src="/imgs/vaga-logo.png"
              alt="Vaga Beta Logo"
              className="w-24 h-24 rounded-full shadow-2xl border-4"
              style={{ borderColor: designTokens.colors.brand.accent }}
            />
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight"
          >
            Dobrodošli u
            <br />
            <span style={{ color: designTokens.colors.brand.accent }}>
              Vaga Beta Shop
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl sm:text-2xl opacity-90 mb-8 max-w-2xl mx-auto"
          >
            Najbolji proizvodi sa garantijom. Brza dostava. Odličan servis 100%
            zadovoljstvo ili novac nazad!
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link
              to="/prodavnica/proizvodi"
              className="px-8 py-4 rounded-lg font-bold text-lg transition-all hover:shadow-xl hover:scale-105 bg-white text-center flex items-center justify-center gap-2"
              style={{ color: designTokens.colors.brand.primary }}
            >
              Pogledaj proizvode
              <FaArrowRight />
            </Link>
            <Link
              to="/usluge"
              className="px-8 py-4 rounded-lg font-bold border-2 border-white text-white text-lg transition-all hover:bg-white/10"
            >
              Saznaj više
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-white opacity-70">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </motion.div>
      </section>

      {/* STATS SEKCIJA */}
      <section
        className="w-full px-4 sm:px-8 md:px-16 py-24"
        style={{
          background: `${designTokens.colors.neutral.bg}`,
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <motion.h3
                  className="text-5xl font-extrabold mb-2"
                  style={{ color: designTokens.colors.brand.primary }}
                  whileInView={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  {stat.number}
                </motion.h3>
                <p
                  style={{ color: designTokens.colors.text.secondary }}
                  className="text-lg"
                >
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SEKCIJA */}
      <section className="w-full px-4 sm:px-8 md:px-16 py-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2
              className="text-3xl sm:text-4xl font-extrabold mb-4"
              style={{ color: designTokens.colors.brand.primary }}
            >
              Zašto Odabrati Nas?
            </h2>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: designTokens.colors.text.secondary }}
            >
              Tri razloga zbog kojih nas biraju tisuće klijenta
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all hover:scale-105 text-center border-t-4"
                  style={{
                    borderColor: designTokens.colors.brand.primary,
                  }}
                >
                  <Icon
                    className="text-5xl mx-auto mb-4"
                    style={{ color: designTokens.colors.brand.primary }}
                  />
                  <h3
                    className="text-xl font-bold mb-2"
                    style={{ color: designTokens.colors.brand.primary }}
                  >
                    {feature.title}
                  </h3>
                  <p style={{ color: designTokens.colors.text.secondary }}>
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA FINALE SEKCIJA */}
      <section
        className="w-full px-4 sm:px-8 md:px-16 py-24"
        style={{
          background: `linear-gradient(135deg, ${designTokens.colors.brand.primary}, ${designTokens.colors.brand.secondary})`,
        }}
      >
        <div className="max-w-2xl mx-auto text-center text-white">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-extrabold mb-6"
          >
            Spreman za kupovinu?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg mb-8 opacity-90"
          >
            Pregledaj našu kolekciju od preko 1000 proizvoda za sve vrste
            potreba merenja.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              to="/prodavnica/proizvodi"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-lg font-bold text-lg bg-white transition-all hover:shadow-xl hover:scale-105"
              style={{ color: designTokens.colors.brand.primary }}
            >
              Počni kupovinu
              <FaArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
