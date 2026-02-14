// components/Navbar.jsx
// Komponenta za navigacioni meni sa logoom i linkovima
// Responsive dizajn sa hamburger menijem za mobilne uređaje
// Koristi React Router za navigaciju između stranica
// Koristi react-icons za ikone
// Koristi useState za upravljanje stanjem menija
// Koristi osnovne Tailwind CSS klase za stilizaciju
// BOJE su definisane u objektu BOJE i mogu se prilagoditi
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaHome,
  FaBoxes,
  FaCogs,
  FaEnvelope,
  FaInfoCircle,
  FaShoppingBag,
  FaMobileAlt,
  FaClipboardList,
  FaPalette,
  FaChevronRight,
} from "react-icons/fa";
import ProgressiveImage from "./UI/ProgressiveImage";

const navItems = [
  { to: "/", label: "Početna", icon: FaHome },
  { to: "/prodavnica", label: "Prodavnica", icon: FaShoppingBag },
  { to: "/usluge", label: "Usluge", icon: FaCogs },
  { to: "/evaga-desktop", label: "Program", icon: FaBoxes },
  { to: "/aplikacija", label: "Aplikacija", icon: FaMobileAlt },
  { to: "/kontakt", label: "Kontakt", icon: FaEnvelope },
  { to: "/onama", label: "O nama", icon: FaInfoCircle },
  { to: "/booking", label: "Zahtev", icon: FaClipboardList },
  { to: "/design-system-demo", label: "Design", icon: FaPalette },
];

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let lastY = window.scrollY;

    const onScroll = () => {
      const currentY = window.scrollY;
      setIsCompact(currentY > 24);

      if (currentY <= 8) {
        setIsHidden(false);
      } else if (currentY > lastY + 8) {
        setIsHidden(true);
      } else if (currentY < lastY - 8) {
        setIsHidden(false);
      }

      lastY = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[9999] transition-transform duration-300 ${
        isHidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <nav
        className={`mx-2 mt-2 sm:mx-4 rounded-2xl border border-brand-primary/20 bg-white/90 backdrop-blur-md shadow-lg transition-all duration-300 ${
          isCompact ? "py-2" : "py-3"
        }`}
      >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4">
        {/* Logo/Brand */}
        <Link to="/" className="flex items-center gap-2">
          <ProgressiveImage
            src="/imgs/vaga-logo.png"
            alt="Logo"
            className="h-10 w-10 rounded-xl border border-brand-primary/20 bg-white shadow"
          />
          <span className="font-heading font-extrabold text-lg tracking-wide text-brand-primary">
            Vaga Beta
          </span>
        </Link>

        {/* Hamburger Icon */}
        <button
          className="sm:hidden flex flex-col items-center justify-center h-10 w-10 rounded-xl hover:bg-brand-primary/10 transition"
          aria-label="Menu"
          onClick={() => setOpen(!open)}
        >
          <span
            className={`block h-0.5 w-6 bg-brand-primary rounded mb-1 transition-all ${
              open ? "rotate-45 translate-y-2" : ""
            }`}
          ></span>
          <span
            className={`block h-0.5 w-6 bg-brand-primary rounded mb-1 transition-all ${
              open ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block h-0.5 w-6 bg-brand-primary rounded transition-all ${
              open ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></span>
        </button>

        {/* Links desktop */}
        <ul className="hidden sm:flex gap-1 font-semibold text-sm lg:text-[15px]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
                    isActive
                      ? "bg-brand-primary text-white"
                      : "text-text-secondary hover:bg-brand-primary/10 hover:text-brand-primary"
                  }`}
                >
                  <Icon /> {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <ul
          className="sm:hidden flex flex-col gap-2 mx-2 mt-2 rounded-2xl border border-neutral-border bg-white p-3 shadow-xl"
          style={{ zIndex: 9999 }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`flex items-center justify-between gap-2 py-2.5 px-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-brand-primary text-white"
                      : "text-text-secondary hover:bg-brand-primary/10 hover:text-brand-primary"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <Icon /> {item.label}
                  </span>
                  <FaChevronRight className="text-xs" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </header>
  );
}
