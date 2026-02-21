// components/Footer.jsx
// Komponenta za podnožje stranice sa informacijama o autorskim pravima i dizajneru
// Prikazuje se na dnu svake stranice
// Koristi osnovne Tailwind CSS klase za stilizaciju
// Dinamički prikazuje tekuću godinu
// Link ka LinkedIn profilu dizajnera sa stilizacijom
// Možeš prilagoditi boje i tekst po želji

import { Link } from "react-router-dom";
import {
  FaLinkedin,
  FaGithub,
  FaPhoneAlt,
  FaEnvelope,
  FaInstagram,
} from "react-icons/fa";
import ProgressiveImage from "./UI/ProgressiveImage";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-neutral-border bg-neutral-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <ProgressiveImage
                src="/imgs/vaga-logo.png"
                alt="Vaga Beta Logo"
                className="w-12 h-12 rounded-xl border border-brand-primary/20 object-cover bg-white"
              />
              <span className="font-heading text-xl font-bold text-brand-primary">
                Vaga Beta
              </span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              Servis i overavanje vaga, prodaja opreme i softverska rešenja za
              profesionalno merenje.
            </p>
          </div>

          <div>
            <h3 className="font-heading text-base font-bold text-text-primary mb-3">
              Navigacija
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  className="text-text-secondary hover:text-brand-primary"
                  to="/"
                >
                  Početna
                </Link>
              </li>
              <li>
                <Link
                  className="text-text-secondary hover:text-brand-primary"
                  to="/prodavnica"
                >
                  Prodavnica
                </Link>
              </li>
              <li>
                <Link
                  className="text-text-secondary hover:text-brand-primary"
                  to="/usluge"
                >
                  Usluge
                </Link>
              </li>
              <li>
                <Link
                  className="text-text-secondary hover:text-brand-primary"
                  to="/kontakt"
                >
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-base font-bold text-text-primary mb-3">
              Kontakt
            </h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-center gap-2">
                <FaPhoneAlt className="text-brand-primary" />
                <span>063 833 9686</span>
              </li>
              <li className="flex items-center gap-2">
                <FaPhoneAlt className="text-brand-primary" />
                <span>066 887 8889</span>
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-brand-primary" />
                <span>vaga.beta@yahoo.com</span>
              </li>
              <li>Ive Andrića 14, Niš 18116</li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-base font-bold text-text-primary mb-3">
              Društvene mreže
            </h3>
            <div className="flex items-center gap-3">
              <a
                href="https://www.linkedin.com/company/vaga-beta/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg border border-neutral-border flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="text-xl" />
              </a>
              <a
                href="https://www.instagram.com/vagabeta/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg border border-neutral-border flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="text-xl" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-4 border-t border-neutral-border text-sm text-text-tertiary flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} Vaga Beta. Sva prava zadržana.
          </span>
          <Link
            to="/privacy"
            className="hover:text-brand-primary transition-colors"
          >
            Politika privatnosti
          </Link>
        </div>
      </div>
    </footer>
  );
}
