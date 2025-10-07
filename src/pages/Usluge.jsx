// src/pages/Usluge.jsx
// Stranica za usluge firme
// Prikazuje različite usluge koje firma nudi
// Stilizovana sa Tailwind CSS
// Responsive i pristupačna
// Koristi ikonice iz react-icons
// Animacije: fadein, slidein, pop
// Boje iz BOJE objekta
// Sadrži sekcije za svaku uslugu sa ikonama i opisima
// Završna sekcija sa benefitima saradnje
// Ikonice iz react-icons
// Usluge: servis vaga, kontrolno telo, softver i cloud rešenja
// Svaka usluga ima svoju sekciju sa opisom i ikonama
// Završna sekcija sa benefitima saradnje sa Vaga Beta
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
  FaInfoCircle,
} from "react-icons/fa";
import { FaSearch, FaCertificate, FaExclamationTriangle } from "react-icons/fa";
import overavanjeImg from "/imgs/usluge/overavanje-merila.png";
import vagaZig from "/imgs/usluge/slika1.jpg"; // tvoja slika
import { useEffect } from "react";

export default function Usluge() {
  // Skrolovanje do sekcije ako postoji hash u URL-u
  // Inicijalizacija Lenis u App.jsx
  // window.lenis je dostupan globalno
  useEffect(() => {
    if (window.location.hash) {
      const el = document.getElementById(window.location.hash.replace("#", ""));
      if (el && window.lenis) {
        setTimeout(() => {
          window.lenis.scrollTo(el, { offset: -120, duration: 1.2 });
        }, 100); // kratko zakašnjenje da se renderuje
      }
    }
  }, []);

  return (
    <main className="max-w-6xl mx-auto bg-gradient-to-b from-[#F9FAF9] to-[#EEF3EF] rounded-3xl shadow-2xl p-10 sm:p-16 mt-16 border border-[#D7DACF] animate-fadein overflow-hidden">
      <div className="text-center mb-14 animate-pop">
        <div className="flex justify-center mb-4">
          <FaTools className="text-6xl text-[#6EAEA2] animate-spin-slow" />
        </div>
        <h2 className="text-5xl font-extrabold text-[#1E3E49] tracking-tight">
          Naše Usluge
        </h2>
        <p className="text-[#2F5363] text-lg mt-2 max-w-3xl mx-auto">
          Pouzdano održavanje, zakonska verifikacija i digitalna transformacija
          vaga – sve na jednom mestu.
        </p>
      </div>

      {/* GLAVNE USLUGE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <section className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 p-8 border border-[#D8E2DC] animate-slidein-left">
          <div className="flex items-center gap-3 mb-3">
            <FaWeight className="text-4xl text-[#1E3E49]" />
            <h3 className="text-2xl font-bold text-[#1E3E49]">
              Servisiranje vaga svih tipova
            </h3>
          </div>
          <p className="text-[#2F5363] mb-4 leading-relaxed">
            Stručno servisiranje, kalibracija i održavanje vaga – od trgovinskih
            do industrijskih i kamionskih sistema. Naš tim obezbeđuje preciznost
            i dugotrajnost svakog merila.
          </p>
          <div className="flex items-center gap-2 text-[#AD5637] font-medium">
            <FaTools /> Stručan i brz servis uz originalne delove.
          </div>
        </section>
        <section className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 p-8 border border-[#D8E2DC] animate-slidein-right">
          <div className="flex items-center gap-3 mb-3">
            <FaBalanceScale className="text-4xl text-[#AD5637]" />
            <h3 className="text-2xl font-bold text-[#AD5637]">
              Kontrolno telo i overavanje
            </h3>
          </div>
          <p className="text-[#2F5363] mb-4 leading-relaxed">
            Akreditovani smo za zakonsku verifikaciju i žigosanje vaga svih
            klasa. Brinemo o tačnosti i zakonitosti svakog javnog merenja u
            skladu sa propisima Republike Srbije.
          </p>
          <div className="flex items-center gap-2 text-[#6EAEA2] font-medium">
            <FaClipboardCheck /> Svaka vaga mora imati overu i žig – mi to
            obezbeđujemo.
          </div>
        </section>
        <section className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 p-8 border border-[#D8E2DC] animate-slidein-left">
          <div className="flex items-center gap-3 mb-3">
            <FaMobileAlt className="text-4xl text-[#6EAEA2]" />
            <h3 className="text-2xl font-bold text-[#1E3E49]">
              Softver, aplikacije i baze podataka
            </h3>
          </div>
          <p className="text-[#2F5363] mb-4 leading-relaxed">
            Razvijamo mobilne aplikacije (
            <FaAndroid className="inline text-[#3DDC84]" /> Android,{" "}
            <FaApple className="inline text-[#1E3E49]" /> iOS), desktop softver
            i baze za digitalno upravljanje merenjima, analizu i izveštavanje.
          </p>
          <div className="flex items-center gap-2 text-[#AD5637] font-medium">
            <FaCogs /> Automatizovani sistemi i statistika u realnom vremenu.
          </div>
        </section>
        <section className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 p-8 border border-[#D8E2DC] animate-slidein-right">
          <div className="flex items-center gap-3 mb-3">
            <FaCloud className="text-4xl text-[#AD5637]" />
            <h3 className="text-2xl font-bold text-[#AD5637]">
              Cloud i daljinsko upravljanje
            </h3>
          </div>
          <p className="text-[#2F5363] mb-4 leading-relaxed">
            Cloud rešenja za skladištenje, API integracije i nadzor vaga sa bilo
            kog mesta. Povezivanje sa ERP/CRM sistemima i generisanje
            automatskih izveštaja.
          </p>
          <div className="flex flex-col gap-1 text-[#2F5363] font-medium">
            <div className="flex items-center gap-2">
              <FaPlug className="text-[#6EAEA2]" /> Povezivanje sa vašim
              softverom.
            </div>
            <div className="flex items-center gap-2">
              <FaGlobe className="text-[#AD5637]" /> Online pristup i
              inspekcioni portal.
            </div>
          </div>
        </section>
      </div>

      {/* SEKCIJA O ŽIGU */}
      <section
        id="zakonski-zig"
        className="mt-20 bg-[#F5F9F7] rounded-3xl p-5 relative animate-fadein shadow-md hover:shadow-xl transition-all duration-500"
      >
        <h3 className="text-3xl font-extrabold text-[#1E3E49] mb-8 text-center">
          Zakonski žig na merilima
        </h3>
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 relative">
          <div className="relative w-full md:w-1/2">
            <img
              src={vagaZig}
              alt="Žig na vagi"
              className="rounded-2xl shadow-lg border border-[#D8E2DC]"
            />
            {/* Linija i krug oko žiga */}
            <div className="absolute border-4 border-[#ff4400] rounded-full w-25 h-25 animate-pulse-slow top-[33%] left-[7%]"></div>
          </div>

          <div className="md:w-1/2 bg-white/80 p-8 rounded-2xl shadow-md border border-[#D8E2DC] animate-slidein-right">
            <h4 className="text-2xl font-bold text-[#AD5637] mb-3 flex items-center gap-2">
              <FaInfoCircle /> Šta je zakonski žig?
            </h4>
            <p className="text-[#2F5363] leading-relaxed">
              Žig (kao na slici – broj 00001578) označava da je vaga{" "}
              <b>zakonski overena</b> i proverena od strane akreditovanog
              kontrolnog tela prema Pravilniku o vagama. Svako merilo u
              Republici Srbiji mora imati važeći žig kao dokaz tačnosti i
              ispravnosti merenja.
            </p>
            <p className="text-[#2F5363] mt-3 italic">
              Uklanjanje, neovlašćeno menjanje ili oštećenje žiga povlači
              zakonske posledice i čini merenje nevažećim. Overa žiga važi
              obično <b>24 meseca</b> od datuma žigosanja, nakon čega mora da se
              izvrši ponovna verifikacija.
            </p>
            <p className="text-[#2F5363] mt-3">
              Dodatno: žig mora sadržati serijski broj, datum verifikacije i
              oznaku klase merila, u skladu sa zakonskim zahtevima. Kontrolno
              telo izdaje sertifikat i vodi evidenciju o verifikaciji.
            </p>
          </div>
        </div>
      </section>

      {/* NOVA PODSEKCIJA Overavanje merila */}
      <section
        id="overavanje-merila"
        className="mt-16 bg-[#F5F9F7] rounded-3xl p-8 flex flex-col md:flex-row gap-10 items-center shadow-lg animate-fadein"
      >
        {/* Slika i graphic container */}
        <div className="relative w-full md:w-1/2 flex justify-center items-center">
          <img
            src={overavanjeImg}
            alt="Overavanje merila ilustracija"
            className="rounded-2xl shadow-xl border border-[#D8E2DC] animate-pop"
            style={{ maxWidth: 400, width: "100%" }}
          />
        </div>
        {/* Tekstualna strana */}
        <div className="w-full md:w-1/2 flex flex-col gap-6 animate-slidein-right">
          <h4 className="text-2xl font-extrabold text-[#1E3E49] mb-2 flex items-center gap-3">
            <FaClipboardCheck className="text-[#6EAEA2]" /> Overavanje merila —
            stručni postupak
          </h4>
          {/* "Stepper" koraci */}
          <div className="flex flex-col gap-6">
            {/* KORAK 1 */}
            <div className="flex items-start gap-4 group">
              <div className="flex-shrink-0 flex flex-col items-center pt-1">
                <FaSearch className="text-3xl text-[#AD5637] animate-[bounce_1.3s_infinite]" />
                <div className="h-10 border-l-2 border-[#D8E2DC] group-last:border-none"></div>
              </div>
              <div>
                <span className="text-xl font-bold text-[#AD5637]">
                  1. Inicijalna provera
                </span>
                <p className="text-[#2F5363] mt-1">
                  Temeljna vizuelna inspekcija i provera ispravnosti svih
                  funkcija merila. Svako odstupanje ili kvar se dokumentuje i
                  predlažu se dalje mere za otklanjanje.
                </p>
              </div>
            </div>
            {/* KORAK 2 */}
            <div className="flex items-start gap-4 group">
              <div className="flex-shrink-0 flex flex-col items-center pt-1">
                <FaBalanceScale className="text-3xl text-[#6EAEA2] animate-[pulse_1.6s_infinite]" />
                <div className="h-10 border-l-2 border-[#D8E2DC] group-last:border-none"></div>
              </div>
              <div>
                <span className="text-xl font-bold text-[#6EAEA2]">
                  2. Tehničko ispitivanje
                </span>
                <p className="text-[#2F5363] mt-1">
                  Detaljno ispitivanje mernih svojstava i utvrđivanje
                  usaglašenosti sa propisanim standardima, uključujući testove
                  tačnosti, linearnosti i stabilnosti.
                </p>
              </div>
            </div>
            {/* KORAK 3 */}
            <div className="flex items-start gap-4 group">
              <div className="flex-shrink-0 flex flex-col items-center pt-1">
                <FaCertificate className="text-3xl text-[#1E3E49] animate-[pop_0.6s]" />
                <div className="h-10 border-l-2 border-[#D8E2DC] group-last:border-none"></div>
              </div>
              <div>
                <span className="text-xl font-bold text-[#1E3E49]">
                  3. Overavanje i dokumentacija
                </span>
                <p className="text-[#2F5363] mt-1">
                  Označavanje (žigosanje) merila, izdavanje sertifikata o
                  overenosti ili rešenja o odbijanju, te unos svih podataka u
                  zakonsku evidenciju i informisanje korisnika.
                </p>
              </div>
            </div>
            {/* NAPOMENA */}
            <div className="flex items-start gap-4 mt-2">
              <FaExclamationTriangle className="text-2xl text-[#AD5637]" />
              <div className="text-[#AD5637] font-semibold">
                Svi koraci izvode se od strane akreditovanog kontrolnog tela, uz
                striktno poštovanje propisa Republike Srbije.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITI */}
      <section className="mt-16 animate-fadein">
        <h3 className="text-3xl text-[#1E3E49] font-extrabold mb-6 text-center">
          Zašto odabrati Vaga Beta?
        </h3>
        <ul className="flex flex-wrap justify-center gap-6 text-lg font-medium">
          <li className="flex gap-2 items-center">
            <FaTools className="text-[#6EAEA2]" /> Savremen servis i stručan tim
          </li>
          <li className="flex gap-2 items-center">
            <FaBalanceScale className="text-[#AD5637]" /> Zakonska sigurnost i
            brzina
          </li>
          <li className="flex gap-2 items-center">
            <FaMobileAlt className="text-[#91CEC1]" /> Softver i mobilne
            aplikacije
          </li>
          <li className="flex gap-2 items-center">
            <FaCloud className="text-[#AD5637]" /> Cloud i daljinsko upravljanje
          </li>
          <li className="flex gap-2 items-center">
            <FaDatabase className="text-[#6EAEA2]" /> Automatizacija podataka
          </li>
          <li className="flex gap-2 items-center">
            <FaPlug className="text-[#AD5637]" /> Integracije sa vašim sistemima
          </li>
        </ul>
      </section>
    </main>
  );
}
