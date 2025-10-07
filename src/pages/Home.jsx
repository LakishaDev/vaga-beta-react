// src/pages/Home.jsx
// Početna stranica sajta
// Predstavlja Vaga Beta firmu, njene usluge i proizvode
// Koristi ProgressiveImage za optimizovane slike
// Stilizovana sa Tailwind CSS
// Responsive i pristupačna
// Koristi komponente iz /components
// Ikonice iz react-icons
// Animacije sa Tailwind CSS
// Sadrži sekcije: hero, intro, usluge, galerija, zašto mi + CTA
// Sve slike su u /public/imgs/home
// Boje iz BOJE objekta
// Animacije: fadein, fadeup, pop

import ProgressiveImage from "../components/UI/ProgressiveImage";
import Slider from "../components/Slider";
import {
  FaTools,
  FaShippingFast,
  FaCertificate,
  FaFlask,
  FaLaptopCode,
  FaIndustry,
  FaShieldAlt,
} from "react-icons/fa";

export default function Home() {
  return (
    <main className="max-w-full sm:max-w-6xl mx-auto p-2 sm:p-8 bg-white/80 rounded-xl shadow-lg mt-10 animate-fadein border border-[#CBCFBB]">
      <div className="relative rounded-2xl overflow-hidden mb-6 animate-fadein duration-1000">
        {/* /imgs/home/slika1.png */}
        <ProgressiveImage
          src="/imgs/home/slika8.jpg"
          alt="Elektronske vage i programiranje"
          className="w-full object-center"
        />
        {/* <div className="absolute inset-0 bg-gradient-to-br from-[#CBCFBB]/80 to-transparent" /> */}
        <div className="absolute bottom-5 left-8 text-3xl text-[#1E3E49] font-bold drop-shadow animate-pop">
          Vaga Beta
        </div>
      </div>

      {/* Slider ili hero slika */}
      <section className="mb-6 animate-fadein duration-1000 delay-200">
        <h2 className="text-2xl text-[#1A343D] mt-0 font-extrabold animate-fadeup">
          Galerija naših radova, proizvoda i alata koje koristimo
        </h2>
        <Slider />
      </section>

      {/* Intro sekcija */}
      <section className="mb-6 animate-fadein duration-1000 delay-200">
        <h2 className="text-2xl text-[#1A343D] mt-0 font-extrabold animate-fadeup">
          Preciznost, inovacije i poverenje u svakoj vagi.
        </h2>
        <p className="text-lg text-[#2F5363] mt-3 mb-4 max-w-xl animate-fadeup delay-100">
          Vaga Beta je lider u izradi, servisu i žigosanju elektronskih vaga –
          ali i programiranju specijalizovanih softverskih rešenja za kontrolu i
          merenje! Pronađite sve što vam je potrebno na jednom mestu – brzo,
          profesionalno i sa garancijom.
        </p>
      </section>

      {/* Sekcija Proizvodnja i softver */}
      <section className="rounded-xl p-4 bg-[#91CEC1]/30 mb-8 flex flex-col md:flex-row gap-6 items-center animate-fadein duration-1000 delay-200">
        <ProgressiveImage
          src="/imgs/home/slika2.png"
          alt="Izrada elektronskih vaga po želji"
          className="w-full md:w-1/2 rounded-lg object-cover animate-pop delay-300"
        />
        <div className="flex-1">
          <h3 className="text-xl font-bold text-[#6EAEA2] mb-2">
            Izrada vaga po meri i razvoj softvera
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <FaIndustry className="text-[#1E3E49] text-xl" /> Elektronske i
              mehaničke vage dizajnirane po vašim potrebama
            </li>
            <li className="flex items-center gap-2">
              <FaLaptopCode className="text-[#AD5637] text-xl" /> Razvoj
              softverskih programa za pametno praćenje, upravljanje i
              integraciju vaga
            </li>
            <li className="flex items-center gap-2">
              <FaShippingFast className="text-[#91CEC1] text-xl" /> Isporuka i
              ugradnja na lokaciji korisnika
            </li>
          </ul>
        </div>
      </section>

      {/* Usluge sekcija sa ikonama */}
      <section className="mb-8 animate-fadein duration-1000 delay-300">
        <h3 className="text-xl text-[#6EAEA2] font-bold mb-3 animate-pop">
          Šta vam još nudimo?
        </h3>
        <ul className="grid sm:grid-cols-2 gap-4 list-none pl-0">
          <li className="flex items-center gap-3 p-3 rounded-lg bg-[#CBCFBB]/50 hover:bg-[#91CEC1]/20 shadow transition-transform hover:scale-105 animate-fadeup">
            <FaTools className="text-[#AD5637] text-2xl" />
            Brza i efikasna popravka elektronskih vaga
          </li>
          <li className="flex items-center gap-3 p-3 rounded-lg bg-[#CBCFBB]/50 hover:bg-[#91CEC1]/20 shadow transition-transform hover:scale-105 animate-fadeup delay-100">
            <FaCertificate className="text-[#8A4D34] text-2xl" />
            Žigosanje vaga i izdavanje sertifikata
          </li>
          <li className="flex items-center gap-3 p-3 rounded-lg bg-[#CBCFBB]/50 hover:bg-[#91CEC1]/20 shadow transition-transform hover:scale-105 animate-fadeup delay-150">
            <FaFlask className="text-[#1E3E49] text-2xl" />
            Laboratorijsko ispitivanje i kalibracija
          </li>
          <li className="flex items-center gap-3 p-3 rounded-lg bg-[#CBCFBB]/50 hover:bg-[#91CEC1]/20 shadow transition-transform hover:scale-105 animate-fadeup delay-200">
            <FaShieldAlt className="text-[#2F5363] text-2xl" />
            Akreditovana firma i višegodišnja garancija
          </li>
        </ul>
      </section>

      {/* Slika testiranja/vage */}
      <div className="rounded-2xl overflow-hidden mb-8 animate-fadein duration-1000 delay-400">
        {/* /imgs/home/slika3.png */}
        <ProgressiveImage
          src="/imgs/home/slika3.png"
          alt="Elektronske vage u laboratoriji"
          className="w-full aspect-video object-cover rounded-xl"
        />
      </div>

      {/* Zašto baš mi + CTA */}
      <section className="bg-[#CBCFBB]/60 rounded-lg p-5 shadow-sm animate-pop duration-1000 delay-400">
        <h4 className="text-xl text-[#AD5637] font-bold mb-2">
          Zašto baš Vaga Beta?
        </h4>
        <ul className="list-disc pl-6 text-[#1A343D] space-y-1 font-medium mb-4">
          <li>Više od 20 godina iskustva u industriji vaga</li>
          <li>Kompletan servis i podrška na jednom mestu</li>
          <li>Tim stručnjaka za elektroniku, mehaniku i softver</li>
          <li>Brzina & pouzdanost</li>
          <li>Individualni pristup svakom klijentu</li>
        </ul>
        <a
          href="/kontakt"
          className="inline-block px-6 py-3 rounded-xl font-semibold text-white bg-[#AD5637] hover:bg-[#6EAEA2] shadow transition-all animate-bounce"
        >
          Kontaktirajte nas
        </a>
      </section>
    </main>
  );
}
