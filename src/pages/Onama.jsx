// src/pages/Onama.jsx
// O nama stranica sajta
// Predstavlja Vaga Beta firmu, njene usluge, tim i dokumentaciju
// Stilizovana sa Tailwind CSS
// Responsive i pristupačna
// Koristi ikone iz react-icons za vizuelnu podršku
// Animacije: fadein, fadeup, pop, slidein-left, slidein-right, bounceInDown, fadeInUpBig
// Boje iz BOJE objekta
// Sadrži sekcije: hero, intro, usluge, benefiti, dokumentacija
// Sve slike su u /public/imgs
// Ikonice iz react-icons
// Animacije sa Tailwind CSS i animate.css
// Koristi ProgressiveImage za optimizovane slike
// Ikonice iz react-icons
import { FaWeightHanging, FaTruckMoving, FaBalanceScale, FaClipboardCheck, FaTools, FaCogs, FaStar, FaCut, FaUserTie, FaHandshake, FaRegComments, FaFilePdf, FaCertificate, FaFileAlt, FaDownload, FaExternalLinkAlt } from "react-icons/fa";
import ProgressiveImage from "../components/UI/ProgressiveImage";

export default function Onama() {
  return (
    <main className="max-w-6xl mx-auto bg-white/95 rounded-xl shadow-2xl p-6 sm:p-10 mt-14 border border-[#CBCFBB] animate-fadein animate__animated animate__fadeInUpBig">
      {/* Logo i naslov */}
      <div className="flex items-center mb-4 animate-pop animate__animated animate__bounceInDown">
        <ProgressiveImage src="/imgs/vaga-logo.png" alt="Logo Vaga Beta" className="h-16 w-16 rounded-full shadow-lg bg-[#CBCFBB] animate-spin-slow" />
        <span className="ml-4 text-3xl font-extrabold text-[#1E3E49] tracking-tight animate-pop">Vaga Beta Lab d.o.o</span>
      </div>

      <h2 className="text-3xl text-[#1E3E49] font-bold mb-2 animate-fadeup">O nama</h2>

      {/* HERO/INTRO */}
      <section className="mb-5">
        <p className="text-[#2F5363] mb-2 animate-fadeup animate__animated animate__fadeInLeft">
          <span className="font-bold text-[#AD5637]">Vaga Beta</span> je specijalizovana firma koja već <span className="text-[#6EAEA2] font-semibold">više od 15 godina</span> uspešno pruža <b>prodaju, proizvodnju i popravku vaga svih vrsta</b> — uključujući elektronske, <b>kamionske</b>, <b>paletne</b> i <b>platformske vage</b>. Posedujemo <span className="text-[#91CEC1] font-semibold">akreditaciju</span> po ISO/IEC 17020:2012 i radimo ispitivanje, žigosanje i sertifikaciju vaga širom Srbije.
        </p>
        <p className="text-[#2F5363] mb-2 animate-fadein">
          Naš iskusni tim nudi <b>brzu intervenciju</b> za sve vrste vaga i merila mase, kao i <span className="font-medium text-[#AD5637]">stručnu popravku mesoreznica</span> — od preventivnog servisa do kompleksnih popravki. Pored svega, za industriju i laboratorije razvijamo i <b>softverska rešenja</b> za pametno upravljanje i digitalni monitoring vaga.
        </p>
        <p className="text-[#2F5363] mb-2 animate-fadein">
          Posvećeni smo svakom klijentu — pružamo <b>pouzdana i prilagođena rešenja</b> uz vrhunski kvalitet i povoljne cene. Naša laboratorija se nalazi u Nišu, ali radimo na celoj teritoriji Srbije, garantujući profesionalnost, transparentnost i sigurnost u svakom koraku.
        </p>
        <p className="text-[#2F5363] mb-2 animate-pop">
          Proverite <b>recenzije naših klijenata</b> i uverite se zašto smo <span className="font-bold text-[#6EAEA2]">prvi izbor</span> mnogih kompanija:
          <a
            href="https://g.page/r/CbHLHzuR7NxCEAE/review"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-[#AD5637] font-semibold underline hover:text-[#1E3E49] transition-colors"
          >Google recenzije <FaStar className="inline" /></a>
        </p>
      </section>

      {/* USLUGE */}
      <section className="mb-6 animate-pop">
        <h3 className="text-xl text-[#6EAEA2] font-semibold mb-3">Šta Vaga Beta nudi?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-[#91CEC1]/20 animate-fadeup">
            <FaWeightHanging className="text-2xl text-[#1E3E49] animate-bounce" />
            Prodaja elektronskih, kamionskih i platformskih vaga
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-[#6EAEA2]/20 animate-fadeup animate__animated animate__fadeInRight">
            <FaBalanceScale className="text-2xl text-[#2F5363]" />
            Proizvodnja i programiranje vaga po vašoj specifikaciji
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-[#CBCFBB]/50 animate-pop">
            <FaClipboardCheck className="text-2xl text-[#AD5637]" />
            Overavanje, kontrola i žigosanje vaga (akreditovano telo)
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-[#91CEC1]/15 animate-fadein">
            <FaTools className="text-2xl text-[#6EAEA2]" />
            Stručna popravka i redovan servis za sve tipove vaga i merila
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-[#AD5637]/10 animate-pop">
            <FaCut className="text-2xl text-[#AD5637]" />
            Servis i popravka mesoreznica, rezervni delovi
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-[#CBCFBB]/35 animate-fadeup">
            <FaCogs className="text-2xl text-[#6EAEA2] animate-spin-slow" />
            Softver i inovativna rešenja za automatizaciju merenja
          </div>
        </div>
      </section>

      {/* BENEFITI */}
      <section className="mb-7 animate-fadeup">
        <h3 className="text-xl text-[#1E3E49] font-semibold mb-2">Vaša prednost sa Vaga Beta timom</h3>
        <ul className="list-none pl-0 space-y-2 text-[#1A343D] font-medium">
          <li className="flex items-center gap-2 animate-fadeup"><FaUserTie className="text-lg text-[#6EAEA2]" /> Iskusan i sertifikovan tim inženjera i tehničara</li>
          <li className="flex items-center gap-2 animate-fadein"><FaHandshake className="text-lg text-[#AD5637]" /> Pouzdanost i personalizovan pristup svakom klijentu</li>
          <li className="flex items-center gap-2 animate-fadein"><FaRegComments className="text-lg text-[#91CEC1]" /> Brza i efikasna podrška — online, telefonom i uživo</li>
          <li className="flex items-center gap-2 animate-pop"><FaStar className="text-lg text-[#F6B100]" /> Višegodišnji pozitivni rezultati i zadovoljni korisnici</li>
        </ul>
      </section>

      {/* Dokumentacija - Modern UI/UX with Glass Morphism */}
      <section className="mt-10 animate-fadeup">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-3 mb-4 animate-pop">
            <FaCertificate className="text-4xl text-[#AD5637] animate-spin-slow" />
            <h3 className="text-3xl text-[#1E3E49] font-extrabold tracking-tight">
              Dokumentacija o akreditaciji
            </h3>
          </div>
          <p className="text-[#2F5363] text-base max-w-2xl mx-auto">
            Preuzmi zvanične dokumente o našoj akreditaciji i sertifikatima
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Sertifikat */}
          <a
            href="/dokumentacija/Sertifikat_o_akreditaciji.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-2xl border border-[#91CEC1]/30 bg-gradient-to-br from-white/60 to-[#91CEC1]/10 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:border-[#6EAEA2] animate-fadein"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#6EAEA2]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-6 flex flex-col items-start h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-[#6EAEA2]/20 group-hover:bg-[#6EAEA2]/30 transition-colors duration-300">
                  <FaCertificate className="text-2xl text-[#1E3E49] group-hover:scale-110 transition-transform duration-300" />
                </div>
                <FaDownload className="ml-auto text-[#6EAEA2] opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300" />
              </div>
              <h4 className="text-lg font-bold text-[#1E3E49] mb-2 group-hover:text-[#6EAEA2] transition-colors duration-300">
                Sertifikat o akreditaciji
              </h4>
              <p className="text-sm text-[#2F5363] mb-4 flex-grow">
                Zvanični sertifikat o akreditaciji laboratorije
              </p>
              <div className="flex items-center gap-2 text-sm text-[#AD5637] font-semibold">
                <FaFilePdf className="text-base" />
                <span>PDF dokument</span>
                <FaExternalLinkAlt className="text-xs ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </a>

          {/* Odluka */}
          <a
            href="/dokumentacija/Odluka.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-2xl border border-[#AD5637]/30 bg-gradient-to-br from-white/60 to-[#AD5637]/10 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:border-[#AD5637] animate-fadein"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#AD5637]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-6 flex flex-col items-start h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-[#AD5637]/20 group-hover:bg-[#AD5637]/30 transition-colors duration-300">
                  <FaFileAlt className="text-2xl text-[#1E3E49] group-hover:scale-110 transition-transform duration-300" />
                </div>
                <FaDownload className="ml-auto text-[#AD5637] opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300" />
              </div>
              <h4 className="text-lg font-bold text-[#1E3E49] mb-2 group-hover:text-[#AD5637] transition-colors duration-300">
                Odluka
              </h4>
              <p className="text-sm text-[#2F5363] mb-4 flex-grow">
                Službena odluka o akreditaciji
              </p>
              <div className="flex items-center gap-2 text-sm text-[#AD5637] font-semibold">
                <FaFilePdf className="text-base" />
                <span>PDF dokument</span>
                <FaExternalLinkAlt className="text-xs ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </a>

          {/* Predmet Odluka */}
          <a
            href="/dokumentacija/Predmet_Odluka.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-2xl border border-[#1E3E49]/30 bg-gradient-to-br from-white/60 to-[#1E3E49]/10 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:border-[#1E3E49] animate-fadein"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#1E3E49]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-6 flex flex-col items-start h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-[#1E3E49]/20 group-hover:bg-[#1E3E49]/30 transition-colors duration-300">
                  <FaFileAlt className="text-2xl text-[#1E3E49] group-hover:scale-110 transition-transform duration-300" />
                </div>
                <FaDownload className="ml-auto text-[#1E3E49] opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300" />
              </div>
              <h4 className="text-lg font-bold text-[#1E3E49] mb-2 group-hover:text-[#2F5363] transition-colors duration-300">
                Predmet Odluka
              </h4>
              <p className="text-sm text-[#2F5363] mb-4 flex-grow">
                Detaljni predmet odluke o akreditaciji
              </p>
              <div className="flex items-center gap-2 text-sm text-[#AD5637] font-semibold">
                <FaFilePdf className="text-base" />
                <span>PDF dokument</span>
                <FaExternalLinkAlt className="text-xs ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </a>

          {/* Rešenje DMDM 1 */}
          <a
            href="/dokumentacija/Rešenje_DMDM_za_V-B_Lab_1.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-2xl border border-[#6EAEA2]/30 bg-gradient-to-br from-white/60 to-[#6EAEA2]/10 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:border-[#6EAEA2] animate-fadein"
            style={{ animationDelay: '0.3s' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#6EAEA2]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-6 flex flex-col items-start h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-[#6EAEA2]/20 group-hover:bg-[#6EAEA2]/30 transition-colors duration-300">
                  <FaClipboardCheck className="text-2xl text-[#1E3E49] group-hover:scale-110 transition-transform duration-300" />
                </div>
                <FaDownload className="ml-auto text-[#6EAEA2] opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300" />
              </div>
              <h4 className="text-lg font-bold text-[#1E3E49] mb-2 group-hover:text-[#6EAEA2] transition-colors duration-300">
                Rešenje DMDM Lab 1
              </h4>
              <p className="text-sm text-[#2F5363] mb-4 flex-grow">
                Rešenje Direkcije za mere i dragocene metale
              </p>
              <div className="flex items-center gap-2 text-sm text-[#AD5637] font-semibold">
                <FaFilePdf className="text-base" />
                <span>PDF dokument</span>
                <FaExternalLinkAlt className="text-xs ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </a>

          {/* Rešenje DMDM 2 */}
          <a
            href="/dokumentacija/Rešenje_DMDM_za_V-B_Lab_2.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-2xl border border-[#91CEC1]/30 bg-gradient-to-br from-white/60 to-[#91CEC1]/10 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:border-[#91CEC1] animate-fadein"
            style={{ animationDelay: '0.4s' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#91CEC1]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-6 flex flex-col items-start h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-[#91CEC1]/20 group-hover:bg-[#91CEC1]/30 transition-colors duration-300">
                  <FaClipboardCheck className="text-2xl text-[#1E3E49] group-hover:scale-110 transition-transform duration-300" />
                </div>
                <FaDownload className="ml-auto text-[#91CEC1] opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300" />
              </div>
              <h4 className="text-lg font-bold text-[#1E3E49] mb-2 group-hover:text-[#6EAEA2] transition-colors duration-300">
                Rešenje DMDM Lab 2
              </h4>
              <p className="text-sm text-[#2F5363] mb-4 flex-grow">
                Rešenje Direkcije za mere i dragocene metale
              </p>
              <div className="flex items-center gap-2 text-sm text-[#AD5637] font-semibold">
                <FaFilePdf className="text-base" />
                <span>PDF dokument</span>
                <FaExternalLinkAlt className="text-xs ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </a>

          {/* Rešenje DMDM 3 */}
          <a
            href="/dokumentacija/Rešenje_DMDM_za_V-B_Lab_3.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-2xl border border-[#AD5637]/30 bg-gradient-to-br from-white/60 to-[#AD5637]/10 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:border-[#AD5637] animate-fadein"
            style={{ animationDelay: '0.5s' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#AD5637]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-6 flex flex-col items-start h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-[#AD5637]/20 group-hover:bg-[#AD5637]/30 transition-colors duration-300">
                  <FaClipboardCheck className="text-2xl text-[#1E3E49] group-hover:scale-110 transition-transform duration-300" />
                </div>
                <FaDownload className="ml-auto text-[#AD5637] opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300" />
              </div>
              <h4 className="text-lg font-bold text-[#1E3E49] mb-2 group-hover:text-[#AD5637] transition-colors duration-300">
                Rešenje DMDM Lab 3
              </h4>
              <p className="text-sm text-[#2F5363] mb-4 flex-grow">
                Rešenje Direkcije za mere i dragocene metale
              </p>
              <div className="flex items-center gap-2 text-sm text-[#AD5637] font-semibold">
                <FaFilePdf className="text-base" />
                <span>PDF dokument</span>
                <FaExternalLinkAlt className="text-xs ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </a>
        </div>
      </section>
    </main>
  );
}
