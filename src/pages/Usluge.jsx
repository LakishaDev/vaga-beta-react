import {
  FaWeight,
  FaMobileAlt,
  FaAndroid,
  FaApple,
  FaDatabase,
  FaBalanceScale,
  FaTools,
  FaTruck,
  FaWarehouse,
  FaStore,
  FaCloud,
  FaServer,
  FaExchangeAlt,
  FaGlobe,
  FaPlug,
  FaClipboardCheck,
  FaCogs,
  FaShippingFast,
} from "react-icons/fa";

export default function Usluge() {
  return (
    <main className="max-w-5xl mx-auto bg-white/95 rounded-2xl shadow-2xl p-8 sm:p-14 mt-14 border border-[#CBCFBB] animate-fadein">
      <div className="flex items-center gap-5 mb-10 justify-center animate-pop">
        <FaTools className="text-5xl text-[#6EAEA2] animate-spin-slow" />
        <h2 className="text-5xl text-[#1E3E49] font-extrabold">Naše usluge</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <section className="bg-[#91CEC1]/20 rounded-2xl shadow p-8 animate-slidein-left">
          <div className="flex items-center gap-3 mb-3">
            <FaWeight className="text-3xl text-[#1E3E49]" />
            <h3 className="text-2xl text-[#1E3E49] font-bold">Servisiranje vaga svih tipova</h3>
          </div>
          <p className="text-[#2F5363] mb-3">
            Servisiramo, kalibrišemo, testiramo i održavamo mehaničke, digitalne, trgovačke, magacinske, platformske, industrijske, kamionske i građevinske vage – pouzdano, brzo i sa stručnim savetima za dug vek i tačan rad.
          </p>
          <div className="flex items-center gap-2 mb-2"><FaTools className="text-lg text-[#AD5637]" /> Stručan servis mesoreznica: zamena noževa, podešavanje, rezervni delovi.</div>
        </section>
        <section className="bg-[#6EAEA2]/15 rounded-2xl shadow p-8 animate-slidein-right">
          <div className="flex items-center gap-3 mb-3">
            <FaBalanceScale className="text-3xl text-[#AD5637]" />
            <h3 className="text-2xl text-[#AD5637] font-bold">Kontrolno telo i overavanje</h3>
          </div>
          <p className="text-[#2F5363] mb-3">
            Akreditovani smo za zakonsku verifikaciju i žigosanje vaga svih klasa: inspekcijsko merenje, izdavanje sertifikata, automatsko obaveštavanje o isteku žiga, usklađivanje sa svim propisima i sigurnost javnog merenja.
          </p>
          <div className="flex items-center gap-2 mb-2"><FaClipboardCheck className="text-lg text-[#6EAEA2]" /> Sva javna merenja moraju biti ispravna i overena — brinemo o tome za Vas.</div>
        </section>
        <section className="bg-[#CBCFBB]/30 rounded-2xl shadow p-8 animate-slidein-left">
          <div className="flex items-center gap-3 mb-3">
            <FaMobileAlt className="text-3xl text-[#6EAEA2]" />
            <h3 className="text-2xl text-[#1E3E49] font-bold">Softver, aplikacije i baze podataka</h3>
          </div>
          <p className="text-[#2F5363] mb-3">
            Pravimo i integriramo mobilne aplikacije (<FaAndroid className="inline text-[#3DDC84]" /> Android, <FaApple className="inline text-[#1E3E49]" /> iOS), desktop softver i baze za digitalno upravljanje vagama, izveštaje, analizu, digitalno žigosanje i daljinsko monitorisanje uz mogućnost Web API povezivanja sa ERP/CRM sistemima.
          </p>
          <div className="flex items-center gap-2 mb-2"><FaCogs className="text-lg text-[#AD5637]" /> Softver za automatsku analizu, vezu sa bazom i naprednu statistiku.</div>
        </section>
        <section className="bg-[#AD5637]/10 rounded-2xl shadow p-8 animate-slidein-right">
          <div className="flex items-center gap-3 mb-3">
            <FaCloud className="text-3xl text-[#AD5637]" />
            <h3 className="text-2xl text-[#AD5637] font-bold">Cloud, API, integracije i remote monitoring</h3>
          </div>
          <p className="text-[#2F5363] mb-3">
            Omogućavamo cloud skladištenje merenja, povezivanje sa Vašim softverom (API/ERP) i remote nadzor vaga gde god da ste — u realnom vremenu, potpuno integrisano, sa automatskim izveštajima i sigurnim pristupom.
          </p>
          <div className="flex items-center gap-2 mb-2"><FaPlug className="text-lg text-[#6EAEA2]" /> Integracije i custom povezivanje sa svim softverskim rešenjima Vaše firme.</div>
          <div className="flex items-center gap-2 mb-2"><FaGlobe className="text-lg text-[#AD5637]" /> Online portal za inspekciju i automatsku generaciju izveštaja.</div>
        </section>
      </div>

      {/* FINAL BENEFITI */}
      <section className="mt-12 mb-8 animate-fadein">
        <h3 className="text-2xl text-[#1E3E49] font-extrabold mb-5 text-center">Zašto baš Vaga Beta?</h3>
        <ul className="list-none flex flex-wrap justify-center gap-7 text-lg font-medium">
          <li className="flex gap-2 items-center animate-slidein-left">
            <FaTools className="text-[#6EAEA2]" /> Savremen servis, profesionalan tim
          </li>
          <li className="flex gap-2 items-center animate-slidein-right">
            <FaBalanceScale className="text-[#AD5637]" /> Zakonska sigurnost i brzina
          </li>
          <li className="flex gap-2 items-center animate-slidein-left">
            <FaMobileAlt className="text-[#91CEC1]" /> Softver & mobilne aplikacije
          </li>
          <li className="flex gap-2 items-center animate-slidein-right">
            <FaCloud className="text-[#AD5637]" /> Cloud, API i daljinsko upravljanje
          </li>
          <li className="flex gap-2 items-center animate-slidein-left">
            <FaDatabase className="text-[#6EAEA2]" /> Automatizacija podataka
          </li>
          <li className="flex gap-2 items-center animate-slidein-right">
            <FaPlug className="text-[#AD5637]" /> Integracije sa vašim sistemima
          </li>
        </ul>
      </section>
    </main>
  );
}
