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
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-md animate-modalFade p-4">
      <div className="bg-neutral-surface border border-neutral-border p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <h4 className="text-xl font-bold mb-4 text-text-primary">{title}</h4>
        <div className="mb-8">{children}</div>
        <div className="flex justify-end gap-4">
          <button
            className="text-text-secondary hover:text-text-primary"
            onClick={onClose}
          >
            Odustani
          </button>
          <button
            className="bg-brand-primary text-white px-5 py-2 rounded-lg shadow hover:bg-brand-primary-hover transition"
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
