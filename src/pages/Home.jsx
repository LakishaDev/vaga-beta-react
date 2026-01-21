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

import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProgressiveImage from "../components/UI/ProgressiveImage";
import Slider from "../components/Slider";
import EvagaVideoPlayer from "../components/UI/EvagaVideoPlayer";
import {
  FaTools,
  FaShippingFast,
  FaCertificate,
  FaFlask,
  FaLaptopCode,
  FaIndustry,
  FaShieldAlt,
  FaClipboardCheck,
} from "react-icons/fa";
import LepModal from "../components/UI/LepModal";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase";

export default function Home() {
  const [modalData, setModalData] = useState({
    open: false,
    src: "",
    text: "",
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [videoStats, setVideoStats] = useState({
    plays: 0,
    pauses: 0,
    ended: 0,
    shares: 0,
    rateChanges: 0,
    maxPercent: 0,
    seeks: 0,
  });
  const [ctaStats, setCtaStats] = useState({ test: 0, demo: 0 });
  const faqItems = [
    {
      q: "Da li sistem podržava više vaga?",
      a: "Da, možete umrežiti više vaga i pratiti ih iz jedinstvene aplikacije sa centralnom bazom podataka.",
    },
    {
      q: "Kako se vrši unos robe?",
      a: "Radnici unose merenja direktno sa tableta ili telefona, a podaci se čuvaju trajno i dostupni su 24/7.",
    },
    {
      q: "Da li postoji prilagođavanje po meri?",
      a: "Program je modularan i možemo ga prilagoditi specifičnim procesima i izveštajima vašeg poslovanja.",
    },
  ];

  const galleryShots = [
    { src: "/imgs/home/slika2.png", title: "Kontrolni panel" },
    { src: "/imgs/home/slika3.png", title: "Laboratorijsko merenje" },
    { src: "/imgs/home/slika8.jpg", title: "Industrijska vaga" },
  ];

  const testimonials = [
    {
      name: "Logistika Plus",
      text: "Centralizovali smo praćenje ulaza i izlaza robe, greške su svedene na minimum.",
    },
    {
      name: "Agro Trade",
      text: "Tablet unos na licu mesta ubrzao je rad za 30% i obezbedio potpunu trasu podataka.",
    },
  ];

  const openModal = ({ src, text }) => setModalData({ open: true, src, text });

  const closeModal = () => setModalData((prev) => ({ ...prev, open: false }));
  const navigate = useNavigate();

  useEffect(() => {
    const adminEmails =
      import.meta.env.VITE_ADMIN_EMAILS?.split(",").map((e) => e.trim()) || [];
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user && adminEmails.includes(user.email)) setIsAdmin(true);
      else setIsAdmin(false);
    });
    return () => unsub();
  }, []);

  const handleVideoAnalytics = useCallback((event, payload) => {
    setVideoStats((prev) => {
      const next = { ...prev };
      if (event === "play") next.plays += 1;
      if (event === "pause") next.pauses += 1;
      if (event === "ended") next.ended += 1;
      if (event === "share") next.shares += 1;
      if (event === "rate_change") next.rateChanges += 1;
      if (event === "seek") next.seeks += 1;
      if (event === "progress" && payload?.maxPercent !== undefined) {
        next.maxPercent = Math.max(next.maxPercent, payload.maxPercent || 0);
      }
      return next;
    });
  }, []);

  const handleCtaClick = (type) => {
    setCtaStats((prev) => ({ ...prev, [type]: (prev[type] || 0) + 1 }));
  };

  return (
    <>
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
          <Slider onImageClick={openModal} />
        </section>

        {/* Intro sekcija */}
        <section className="mb-6 animate-fadein duration-1000 delay-200">
          <h2 className="text-2xl text-[#1A343D] mt-0 font-extrabold animate-fadeup">
            Preciznost, inovacije i poverenje u svakoj vagi.
          </h2>
          <p className="text-lg text-[#2F5363] mt-3 mb-4 max-w-xl animate-fadeup delay-100">
            Vaga Beta je lider u izradi, servisu i žigosanju elektronskih vaga –
            ali i programiranju specijalizovanih softverskih rešenja za kontrolu
            i merenje! Pronađite sve što vam je potrebno na jednom mestu – brzo,
            profesionalno i sa garancijom.
          </p>
        </section>

        {/* e-Vaga Program Video Prezentacija Sekcija */}
        <EvagaVideoPlayer
          filename="eVaga Program 2026.mp4"
          namespace="videos"
          title="e-Vaga Program Prezentacija - Kontrola i Praćenje Merenja"
          description="U nastavku vam predstavljamo video prezentaciju programa-sistema koji je namenjen za kontrolu i praćenje merenja robe na vagama, sa mogućnošću umrežavanja više vaga. Saznaću više o mogućnostima, automatizaciji i kako ovaj sistem može poboljšati vašu poslovanje."
          autoplay={true}
          enableAnalytics={isAdmin}
          onAnalyticsEvent={handleVideoAnalytics}
        />

        {/* Info box ispod videa */}
        <section className="grid gap-4 sm:grid-cols-2 bg-[#F5F9F7] border border-[#D7DACF] rounded-xl p-5 shadow-sm animate-fadein duration-700">
          <div>
            <h4 className="text-xl font-bold text-[#1E3E49] mb-2">
              Ključne mogućnosti e-Vage
            </h4>
            <ul className="space-y-2 text-[#2F5363] text-sm sm:text-base list-disc pl-5">
              <li>Evidencija primljene i izdate robe po artiklima</li>
              <li>Praćenje rada zaposlenih sa tableta/telefona</li>
              <li>Centralna baza podataka, 24/7 pristup</li>
              <li>Umrežavanje više vaga u jednom sistemu</li>
              <li>Detaljna istorija merenja i izveštaji po periodu</li>
              <li>Modularna prilagođavanja vašim procesima</li>
            </ul>
          </div>
          <div className="bg-white/70 rounded-lg p-4 border border-[#E2E7DE] shadow-inner">
            <h5 className="text-lg font-semibold text-[#6EAEA2] mb-2">
              Brz uvid u prednosti
            </h5>
            <p className="text-[#2F5363] text-sm sm:text-base leading-relaxed">
              Kontrola zaliha u realnom vremenu, manje grešaka u merenju, i
              jasna traživost svakog unosa. Povežite teren, magacin i menadžment
              u jednu sliku.
            </p>
          </div>
        </section>

        {/* CTA sekcija */}
        <section className="my-8 bg-gradient-to-r from-[#1E3E49] via-[#2F5363] to-[#6EAEA2] text-white rounded-2xl p-6 sm:p-8 shadow-lg animate-pop">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-wide opacity-80">
                Automatizacija merenja
              </p>
              <h3 className="text-2xl sm:text-3xl font-extrabold mt-1">
                Spremni za potpunu kontrolu robe?
              </h3>
              <p className="text-white/90 mt-2 max-w-2xl text-sm sm:text-base">
                Testirajte e-Vagu u realnom okruženju ili zakažite demo sa našim
                timom. Brzo postavljanje, jasni izveštaji, sigurni podaci.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/prodavnica"
                onClick={() => handleCtaClick("test")}
                className="px-5 py-3 rounded-xl bg-white text-[#1E3E49] font-bold shadow hover:shadow-lg hover:-translate-y-0.5 transition"
              >
                Testiraj e-Vagu
              </Link>
              <Link
                to="/kontakt"
                onClick={() => handleCtaClick("demo")}
                className="px-5 py-3 rounded-xl border border-white/70 text-white font-bold hover:bg-white/10 hover:-translate-y-0.5 transition"
              >
                Kontaktiraj nas za demo
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ + galerija + testimoniali */}
        <section className="grid gap-6 lg:grid-cols-3 my-8">
          <div className="bg-white/80 border border-[#E2E7DE] rounded-xl p-5 shadow-sm lg:col-span-2">
            <h4 className="text-xl font-bold text-[#1E3E49] mb-3">
              Česta pitanja
            </h4>
            <div className="space-y-3">
              {faqItems.map((item) => (
                <details
                  key={item.q}
                  className="group border border-[#E6E9E0] rounded-lg p-3 bg-[#F8FAF8]"
                >
                  <summary className="cursor-pointer font-semibold text-[#1E3E49] flex items-center justify-between">
                    {item.q}
                    <span className="text-[#6EAEA2] group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <p className="mt-2 text-sm text-[#2F5363] leading-relaxed">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>

          <div className="bg-white/80 border border-[#E2E7DE] rounded-xl p-5 shadow-sm">
            <h4 className="text-xl font-bold text-[#1E3E49] mb-3">
              Testimoniali
            </h4>
            <div className="space-y-3">
              {testimonials.map((t) => (
                <div
                  key={t.name}
                  className="p-3 rounded-lg bg-[#F5F9F7] border border-[#D7DACF]"
                >
                  <p className="text-[#2F5363] text-sm leading-relaxed">
                    “{t.text}”
                  </p>
                  <p className="mt-2 text-xs font-semibold text-[#1E3E49]">
                    {t.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="my-8">
          <h4 className="text-xl font-bold text-[#1E3E49] mb-3">
            Galerija aplikacije
          </h4>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {galleryShots.map((shot) => (
              <div
                key={shot.src}
                className="rounded-xl overflow-hidden border border-[#E2E7DE] shadow-sm bg-white"
              >
                <ProgressiveImage
                  src={shot.src}
                  alt={shot.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-3 text-sm font-semibold text-[#1E3E49]">
                  {shot.title}
                </div>
              </div>
            ))}
          </div>
        </section>

        {isAdmin && (
          <section className="my-6 bg-[#F0F4F1] border border-[#D7DACF] rounded-xl p-5 shadow-sm">
            <h5 className="text-lg font-bold text-[#1E3E49] mb-2">
              Video Analytics (admin)
            </h5>
            <div className="grid sm:grid-cols-3 md:grid-cols-4 gap-3 text-sm text-[#1E3E49]">
              <div className="p-3 rounded-lg bg-white/90 border border-[#E6E9E0]">
                Play: <strong>{videoStats.plays}</strong>
              </div>
              <div className="p-3 rounded-lg bg-white/90 border border-[#E6E9E0]">
                Pause: <strong>{videoStats.pauses}</strong>
              </div>
              <div className="p-3 rounded-lg bg-white/90 border border-[#E6E9E0]">
                Seeks: <strong>{videoStats.seeks}</strong>
              </div>
              <div className="p-3 rounded-lg bg-white/90 border border-[#E6E9E0]">
                Share: <strong>{videoStats.shares}</strong>
              </div>
              <div className="p-3 rounded-lg bg-white/90 border border-[#E6E9E0]">
                Rate promene: <strong>{videoStats.rateChanges}</strong>
              </div>
              <div className="p-3 rounded-lg bg-white/90 border border-[#E6E9E0]">
                Max odgledano:{" "}
                <strong>{Math.round(videoStats.maxPercent)}%</strong>
              </div>
              <div className="p-3 rounded-lg bg-white/90 border border-[#E6E9E0]">
                Završeno: <strong>{videoStats.ended}</strong>
              </div>
              <div className="p-3 rounded-lg bg-white/90 border border-[#E6E9E0]">
                CTA Testiraj: <strong>{ctaStats.test}</strong> / Demo:{" "}
                <strong>{ctaStats.demo}</strong>
              </div>
            </div>
          </section>
        )}

        {/* SEKCIJA – vodič ka žigu/overavanju, stilski uklopljena */}
        <section
          className="
              w-full
              bg-gradient-to-br from-[#F5F9F7] to-[#E9EFE6]/80
              rounded-xl shadow
              my-10 px-4 py-8
              flex flex-col items-center
              animate-fadein
            "
        >
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1E3E49] text-center mb-2 animate-fadeup">
            Potrebna vam je zakonska verifikacija ili više informacija o
            merilima?
          </h3>
          <p className="text-[#2F5363] text-base sm:text-lg text-center max-w-2xl mx-auto mb-5 animate-fadeup delay-100">
            Pripremili smo praktične vodiče i postupke za žigosanje i overu
            vaga, sve prema važećim zakonima. Odaberite jednu od opcija ispod za
            detalje i primere iz prakse.
          </p>
          <div
            className="
                w-full
                max-w-xl
                grid grid-cols-1 sm:grid-cols-2
                gap-4 mt-3
              "
          >
            <Link
              to="/usluge#zigosanje-vaga"
              className="
                  flex flex-col justify-center items-center gap-2
                  py-5 px-3
                  rounded-xl
                  bg-white/90 hover:bg-[#6EAEA2]/10 transition
                  border border-[#D7DACF]
                  shadow group
                  focus:outline-none focus:ring-2 focus:ring-[#6EAEA2]
                  animate-pop
                "
            >
              <FaCertificate className="text-3xl text-[#6EAEA2] group-hover:scale-110 transition" />
              <span className="text-lg font-semibold text-[#1E3E49]">
                Žigosanje vaga
              </span>
              <span className="text-sm text-[#2F5363] opacity-80 mt-1 text-center">
                Sve što treba da znate o žigosanju vaga i važnosti zakonskog
                žiga.
              </span>
            </Link>
            <Link
              to="/usluge#overavanje-vaga"
              className="
                    flex flex-col justify-center items-center gap-2
                    py-5 px-3
                    rounded-xl
                    bg-white/90 hover:bg-[#AD5637]/10 transition
                    border border-[#D7DACF]
                    shadow group
                    focus:outline-none focus:ring-2 focus:ring-[#AD5637]
                    animate-pop
                  "
            >
              <FaClipboardCheck className="text-3xl text-[#AD5637] group-hover:scale-110 transition" />
              <span className="text-lg font-semibold text-[#1E3E49]">
                Overavanje vaga
              </span>
              <span className="text-sm text-[#2F5363] opacity-80 mt-1 text-center">
                Detaljan postupak, objašnjenja i odgovori na najčešća pitanja o
                overavanju.
              </span>
            </Link>
          </div>
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
      <AnimatePresence mode="wait">
        {modalData.open && (
          <LepModal
            key={modalData.src + modalData.text}
            open={modalData.open}
            onClose={closeModal}
            src={modalData.src}
            text={modalData.text}
          />
        )}
      </AnimatePresence>
    </>
  );
}
