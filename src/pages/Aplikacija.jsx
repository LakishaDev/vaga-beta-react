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
  FaClock
} from "react-icons/fa";
import ProgressiveImage from "../components/UI/ProgressiveImage";

export default function Aplikacija() {
  return (
    <main className="max-w-6xl mx-auto bg-white/95 rounded-xl shadow-2xl p-6 sm:p-10 mt-14 border border-[#CBCFBB] animate-fadein animate__animated animate__fadeInUpBig">
      
      {/* Hero sekcija sa pozivom na akciju */}
      <section className="relative overflow-hidden rounded-2xl mb-10 animate-fadeup">
        {/* Gradient pozadina sa glass morphism efektom */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E3E49] via-[#2F5363] to-[#6EAEA2] opacity-95"></div>
        <div className="absolute inset-0 backdrop-blur-3xl bg-white/5"></div>
        
        {/* Dekorativni elementi */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#91CEC1]/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#AD5637]/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative p-8 sm:p-12 text-white">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Leva strana - Tekst i CTA */}
            <div className="flex-1 animate-slidein-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#91CEC1]/20 backdrop-blur-sm border border-[#91CEC1]/30 mb-4 animate-pop">
                <FaRocket className="text-[#91CEC1]" />
                <span className="text-sm font-semibold text-[#91CEC1]">Rani pristup</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight">
                <span className="bg-gradient-to-r from-white via-[#91CEC1] to-white bg-clip-text text-transparent">
                  eVaga Client Mobile
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-[#CBCFBB] mb-6 leading-relaxed">
                Upravljajte uslugama vaga bilo gde, bilo kada. Vaša digitalna ruka za sve zahteve vezane za overavanje, servisiranje i održavanje vaga.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://play.google.com/apps/testing/com.vagabeta.evaga_client"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[#6EAEA2] to-[#91CEC1] hover:from-[#91CEC1] hover:to-[#6EAEA2] font-bold text-[#1E3E49] shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 animate-pulse-slow"
                >
                  <FaGoogle className="text-2xl" />
                  <span>Preuzmi na Google Play</span>
                  <FaDownload className="group-hover:translate-y-1 transition-transform duration-300" />
                </a>
              </div>
            </div>
            
            {/* Desna strana - Mobilna ikonica */}
            <div className="flex-shrink-0 animate-slidein-right">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#91CEC1] to-[#6EAEA2] rounded-full blur-2xl opacity-50 animate-pulse"></div>
                <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
                  <FaMobileAlt className="text-8xl text-[#91CEC1] animate-bounce" />
                </div>
              </div>
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
          <span className="font-bold text-[#AD5637]">eVaga Client Mobile</span> je mobilna aplikacija dizajnirana da <span className="text-[#6EAEA2] font-semibold">pojednostavi i ubrza</span> sve vaše interakcije sa Vaga Beta timom. Bilo da ste u fabrici, skladištu ili na terenu, sada možete lako kreirati zahteve, zakazivati servise i pratiti istoriju održavanja vaših vaga — <b>sve sa vašeg telefona</b>.
        </p>
        <p className="text-[#2F5363] text-lg leading-relaxed">
          Aplikacija je trenutno u <span className="font-bold text-[#AD5637]">ranom pristupu</span>, što znači da možete biti među prvima koji će isprobati i uticati na njen razvoj. Pridružite nam se i dopustite nam da zajedno izgradimo najbolje mobilno iskustvo za upravljanje vagama!
        </p>
      </section>

      {/* Funkcionalnosti aplikacije */}
      <section className="mb-10 animate-pop">
        <div className="text-center mb-8">
          <h3 className="text-3xl text-[#1E3E49] font-extrabold mb-3 tracking-tight">
            Šta aplikacija nudi?
          </h3>
          <p className="text-[#2F5363] text-base max-w-2xl mx-auto">
            Sve što vam je potrebno za efikasno upravljanje uslugama vaga na jednom mestu
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
                Unesite sve potrebne informacije i pošaljite zahtev za servis ili overavanje vaga direktno sa terena u nekoliko klikova.
              </p>
            </div>
          </div>

          {/* Funkcionalnost 2 - Zakazivanje servisa */}
          <div className="group relative overflow-hidden rounded-2xl border border-[#91CEC1]/30 bg-gradient-to-br from-white/60 to-[#91CEC1]/10 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:border-[#91CEC1] animate-fadeup" style={{ animationDelay: '0.1s' }}>
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
                Zakažite overavanje, servisiranje ili popravku vaga odabirom datuma i vremena koji vama odgovara. Bez telefonskih poziva!
              </p>
            </div>
          </div>

          {/* Funkcionalnost 3 - Istorija servisa */}
          <div className="group relative overflow-hidden rounded-2xl border border-[#AD5637]/30 bg-gradient-to-br from-white/60 to-[#AD5637]/10 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:border-[#AD5637] animate-fadeup" style={{ animationDelay: '0.2s' }}>
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
                Sve informacije o prethodnim servisima, overavanjima i popravkama na jednom mestu. Pratite šta je urađeno i kada.
              </p>
            </div>
          </div>

          {/* Funkcionalnost 4 - Komunikacija */}
          <div className="group relative overflow-hidden rounded-2xl border border-[#1E3E49]/30 bg-gradient-to-br from-white/60 to-[#1E3E49]/10 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:border-[#1E3E49] animate-fadeup" style={{ animationDelay: '0.3s' }}>
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
                Komunicirajte sa našim timom direktno kroz aplikaciju. Postavite pitanja, dobijte savete i pratite status vašeg zahteva u realnom vremenu.
              </p>
            </div>
          </div>

          {/* Funkcionalnost 5 - Mobilno upravljanje */}
          <div className="group relative overflow-hidden rounded-2xl border border-[#6EAEA2]/30 bg-gradient-to-br from-white/60 to-[#6EAEA2]/10 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:border-[#6EAEA2] animate-fadeup" style={{ animationDelay: '0.4s' }}>
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
                Upravljajte svim uslugama na daljinu. Proveravajte status, menjajte termine i pratite napredak - sve sa vašeg mobilnog uređaja.
              </p>
            </div>
          </div>

          {/* Funkcionalnost 6 - Push notifikacije */}
          <div className="group relative overflow-hidden rounded-2xl border border-[#91CEC1]/30 bg-gradient-to-br from-white/60 to-[#91CEC1]/10 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:border-[#91CEC1] animate-fadeup" style={{ animationDelay: '0.5s' }}>
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
                Budite uvek obavešteni. Dobijajte notifikacije o statusu zahteva, podsetnike za zakazane servise i važna obaveštenja od tima.
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
              <h4 className="text-lg font-bold text-[#1E3E49] mb-1">Brže i efikasnije</h4>
              <p className="text-[#2F5363]">
                Smanjite vreme čekanja i elimišite nepotrebne telefonske pozive. Sve što vam je potrebno je na dohvat ruke.
              </p>
            </div>
          </div>

          {/* Benefit 2 */}
          <div className="flex items-start gap-4 p-5 rounded-xl bg-gradient-to-br from-[#91CEC1]/10 to-[#6EAEA2]/5 border border-[#91CEC1]/20 hover:border-[#91CEC1] transition-all duration-300 hover:shadow-lg animate-slidein-right">
            <div className="flex-shrink-0 p-3 rounded-lg bg-[#91CEC1]/20">
              <FaClock className="text-2xl text-[#AD5637]" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-[#1E3E49] mb-1">Dostupno 24/7</h4>
              <p className="text-[#2F5363]">
                Kreirajte zahteve i zakažite servise bilo kada, bez obzira na radno vreme. Aplikacija je uvek dostupna.
              </p>
            </div>
          </div>

          {/* Benefit 3 */}
          <div className="flex items-start gap-4 p-5 rounded-xl bg-gradient-to-br from-[#AD5637]/10 to-[#CBCFBB]/10 border border-[#AD5637]/20 hover:border-[#AD5637] transition-all duration-300 hover:shadow-lg animate-slidein-left" style={{ animationDelay: '0.1s' }}>
            <div className="flex-shrink-0 p-3 rounded-lg bg-[#AD5637]/20">
              <FaCheckCircle className="text-2xl text-[#6EAEA2]" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-[#1E3E49] mb-1">Transparentnost i kontrola</h4>
              <p className="text-[#2F5363]">
                Pratite svaki korak procesa i imajte potpunu kontrolu nad vašim servisima i zahtevima.
              </p>
            </div>
          </div>

          {/* Benefit 4 */}
          <div className="flex items-start gap-4 p-5 rounded-xl bg-gradient-to-br from-[#1E3E49]/10 to-[#2F5363]/5 border border-[#1E3E49]/20 hover:border-[#1E3E49] transition-all duration-300 hover:shadow-lg animate-slidein-right" style={{ animationDelay: '0.1s' }}>
            <div className="flex-shrink-0 p-3 rounded-lg bg-[#1E3E49]/20">
              <FaShieldAlt className="text-2xl text-[#6EAEA2]" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-[#1E3E49] mb-1">Sigurno i pouzdano</h4>
              <p className="text-[#2F5363]">
                Vaši podaci su šifrovani i bezbedni. Koristimo najnovije standarde zaštite podataka.
              </p>
            </div>
          </div>

          {/* Benefit 5 */}
          <div className="flex items-start gap-4 p-5 rounded-xl bg-gradient-to-br from-[#6EAEA2]/10 to-[#91CEC1]/5 border border-[#6EAEA2]/20 hover:border-[#6EAEA2] transition-all duration-300 hover:shadow-lg animate-slidein-left" style={{ animationDelay: '0.2s' }}>
            <div className="flex-shrink-0 p-3 rounded-lg bg-[#6EAEA2]/20">
              <FaUserCheck className="text-2xl text-[#AD5637]" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-[#1E3E49] mb-1">Personalizovano iskustvo</h4>
              <p className="text-[#2F5363]">
                Vaša istorija, preferencije i podaci su sačuvani za brži i lakši pristup.
              </p>
            </div>
          </div>

          {/* Benefit 6 */}
          <div className="flex items-start gap-4 p-5 rounded-xl bg-gradient-to-br from-[#91CEC1]/10 to-[#6EAEA2]/5 border border-[#91CEC1]/20 hover:border-[#91CEC1] transition-all duration-300 hover:shadow-lg animate-slidein-right" style={{ animationDelay: '0.2s' }}>
            <div className="flex-shrink-0 p-3 rounded-lg bg-[#91CEC1]/20">
              <FaChartLine className="text-2xl text-[#AD5637]" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-[#1E3E49] mb-1">Budite prvi</h4>
              <p className="text-[#2F5363]">
                Kao korisnik ranog pristupa, uticaćete na razvoj aplikacije i budite prvi koji će koristiti sve nove funkcionalnosti.
              </p>
            </div>
          </div>
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
              <div className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-[#91CEC1]/20 backdrop-blur-sm border border-[#91CEC1]/30 mb-6 animate-bounce">
                <FaRocket className="text-[#91CEC1] text-xl" />
                <span className="text-sm font-bold text-[#91CEC1]">PRIDRUŽITE SE RANOM PRISTUPU</span>
              </div>
              
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                Preuzmi aplikaciju danas!
              </h3>
              
              <p className="text-lg text-[#CBCFBB] mb-8 leading-relaxed">
                Postanite deo naše zajednice i pomozite nam da izgradimo najbolje rešenje za upravljanje vagama. 
                Preuzimanjem aplikacije u ranom pristupu, dobijate priliku da uticaćete na njen budući razvoj.
              </p>
              
              <a
                href="https://play.google.com/apps/testing/com.vagabeta.evaga_client"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-4 px-10 py-5 rounded-2xl bg-gradient-to-r from-[#6EAEA2] to-[#91CEC1] hover:from-[#91CEC1] hover:to-[#6EAEA2] font-extrabold text-lg text-[#1E3E49] shadow-2xl hover:shadow-[0_20px_60px_rgba(110,174,162,0.5)] transform hover:scale-110 transition-all duration-500 animate-pulse-slow"
              >
                <FaGoogle className="text-3xl group-hover:rotate-12 transition-transform duration-300" />
                <span>Preuzmi na Google Play</span>
                <FaDownload className="text-2xl group-hover:translate-y-1 transition-transform duration-300" />
              </a>
              
              <p className="text-sm text-[#91CEC1] mt-6 font-medium">
                Besplatno • Android • Rani pristup
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
            <h4 className="text-lg font-bold text-[#1E3E49] mb-2">Napomena o ranom pristupu</h4>
            <p className="text-[#2F5363] leading-relaxed">
              Aplikacija je trenutno u fazi ranog pristupa, što znači da aktivno radimo na njenom unapređenju. 
              Vaše povratne informacije su nam izuzetno važne! Ako primetite bilo kakve probleme ili imate sugestije, 
              slobodno nas <a href="/kontakt" className="text-[#AD5637] font-semibold underline hover:text-[#1E3E49] transition-colors">kontaktirajte</a>.
            </p>
          </div>
        </div>
      </section>

    </main>
  );
}
