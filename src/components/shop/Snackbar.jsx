import { useEffect, useState } from "react";
import { X, CheckCircle2, AlertTriangle, Info, Sparkle } from "lucide-react";

const iconMap = {
  success: <CheckCircle2 size={22} />,
  error: <AlertTriangle size={22} />,
  info: <Info size={22} />,
  custom: <Sparkle size={22} />
};

export default function Snackbar({ message, show, onClose, id, type = "info" }) {
  const [exiting, setExiting] = useState(false);

  const icon = iconMap[type] ?? iconMap["info"];

  useEffect(() => {
    if (show) setExiting(false);
    if (show) {
      const t = setTimeout(() => setExiting(true), 3900); // start exit 300ms pre onClose
      return () => clearTimeout(t);
    }
  }, [show]);

  // kada je exiting, čekaj završetak animacije pa tek tada onClose!
  useEffect(() => {
    if (exiting) {
      const timer = setTimeout(() => onClose(id), 350); // 300–400ms = trajanje izlazne animacije
      return () => clearTimeout(timer);
    }
  }, [exiting, id, onClose]);

  if (!show && !exiting) return null;

  return (
    <div className="relative w-full pointer-events-auto">
      <div
        className={`
          flex items-center gap-3 max-w-xs bg-gradient-to-r
          rounded-xl px-5 py-3 shadow-xl z-50 mb-4
          border-2
          duration-300
          ${type === "success" ? "from-bluegreen to-sheen border-bluegreen/40" : ""}
          ${type === "error" ? "from-rust to-sheen border-rust/40" : ""}
          ${type === "info" ? "from-sheen to-bluegreen border-sheen/40" : ""}
          ${type === "custom" ? "from-yellow-300 to-bluegreen border-yellow-300/30" : ""}
          ${exiting ? "animate-snackbar-exit" : "animate-slidein-left"}
        `}
      >
        <span className="flex-shrink-0">{icon}</span>
        <span className="flex-1 font-semibold tracking-wide text-sm drop-shadow">
          {message}
        </span>
        <button
          className="p-1 rounded-full hover:bg-white/20 transition active:scale-95 focus:ring-2 focus:ring-white/50 outline-none"
          onClick={() => setExiting(true)}
          aria-label="Zatvori"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}