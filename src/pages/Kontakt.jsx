export default function Kontakt() {
  return (
    <main className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-10 animate-fadein">
      <h2 className="text-3xl text-[#1E3E49] font-semibold mb-4 animate-pop">Kontaktirajte nas</h2>
      <p className="text-gray-700 mb-6 animate-fadeup">Možete nas kontaktirati putem e-maila:</p>
      <ul className="space-y-3 text-gray-700 mb-8">
        <li><strong>Adresa:</strong> Ive Andrića 14, Niš 18116</li>
        <li><strong>Aleksandar:</strong> <span className="text-blue-600">063 833 9686</span></li>
        <li><strong>Radoslav:</strong> <span className="text-blue-600">063 810 6322</span></li>
        <li><strong>Telefon:</strong> <span className="text-blue-600">018 4545 782</span></li>
        <li><strong>Email:</strong> <a href="mailto:vaga.beta@yahoo.com" className="text-blue-500 underline">vaga.beta@yahoo.com</a></li>
      </ul>
      <div className="rounded-xl overflow-hidden border border-blue-100 shadow-lg max-w-full w-[100%] h-[300px]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d725.7919941335642!2d21.96049866741613!3d43.31074294781325!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4755b9489a4acd21%3A0x422f0275588f7174!2sVaga%20Beta%20Lab%20d.o.o!5e0!3m2!1ssr!2srs!4v1690286095097!5m2!1ssr!2srs"
          style={{ border: 0, width: "100%", height: "100%" }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Lokacija Vaga Beta"
        />
      </div>
    </main>
  );
}
