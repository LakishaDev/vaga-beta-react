export default function Onama() {
  return (
    <main className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-10 animate-fadein">
      <h2 className="text-3xl text-blue-700 font-semibold mb-6 animate-pop">O nama</h2>
      <p className="text-gray-700 mb-4 animate-fadeup">
        Vaga-Beta osnovana 2009. godine sa sedištem u Nišu, ul. Ive Andrića 14.<br />
        Osnovna delatnost: kontrolno ispitivanje, servisiranje i overavanje vaga na teritoriji cele Srbije.
      </p>
      <p className="text-gray-700 mb-4 animate-fadeup">
        2022. godine po standardu ISO /IEC 17020:2012 postajemo akreditovano kontrolno telo za overavanje merila mase neautomatskih vaga klase II, III i IIII pod nazivom Vaga-Beta Lab.<br />
        Kao akreditovana laboratorija izdajemo uverenja o ispravnosti merila za potrebe HACCP, ISO i drugih standarda. Takođe vršimo servisiranje mesoreznica.
      </p>
      <h3 className="text-xl text-blue-400 font-medium mb-3 animate-fadeup">Dokumentacija o akreditaciji</h3>
      <ul className="list-disc pl-6 text-blue-600 space-y-2">
        <li><a href="https://vagabeta.rs/dokumentacija/Sertifikat_o_akreditaciji.pdf" className="underline hover:text-blue-800" target="_blank">Sertifikat o akreditaciji</a></li>
        <li><a href="https://vagabeta.rs/dokumentacija/Odluka.pdf" className="underline hover:text-blue-800" target="_blank">Odluka</a></li>
        <li><a href="https://vagabeta.rs/dokumentacija/Predmet_Odluka.pdf" className="underline hover:text-blue-800" target="_blank">Predmet Odluka</a></li>
        <li><a href="https://vagabeta.rs/dokumentacija/Re%C5%A1enje_DMDM_za_V-B_Lab_1.pdf" className="underline hover:text-blue-800" target="_blank">Rešenje DMDM za V-B Lab 1</a></li>
        <li><a href="https://vagabeta.rs/dokumentacija/Re%C5%A1enje_DMDM_za_V-B_Lab_2.pdf" className="underline hover:text-blue-800" target="_blank">Rešenje DMDM za V-B Lab 2</a></li>
        <li><a href="https://vagabeta.rs/dokumentacija/Re%C5%A1enje_DMDM_za_V-B_Lab_3.pdf" className="underline hover:text-blue-800" target="_blank">Rešenje DMDM za V-B Lab 3</a></li>
      </ul>
    </main>
  );
}
