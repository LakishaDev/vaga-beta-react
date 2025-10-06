// components/Footer.jsx
// Komponenta za podnožje stranice sa informacijama o autorskim pravima i dizajneru
// Prikazuje se na dnu svake stranice
// Koristi osnovne Tailwind CSS klase za stilizaciju
// Dinamički prikazuje tekuću godinu
// Link ka LinkedIn profilu dizajnera sa stilizacijom
// Možeš prilagoditi boje i tekst po želji

import { FaLinkedin, FaGithub } from "react-icons/fa";
import ProgressiveImage from "./UI/ProgressiveImage";

export default function Footer() {
  return (
    <footer
      className="
        bg-gradient-to-r from-[#183446] via-[#255366] to-[#183446]
        text-[#B7E8D9]
        px-6 py-8 mt-12
        shadow-lg
        animate-fadeIn
      "
    >
      <div
        className="
          max-w-5xl mx-auto
          flex flex-col md:flex-row items-center justify-between gap-4
          transition-all duration-300
        "
      >
        {/* Logo & Title */}
        <div className="flex items-center gap-3 animate-slideInLeft">
          <ProgressiveImage
            src="/imgs/vaga-logo.png"
            alt="Vaga Beta Logo"
            className="w-16 h-16 rounded-full border-2 border-[#91CEC1] shadow-lg object-cover bg-white"
          />
          <span className="text-lg font-bold tracking-wide">Vaga Beta</span>
        </div>

        {/* Designer & Socials */}
        <div className="flex items-center gap-4 animate-fadeIn">
          <span className="text-base font-medium">
            Designed by{" "}
            <a
              href="https://www.linkedin.com/in/lakishadev/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 underline text-[#56A4F2] hover:text-[#2d79c7] transition-colors"
            >
              lakishadev <FaLinkedin className="inline text-xl" />
            </a>
          </span>
          <a
            href="https://github.com/lakishadev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#6cffe7] hover:text-white transition-colors text-2xl"
            aria-label="GitHub"
          >
            <FaGithub />
          </a>
        </div>
      </div>

      {/* Divider & Copyright */}
      <div className="mt-8 border-t border-[#91CEC155] pt-4 text-sm text-[#7ABAB3] tracking-wide text-center animate-slideInUp">
        © {new Date().getFullYear()} Vaga Beta. All rights reserved.
      </div>
    </footer>
  );
}
