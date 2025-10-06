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
const BOJE = {
  bone: "#CBCFBB",
  midnight: "#1E3E49",
  sheen: "#6EAEA2",
  chestnut: "#8A4D34",
  outerspace: "#1A343D",
  rust: "#AD5637",
  bluegreen: "#91CEC1",
  charcoal: "#2F5363",
};

export default function HeroSection() {
  return (
    <section
      className="
        h-screen min-h-[600px]
        flex flex-col items-center justify-center
        px-4 
        bg-gradient-to-br from-[#1E3E49] via-[#2F5363] to-[#CBCFBB]
        animate-fadeIn
      "
    >
      {/* Logo */}
      <ProgressiveImage
        src="imgs/vaga-logo.png"
        alt="Shop hero logo"
        className="w-36 h-36 rounded-full mb-5 shadow-2xl border-4 border-[#91CEC1] bg-white/90 animate-pop"
      />

      {/* Main Text */}
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-3 animate-slideUp text-center drop-shadow">
        Dobrodošli u Vaga Beta Shop
      </h1>
      <p className="text-xl md:text-2xl text-[#91CEC1] mb-4 animate-slideUp text-center max-w-xl">
        Najbolji proizvodi, jednostavna kupovina za svakog kupca!
      </p>

      {/* CTA */}
      <Link to="/prodavnica/proizvodi">
        <button
          className="
            flex items-center gap-2 bg-[#6EAEA2] text-white font-semibold
            px-7 py-3 rounded-full shadow-lg hover:bg-[#91CEC1] 
            transition-colors duration-200 animate-bounceIn border-2 border-[#CBCFBB]
          "
        >
          <FaShoppingCart className="text-2xl" />
          Pogledaj proizvode
        </button>
      </Link>

      {/* Feature Icons */}
      <div className="flex gap-8 mt-8 justify-center flex-wrap animate-fadeIn">
        <div className="flex flex-col items-center">
          <FaStar className="text-[#AD5637] text-3xl mb-2 animate-spinSlow" />
          <span className="text-white font-semibold">Top Kolekcija</span>
        </div>
        <div className="flex flex-col items-center">
          <FaShippingFast className="text-[#91CEC1] text-3xl mb-2 animate-slideInLeft" />
          <span className="text-white font-semibold">Brza Dostava</span>
        </div>
        <div className="flex flex-col items-center">
          <FaShoppingCart className="text-[#6EAEA2] text-3xl mb-2 animate-bounceIn" />
          <span className="text-white font-semibold">Jednostavna kupovina</span>
        </div>
      </div>
    </section>
  );
}
