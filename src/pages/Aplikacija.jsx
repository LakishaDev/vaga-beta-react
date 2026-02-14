// src/pages/Aplikacija.jsx
// Stranica za predstavljanje mobilne aplikacije eVagaClientMobile
// Profesionalno predstavlja mobilnu aplikaciju u ranom pristupu
// Stilizovana sa Tailwind CSS i Vaga Beta paletom boja
// Responsive i pristupačna
// Koristi ikone iz react-icons za vizuelnu podršku
// Animacije: fadein, fadeup, pop, slidein-left, slidein-right, bounceInDown, fadeInUpBig
// Boje iz BOJE objekta: Bone #CBCFBB, Midnight #1E3E49, Sheen #6EAEA2, Chestnut #8A4D34, Outer Space #1A343D, Rust #AD5637, Blue Green #91CEC1, Charcoal #2F5363
// Sadrži sekcije: hero, funkcionalnosti, benefiti, call-to-action
// Sve slike su u /public/imgs
// Ikonice iz react-icons
// Animacije sa Tailwind CSS i animate.css
// Glass morphism efekti
// Profesionalni gradienti

import {
  FaMobileAlt,
  FaClipboardList,
  FaCalendarCheck,
  FaHistory,
  FaComments,
  FaCog,
  FaBell,
  FaCheckCircle,
  FaBolt,
  FaShieldAlt,
  FaDownload,
  FaGoogle,
  FaRocket,
  FaChartLine,
  FaUserCheck,
  FaClock,
  FaApple,
  FaAndroid,
  FaCode,
  FaGlobe,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useEVagaDesktop } from "../contexts/EVagaDesktopContext";
import { designTokens } from "../configs/designTokens";

