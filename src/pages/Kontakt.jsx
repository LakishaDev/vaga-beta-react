// src/pages/Kontakt.jsx
// Kontakt stranica sajta
// Prikazuje kontakt informacije, radno vreme i mapu lokacije
// Stilizovana sa Tailwind CSS
// Responsive i pristupačna
// Koristi Google Maps iframe za prikaz lokacije
// Boje iz BOJE objekta
// Animacije: fadein, slidein-left, slidein-right, fadeup, pop
// Ikonice iz emoji (za jednostavnost)
// Sadrži dva bloka: levi sa informacijama, desni sa mapom
export default function Kontakt() {
  return (
    <main className="max-w-5xl mx-auto bg-white/90 rounded-xl shadow-2xl p-6 sm:p-10 mt-12 border border-[#CBCFBB] flex flex-col md:flex-row gap-8 items-stretch animate-fadein">
      {/* Levi blok: info + tekst */}
      <section className="flex-1 flex flex-col justify-between animate-slidein-left">
        <div>
          <h2 className="text-4xl text-[#1E3E49] font-bold mb-2 animate-pop">
            Kontaktirajte nas
          </h2>
          <p className="text-[#2F5363] mb-4 text-lg animate-fadeup">
            Pišite, pozovite ili svratite do naše laboratorije –{" "}
            <span className="font-bold text-[#AD5637]">Vaga Beta</span> tim je
            tu da svakom klijentu obezbedi pouzdanu podršku, brzu realizaciju i
            profesionalni odnos.
          </p>
          <ul className="space-y-2 text-[#1A343D] text-base font-semibold mb-4 animate-fadein">
            <li className="flex gap-2 items-center">
              <span role="img" aria-label="location">
                📍
              </span>{" "}
              <strong>Adresa:</strong> Ive Andrića 14, Niš 18116
            </li>
            <li className="flex gap-2 items-center">
              <span role="img" aria-label="man">
                👨‍💼
              </span>{" "}
              <strong>Aleksandar:</strong>{" "}
              <span className="text-[#91CEC1]">063 833 9686</span>
            </li>
            <li className="flex gap-2 items-center">
              <span role="img" aria-label="man">
                👨‍🔧
              </span>{" "}
              <strong>Radoslav:</strong>{" "}
              <span className="text-[#6EAEA2]">063 810 6322</span>
            </li>
            <li className="flex gap-2 items-center">
              <span role="img" aria-label="phone">
                📞
              </span>{" "}
              <strong>Telefon:</strong>{" "}
              <span className="text-[#2F5363]">018 4545 782</span>
            </li>
            <li className="flex gap-2 items-center">
              <span role="img" aria-label="email">
                ✉️
              </span>{" "}
              <strong>Email:</strong>
              <a
                href="mailto:vaga.beta@yahoo.com"
                className="text-[#AD5637] underline hover:text-[#6EAEA2] transition-colors"
              >
                vaga.beta@yahoo.com
              </a>
            </li>
          </ul>
        </div>
        <div className="mt-6 text-sm text-[#6EAEA2] font-medium animate-fadeup">
          Radno vreme: <br />
          <span className="block">
            <span className="text-[#1E3E49] font-semibold">Pon–Pet:</span>{" "}
            <span className="text-[#AD5637]">08–18h</span>
          </span>
          <span className="block">
            <span className="text-[#1E3E49] font-semibold">Subota:</span>{" "}
            <span className="text-[#AD5637]">08–16h</span>
          </span>
          <span className="block">
            <span className="text-[#1E3E49] font-semibold">Nedelja:</span>{" "}
            <span className="text-[#AD5637] font-semibold">ne radimo</span>
          </span>
        </div>
      </section>

      {/* Desni blok: mapa lepo u cardu */}
      <section className="flex-1 md:w-[380px] bg-[#CBCFBB]/70 rounded-xl border border-[#91CEC1] shadow-lg overflow-hidden flex flex-col justify-center animate-slidein-right">
        <div className="p-1">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d725.7919941335642!2d21.96049866741613!3d43.31074294781325!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4755b9489a4acd21%3A0x422f0275588f7174!2sVaga%20Beta%20Lab%20d.o.o!5e0!3m2!1ssr!2srs!4v1690286095097!5m2!1ssr!2srs"
            style={{
              border: 0,
              width: "100%",
              minHeight: "260px",
              height: "100%",
              borderRadius: "1rem",
            }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Lokacija Vaga Beta"
          />
        </div>
        <div className="text-center py-2 text-[#1A343D] text-sm animate-fadeup">
          Pogledajte mapu za lakši dolazak
        </div>
      </section>
    </main>
  );
}
