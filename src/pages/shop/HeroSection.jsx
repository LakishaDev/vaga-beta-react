// src/components/HeroSection.jsx
// Hero sekcija za shop stranicu
// Jednostavna, sa slikom, naslovom, podnaslovom i CTA dugmetom
// Koristi ProgressiveImage za optimizovanu sliku
// Stilizovana sa Tailwind CSS
// Boje iz BOJE objekta
// Poziva se na /prodavnica/proizvodi stranicu
// Responsive i pristupačna
// src/components/HeroSection.jsx
import { Link } from "react-router-dom";
import ProgressiveImage from "../../components/UI/ProgressiveImage";
import { FaShoppingCart, FaStar, FaShippingFast } from "react-icons/fa";

export default function HeroSection() {
  return (
    <section
      className="
        h-screen min-h-[600px]
        flex flex-col items-center justify-center
        px-4 
        bg-gradient-to-br from-brand-primary via-text-primary to-brand-accent
        animate-fadeIn
      "
    >
      {/* Logo */}
      <ProgressiveImage
        src="/imgs/vaga-logo.png"
        alt="Shop hero logo"
        className="w-36 h-36 rounded-full mb-5 shadow-2xl border-4 border-brand-accent bg-white/90 animate-pop"
      />

      {/* Main Text */}
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-3 animate-slideUp text-center drop-shadow">
        Dobrodošli u Vaga Beta Shop
      </h1>
      <p className="text-xl md:text-2xl text-brand-accent mb-4 animate-slideUp text-center max-w-xl">
        Najbolji proizvodi, jednostavna kupovina za svakog kupca!
      </p>

      {/* CTA */}
      <Link to="/prodavnica/proizvodi">
        <button
          className="
            flex items-center gap-2 bg-brand-secondary text-white font-semibold
            px-7 py-3 rounded-full shadow-lg hover:bg-brand-accent 
            transition-colors duration-200 animate-bounceIn border-2 border-neutral-border
          "
        >
          <FaShoppingCart className="text-2xl" />
          Pogledaj proizvode
        </button>
      </Link>

      {/* Feature Icons */}
      <div className="flex gap-8 mt-8 justify-center flex-wrap animate-fadeIn">
        <div className="flex flex-col items-center">
          <FaStar className="text-error text-3xl mb-2 animate-spinSlow" />
          <span className="text-white font-semibold">Top Kolekcija</span>
        </div>
        <div className="flex flex-col items-center">
          <FaShippingFast className="text-brand-accent text-3xl mb-2 animate-slideInLeft" />
          <span className="text-white font-semibold">Brza Dostava</span>
        </div>
        <div className="flex flex-col items-center">
          <FaShoppingCart className="text-brand-secondary text-3xl mb-2 animate-bounceIn" />
          <span className="text-white font-semibold">Jednostavna kupovina</span>
        </div>
      </div>
    </section>
  );
}
