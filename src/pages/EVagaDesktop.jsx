import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  CheckCircle,
  Server,
  Monitor,
  Database,
  Shield,
  Zap,
  Users,
  FileText,
  Settings,
  Download,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Link } from "react-router-dom";

const EVagaDesktop = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);

  // Paketi
  const packages = [
    {
      id: "starter",
      name: "Starter paket",
      price: 89990,
      recommended: false,
      features: [
        "eVaga Desktop - Serverska strana",
        "eVaga Desktop - Klijentska strana (1 licenca)",
        "SQL Server Express integracija",
        "Osnovne funkcionalnosti merenja",
        "Evidencija fizičkih i pravnih lica",
        "Upravljanje vozilima i robom",
        "Štampanje izveštaja",
        "Email podrška",
        "1 mesec besplatne podrške",
      ],
      description: "Idealan za male firme i individualne preduzetnike",
    },
    {
      id: "professional",
      name: "Professional paket",
      price: 149990,
      recommended: true,
      features: [
        "Sve iz Starter paketa",
        "eVaga Desktop - Klijentske stanice (do 5 licenci)",
        "Client-Server arhitektura",
        "WebSocket komunikacija u realnom vremenu",
        "Kontrola pristupa sa 2 nivoa korisnika",
        "Postavke firme sa logoima",
        "Automatska sinhronizacija podataka",
        "Remote pristup podacima",
        "Email i telefon podrška",
        "3 meseca besplatne podrške",
        "Obuka korisnika (2h)",
      ],
      description: "Najpopularniji izbor za srednje firme",
    },
    {
      id: "enterprise",
      name: "Enterprise paket",
      price: 249990,
      recommended: false,
      features: [
        "Sve iz Professional paketa",
        "Neograničen broj klijentskih stanica",
        "SQL Server Standard/Enterprise integracija",
        "Prilagođeni izveštaji i štampanje",
        "Backup i restore automatizacija",
        "VPN pristup za remote konekcije",
        "Integracija sa drugim sistemima (API)",
        "Monitoring i alerting sistem",
        "Dedikovan account manager",
        "6 meseci besplatne podrške",
        "Obuka korisnika (5h)",
        "On-site instalacija i setup",
      ],
      description: "Kompletno rešenje za velike firme",
    },
  ];

  // Dodatne usluge
  const additionalServices = [
    {
      name: "Dodatna klijentska licenca",
      price: 15000,
      unit: "po licenci",
    },
    {
      name: "Tehnička podrška - mesečna",
      price: 5000,
      unit: "mesečno",
    },
    {
      name: "Tehnička podrška - godišnja",
      price: 50000,
      unit: "godišnje (ušteda 17%)",
    },
    {
      name: "Dodatna obuka korisnika",
      price: 8000,
      unit: "po satu",
    },
    {
      name: "Prilagođavanje softvera",
      price: 12000,
      unit: "po satu",
    },
    {
      name: "On-site instalacija",
      price: 20000,
      unit: "jednokratno",
    },
  ];

  // Tehnički detalji
  const technicalSpecs = [
    {
      category: "Serverska strana",
      icon: <Server className="w-6 h-6" />,
      specs: [
        "Komunikacija sa indikatorom vage (RS232/TCP)",
        "WebSocket server za broadcasting",
        "Real-time monitoring težine",
        "SQL Server baza podataka",
        "Automatska inicijalizacija baze",
        "CRUD operacije nad merenjima",
        "Upravljanje robom (šifrarnik)",
        "Generisanje štampanih izveštaja",
      ],
    },
    {
      category: "Klijentska strana",
      icon: <Monitor className="w-6 h-6" />,
      specs: [
        "WebSocket klijent komunikacija",
        "Real-time prijem podataka",
        "Automatsko popunjavanje polja",
        "Lokalni keš za offline rad",
        "Automatska sinhronizacija",
        "Moderan Siticone UI",
        "Vizuelni indikatori statusa",
        "Štampanje primljenih merenja",
      ],
    },
    {
      category: "Autentifikacija i sigurnost",
      icon: <Shield className="w-6 h-6" />,
      specs: [
        "BCrypt hashing lozinki",
        "Role-based access control (RBAC)",
        "2 nivoa pristupa (Admin, Radnik)",
        "Fleksibilno upravljanje lozinkama",
        "Logovanje svih aktivnosti",
        "Validacija korisničkih unosa",
        "Thread-safe operacije",
        "Odvojene login forme",
      ],
    },
    {
      category: "Baza podataka",
      icon: <Database className="w-6 h-6" />,
      specs: [
        "SQL Server 2019+ podrška",
        "Automatsko kreiranje tabela",
        "Centralizovana arhitektura",
        "Connection pooling",
        "Optimizovani upiti",
        "Backup i restore",
        "Remote pristup",
        "Scalable za 1M+ merenja",
      ],
    },
  ];

  // FAQ
  const faqs = [
    {
      question: "Koji operativni sistem je podržan?",
      answer:
        "eVaga Desktop trenutno podržava Windows 10 i Windows 11 (64-bit). Potreban je .NET 8.0 Runtime koji možete besplatno preuzeti.",
    },
    {
      question: "Koliko klijentskih stanica mogu imati?",
      answer:
        "Starter paket dolazi sa 1 licencom, Professional sa do 5, a Enterprise sa neograničenim brojem. Dodatne licence možete kupiti po potrebi.",
    },
    {
      question: "Da li sistem radi offline?",
      answer:
        "Da! Klijentske stanice imaju lokalni keš i mogu da rade u offline modu. Kada se server ponovo poveže, automatski se sinhronizuju podaci.",
    },
    {
      question: "Koje tipove vaga sistem podržava?",
      answer:
        "Sistem podržava indikatore koji koriste RS232 ili TCP/IP komunikaciju. Trenutno su testirani: Windicator i Dini Argeo protokoli.",
    },
    {
      question: "Da li mogu da koristim svoju postojeću bazu podataka?",
      answer:
        "Da, sistem podržava SQL Server 2019+ i može se integrisati sa postojećom infrastrukturom. Možete koristiti i SQL Server Express (besplatno).",
    },
    {
      question: "Šta uključuje tehnička podrška?",
      answer:
        "Tehnička podrška uključuje: pomoć pri instalaciji, rešavanje problema, odgovore na pitanja putem email-a/telefona, i manjа ažuriranja softvera.",
    },
    {
      question: "Da li mogu da prilagodim izveštaje?",
      answer:
        "Da! Enterprise paket uključuje prilagođene izveštaje. Za ostale pakete, prilagođavanje je dostupno kao dodatna usluga.",
    },
    {
      question: "Kako izgleda proces instalacije?",
      answer:
        "Instalacija traje 20-30 minuta i uključuje: instalaciju SQL Server-a, konfiguraciju baze, instalaciju aplikacije i podešavanje veze sa indikatorom.",
    },
  ];

  // Format cene
  const formatPrice = (price) => {
    return new Intl.NumberFormat("sr-RS").format(price) + " RSD";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white rounded-t-2xl mt-14">
      {/* Hero sekcija */}
      <section className="relative overflow-hidden bg-gradient-to-br from-midnight via-outer-space to-midnight py-20 px-4 rounded-t-2xl">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              eVaga Desktop
            </h1>
            <p className="text-xl md:text-2xl text-bone max-w-3xl mx-auto">
              Profesionalni desktop sistem za automatizovano merenje, evidenciju
              i štampanje podataka o vaganju
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <Server className="w-12 h-12 text-sheen mx-auto mb-3" />
                <div className="text-3xl font-bold text-white">100+</div>
                <div className="text-bone text-sm">Instalacija</div>
              </div>
              <div className="text-center">
                <Users className="w-12 h-12 text-sheen mx-auto mb-3" />
                <div className="text-3xl font-bold text-white">500+</div>
                <div className="text-bone text-sm">Korisnika</div>
              </div>
              <div className="text-center">
                <Database className="w-12 h-12 text-sheen mx-auto mb-3" />
                <div className="text-3xl font-bold text-white">1M+</div>
                <div className="text-bone text-sm">Merenja</div>
              </div>
              <div className="text-center">
                <Zap className="w-12 h-12 text-sheen mx-auto mb-3" />
                <div className="text-3xl font-bold text-white">99.9%</div>
                <div className="text-bone text-sm">Uptime</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Ključne karakteristike */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-midnight text-center mb-12"
          >
            Zašto izabrati eVaga Desktop?
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-12 h-12 text-rust" />,
                title: "Real-time komunikacija",
                description:
                  "Automatsko očitavanje težine sa indikatora u realnom vremenu sa WebSocket protokolom",
              },
              {
                icon: <Database className="w-12 h-12 text-rust" />,
                title: "Robusna baza podataka",
                description:
                  "SQL Server baza sa automatskom inicijalizacijom, skalabilna za preko 1 milion merenja",
              },
              {
                icon: <Shield className="w-12 h-12 text-rust" />,
                title: "Bezbednost na prvom mestu",
                description:
                  "BCrypt hashing, RBAC kontrola pristupa, logovanje aktivnosti i validacija unosa",
              },
              {
                icon: <Users className="w-12 h-12 text-rust" />,
                title: "Multi-user podrška",
                description:
                  "Neograničen broj korisnika sa 2 nivoa pristupa: Admin, Radnik",
              },
              {
                icon: <Server className="w-12 h-12 text-rust" />,
                title: "Client-Server arhitektura",
                description:
                  "Centralizovana baza na serveru sa hibridnim pristupom na klijentima (offline podrška)",
              },
              {
                icon: <FileText className="w-12 h-12 text-rust" />,
                title: "Profesionalni izveštaji",
                description:
                  "Generisanje i štampanje izveštaja sa podacima firme i logom",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-midnight mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tehnički detalji */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-midnight text-center mb-12"
          >
            Tehnički detalji
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8">
            {technicalSpecs.map((spec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-rust">{spec.icon}</div>
                  <h3 className="text-xl font-bold text-midnight">
                    {spec.category}
                  </h3>
                </div>
                <ul className="space-y-2">
                  {spec.specs.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-sheen flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cenovnik */}
      <section className="py-16 px-4" id="cenovnik">
        <div className="container mx-auto max-w-7xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-midnight text-center mb-4"
          >
            Odaberite paket koji vam odgovara
          </motion.h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Svi paketi uključuju kompletnu instalaciju, dokumentaciju i
            inicijalnu podršku
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-white rounded-2xl shadow-lg overflow-hidden ${
                  pkg.recommended ? "ring-4 ring-rust scale-105" : ""
                }`}
              >
                {pkg.recommended && (
                  <div className="absolute top-0 right-0 bg-rust text-white px-4 py-1 text-sm font-bold">
                    PREPORUČENO
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-midnight mb-2">
                    {pkg.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {pkg.description}
                  </p>

                  <div className="mb-6">
                    <div className="text-4xl font-bold text-rust">
                      {formatPrice(pkg.price)}
                    </div>
                    <div className="text-sm text-gray-500">jednokratno</div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-sheen flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to="/kontakt">
                    <button
                      className={`w-full py-3 rounded-lg font-bold transition-colors ${
                        pkg.recommended
                          ? "bg-rust text-white hover:bg-chestnut"
                          : "bg-midnight text-white hover:bg-outer-space"
                      }`}
                    >
                      Kontaktirajte nas
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Dodatne usluge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <h3 className="text-2xl font-bold text-midnight mb-6">
              Dodatne usluge
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {additionalServices.map((service, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="font-semibold text-midnight">
                      {service.name}
                    </div>
                    <div className="text-sm text-gray-500">{service.unit}</div>
                  </div>
                  <div className="text-lg font-bold text-rust">
                    {formatPrice(service.price)}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-midnight text-center mb-12"
          >
            Često postavljana pitanja
          </motion.h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-midnight pr-4">
                    {faq.question}
                  </span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-rust flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-rust flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6"
                  >
                    <p className="text-gray-600">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA sekcija */}
      <section className="py-16 px-4 bg-gradient-to-br from-midnight to-outer-space">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Spremni da optimizujete vaš proces vaganja?
            </h2>
            <p className="text-bone text-lg mb-8 max-w-2xl mx-auto">
              Kontaktirajte nas danas i saznajte kako eVaga Desktop može da
              transformiše vaše poslovanje
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/kontakt">
                <button className="bg-rust text-white px-8 py-4 rounded-lg font-bold hover:bg-chestnut transition-colors inline-flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Zatražite demo
                </button>
              </Link>
              <Link to="/kontakt">
                <button className="bg-white text-midnight px-8 py-4 rounded-lg font-bold hover:bg-bone transition-colors">
                  Kontaktirajte nas
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default EVagaDesktop;
