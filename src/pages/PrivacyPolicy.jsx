// src/pages/PrivacyPolicy.jsx
// Stranica sa politikom privatnosti za Vaga Beta aplikaciju
// Sadrži informacije o prikupljanju, korišćenju i zaštiti podataka
// Stilizovana sa Tailwind CSS, konzistentno sa ostalim stranicama
// Responsive i pristupačna
// Animacije: fadein, fadeup, pop
// Datum poslednje izmene: 25. novembar 2025
// VAŽNO: Aplikacija ne sadrži oglase

import { FaShieldAlt, FaUserLock, FaDatabase, FaEnvelope, FaUserShield, FaInfoCircle, FaBan } from "react-icons/fa";

/**
 * PrivacyPolicy komponenta
 * Prikazuje politiku privatnosti za Vaga Beta Lab d.o.o
 * @returns {JSX.Element} Renderovana stranica sa politikom privatnosti
 */
export default function PrivacyPolicy() {
  return (
    <main className="max-w-5xl mx-auto bg-white/90 rounded-xl shadow-2xl p-6 sm:p-10 mt-12 border border-[#CBCFBB] animate-fadein">
      {/* Naslov stranice */}
      <header className="mb-8 animate-pop">
        <div className="flex items-center gap-3 mb-4">
          <FaShieldAlt className="text-4xl text-[#6EAEA2]" />
          <h1 className="text-3xl sm:text-4xl text-[#1E3E49] font-bold">
            Politika privatnosti
          </h1>
        </div>
        <p className="text-[#2F5363] text-sm">
          Datum poslednje izmene: <span className="font-semibold text-[#AD5637]">25. novembar 2025.</span>
        </p>
      </header>

      {/* Sekcija: Uvod */}
      <section className="mb-8 animate-fadeup">
        <div className="flex items-center gap-2 mb-3">
          <FaInfoCircle className="text-xl text-[#6EAEA2]" />
          <h2 className="text-xl sm:text-2xl text-[#1E3E49] font-semibold">
            Uvod
          </h2>
        </div>
        <div className="bg-[#91CEC1]/10 rounded-lg p-4 border border-[#91CEC1]/30">
          <p className="text-[#2F5363] mb-3">
            Dobrodošli na web stranicu kompanije <span className="font-bold text-[#AD5637]">Vaga Beta Lab d.o.o</span>. 
            Mi smo specijalizovana firma sa sedištem u Nišu, Srbija, koja se bavi prodajom, proizvodnjom, 
            popravkom i overavanjem vaga svih vrsta.
          </p>
          <p className="text-[#2F5363] mb-3">
            Ova Politika privatnosti opisuje kako prikupljamo, koristimo i štitimo vaše lične podatke 
            prilikom korišćenja naše web stranice i usluga. Vaša privatnost nam je izuzetno važna i 
            posvećeni smo zaštiti vaših ličnih informacija.
          </p>
          <p className="text-[#2F5363]">
            Korišćenjem naše web stranice, saglasni ste sa praksom opisanom u ovoj politici privatnosti.
          </p>
        </div>
      </section>

      {/* Sekcija: Bez oglasa - VAŽNO */}
      <section className="mb-8 animate-pop">
        <div className="flex items-center gap-2 mb-3">
          <FaBan className="text-xl text-[#AD5637]" />
          <h2 className="text-xl sm:text-2xl text-[#1E3E49] font-semibold">
            Bez oglasa
          </h2>
        </div>
        <div className="bg-[#AD5637]/10 rounded-lg p-4 border border-[#AD5637]/30">
          <p className="text-[#2F5363] font-medium">
            <span className="font-bold text-[#AD5637]">VAŽNO:</span> Naša aplikacija i web stranica 
            <span className="font-bold text-[#1E3E49]"> ne sadrže oglase</span>. Ne koristimo reklamne 
            mreže, ne prikazujemo reklame trećih strana i ne delimo vaše podatke sa oglašivačima.
          </p>
        </div>
      </section>

      {/* Sekcija: Prikupljanje podataka */}
      <section className="mb-8 animate-fadeup">
        <div className="flex items-center gap-2 mb-3">
          <FaDatabase className="text-xl text-[#6EAEA2]" />
          <h2 className="text-xl sm:text-2xl text-[#1E3E49] font-semibold">
            Prikupljanje podataka
          </h2>
        </div>
        <div className="bg-[#CBCFBB]/30 rounded-lg p-4 border border-[#CBCFBB]">
          <p className="text-[#2F5363] mb-3">
            Prikupljamo sledeće vrste podataka:
          </p>
          <ul className="list-disc list-inside space-y-2 text-[#2F5363] ml-2">
            <li>
              <span className="font-semibold text-[#1E3E49]">Kontakt informacije:</span> ime, email adresa, 
              broj telefona — koje nam dobrovoljno pružate putem kontakt forme ili direktne komunikacije.
            </li>
            <li>
              <span className="font-semibold text-[#1E3E49]">Podaci o upitu:</span> detalji o vašim upitima 
              za naše usluge i proizvode.
            </li>
            <li>
              <span className="font-semibold text-[#1E3E49]">Tehnički podaci:</span> IP adresa, tip 
              pretraživača, operativni sistem — prikupljeni automatski radi poboljšanja korisničkog iskustva.
            </li>
          </ul>
        </div>
      </section>

      {/* Sekcija: Korišćenje podataka */}
      <section className="mb-8 animate-fadeup">
        <div className="flex items-center gap-2 mb-3">
          <FaUserLock className="text-xl text-[#91CEC1]" />
          <h2 className="text-xl sm:text-2xl text-[#1E3E49] font-semibold">
            Korišćenje podataka
          </h2>
        </div>
        <div className="bg-[#91CEC1]/10 rounded-lg p-4 border border-[#91CEC1]/30">
          <p className="text-[#2F5363] mb-3">
            Vaše podatke koristimo isključivo u sledeće svrhe:
          </p>
          <ul className="list-disc list-inside space-y-2 text-[#2F5363] ml-2">
            <li>Odgovaranje na vaše upite i pružanje traženih informacija</li>
            <li>Realizacija usluga koje ste zatražili (servis, overavanje, prodaja vaga)</li>
            <li>Poboljšanje funkcionalnosti naše web stranice</li>
            <li>Komunikacija u vezi sa narudžbinama i uslugama</li>
            <li>Ispunjavanje zakonskih obaveza</li>
          </ul>
          <p className="text-[#2F5363] mt-3 font-medium">
            <span className="text-[#AD5637]">Ne prodajemo</span> i <span className="text-[#AD5637]">ne delimo</span> vaše 
            lične podatke sa trećim stranama u marketinške svrhe.
          </p>
        </div>
      </section>

      {/* Sekcija: Zaštita podataka */}
      <section className="mb-8 animate-pop">
        <div className="flex items-center gap-2 mb-3">
          <FaShieldAlt className="text-xl text-[#6EAEA2]" />
          <h2 className="text-xl sm:text-2xl text-[#1E3E49] font-semibold">
            Zaštita podataka
          </h2>
        </div>
        <div className="bg-[#6EAEA2]/10 rounded-lg p-4 border border-[#6EAEA2]/30">
          <p className="text-[#2F5363] mb-3">
            Preduzimamo odgovarajuće tehničke i organizacione mere za zaštitu vaših ličnih podataka:
          </p>
          <ul className="list-disc list-inside space-y-2 text-[#2F5363] ml-2">
            <li>SSL enkripcija za sigurnu komunikaciju</li>
            <li>Ograničen pristup ličnim podacima samo ovlašćenim zaposlenima</li>
            <li>Redovno ažuriranje sigurnosnih sistema</li>
            <li>Bezbedno čuvanje podataka u skladu sa industrijskim standardima</li>
          </ul>
          <p className="text-[#2F5363] mt-3">
            Čuvamo vaše podatke samo onoliko dugo koliko je potrebno za ispunjenje svrhe za koju su 
            prikupljeni ili koliko zakon zahteva.
          </p>
        </div>
      </section>

      {/* Sekcija: Prava korisnika */}
      <section className="mb-8 animate-fadeup">
        <div className="flex items-center gap-2 mb-3">
          <FaUserShield className="text-xl text-[#AD5637]" />
          <h2 className="text-xl sm:text-2xl text-[#1E3E49] font-semibold">
            Prava korisnika
          </h2>
        </div>
        <div className="bg-[#AD5637]/10 rounded-lg p-4 border border-[#AD5637]/30">
          <p className="text-[#2F5363] mb-3">
            U skladu sa zakonom o zaštiti podataka, imate sledeća prava:
          </p>
          <ul className="list-disc list-inside space-y-2 text-[#2F5363] ml-2">
            <li>
              <span className="font-semibold text-[#1E3E49]">Pravo pristupa:</span> možete zatražiti 
              informacije o podacima koje čuvamo o vama.
            </li>
            <li>
              <span className="font-semibold text-[#1E3E49]">Pravo ispravke:</span> možete zatražiti 
              ispravku netačnih podataka.
            </li>
            <li>
              <span className="font-semibold text-[#1E3E49]">Pravo brisanja:</span> možete zatražiti 
              brisanje vaših podataka pod određenim uslovima.
            </li>
            <li>
              <span className="font-semibold text-[#1E3E49]">Pravo prigovora:</span> možete uložiti 
              prigovor na obradu vaših podataka.
            </li>
            <li>
              <span className="font-semibold text-[#1E3E49]">Pravo prenosivosti:</span> možete zatražiti 
              prenos vaših podataka u strukturiranom formatu.
            </li>
          </ul>
          <p className="text-[#2F5363] mt-3">
            Za ostvarivanje bilo kog od ovih prava, kontaktirajte nas putem podataka navedenih ispod.
          </p>
        </div>
      </section>

      {/* Sekcija: Kontakt informacije */}
      <section className="mb-4 animate-pop">
        <div className="flex items-center gap-2 mb-3">
          <FaEnvelope className="text-xl text-[#6EAEA2]" />
          <h2 className="text-xl sm:text-2xl text-[#1E3E49] font-semibold">
            Kontakt informacije
          </h2>
        </div>
        <div className="bg-[#CBCFBB]/30 rounded-lg p-4 border border-[#CBCFBB]">
          <p className="text-[#2F5363] mb-3">
            Za sva pitanja u vezi sa ovom politikom privatnosti ili obradom vaših podataka, 
            možete nas kontaktirati:
          </p>
          <ul className="space-y-2 text-[#2F5363]">
            <li className="flex items-center gap-2">
              <span className="font-semibold text-[#1E3E49]">Kompanija:</span>
              <span className="text-[#AD5637] font-medium">Vaga Beta Lab d.o.o</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="font-semibold text-[#1E3E49]">Adresa:</span>
              <span>Ive Andrića 14, Niš 18116, Srbija</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="font-semibold text-[#1E3E49]">Email:</span>
              <a 
                href="mailto:vaga.beta@yahoo.com" 
                className="text-[#AD5637] underline hover:text-[#6EAEA2] transition-colors"
              >
                vaga.beta@yahoo.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <span className="font-semibold text-[#1E3E49]">Telefon:</span>
              <span className="text-[#91CEC1]">018 4545 782</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Footer sa dodatnom informacijom */}
      <footer className="mt-8 pt-4 border-t border-[#CBCFBB] text-center animate-fadein">
        <p className="text-sm text-[#2F5363]">
          Ova politika privatnosti može biti ažurirana povremeno. Molimo vas da periodično 
          proveravate ovu stranicu za eventualne izmene.
        </p>
        <p className="text-xs text-[#6EAEA2] mt-2">
          © 2025 Vaga Beta Lab d.o.o — Sva prava zadržana
        </p>
      </footer>
    </main>
  );
}
