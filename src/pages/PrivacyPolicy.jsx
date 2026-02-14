import {
  FaShieldAlt,
  FaUserLock,
  FaDatabase,
  FaEnvelope,
  FaUserShield,
  FaInfoCircle,
  FaBan,
} from "react-icons/fa";

export default function PrivacyPolicy() {
  const sections = [
    {
      icon: FaInfoCircle,
      title: "Uvod",
      content: (
        <>
          <p>
            Dobrodošli na web stranicu kompanije{" "}
            <strong>Vaga Beta Lab d.o.o</strong>. Bavimo se prodajom,
            proizvodnjom, popravkom i overavanjem vaga svih vrsta.
          </p>
          <p className="mt-3">
            Ova politika privatnosti objašnjava kako prikupljamo, koristimo i
            štitimo vaše lične podatke prilikom korišćenja naših usluga.
          </p>
        </>
      ),
    },
    {
      icon: FaBan,
      title: "Bez oglasa",
      content: (
        <p>
          <strong>VAŽNO:</strong> Naša aplikacija i web stranica{" "}
          <strong>ne sadrže oglase</strong>. Ne koristimo reklamne mreže i ne
          delimo podatke sa oglašivačima.
        </p>
      ),
      accent: "error",
    },
    {
      icon: FaDatabase,
      title: "Prikupljanje podataka",
      content: (
        <ul className="list-disc list-inside space-y-2">
          <li>
            Kontakt podaci: ime, email, telefon (kada ih dobrovoljno unesete).
          </li>
          <li>
            Podaci o upitu: sadržaj zahteva za servis, overavanje ili kupovinu.
          </li>
          <li>
            Tehnički podaci: IP adresa, browser i osnovni sistemski podaci radi
            stabilnosti servisa.
          </li>
        </ul>
      ),
    },
    {
      icon: FaUserLock,
      title: "Korišćenje podataka",
      content: (
        <ul className="list-disc list-inside space-y-2">
          <li>Odgovor na vaše upite i realizacija traženih usluga.</li>
          <li>Komunikacija o narudžbinama, servisima i statusima zahteva.</li>
          <li>
            Poboljšanje funkcionalnosti sajta i ispunjenje zakonskih obaveza.
          </li>
          <li>
            <strong>Ne prodajemo i ne delimo</strong> vaše lične podatke trećim
            stranama u marketinške svrhe.
          </li>
        </ul>
      ),
    },
    {
      icon: FaShieldAlt,
      title: "Zaštita podataka",
      content: (
        <ul className="list-disc list-inside space-y-2">
          <li>SSL enkripcija i bezbedna komunikacija.</li>
          <li>Ograničen pristup podacima samo ovlašćenim licima.</li>
          <li>Redovno održavanje i unapređenje sigurnosnih mehanizama.</li>
          <li>
            Čuvanje podataka samo onoliko dugo koliko je potrebno i zakonski
            dozvoljeno.
          </li>
        </ul>
      ),
    },
    {
      icon: FaUserShield,
      title: "Prava korisnika",
      content: (
        <ul className="list-disc list-inside space-y-2">
          <li>Pravo pristupa podacima koje čuvamo o vama.</li>
          <li>Pravo ispravke netačnih podataka.</li>
          <li>Pravo brisanja podataka pod zakonski dozvoljenim uslovima.</li>
          <li>Pravo prigovora i pravo prenosivosti podataka.</li>
        </ul>
      ),
    },
  ];

  return (
    <main className="w-full bg-neutral-bg px-4 sm:px-8 md:px-16 py-10 sm:py-14">
      <div className="max-w-5xl mx-auto bg-neutral-surface rounded-2xl shadow-xl border border-neutral-border p-6 sm:p-10">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <FaShieldAlt className="text-3xl text-brand-primary" />
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text-primary">
              Politika privatnosti
            </h1>
          </div>
          <p className="text-text-secondary text-sm">
            Datum poslednje izmene:{" "}
            <span className="font-semibold">13. februar 2026.</span>
          </p>
        </header>

        <div className="space-y-6">
          {sections.map((section, index) => {
            const Icon = section.icon;
            const accentClass =
              section.accent === "error"
                ? "border-error/30 bg-error/5"
                : "border-neutral-border bg-neutral-surface-tint/40";

            return (
              <section
                key={index}
                className={`rounded-xl border p-5 sm:p-6 ${accentClass}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="text-brand-secondary" />
                  <h2 className="text-xl sm:text-2xl font-semibold text-text-primary">
                    {section.title}
                  </h2>
                </div>
                <div className="text-text-secondary leading-relaxed">
                  {section.content}
                </div>
              </section>
            );
          })}
        </div>

        <section className="mt-6 rounded-xl border border-neutral-border p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-3">
            <FaEnvelope className="text-brand-secondary" />
            <h2 className="text-xl sm:text-2xl font-semibold text-text-primary">
              Kontakt informacije
            </h2>
          </div>
          <ul className="space-y-2 text-text-secondary">
            <li>
              <span className="font-semibold text-text-primary">
                Kompanija:
              </span>{" "}
              Vaga Beta Lab d.o.o
            </li>
            <li>
              <span className="font-semibold text-text-primary">Adresa:</span>{" "}
              Ive Andrića 14, Niš 18116, Srbija
            </li>
            <li>
              <span className="font-semibold text-text-primary">Email:</span>{" "}
              <a
                href="mailto:vaga.beta@yahoo.com"
                className="text-text-link hover:text-text-link-hover underline"
              >
                vaga.beta@yahoo.com
              </a>
            </li>
            <li>
              <span className="font-semibold text-text-primary">Telefon:</span>{" "}
              018 4545 782
            </li>
          </ul>
        </section>

        <footer className="mt-8 pt-4 border-t border-neutral-border text-center text-sm text-text-tertiary">
          Ova politika privatnosti može biti periodično ažurirana.
        </footer>
      </div>
    </main>
  );
}
