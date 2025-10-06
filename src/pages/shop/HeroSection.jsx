// src/components/HeroSection.jsx
import { Link } from "react-router-dom";
import ProgressiveImage from "../../components/UI/ProgressiveImage";
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

export default function HeroSection() {
  return (
    <section
      className="rounded-xl shadow-xl flex flex-col items-center justify-center py-12 mb-10"
      style={{
        background: `linear-gradient(135deg, ${BOJE.midnight} 40%, ${BOJE.bone} 100%)`
      }}
    >
      <ProgressiveImage src="imgs/vaga-logo.png" alt="Shop hero" className="w-40 rounded-full mb-4 shadow-lg" />
      <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Dobrodošli u Vaga Beta Shop</h1>
      <p className="text-xl text-sheen mb-4">Najbolji proizvodi, probrana kolekcija, jednostavna kupovina!</p>
      <Link to="/prodavnica/proizvodi">
        <button className="bg-sheen text-white font-semibold px-6 py-2 rounded shadow hover:bg-bluegreen transition">
          Pogledaj proizvode
        </button>
      </Link>
    </section>
  );
}
