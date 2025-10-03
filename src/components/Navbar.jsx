import { Link } from "react-router-dom";
import { useState } from "react";
import { FaHome, FaBoxes, FaCogs, FaEnvelope, FaInfoCircle } from "react-icons/fa";

const BOJE = {
  bone: "#CBCFBB",
  midnight: "#1E3E49",
  sheen: "#6EAEA2",
  chestnut: "#8A4D34",
  outerspace: "#1A343D",
  rust: "#AD5637",
  bluegreen: "#91CEC1",
  charcoal: "#2F5363"
};

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
      <nav
        className="fixed top-0 left-0 w-screen z-[9999] backdrop-blur-md bg-[#1E3E49]/80 shadow-md"
        style={{
          borderBottom: `2px solid ${BOJE.sheen}`,
          color: BOJE.bone,
          width: "100vw",
          left: 0,
          top: 0,
          zIndex: 9999,
        }}
      >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo/Brand */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/imgs/vaga-logo.png"
            alt="Logo"
            className="h-9 w-9 rounded-lg shadow"
            style={{ background: BOJE.bone }}
          />
          <span className="font-extrabold text-lg tracking-wide" style={{ color: BOJE.bluegreen }}>
            Vaga Beta
          </span>
        </Link>

        {/* Hamburger Icon */}
        <button
          className="sm:hidden flex flex-col items-center justify-center h-9 w-9 rounded hover:bg-[#6EAEA2]/50 transition"
          aria-label="Menu"
          onClick={() => setOpen(!open)}
          style={{
            background: open ? BOJE.sheen : "transparent",
            position: "relative", // Garantuje da je iznad svih
            zIndex: 10000         // Visoki z-index, hamburger je uvek na vrhu!
          }}
        >
          <span className={`block h-1 w-7 bg-[#CBCFBB] rounded mb-1 transition-all ${open ? "rotate-45 translate-y-2" : ""}`}></span>
          <span className={`block h-1 w-7 bg-[#CBCFBB] rounded mb-1 transition-all ${open ? "opacity-0" : ""}`}></span>
          <span className={`block h-1 w-7 bg-[#CBCFBB] rounded transition-all ${open ? "-rotate-45 -translate-y-2" : ""}`}></span>
        </button>

        {/* Links desktop */}
        <ul className="hidden sm:flex gap-6 font-semibold text-base">
          <li>
            <Link to="/" className="flex items-center gap-2 hover:text-[#AD5637] transition" style={{ color: BOJE.bone }}>
              <FaHome /> Početna
            </Link>
          </li>
          <li>
            <Link to="/prodavnica" className="flex items-center gap-2 hover:text-[#6EAEA2] transition" style={{ color: BOJE.bone }}>
              <FaBoxes /> Prodavnica
            </Link>
          </li>
          <li>
            <Link to="/usluge" className="flex items-center gap-2 hover:text-[#91CEC1] transition" style={{ color: BOJE.bone }}>
              <FaCogs /> Usluge
            </Link>
          </li>
          <li>
            <Link to="/kontakt" className="flex items-center gap-2 hover:text-[#8A4D34] transition" style={{ color: BOJE.bone }}>
              <FaEnvelope /> Kontakt
            </Link>
          </li>
          <li>
            <Link to="/onama" className="flex items-center gap-2 hover:text-[#CBCFBB] transition" style={{ color: BOJE.bone }}>
              <FaInfoCircle /> O nama
            </Link>
          </li>
        </ul>
      </div>

      {/* Mobile Menu */}
      {open && (
        <ul className="sm:hidden flex flex-col items-end gap-4 px-6 pb-6 bg-[#1E3E49]/80 backdrop-blur-md absolute right-0 left-0 top-full shadow-lg rounded-b-xl border-b-2 border-[#6EAEA2] animate-slidein-right"

          style={{ zIndex: 9999 }} // Obezbeđuje da je ispred sadržaja!
        >
          <li>
            <Link to="/" className="flex items-center gap-2 py-2 px-6 rounded hover:bg-[#AD5637]/20 w-full text-right" style={{ color: BOJE.bone }} onClick={() => setOpen(false)}>
              <FaHome /> Početna
            </Link>
          </li>
          <li>
            <Link to="/proizvodi" className="flex items-center gap-2 py-2 px-6 rounded hover:bg-[#6EAEA2]/20 w-full text-right" style={{ color: BOJE.bone }} onClick={() => setOpen(false)}>
              <FaBoxes /> Proizvodi
            </Link>
          </li>
          <li>
            <Link to="/usluge" className="flex items-center gap-2 py-2 px-6 rounded hover:bg-[#91CEC1]/20 w-full text-right" style={{ color: BOJE.bone }} onClick={() => setOpen(false)}>
              <FaCogs /> Usluge
            </Link>
          </li>
          <li>
            <Link to="/kontakt" className="flex items-center gap-2 py-2 px-6 rounded hover:bg-[#8A4D34]/20 w-full text-right" style={{ color: BOJE.bone }} onClick={() => setOpen(false)}>
              <FaEnvelope /> Kontakt
            </Link>
          </li>
          <li>
            <Link to="/onama" className="flex items-center gap-2 py-2 px-6 rounded hover:bg-[#CBCFBB]/20 w-full text-right" style={{ color: BOJE.bone }} onClick={() => setOpen(false)}>
              <FaInfoCircle /> O nama
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
}
