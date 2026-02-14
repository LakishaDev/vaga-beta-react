// src/pages/about/OnamaModern.jsx
// Modernizovana O nama stranica sa full-width dizajnom
// Koristi Cobalt Navy paletu iz designTokens

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { designTokens } from "../../configs/designTokens";
import ProgressiveImage from "../../components/UI/ProgressiveImage";
import {
  FaStar,
  FaAward,
  FaUsers,
  FaHandshake,
  FaLightbulb,
  FaShieldAlt,
  FaTrophy,
  FaArrowRight,
} from "react-icons/fa";

export default function OnamaModern() {
  const timeline = [
    {
      year: "15+",
      title: "Godina iskustva",
      description:
        "Više od 15 godina uspešno pružamo prodaju, proizvodnju i popravku vaga svih vrsta.",
    },
    {
      year: "ISO",
      title: "Akreditacija",
      description:
        "Posedujemo akreditaciju po ISO/IEC 17020:2012 i vršimo ispitivanje, žigosanje i sertifikaciju vaga.",
    },
    {
      year: "SRB",
      title: "Rad širom Srbije",
      description:
        "Laboratorija je u Nišu, a usluge pružamo na celoj teritoriji Srbije.",
    },
    {
      year: "24/7",
      title: "Podrška i servis",
      description:
        "Tim obezbeđuje brzu intervenciju i profesionalnu podršku za sve tipove vaga i merila mase.",
    },
    {
      year: "R&D",
      title: "Softverska rešenja",
      description:
        "Razvijamo softver za pametno upravljanje i digitalni monitoring vaga u industriji i laboratorijama.",
    },
  ];

  const values = [
    {
      icon: FaShieldAlt,
      title: "Pouzdanost",
      description: "Svaki rad je garantovan i potpuno dokumentovan",
    },
    {
      icon: FaLightbulb,
      title: "Inovativnost",
      description: "Stalno unapređujemo tehnologiju i pristupe",
    },
    {
      icon: FaUsers,
      title: "Timski Rad",
      description: "Saradnja je osnov našeg uspeha",
    },
    {
      icon: FaHandshake,
      title: "Pristupačnost",
      description: "Uvek spremni da slušamo potrebe klijenta",
    },
  ];

  const stats = [
    { number: "20+", label: "Godina iskustva" },
    { number: "500+", label: "Zadovoljnih klijenta" },
    { number: "10,000+", label: "Servisirane vage" },
    { number: "99.9%", label: "Uptime sistema" },
  ];

  return (
    <>
      <main className="w-full bg-white">
        {/* HERO SEKCIJA */}
        <section className="relative h-96 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <ProgressiveImage
              src="/imgs/home/slika3.png"
              alt="O nama background"
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${designTokens.colors.brand.primary}dd, ${designTokens.colors.brand.secondary}dd)`,
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
              O Nama
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl sm:text-2xl opacity-90 max-w-2xl mx-auto px-4"
            >
              Lider u servisu elektronskih vaga sa preko 20 godina iskustva
            </motion.p>
          </div>
        </section>

        {/* MISIJA SEKCIJA */}
        <section className="w-full px-4 sm:px-8 md:px-16 py-24">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="grid lg:grid-cols-2 gap-12 items-center"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
              >
                <h2
                  className="text-3xl sm:text-4xl font-extrabold mb-6"
                  style={{ color: designTokens.colors.brand.primary }}
                >
                  Naša Misija
                </h2>
                <p
                  className="text-lg mb-6 leading-relaxed"
                  style={{ color: designTokens.colors.text.secondary }}
                >
                  Pružiti pouzdane, precizne i inovativne usluge elektronskog
                  merenja. Naš cilj je da budemo pouzdan partner svakom
                  poslovnom subjektu koji zavisi od tačnih merenja.
                </p>
                <p
                  className="text-lg leading-relaxed"
                  style={{ color: designTokens.colors.text.secondary }}
                >
                  Kroz kontinuirane investicije u tehnologiju, obuku kadra i
                  razvoj softvera, osiguravamo da su sve rešenja u skladu sa
                  najvišim standardima tačnosti i bezbednosti.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
              >
                <ProgressiveImage
                  src="/imgs/home/slika2.png"
                  alt="Naša misija"
                  className="rounded-xl shadow-lg w-full h-96 object-cover"
                />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* STATISTIKA SEKCIJA */}
        <section
          className="w-full px-4 sm:px-8 md:px-16 py-24"
          style={{
            background: `linear-gradient(135deg, ${designTokens.colors.brand.primary}, ${designTokens.colors.brand.secondary})`,
          }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center text-white"
                >
                  <motion.h3
                    className="text-5xl font-extrabold mb-2"
                    whileInView={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.5 }}
                  >
                    {stat.number}
                  </motion.h3>
                  <p className="text-lg opacity-90">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* VREDNOSTI SEKCIJA */}
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
                Naše Vrednosti
              </h2>
              <p
                className="text-lg max-w-2xl mx-auto"
                style={{ color: designTokens.colors.text.secondary }}
              >
                Ove vrednosti predstavljaju temelj našeg poslovanja
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, idx) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all hover:scale-105 text-center"
                  >
                    <Icon
                      className="text-5xl mx-auto mb-4"
                      style={{ color: designTokens.colors.brand.primary }}
                    />
                    <h3
                      className="text-xl font-bold mb-2"
                      style={{ color: designTokens.colors.brand.primary }}
                    >
                      {value.title}
                    </h3>
                    <p style={{ color: designTokens.colors.text.secondary }}>
                      {value.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* VREMENSKI TOK SEKCIJA */}
        <section
          className="w-full px-4 sm:px-8 md:px-16 py-24"
          style={{
            backgroundColor: `${designTokens.colors.neutral.surfaceTint}99`,
          }}
        >
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
                Naša Istorija
              </h2>
              <p
                className="text-lg"
                style={{ color: designTokens.colors.text.secondary }}
              >
                Od 2003. do 2024. - Putanja inovacije i rasta
              </p>
            </motion.div>

            <div className="relative">
              {/* Timeline line */}
              <div
                className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full"
                style={{
                  backgroundColor: `${designTokens.colors.brand.primary}33`,
                }}
              />

              {/* Timeline items */}
              <div className="space-y-12 lg:space-y-0">
                {timeline.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`flex flex-col lg:flex-row gap-8 items-center ${
                      idx % 2 === 1 ? "lg:flex-row-reverse" : ""
                    }`}
                  >
                    {/* Content */}
                    <div className="flex-1">
                      <div
                        className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all"
                        style={{
                          borderTop: `4px solid ${designTokens.colors.brand.primary}`,
                        }}
                      >
                        <h3
                          className="text-2xl font-bold mb-2"
                          style={{ color: designTokens.colors.brand.primary }}
                        >
                          {item.title}
                        </h3>
                        <p
                          style={{
                            color: designTokens.colors.text.secondary,
                          }}
                        >
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Center dot */}
                    <div className="hidden lg:flex w-16 h-16 items-center justify-center">
                      <div
                        className="w-6 h-6 rounded-full border-4 bg-white"
                        style={{
                          borderColor: designTokens.colors.brand.primary,
                        }}
                      />
                    </div>

                    {/* Year */}
                    <div className="flex-1 text-center lg:text-left">
                      <motion.h4
                        className="text-4xl font-extrabold"
                        style={{ color: designTokens.colors.brand.primary }}
                        whileInView={{ scale: [1, 1.1, 1] }}
                      >
                        {item.year}
                      </motion.h4>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* TIM SEKCIJA */}
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
                Naš Tim
              </h2>
              <p
                className="text-lg max-w-2xl mx-auto"
                style={{ color: designTokens.colors.text.secondary }}
              >
                Kompetentni stručnjaci sa godinama iskustva
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Stručni tehničari",
                  role: "Servis, kalibracija i popravka vaga",
                  icon: FaTrophy,
                },
                {
                  name: "Akreditovano kontrolno telo",
                  role: "Ispitivanje, overa i žigosanje po standardu",
                  icon: FaAward,
                },
                {
                  name: "Softverski inženjeri",
                  role: "Digitalizacija merenja i razvoj rešenja",
                  icon: FaLightbulb,
                },
              ].map((member, idx) => {
                const Icon = member.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all text-center"
                  >
                    <div
                      className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                      style={{
                        backgroundColor: `${designTokens.colors.brand.primary}15`,
                      }}
                    >
                      <Icon
                        className="text-5xl"
                        style={{ color: designTokens.colors.brand.primary }}
                      />
                    </div>
                    <h3
                      className="text-xl font-bold mb-2"
                      style={{ color: designTokens.colors.brand.primary }}
                    >
                      {member.name}
                    </h3>
                    <p style={{ color: designTokens.colors.text.secondary }}>
                      {member.role}
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
              Želite da sarađujete sa nama?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg mb-8 opacity-90"
            >
              Kontaktirajte nas i saznajte kako možemo da pružimo najbolje
              usluge za vaše potrebe.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/kontakt"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-bold bg-white text-lg transition-all hover:shadow-xl hover:scale-105"
                style={{ color: designTokens.colors.brand.primary }}
              >
                Kontaktiraj nas
                <FaArrowRight />
              </Link>
              <Link
                to="/usluge"
                className="px-8 py-4 rounded-lg font-bold border-2 border-white text-white text-lg transition-all hover:bg-white/10"
              >
                Naše usluge
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