export default function Aplikacija() {
  const { mobilePackages, mobileAdditionalServices, formatPrice } =
    useEVagaDesktop();
  return (
    <main className="w-full bg-neutral-bg px-4 sm:px-8 md:px-16 py-10 sm:py-14 animate-fadein">
      <div className="max-w-6xl mx-auto bg-neutral-surface/95 rounded-2xl shadow-2xl p-6 sm:p-10 border border-neutral-border">
        {/* Hero sekcija sa pozivom na akciju */}
        <section className="relative overflow-hidden rounded-2xl mb-10 animate-fadeup">
          {/* Gradient pozadina sa glass morphism efektom */}
          <div
            className="absolute inset-0 opacity-95"
            style={{
              background: `linear-gradient(135deg, ${designTokens.colors.brand.primary}, ${designTokens.colors.brand.secondary})`,
            }}
          ></div>
          <div className="absolute inset-0 backdrop-blur-3xl bg-white/5"></div>

          {/* Dekorativni elementi */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#91CEC1]/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <div
            className="absolute bottom-0 left-0 w-48 h-48 bg-[#AD5637]/20 rounded-full blur-3xl animate-pulse-slow"
            style={{ animationDelay: "1s" }}
          ></div>

          <div className="relative p-8 sm:p-12 text-white">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Leva strana - Tekst i CTA */}
              <div className="flex-1 animate-slidein-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#91CEC1]/20 backdrop-blur-sm border border-[#91CEC1]/30 mb-4 animate-pop">
                  <FaRocket className="text-brand-accent" />
                  <span className="text-sm font-semibold text-[#91CEC1]">
                    Rani pristup
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight">
                  <span className="bg-gradient-to-r from-white via-[#91CEC1] to-white bg-clip-text text-transparent">
                    eVaga Mobile
                  </span>
                </h1>

                <p className="text-lg sm:text-xl text-[#CBCFBB] mb-6 leading-relaxed">
                  Upravljajte uslugama vaga bilo gde, bilo kada. Vaša digitalna
                  ruka za sve zahteve vezane za overavanje, servisiranje i
                  održavanje vaga.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="https://play.google.com/apps/testing/com.vagabeta.evaga_client"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[#6EAEA2] to-[#91CEC1] hover:from-[#91CEC1] hover:to-[#6EAEA2] font-bold text-[#1E3E49] shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    <FaGoogle className="text-2xl" />
                    <span>Preuzmi na Google Play</span>
                    <FaDownload className="group-hover:translate-y-1 transition-transform duration-300" />
                  </a>
                </div>
              </div>

              {/* Desna strana - Mobilna ikonica */}
              <div className="flex-shrink-0 animate-slidein-right">
                <img
                  src="/imgs/logos/logo.png"
                  alt="eVaga Client Mobile App Mockup"
                  className="w-48 sm:w-64 mx-auto"
                />
                {/* <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#91CEC1] to-[#6EAEA2] rounded-full blur-2xl opacity-50 animate-pulse"></div>
                <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
                  <FaMobileAlt className="text-8xl text-[#91CEC1]" />
                </div>
              </div> */}
              </div>
            </div>
          </div>
        </section>

        {/* Intro tekst */}
        <section className="mb-8 animate-fadeup">
          <h2 className="text-3xl text-[#1E3E49] font-bold mb-4">
            Vaša mobilna laboratorija u džepu
          </h2>
          <p className="text-[#2F5363] text-lg mb-3 leading-relaxed">
            <span className="font-bold text-[#AD5637]">eVaga Mobile</span> je
            mobilna aplikacija dizajnirana da{" "}
            <span className="text-[#6EAEA2] font-semibold">
              pojednostavi i ubrza
            </span>{" "}
            sve vaše interakcije sa Vaga Beta timom. Bilo da ste u fabrici,
            skladištu ili na terenu, sada možete lako kreirati zahteve,
            zakazivati servise i pratiti istoriju održavanja vaših vaga —{" "}
            <b>sve sa vašeg telefona</b>.
          </p>
          <p className="text-[#2F5363] text-lg leading-relaxed">
            Aplikacija je trenutno u{" "}
            <span className="font-bold text-[#AD5637]">ranom pristupu</span>,
            što znači da možete biti među prvima koji će isprobati i uticati na
            njen razvoj. Pridružite nam se i dopustite nam da zajedno izgradimo
            najbolje mobilno iskustvo za upravljanje vagama!
          </p>
        </section>

        {/* eVaga Desktop integracija */}
        <section className="mb-10 p-8 rounded-2xl bg-gradient-to-br from-[#1E3E49] via-[#2F5363] to-[#1A343D] animate-fadeup">
          <div className="flex items-start gap-6 flex-col lg:flex-row">
            <div className="flex-shrink-0">
              <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                <img
                  src="/imgs/evagadesktop/evaga.png"
                  alt="eVaga Desktop"
                  className="w-24 h-24 object-contain"
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <FaShieldAlt className="text-3xl text-[#91CEC1]" />
                <h3 className="text-2xl font-bold text-white">
                  Povezano sa eVaga Desktop programom
                </h3>
              </div>
              <p className="text-[#CBCFBB] text-lg mb-4 leading-relaxed">
                <span className="font-bold text-[#91CEC1]">eVaga Mobile</span>{" "}
                aplikacija je{" "}
                <span className="font-semibold">potpuno integrisana</span> sa
                našim{" "}
                <Link
                  to="/evaga-desktop"
                  className="text-[#91CEC1] underline hover:text-white transition-colors"
                >
                  eVaga Desktop
                </Link>{" "}
                programom. Aplikacija dolazi{" "}
                <span className="font-bold text-[#91CEC1]">besplatno</span> uz
                svaki paket eVaga Desktop programa!
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <FaCheckCircle className="text-[#91CEC1] text-xl flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-white mb-1">
                      Besplatna aplikacija
                    </h4>
                    <p className="text-[#CBCFBB] text-sm">
                      Aplikacija se dobija besplatno uz bilo koji Desktop paket
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <FaShieldAlt className="text-[#91CEC1] text-xl flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-white mb-1">
                      Šifrovana komunikacija
                    </h4>
                    <p className="text-[#CBCFBB] text-sm">
                      Svi podaci između aplikacije i programa su potpuno
                      zaštićeni
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <FaBolt className="text-[#91CEC1] text-xl flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-white mb-1">
                      Real-time sinhronizacija
                    </h4>
                    <p className="text-[#CBCFBB] text-sm">
                      Sve promene se odmah prikazuju na svim uređajima
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <FaUserCheck className="text-[#91CEC1] text-xl flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-white mb-1">
                      Isti korisnici
                    </h4>
                    <p className="text-[#CBCFBB] text-sm">
                      Koristite iste naloge kao i na Desktop programu
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#91CEC1]/20 border border-[#91CEC1]/30">
                <p className="text-white text-sm">
                  <FaBell className="inline-block mr-2" />
                  <span className="font-semibold">Napomena:</span> Pristup
                  mobilnoj aplikaciji se naplaćuje kao mesečna ili godišnja
                  pretplata. Desktop program i aplikacija rade zajedno i dele
                  istu bazu podataka.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Funkcionalnosti aplikacije */}
        <section className="mb-10 animate-pop">
          <div className="text-center mb-8">
            <h3 className="text-3xl text-[#1E3E49] font-extrabold mb-3 tracking-tight">
              Šta aplikacija nudi?
            </h3>
            <p className="text-[#2F5363] text-base max-w-2xl mx-auto">
              Sve što vam je potrebno za efikasno upravljanje uslugama vaga na
              jednom mestu
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Funkcionalnost 1 - Kreiranje zahteva */}
            <div className="group relative overflow-hidden rounded-2xl border border-[#6EAEA2]/30 bg-gradient-to-br from-white/60 to-[#6EAEA2]/10 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:border-[#6EAEA2] animate-fadeup">
              <div className="absolute inset-0 bg-gradient-to-br from-[#6EAEA2]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-4 rounded-xl bg-[#6EAEA2]/20 group-hover:bg-[#6EAEA2]/30 transition-colors duration-300">
                    <FaClipboardList className="text-3xl text-[#1E3E49] group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>
                <h4 className="text-xl font-bold text-[#1E3E49] mb-2 group-hover:text-[#6EAEA2] transition-colors duration-300">
                  Brzo kreiranje zahteva
                </h4>
                <p className="text-[#2F5363]">
                  Unesite sve potrebne informacije i pošaljite zahtev za servis
                  ili overavanje vaga direktno sa terena u nekoliko klikova.
                </p>
              </div>
            </div>

            {/* Funkcionalnost 2 - Zakazivanje servisa */}
            <div
              className="group relative overflow-hidden rounded-2xl border border-[#91CEC1]/30 bg-gradient-to-br from-white/60 to-[#91CEC1]/10 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:border-[#91CEC1] animate-fadeup"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#91CEC1]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-4 rounded-xl bg-[#91CEC1]/20 group-hover:bg-[#91CEC1]/30 transition-colors duration-300">
                    <FaCalendarCheck className="text-3xl text-[#1E3E49] group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>
                <h4 className="text-xl font-bold text-[#1E3E49] mb-2 group-hover:text-[#91CEC1] transition-colors duration-300">
                  Lako zakazivanje servisa
                </h4>
                <p className="text-[#2F5363]">
                  Zakažite overavanje, servisiranje ili popravku vaga odabirom
                  datuma i vremena koji vama odgovara. Bez telefonskih poziva!
                </p>
              </div>
            </div>

            {/* Funkcionalnost 3 - Istorija servisa */}
            <div
              className="group relative overflow-hidden rounded-2xl border border-[#AD5637]/30 bg-gradient-to-br from-white/60 to-[#AD5637]/10 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:border-[#AD5637] animate-fadeup"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#AD5637]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-4 rounded-xl bg-[#AD5637]/20 group-hover:bg-[#AD5637]/30 transition-colors duration-300">
                    <FaHistory className="text-3xl text-[#1E3E49] group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>
                <h4 className="text-xl font-bold text-[#1E3E49] mb-2 group-hover:text-[#AD5637] transition-colors duration-300">
                  Pregled istorije servisa
                </h4>
                <p className="text-[#2F5363]">
                  Sve informacije o prethodnim servisima, overavanjima i
                  popravkama na jednom mestu. Pratite šta je urađeno i kada.
                </p>
              </div>
            </div>

            {/* Funkcionalnost 4 - Komunikacija */}
            <div
              className="group relative overflow-hidden rounded-2xl border border-[#1E3E49]/30 bg-gradient-to-br from-white/60 to-[#1E3E49]/10 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:border-[#1E3E49] animate-fadeup"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#1E3E49]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-4 rounded-xl bg-[#1E3E49]/20 group-hover:bg-[#1E3E49]/30 transition-colors duration-300">
                    <FaComments className="text-3xl text-[#1E3E49] group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>
                <h4 className="text-xl font-bold text-[#1E3E49] mb-2 group-hover:text-[#2F5363] transition-colors duration-300">
                  Direktna komunikacija
                </h4>
                <p className="text-[#2F5363]">
                  Komunicirajte sa našim timom direktno kroz aplikaciju.
                  Postavite pitanja, dobijte savete i pratite status vašeg
                  zahteva u realnom vremenu.
                </p>
              </div>
            </div>

            {/* Funkcionalnost 5 - Mobilno upravljanje */}
            <div
              className="group relative overflow-hidden rounded-2xl border border-[#6EAEA2]/30 bg-gradient-to-br from-white/60 to-[#6EAEA2]/10 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:border-[#6EAEA2] animate-fadeup"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#6EAEA2]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-4 rounded-xl bg-[#6EAEA2]/20 group-hover:bg-[#6EAEA2]/30 transition-colors duration-300">
                    <FaCog className="text-3xl text-[#1E3E49] group-hover:scale-110 group-hover:rotate-180 transition-all duration-500" />
                  </div>
                </div>
                <h4 className="text-xl font-bold text-[#1E3E49] mb-2 group-hover:text-[#6EAEA2] transition-colors duration-300">
                  Mobilno upravljanje uslugama
                </h4>
                <p className="text-[#2F5363]">
                  Upravljajte svim uslugama na daljinu. Proveravajte status,
                  menjajte termine i pratite napredak - sve sa vašeg mobilnog
                  uređaja.
                </p>
              </div>
            </div>

            {/* Funkcionalnost 6 - Push notifikacije */}
            <div
              className="group relative overflow-hidden rounded-2xl border border-[#91CEC1]/30 bg-gradient-to-br from-white/60 to-[#91CEC1]/10 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:border-[#91CEC1] animate-fadeup"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#91CEC1]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-4 rounded-xl bg-[#91CEC1]/20 group-hover:bg-[#91CEC1]/30 transition-colors duration-300">
                    <FaBell className="text-3xl text-[#1E3E49] group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                  </div>
                </div>
                <h4 className="text-xl font-bold text-[#1E3E49] mb-2 group-hover:text-[#91CEC1] transition-colors duration-300">
                  Push notifikacije
                </h4>
                <p className="text-[#2F5363]">
                  Budite uvek obavešteni. Dobijajte notifikacije o statusu
                  zahteva, podsetnike za zakazane servise i važna obaveštenja od
                  tima.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefiti korišćenja aplikacije */}
        <section className="mb-10 animate-fadeup">
          <div className="text-center mb-8">
            <h3 className="text-3xl text-[#1E3E49] font-extrabold mb-3 tracking-tight">
              Zašto koristiti mobilnu aplikaciju?
            </h3>
            <p className="text-[#2F5363] text-base max-w-2xl mx-auto">
              Benefiti koji će transformisati način na koji upravljate vagama
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Benefit 1 */}
            <div className="flex items-start gap-4 p-5 rounded-xl bg-gradient-to-br from-[#6EAEA2]/10 to-[#91CEC1]/5 border border-[#6EAEA2]/20 hover:border-[#6EAEA2] transition-all duration-300 hover:shadow-lg animate-slidein-left">
              <div className="flex-shrink-0 p-3 rounded-lg bg-[#6EAEA2]/20">
                <FaBolt className="text-2xl text-[#AD5637]" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#1E3E49] mb-1">
                  Brže i efikasnije
                </h4>
                <p className="text-[#2F5363]">
                  Smanjite vreme čekanja i elimišite nepotrebne telefonske
                  pozive. Sve što vam je potrebno je na dohvat ruke.
                </p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="flex items-start gap-4 p-5 rounded-xl bg-gradient-to-br from-[#91CEC1]/10 to-[#6EAEA2]/5 border border-[#91CEC1]/20 hover:border-[#91CEC1] transition-all duration-300 hover:shadow-lg animate-slidein-right">
              <div className="flex-shrink-0 p-3 rounded-lg bg-[#91CEC1]/20">
                <FaClock className="text-2xl text-[#AD5637]" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#1E3E49] mb-1">
                  Dostupno 24/7
                </h4>
                <p className="text-[#2F5363]">
                  Kreirajte zahteve i zakažite servise bilo kada, bez obzira na
                  radno vreme. Aplikacija je uvek dostupna.
                </p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div
              className="flex items-start gap-4 p-5 rounded-xl bg-gradient-to-br from-[#AD5637]/10 to-[#CBCFBB]/10 border border-[#AD5637]/20 hover:border-[#AD5637] transition-all duration-300 hover:shadow-lg animate-slidein-left"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="flex-shrink-0 p-3 rounded-lg bg-[#AD5637]/20">
                <FaCheckCircle className="text-2xl text-[#6EAEA2]" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#1E3E49] mb-1">
                  Transparentnost i kontrola
                </h4>
                <p className="text-[#2F5363]">
                  Pratite svaki korak procesa i imajte potpunu kontrolu nad
                  vašim servisima i zahtevima.
                </p>
              </div>
            </div>

            {/* Benefit 4 */}
            <div
              className="flex items-start gap-4 p-5 rounded-xl bg-gradient-to-br from-[#1E3E49]/10 to-[#2F5363]/5 border border-[#1E3E49]/20 hover:border-[#1E3E49] transition-all duration-300 hover:shadow-lg animate-slidein-right"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="flex-shrink-0 p-3 rounded-lg bg-[#1E3E49]/20">
                <FaShieldAlt className="text-2xl text-[#6EAEA2]" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#1E3E49] mb-1">
                  Sigurno i pouzdano
                </h4>
                <p className="text-[#2F5363]">
                  Vaši podaci su šifrovani i bezbedni. Koristimo najnovije
                  standarde zaštite podataka.
                </p>
              </div>
            </div>

            {/* Benefit 5 */}
            <div
              className="flex items-start gap-4 p-5 rounded-xl bg-gradient-to-br from-[#6EAEA2]/10 to-[#91CEC1]/5 border border-[#6EAEA2]/20 hover:border-[#6EAEA2] transition-all duration-300 hover:shadow-lg animate-slidein-left"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="flex-shrink-0 p-3 rounded-lg bg-[#6EAEA2]/20">
                <FaUserCheck className="text-2xl text-[#AD5637]" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#1E3E49] mb-1">
                  Personalizovano iskustvo
                </h4>
                <p className="text-[#2F5363]">
                  Vaša istorija, preferencije i podaci su sačuvani za brži i
                  lakši pristup.
                </p>
              </div>
            </div>

            {/* Benefit 6 */}
            <div
              className="flex items-start gap-4 p-5 rounded-xl bg-gradient-to-br from-[#91CEC1]/10 to-[#6EAEA2]/5 border border-[#91CEC1]/20 hover:border-[#91CEC1] transition-all duration-300 hover:shadow-lg animate-slidein-right"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="flex-shrink-0 p-3 rounded-lg bg-[#91CEC1]/20">
                <FaChartLine className="text-2xl text-[#AD5637]" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#1E3E49] mb-1">
                  Budite prvi
                </h4>
                <p className="text-[#2F5363]">
                  Kao korisnik ranog pristupa, uticaćete na razvoj aplikacije i
                  budite prvi koji će koristiti sve nove funkcionalnosti.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Cenovnik pretplate */}
        <section className="mt-12 mb-10 animate-fadeup" id="pretplata">
          <div className="text-center mb-10">
            <h3 className="text-3xl text-[#1E3E49] font-extrabold mb-3 tracking-tight">
              Pretplata za pristup mobilnoj aplikaciji
            </h3>
            <p className="text-[#2F5363] text-base max-w-2xl mx-auto">
              Aplikacija dolazi besplatno uz eVaga Desktop program. Pristup se
              aktivira mesečnom, kvartalnom ili godišnjom pretplatom.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Mesečna pretplata */}
            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-[#6EAEA2]/30 hover:border-[#6EAEA2] transition-all duration-300 hover:scale-105">
              <div className="p-6">
                <div className="text-center mb-6">
                  <FaCalendarCheck className="text-4xl text-[#6EAEA2] mx-auto mb-3" />
                  <h4 className="text-2xl font-bold text-[#1E3E49] mb-2">
                    Mesečna
                  </h4>
                  <p className="text-[#2F5363] text-sm">
                    Plaćanje iz meseca u mesec
                  </p>
                </div>

                <div className="text-center mb-6">
                  <div className="text-4xl font-extrabold text-[#AD5637] mb-1">
                    2.990 RSD
                  </div>
                  <div className="text-sm text-[#2F5363]">mesečno</div>
                </div>

                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="w-5 h-5 text-[#6EAEA2] flex-shrink-0 mt-0.5" />
                    <span className="text-[#2F5363] text-sm">
                      Pristup mobilnoj aplikaciji
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="w-5 h-5 text-[#6EAEA2] flex-shrink-0 mt-0.5" />
                    <span className="text-[#2F5363] text-sm">
                      Sinhronizacija sa Desktop programom
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="w-5 h-5 text-[#6EAEA2] flex-shrink-0 mt-0.5" />
                    <span className="text-[#2F5363] text-sm">
                      Push notifikacije
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="w-5 h-5 text-[#6EAEA2] flex-shrink-0 mt-0.5" />
                    <span className="text-[#2F5363] text-sm">
                      Tehnička podrška
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="w-5 h-5 text-[#6EAEA2] flex-shrink-0 mt-0.5" />
                    <span className="text-[#2F5363] text-sm">
                      Otkazivanje u bilo kom trenutku
                    </span>
                  </li>
                </ul>

                <Link to="/kontakt">
                  <button className="w-full py-3 rounded-lg font-bold bg-gradient-to-r from-[#6EAEA2] to-[#91CEC1] text-[#1E3E49] hover:shadow-lg transition-all duration-300">
                    Izaberi mesečnu
                  </button>
                </Link>
              </div>
            </div>

            {/* Kvartalna pretplata */}
            <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-[#AD5637] ring-4 ring-[#AD5637]/30 scale-105">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-[#AD5637] to-[#8A4D34] text-white px-6 py-2 text-sm font-extrabold shadow-lg z-10">
                NAJPOPULARNIJA
              </div>

              <div className="p-6 pt-12">
                <div className="text-center mb-6">
                  <FaBolt className="text-4xl text-[#AD5637] mx-auto mb-3" />
                  <h4 className="text-2xl font-bold text-[#1E3E49] mb-2">
                    Kvartalna
                  </h4>
                  <p className="text-[#2F5363] text-sm">
                    Plaćanje na 3 meseca unapred
                  </p>
                </div>

                <div className="text-center mb-6">
                  <div className="text-4xl font-extrabold text-[#AD5637] mb-1">
                    7.990 RSD
                  </div>
                  <div className="text-sm text-[#2F5363]">na 3 meseca</div>
                  <div className="text-xs text-[#6EAEA2] font-semibold mt-1">
                    (ušteda 1.000 RSD)
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="w-5 h-5 text-[#AD5637] flex-shrink-0 mt-0.5" />
                    <span className="text-[#2F5363] text-sm">
                      Sve iz mesečne pretplate
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="w-5 h-5 text-[#AD5637] flex-shrink-0 mt-0.5" />
                    <span className="text-[#2F5363] text-sm">
                      Prioritetna tehnička podrška
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="w-5 h-5 text-[#AD5637] flex-shrink-0 mt-0.5" />
                    <span className="text-[#2F5363] text-sm">
                      Rani pristup novim funkcijama
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="w-5 h-5 text-[#AD5637] flex-shrink-0 mt-0.5" />
                    <span className="text-[#2F5363] text-sm font-semibold">
                      Ušteda 11%
                    </span>
                  </li>
                </ul>

                <Link to="/kontakt">
                  <button className="w-full py-3 rounded-lg font-bold bg-gradient-to-r from-[#AD5637] to-[#8A4D34] text-white hover:shadow-xl transition-all duration-300">
                    Izaberi kvartalnu
                  </button>
                </Link>
              </div>
            </div>

            {/* Godišnja pretplata */}
            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-[#91CEC1]/30 hover:border-[#91CEC1] transition-all duration-300 hover:scale-105">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-[#6EAEA2] to-[#91CEC1] text-[#1E3E49] px-6 py-2 text-xs font-extrabold shadow-lg z-10">
                NAJBOLJA CENA
              </div>

              <div className="p-6 pt-10">
                <div className="text-center mb-6">
                  <FaRocket className="text-4xl text-[#91CEC1] mx-auto mb-3" />
                  <h4 className="text-2xl font-bold text-[#1E3E49] mb-2">
                    Godišnja
                  </h4>
                  <p className="text-[#2F5363] text-sm">
                    Plaćanje za celu godinu
                  </p>
                </div>

                <div className="text-center mb-6">
                  <div className="text-4xl font-extrabold text-[#AD5637] mb-1">
                    29.990 RSD
                  </div>
                  <div className="text-sm text-[#2F5363]">godišnje</div>
                  <div className="text-xs text-[#6EAEA2] font-semibold mt-1">
                    (ušteda 5.890 RSD)
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="w-5 h-5 text-[#91CEC1] flex-shrink-0 mt-0.5" />
                    <span className="text-[#2F5363] text-sm">
                      Sve iz kvartalne pretplate
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="w-5 h-5 text-[#91CEC1] flex-shrink-0 mt-0.5" />
                    <span className="text-[#2F5363] text-sm">
                      VIP tehnička podrška
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="w-5 h-5 text-[#91CEC1] flex-shrink-0 mt-0.5" />
                    <span className="text-[#2F5363] text-sm">
                      Besplatno ažuriranje aplikacije
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="w-5 h-5 text-[#91CEC1] flex-shrink-0 mt-0.5" />
                    <span className="text-[#2F5363] text-sm font-semibold">
                      Ušteda 16%
                    </span>
                  </li>
                </ul>

                <Link to="/kontakt">
                  <button className="w-full py-3 rounded-lg font-bold bg-gradient-to-r from-[#91CEC1] to-[#6EAEA2] text-[#1E3E49] hover:shadow-lg transition-all duration-300">
                    Izaberi godišnju
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 rounded-xl bg-[#91CEC1]/10 border border-[#91CEC1]/30 text-center">
            <p className="text-[#2F5363]">
              <FaShieldAlt className="inline-block mr-2 text-[#6EAEA2]" />
              <span className="font-semibold">Napomena:</span> Pretplata se
              automatski obnavlja. Možete je otkazati u bilo kom trenutku bez
              dodatnih troškova.
            </p>
          </div>
        </section>

        {/* Call to Action - Download sekcija */}
        <section className="mt-12 animate-fadeup">
          <div className="relative overflow-hidden rounded-3xl border-2 border-[#6EAEA2]/30 bg-gradient-to-br from-[#1E3E49] via-[#2F5363] to-[#1A343D] shadow-2xl">
            {/* Glass morphism overlay */}
            <div className="absolute inset-0 backdrop-blur-3xl bg-white/5"></div>

            {/* Dekorativni elementi */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#91CEC1]/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#AD5637]/10 rounded-full blur-3xl"></div>

            <div className="relative p-8 sm:p-12 text-center">
              <div className="max-w-3xl mx-auto">
                <div className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-[#91CEC1]/20 backdrop-blur-sm border border-[#91CEC1]/30 mb-6">
                  <FaRocket className="text-[#91CEC1] text-xl" />
                  <span className="text-sm font-bold text-[#91CEC1]">
                    PRIDRUŽITE SE RANOM PRISTUPU
                  </span>
                </div>

                <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                  Preuzmi aplikaciju danas!
                </h3>

                <p className="text-lg text-[#CBCFBB] mb-8 leading-relaxed">
                  Postanite deo naše zajednice i pomozite nam da izgradimo
                  najbolje rešenje za upravljanje vagama. Preuzimanjem
                  aplikacije u ranom pristupu, dobijate priliku da uticaćete na
                  njen budući razvoj.
                </p>

                <a
                  href="https://play.google.com/apps/testing/com.vagabeta.evaga_client"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-4 px-10 py-5 rounded-2xl bg-gradient-to-r from-[#6EAEA2] to-[#91CEC1] hover:from-[#91CEC1] hover:to-[#6EAEA2] font-extrabold text-lg text-[#1E3E49] shadow-2xl hover:shadow-[0_20px_60px_rgba(110,174,162,0.5)] transform hover:scale-110 transition-all duration-500"
                >
                  <FaGoogle className="text-3xl group-hover:rotate-12 transition-transform duration-300" />
                  <span>Preuzmi na Google Play</span>
                  <FaDownload className="text-2xl group-hover:translate-y-1 transition-transform duration-300" />
                </a>

                <p className="text-sm text-[#91CEC1] mt-6 font-medium">
                  Besplatno preuzimanje • Android • Rani pristup
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Dodatne informacije */}
        <section className="mt-10 p-6 rounded-xl bg-[#CBCFBB]/10 border border-[#CBCFBB]/30 animate-fadein">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 p-3 rounded-lg bg-[#6EAEA2]/20">
              <FaMobileAlt className="text-2xl text-[#1E3E49]" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-[#1E3E49] mb-2">
                Napomena o ranom pristupu
              </h4>
              <p className="text-[#2F5363] leading-relaxed">
                Aplikacija je trenutno u fazi ranog pristupa, što znači da
                aktivno radimo na njenom unapređenju. Vaše povratne informacije
                su nam izuzetno važne! Ako primetite bilo kakve probleme ili
                imate sugestije, slobodno nas{" "}
                <Link
                  to="/kontakt"
                  className="text-[#AD5637] font-semibold underline hover:text-[#1E3E49] transition-colors"
                >
                  kontaktirajte
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        {/* Aplikacije po meri - Cenovnik */}
        <section className="mt-16 animate-fadeup" id="aplikacije-po-meri">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#AD5637]/20 backdrop-blur-sm border border-[#AD5637]/30 mb-4">
              <FaCode className="text-[#AD5637]" />
              <span className="text-sm font-semibold text-[#AD5637]">
                Razvoj po želji
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl text-[#1E3E49] font-extrabold mb-4 tracking-tight">
              Takodje!
            </h2>
            <h2 className="text-4xl text-[#1E3E49] font-extrabold mb-4 tracking-tight">
              Pravimo aplikaciju baš kakvu Vi želite
            </h2>
            <p className="text-[#2F5363] text-lg max-w-3xl mx-auto">
              Trebate mobilnu aplikaciju po Vašim zahtevima? Razvijamo Android i
              iOS aplikacije potpuno prilagođene vašim potrebama i poslovanju.
            </p>
          </div>

          {/* Paketi po meri */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {mobilePackages.map((pkg, index) => (
              <div
                key={pkg.id}
                className={`relative bg-gradient-to-br from-white via-white to-[#6EAEA2]/5 rounded-3xl shadow-xl overflow-hidden border-2 transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                  pkg.recommended
                    ? "border-[#AD5637] ring-4 ring-[#AD5637]/30"
                    : "border-[#6EAEA2]/30 hover:border-[#6EAEA2]"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {pkg.recommended && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-[#AD5637] to-[#8A4D34] text-white px-6 py-2 text-sm font-extrabold shadow-lg z-10">
                    ⭐ PREPORUČENO
                  </div>
                )}

                <div className="p-8">
                  {/* Ikonica platforme */}
                  <div className="flex justify-center gap-3 mb-4">
                    {(pkg.platform.includes("Android") ||
                      pkg.platform.includes("obe")) && (
                      <div className="p-3 rounded-xl bg-[#6EAEA2]/20">
                        <FaAndroid className="text-3xl text-[#1E3E49]" />
                      </div>
                    )}
                    {(pkg.platform.includes("iOS") ||
                      pkg.platform.includes("obe")) && (
                      <div className="p-3 rounded-xl bg-[#6EAEA2]/20">
                        <FaApple className="text-3xl text-[#1E3E49]" />
                      </div>
                    )}
                    {pkg.platform.includes("Web") && (
                      <div className="p-3 rounded-xl bg-[#6EAEA2]/20">
                        <FaGlobe className="text-3xl text-[#1E3E49]" />
                      </div>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-[#1E3E49] mb-2 text-center">
                    {pkg.name}
                  </h3>
                  <p className="text-[#2F5363] text-sm mb-4 text-center">
                    {pkg.description}
                  </p>
                  <div className="text-center mb-2">
                    <div className="inline-flex items-baseline gap-2 px-4 py-1 rounded-full bg-[#6EAEA2]/10">
                      <span className="text-xs text-[#2F5363] font-medium">
                        {pkg.platform}
                      </span>
                    </div>
                  </div>

                  <div className="text-center mb-6">
                    <div className="text-4xl font-extrabold text-[#AD5637] mb-1">
                      {formatPrice(pkg.price)}
                    </div>
                    <div className="text-sm text-[#2F5363]">jednokratno</div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <FaCheckCircle className="w-5 h-5 text-[#6EAEA2] flex-shrink-0 mt-0.5" />
                        <span className="text-[#2F5363] text-sm leading-snug">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link to="/kontakt">
                    <button
                      className={`w-full py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                        pkg.recommended
                          ? "bg-gradient-to-r from-[#AD5637] to-[#8A4D34] text-white shadow-lg hover:shadow-xl"
                          : "bg-gradient-to-r from-[#6EAEA2] to-[#91CEC1] text-[#1E3E49] shadow-md hover:shadow-lg"
                      }`}
                    >
                      Zatražite ponudu
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Dodatne usluge za aplikacije po meri */}
          <div className="bg-gradient-to-br from-white via-[#6EAEA2]/5 to-white rounded-3xl shadow-xl p-8 border-2 border-[#6EAEA2]/30">
            <h3 className="text-2xl font-bold text-[#1E3E49] mb-6 text-center">
              <FaCog className="inline-block mr-2 text-[#6EAEA2]" />
              Dodatne usluge
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {mobileAdditionalServices.map((service, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-5 bg-white/80 backdrop-blur-sm rounded-xl border border-[#6EAEA2]/20 hover:border-[#6EAEA2] transition-all duration-300 hover:shadow-lg"
                >
                  <div>
                    <div className="font-semibold text-[#1E3E49] mb-1">
                      {service.name}
                    </div>
                    <div className="text-sm text-[#2F5363]">{service.unit}</div>
                  </div>
                  <div className="text-lg font-bold text-[#AD5637] whitespace-nowrap ml-4">
                    {formatPrice(service.price)}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-[#91CEC1]/10 rounded-xl border border-[#91CEC1]/30">
              <p className="text-[#2F5363] text-sm text-center">
                <FaShieldAlt className="inline-block mr-2 text-[#6EAEA2]" />
                Sve aplikacije koje razvijemo dolaze sa garancijom i inicijalnom
                podrškom. Kontaktirajte nas za detaljnu ponudu.
              </p>
            </div>
          </div>
        </section>

        {/* Zašto aplikacija po meri */}
        <section className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-[#1E3E49] via-[#2F5363] to-[#1A343D] animate-fadeup">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-extrabold text-white mb-3">
              Zašto aplikacija po Vašoj želji?
            </h3>
            <p className="text-[#CBCFBB] text-lg max-w-2xl mx-auto">
              Prednosti aplikacije razvijene posebno za Vas i vaše poslovanje
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <FaCode className="text-3xl" />,
                title: "100% Prilagođeno",
                desc: "Aplikacija razvijena po vašim specifikacijama i potrebama",
              },
              {
                icon: <FaShieldAlt className="text-3xl" />,
                title: "Potpuna kontrola",
                desc: "Vi posedujete kompletan source code i sve poslovne logike",
              },
              {
                icon: <FaRocket className="text-3xl" />,
                title: "Vaš brend",
                desc: "Dizajn i funkcionalnost u skladu sa vašim brendom",
              },
              {
                icon: <FaBolt className="text-3xl" />,
                title: "Skalabilnost",
                desc: "Raste zajedno sa vašim poslovanjem bez ograničenja",
              },
              {
                icon: <FaCog className="text-3xl" />,
                title: "Integracije",
                desc: "Povezivanje sa vašim postojećim sistemima i API-jima",
              },
              {
                icon: <FaUserCheck className="text-3xl" />,
                title: "Posvećen tim",
                desc: "Dedikovan razvojni tim tokom celog projekta",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300"
              >
                <div className="text-[#91CEC1] mb-3">{item.icon}</div>
                <h4 className="text-lg font-bold text-white mb-2">
                  {item.title}
                </h4>
                <p className="text-[#CBCFBB] text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
