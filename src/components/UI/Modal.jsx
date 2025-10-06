// src/components/UI/Modal.jsx
// Komponenta za prikaz modal dijaloga sa naslovom, sadržajem i dugmadima
// Props:
// - title: naslov modala
// - children: sadržaj modala
// - onClose: funkcija koja se poziva pri zatvaranju modala
// - onConfirm: funkcija koja se poziva pri potvrdi akcije
// - confirmText: tekst na dugmetu za potvrdu (default "Potvrdi")

// Koristi osnovne Tailwind CSS klase za stilizaciju
export default function Modal({
  title,
  children,
  onClose,
  onConfirm,
  confirmText = "Potvrdi",
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900/60 backdrop-blur-md animate-modalFade">
      <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <h4 className="text-xl font-bold mb-4">{title}</h4>
        <div className="mb-8">{children}</div>
        <div className="flex justify-end gap-4">
          <button
            className="text-gray-500 hover:text-gray-900"
            onClick={onClose}
          >
            Odustani
          </button>
          <button
            className="bg-bluegreen text-white px-5 py-2 rounded-lg shadow hover:bg-sheen transition"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
// Ovaj Modal komponenta možeš koristiti bilo gde u aplikaciji gde ti je potrebna modal dijalog forma.
