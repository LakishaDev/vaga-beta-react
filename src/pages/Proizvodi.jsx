// src/pages/Proizvodi.jsx
// Stranica za proizvode
// Trenutno samo placeholder sa "USKORO..." tekstom
// Uključuje HeroSection komponentu koja vodi do shop stranice
// Stilizovana sa Tailwind CSS
// Responsive i pristupačna
// Animacije: fadein, pop
// Boje iz BOJE objekta
import HeroSection from "./shop/HeroSection";

export default function Proizvodi() {
  return (
    <main className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-10 animate-fadein">
      <h2 className="text-3xl text-[#1E3E49] font-semibold mb-6 animate-pop">
        Proizvodi
      </h2>
      <div className="text-gray-700 text-lg">
        <p className="opacity-80">USKORO...</p>
      </div>
      <HeroSection />
    </main>
  );
}
