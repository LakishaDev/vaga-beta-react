// src/pages/services/UslugaModern.jsx
// Modernizovana Usluge stranica sa full-width dizajnom
// Koristi Cobalt Navy paletu iz designTokens

import { useState } from "react";
import { Link } from "react-router-dom";
import { designTokens } from "../../configs/designTokens";
import {
  FaWeight,
  FaBalanceScale,
  FaTools,
  FaClipboardCheck,
  FaMobileAlt,
  FaAndroid,
  FaApple,
  FaCogs,
  FaCloud,
  FaPlug,
  FaGlobe,
  FaDatabase,
  FaCheckCircle,
  FaArrowRight,
  FaStar,
} from "react-icons/fa";
import ProgressiveImage from "../../components/UI/ProgressiveImage";
import { motion } from "framer-motion";

export default function UslugaModern() {
  const services = [
    {
      icon: FaWeight,
      title: "Servisiranje vaga svih tipova",
      description:
        "Stručno servisiranje, kalibracija i održavanje vaga – od trgovinskih do industrijskih i kamionskih sistema. Naš tim obezbeđuje preciznost i dugotrajnost svakog merila.",
      benefits: [
        "Stručan i brz servis uz originalne delove",
        "Sve vrste vaga - industrijske, trgovinske, kamionske",
        "Redovno održavanje i kalibracija",
        "Garant za sve servisne intervencije",
      ],
      color: designTokens.colors.brand.secondary,
      image: "/imgs/usluge/slika1.jpg",
    },
    {
      icon: FaBalanceScale,
      title: "Kontrolno telo i žigosanje",
      description:
        "Akreditovani smo za zakonsku verifikaciju i žigosanje vaga svih klasa. Brinemo o tačnosti i zakonitosti svakog javnog merenja.",
      benefits: [
        "Akreditovani za sva održavanja i žigosanja",
        "Zakonska verifikacija po OIML standardima",
        "Sve klase vaga - od I do IIII",
        "Brzo i efikasno - bez nepotrebnog čekanja",
      ],
      color: designTokens.colors.brand.accent,
      image: "/imgs/usluge/overavanje-merila.png",
    },
    {
      icon: FaMobileAlt,
      title: "Softver i mobilne aplikacije",
      description:
        "Razvijamo mobilne aplikacije, desktop softver i baze za digitalno upravljanje merenjima, analizu i izveštavanje.",
      benefits: [
        "iOS i Android mobilne aplikacije",
        "Desktop softver svestranih mogućnosti",
        "Cloud baze podataka sa sigurnosnom zaštitom",
        "Real-time analiza i izveštavanja",
      ],
      color: designTokens.colors.brand.primary,
      image: "/imgs/home/slika2.png",
    },
  ];

  const features = [
    {
      icon: FaTools,
      title: "Brza i pouzdana dijagnoza",
      description: "Identifikujemo problem u čim stupite u kontakt sa nama",
    },
    {
      icon: FaClipboardCheck,
      title: "Sveobuhvatna dokumentacija",
      description: "Svi radovi su detaljno dokumentovani i garantovani",
    },
    {
      icon: FaCloud,
      title: "Cloud infrastruktura",
      description: "Vaši podaci bezbedno čuvani sa 99.9% uptime",
    },
    {
      icon: FaGlobe,
      title: "Dostupna 24/7 podrška",
      description: "Tim je uvek spremna da vam pomogne bez obzira na vreme",
    },
  ];

  return (
    <>
      <main className="w-full bg-white">
        {/* HERO SEKCIJA */}
        <section className="relative h-96 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <ProgressiveImage
              src="/imgs/home/slika8.jpg"
              alt="Usluge Hero"
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${designTokens.colors.brand.primary}cc, ${designTokens.colors.brand.secondary}cc)`,
              }}
            />
          </div>

          <div className="relative z-10 w-full text-white text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4"
            >
              Naše Usluge
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl sm:text-2xl opacity-90"
            >
              Kompletan servis za sve vrste elektronskih vaga
            </motion.p>
          </div>
        </section>

        {/* GLAVNE USLUGE SEKCIJA */}
        <section className="w-full px-4 sm:px-8 md:px-16 py-24">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h2
                className="text-3xl sm:text-4xl font-extrabold mb-4"
                style={{ color: designTokens.colors.brand.primary }}
              >
                Tri Ključne Usluge
              </h2>
              <p
                className="text-lg max-w-2xl mx-auto"
                style={{ color: designTokens.colors.text.secondary }}
              >
                Sajedno pokrivamo sve aspekte elektronskog merenja i kontrole
              </p>
            </motion.div>

            <div className="space-y-20">
              {services.map((service, idx) => {
                const Icon = service.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.2 }}
                    className={`grid lg:grid-cols-2 gap-12 items-center ${
                      idx % 2 === 1 ? "lg:direction-rtl" : ""
                    }`}
                  >
                    {/* Tekst */}
                    <motion.div
                      initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div
                          className="p-3 rounded-lg"
                          style={{ backgroundColor: `${service.color}15` }}
                        >
                          <Icon
                            className="text-4xl"
                            style={{ color: service.color }}
                          />
                        </div>
                        <h3
                          className="text-2xl sm:text-3xl font-bold"
                          style={{ color: service.color }}
                        >
                          {service.title}
                        </h3>
                      </div>

                      <p
                        className="text-lg mb-6 leading-relaxed"
                        style={{ color: designTokens.colors.text.secondary }}
                      >
                        {service.description}
                      </p>

                      <div className="space-y-3 mb-8">
                        {service.benefits.map((benefit, bidx) => (
                          <motion.div
                            key={bidx}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: bidx * 0.1 }}
                            className="flex items-start gap-3"
                          >
                            <FaCheckCircle
                              className="text-2xl mt-1 flex-shrink-0"
                              style={{ color: service.color }}
                            />
                            <span
                              style={{
                                color: designTokens.colors.text.secondary,
                              }}
                            >
                              {benefit}
                            </span>
                          </motion.div>
                        ))}
                      </div>

                      <Link
                        to="/kontakt"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-white transition-all hover:shadow-xl hover:scale-105"
                        style={{ backgroundColor: service.color }}
                      >
                        Zašto baš ova usluga?
                        <FaArrowRight />
                      </Link>
                    </motion.div>

                    {/* Slika */}
                    <motion.div
                      initial={{ opacity: 0, x: idx % 2 === 0 ? 20 : -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      className={idx % 2 === 1 ? "lg:order-first" : ""}
                    >
                      <ProgressiveImage
                        src={service.image}
                        alt={service.title}
                        className="rounded-xl shadow-lg w-full h-96 object-cover"
                      />
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FEATURES SEKCIJA */}
        <section
          className="w-full px-4 sm:px-8 md:px-16 py-24"
          style={{
            backgroundColor: `${designTokens.colors.neutral.surfaceTint}99`,
          }}
        >
          <div className="max-w-7xl mx-auto">
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
                Ove osobine nas razlikuju od ostalih
              </p>
            </motion.div>

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
                      className="text-lg font-bold mb-2"
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

        {/* CTA SEKCIJA */}
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
              Spreman za saradnju?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg mb-8 opacity-90"
            >
              Kontaktirajte nas još danas i saznajte kako možemo da poboljšamo
              vaš proces merenja.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/kontakt"
                className="px-8 py-4 rounded-lg font-bold text-lg transition-all hover:shadow-xl hover:scale-105 bg-white text-center"
                style={{ color: designTokens.colors.brand.primary }}
              >
                Kontaktiraj nas
              </Link>
              <Link
                to="/prodavnica"
                className="px-8 py-4 rounded-lg font-bold border-2 border-white text-white text-lg transition-all hover:bg-white/10"
              >
                Vidi proizvode
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Testimonials SEKCIJA */}
        <section className="w-full px-4 sm:px-8 md:px-16 py-24">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h2
                className="text-3xl sm:text-4xl font-extrabold mb-4"
                style={{ color: designTokens.colors.brand.primary }}
              >
                Šta Naši Klijenti Kažu
              </h2>
            </motion.div>

            <div className="space-y-6">
              {[
                {
                  name: "Logistika Plus",
                  text: "Centralizovali smo praćenje ulaza i izlaza robe, greške su svedene na minimum. Tim od Vaga Beta je izuzetno profesionalan.",
                },
                {
                  name: "Agro Trade",
                  text: "Tablet unos na licu mesta ubrzao je rad za 30% i obezbeđio potpunu trasu podataka. Topla preporuka!",
                },
                {
                  name: "Industrija AS",
                  text: "Nakon 5 godina korišćenja njihovog softvera, gotovo da ne vidimo ispade u merenju. Odličan support tim.",
                },
              ].map((testimonial, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-xl p-6 border-l-4 shadow-md hover:shadow-lg transition-all"
                  style={{
                    borderColor: designTokens.colors.brand.primary,
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        style={{
                          color: designTokens.colors.brand.accent,
                        }}
                      />
                    ))}
                  </div>
                  <p
                    className="text-lg mb-3"
                    style={{ color: designTokens.colors.text.secondary }}
                  >
                    "{testimonial.text}"
                  </p>
                  <p
                    className="font-bold"
                    style={{ color: designTokens.colors.brand.primary }}
                  >
                    – {testimonial.name}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
