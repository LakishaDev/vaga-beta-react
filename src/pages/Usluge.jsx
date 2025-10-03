export default function Usluge() {
  return (
    <main className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-10 animate-fadein">
      <h2 className="text-3xl text-[#1E3E49] font-semibold mb-4 animate-pop">Servis</h2>
      <p className="text-gray-700 mb-4 animate-fadeup">
        Vršimo servisranje svih vrsta vaga: mehaničkih, digitalnih, preciznih, trgovačkih, magacinskih, kamionskih, mesoreznica i građevinskih vaga.
      </p>
      <h3 className="text-xl text-blue-400 mt-6 font-medium animate-fadeup">Kontrolno telo</h3>
      <ul className="list-disc pl-6 space-y-2 text-gray-700">
        <li>Kontrolno ispitivanje i overavanje vaga.</li>
        <li>Žigosanje se vrši po kvartalima.</li>
        <li>Žig do 9000kg traje 2 godine, preko 9000kg 1 godinu.</li>
        <li>Zakonska obaveza: svako merilo u javnom objektu mora biti overeno-žigosano.</li>
        <li>Obaveštavamo korisnike kada nale žig ističe.</li>
      </ul>
    </main>
  );
}
