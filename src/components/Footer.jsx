// components/Footer.jsx
// Komponenta za podnožje stranice sa informacijama o autorskim pravima i dizajneru
// Prikazuje se na dnu svake stranice
// Koristi osnovne Tailwind CSS klase za stilizaciju
// Dinamički prikazuje tekuću godinu
// Link ka LinkedIn profilu dizajnera sa stilizacijom
// Možeš prilagoditi boje i tekst po želji

export default function Footer() {
  return (
    <footer className="bg-[#2F5363] text-[#91CEC1] text-center p-4 mt-8 shadow-inner animate-fadeIn">
      <p>
        Designed by{" "}
        <a
          href="https://www.linkedin.com/in/lakishadev/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-blue-500 hover:text-blue-800 transition-colors"
        >
          lakishadev
        </a>
        <br />© {new Date().getFullYear()} Vaga Beta. All rights reserved.
      </p>
    </footer>
  );
}
