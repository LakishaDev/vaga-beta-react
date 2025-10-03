import { useEffect } from "react";
import { X, CheckCircle2, AlertTriangle, Info, Sparkle } from "lucide-react";

// Optional prop: type ("success", "error", "info", "custom"), stilovi za sve
const iconMap = {
  success: <CheckCircle2 size={22}  />,
  error: <AlertTriangle size={22}  />,
  info: <Info size={22}  />,
  custom: <Sparkle size={22}  />
};

export default function Snackbar({ message, show, onClose, id, type = "info" }) {
  const icon = iconMap[type] ?? iconMap["info"];
  useEffect(() => {
    if (show) {
      const t = setTimeout(() => onClose(id), 4200);
      return () => clearTimeout(t);
    }
  }, [show, onClose, id]);
  if (!show) return null;
  console.log(icon, typeof icon, icon.type)

  return (
    <div className="relative w-full pointer-events-auto">
      <div
        className={`
          flex items-center gap-3 max-w-xs bg-gradient-to-r
          rounded-xl px-5 py-3 shadow-xl z-50 mb-4 animate-pop
          border-2
          ${type == "success" ? "from-bluegreen to-sheen border-bluegreen/40" : ""}
          ${type == "error" ? "from-rust to-sheen border-rust/40" : ""}
          ${type == "info" ? "from-sheen to-bluegreen border-sheen/40" : ""}
          ${type == "custom" ? "from-yellow-300 to-bluegreen border-yellow-300/30" : ""}
        `}
      >
        {/* Ikona po tipu */}
        <span className="flex-shrink-0">{icon}</span>
        {/* Poruka */}
        <span className="flex-1 font-semibold tracking-wide text-sm drop-shadow">
          {message}
        </span>
        {/* Close dugme */}
        <button
          className="p-1 rounded-full hover:bg-white/20 transition active:scale-95 focus:ring-2 focus:ring-white/50 outline-none"
          onClick={() => onClose(id)}
          aria-label="Zatvori"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
