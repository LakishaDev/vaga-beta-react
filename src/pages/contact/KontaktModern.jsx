// src/pages/contact/KontaktModern.jsx
// Modernizovana Kontakt stranica sa full-width dizajnom
// Koristi Cobalt Navy paletu iz designTokens

import { useState } from "react";
import { motion } from "framer-motion";
import { designTokens } from "../../configs/designTokens";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

export default function KontaktModern() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const contactInfo = [
    {
      icon: FaMapMarkerAlt,
      title: "Lokacija",
      details: "Ive Andrića 14, Niš 18116",
      description: "Laboratorija i servisni centar Vaga Beta",
    },
    {
      icon: FaPhone,
      title: "Telefon",
      details: "018 4545 782",
      description: "Aleksandar: 063 833 9686, Radoslav: 063 810 6322",
    },
    {
      icon: FaEnvelope,
      title: "Email",
      details: "vaga.beta@yahoo.com",
      description: "Odgovorimo u roku od 24h",
    },
    {
      icon: FaClock,
      title: "Radno vreme",
      details: "Pon–Pet: 08–18h, Subota: 08–16h",
      description: "Nedelja: ne radimo",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      setError("Molimo popunite sva obavezna polja");
      return;
    }

    // Simulacija slanja forme
    try {
      // U praksi bi se slalo na backend
      console.log("Forma poslata:", formData);
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError("Došlo je do greške. Pokušajte ponovo.");
    }
  };

  return (
    <>
      <main className="w-full bg-white">
        {/* HERO SEKCIJA */}
        <section className="relative h-80 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <div
              style={{
                background: `linear-gradient(135deg, ${designTokens.colors.brand.primary}, ${designTokens.colors.brand.secondary})`,
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
              Kontaktirajte nas
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl sm:text-2xl opacity-90 max-w-2xl mx-auto px-4"
            >
              Pišite, pozovite ili svratite do naše laboratorije u Nišu.
            </motion.p>
          </div>
        </section>

        {/* KONTAKT INFO SEKCIJA */}
        <section className="w-full px-4 sm:px-8 md:px-16 py-24">
          <div className="max-w-6xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactInfo.map((info, idx) => {
                const Icon = info.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all hover:scale-105 text-center border-t-4"
                    style={{
                      borderColor: designTokens.colors.brand.primary,
                    }}
                  >
                    <Icon
                      className="text-4xl mx-auto mb-4"
                      style={{ color: designTokens.colors.brand.primary }}
                    />
                    <h3
                      className="text-lg font-bold mb-2"
                      style={{ color: designTokens.colors.brand.primary }}
                    >
                      {info.title}
                    </h3>
                    <p
                      className="font-semibold mb-1"
                      style={{ color: designTokens.colors.brand.secondary }}
                    >
                      {info.details}
                    </p>
                    <p style={{ color: designTokens.colors.text.secondary }}>
                      {info.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FORMA I MAPA SEKCIJA */}
        <section
          className="w-full px-4 sm:px-8 md:px-16 py-24"
          style={{
            backgroundColor: `${designTokens.colors.neutral.surfaceTint}99`,
          }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* FORMA */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
              >
                <h2
                  className="text-3xl sm:text-4xl font-extrabold mb-8"
                  style={{ color: designTokens.colors.brand.primary }}
                >
                  Pošalji nam poruku
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Ime */}
                  <div>
                    <label
                      className="block text-sm font-bold mb-2"
                      style={{ color: designTokens.colors.brand.primary }}
                    >
                      Ime i prezime *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Vaše puno ime"
                      className="w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none"
                      style={{
                        borderColor: designTokens.colors.neutral.borderLight,
                      }}
                      onFocus={(e) =>
                        (e.target.style.borderColor =
                          designTokens.colors.brand.primary)
                      }
                      onBlur={(e) =>
                        (e.target.style.borderColor =
                          designTokens.colors.neutral.borderLight)
                      }
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      className="block text-sm font-bold mb-2"
                      style={{ color: designTokens.colors.brand.primary }}
                    >
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="vasa@email.com"
                      className="w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none"
                      style={{
                        borderColor: designTokens.colors.neutral.borderLight,
                      }}
                      onFocus={(e) =>
                        (e.target.style.borderColor =
                          designTokens.colors.brand.primary)
                      }
                      onBlur={(e) =>
                        (e.target.style.borderColor =
                          designTokens.colors.neutral.borderLight)
                      }
                    />
                  </div>

                  {/* Telefon */}
                  <div>
                    <label
                      className="block text-sm font-bold mb-2"
                      style={{ color: designTokens.colors.brand.primary }}
                    >
                      Telefon
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="018 4545 782"
                      className="w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none"
                      style={{
                        borderColor: designTokens.colors.neutral.borderLight,
                      }}
                      onFocus={(e) =>
                        (e.target.style.borderColor =
                          designTokens.colors.brand.primary)
                      }
                      onBlur={(e) =>
                        (e.target.style.borderColor =
                          designTokens.colors.neutral.borderLight)
                      }
                    />
                  </div>

                  {/* Predmet */}
                  <div>
                    <label
                      className="block text-sm font-bold mb-2"
                      style={{ color: designTokens.colors.brand.primary }}
                    >
                      Predmet poruke *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none"
                      style={{
                        borderColor: designTokens.colors.neutral.borderLight,
                      }}
                      onFocus={(e) =>
                        (e.target.style.borderColor =
                          designTokens.colors.brand.primary)
                      }
                      onBlur={(e) =>
                        (e.target.style.borderColor =
                          designTokens.colors.neutral.borderLight)
                      }
                    >
                      <option value="">Izaberite predmet</option>
                      <option value="servis">Servis vage</option>
                      <option value="zigosanje">Žigosanje vage</option>
                      <option value="softver">Softver i aplikacija</option>
                      <option value="saradnja">Saradnja</option>
                      <option value="ostalo">Ostalo</option>
                    </select>
                  </div>

                  {/* Poruka */}
                  <div>
                    <label
                      className="block text-sm font-bold mb-2"
                      style={{ color: designTokens.colors.brand.primary }}
                    >
                      Poruka *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Vaša poruka..."
                      rows="5"
                      className="w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none resize-none"
                      style={{
                        borderColor: designTokens.colors.neutral.borderLight,
                      }}
                      onFocus={(e) =>
                        (e.target.style.borderColor =
                          designTokens.colors.brand.primary)
                      }
                      onBlur={(e) =>
                        (e.target.style.borderColor =
                          designTokens.colors.neutral.borderLight)
                      }
                    />
                  </div>

                  {/* Error/Success */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-4 rounded-lg"
                      style={{
                        backgroundColor: "#FEE2E2",
                        color: "#991B1B",
                      }}
                    >
                      <FaExclamationCircle />
                      {error}
                    </motion.div>
                  )}

                  {submitted && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-4 rounded-lg"
                      style={{
                        backgroundColor: "#DCFCE7",
                        color: "#166534",
                      }}
                    >
                      <FaCheckCircle />
                      Hvala! Primili smo vašu poruku. Odgovorićemo u roku od
                      24h.
                    </motion.div>
                  )}

                  {/* Submit */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="w-full font-bold py-4 rounded-lg text-white text-lg transition-all hover:shadow-xl flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: designTokens.colors.brand.primary,
                    }}
                  >
                    Pošalji poruku
                    <FaPaperPlane />
                  </motion.button>
                </form>
              </motion.div>

              {/* MAPA I INFO */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="flex flex-col gap-6"
              >
                {/* Mapa */}
                <div
                  className="w-full h-96 rounded-xl shadow-lg"
                  style={{
                    backgroundColor: `${designTokens.colors.brand.primary}15`,
                  }}
                >
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d725.7919941335642!2d21.96049866741613!3d43.31074294781325!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4755b9489a4acd21%3A0x422f0275588f7174!2sVaga%20Beta%20Lab%20d.o.o!5e0!3m2!1ssr!2srs!4v1690286095097!5m2!1ssr!2srs"
                    style={{
                      border: 0,
                      width: "100%",
                      height: "100%",
                      borderRadius: "0.75rem",
                    }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Lokacija Vaga Beta"
                  />
                </div>

                {/* Info boks */}
                <div
                  className="bg-white rounded-xl p-6 shadow-md"
                  style={{
                    borderLeft: `4px solid ${designTokens.colors.brand.primary}`,
                  }}
                >
                  <h3
                    className="text-xl font-bold mb-4"
                    style={{ color: designTokens.colors.brand.primary }}
                  >
                    Brze informacije
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: designTokens.colors.brand.primary }}
                      >
                        Telefon
                      </p>
                      <p style={{ color: designTokens.colors.text.secondary }}>
                        018 4545 782, 063 833 9686
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: designTokens.colors.brand.primary }}
                      >
                        Email
                      </p>
                      <p style={{ color: designTokens.colors.text.secondary }}>
                        vaga.beta@yahoo.com
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: designTokens.colors.brand.primary }}
                      >
                        Radno vreme
                      </p>
                      <p style={{ color: designTokens.colors.text.secondary }}>
                        Pon–Pet: 08–18h, Sub: 08–16h
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ SEKCIJA */}
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
                Česta Pitanja
              </h2>
            </motion.div>

            <div className="space-y-4">
              {[
                {
                  q: "Koja je vaša vremenska dostupnost?",
                  a: "Dostupni smo radnim danima od 8:00 do 17:00. Za hitne slučajeve, pozovite nas na broj +381 11 123 4567.",
                },
                {
                  q: "Koje su usluge koje pružate?",
                  a: "Pružamo servisiranje vaga, žigosanje, razvoj softvera, mobilne aplikacije i cloud rešenja.",
                },
                {
                  q: "Koliko traje uobičajen servis?",
                  a: "Servis traje od 1 do 3 radna dana zavisno od vrste i kompleksnosti problema vage.",
                },
                {
                  q: "Da li nudite besplatnu procenu?",
                  a: "Da, inicijalna procena je besplatna. Dogovorićemo se sa vama pre nego što počnemo radove.",
                },
              ].map((item, idx) => (
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
      </main>
    </>
  );
}
