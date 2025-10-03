import Slider from "../components/Slider";

export default function Home() {
  return (
    <main className="max-w-full sm:max-w-2xl mx-auto p-2 sm:p-8 bg-white rounded-xl shadow-lg mt-10 animate-fadein">
      <Slider />
      <h1 className="text-4xl text-[#1E3E49] mb-2 font-bold animate-pop">Vaga Beta</h1>
      <h2 className="text-2xl text-[#1A343D]

 mt-0 animate-fadeup">Šta vam nudimo?</h2>
      <ul className="list-disc pl-6 space-y-3 animate-fadeup">
        <li className="hover:scale-105 transition-transform">Brzu i efikasnu popravku</li>
        <li className="hover:scale-105 transition-transform">Profesionalno servisiranje uz profesionalnu opremu</li>
        <li className="hover:scale-105 transition-transform">Žigosanje vaga u najkraćem roku</li>
        <li className="hover:scale-105 transition-transform">Izrađivanje vaga po vašoj želji</li>
        <li className="hover:scale-105 transition-transform">Laboratorijsko ispitivanje</li>
        <li className="hover:scale-105 transition-transform">Akreditovana firma D.O.O</li>
      </ul>
    </main>
  );
}
