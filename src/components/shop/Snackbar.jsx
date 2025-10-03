// src/components/Snackbar.jsx
import { useEffect } from "react";

export default function Snackbar({ message, show, onClose }) {
  useEffect(() => {
    if (show) {
      const t = setTimeout(onClose, 2500);
      return () => clearTimeout(t);
    }
  }, [show, onClose]);
  if (!show) return null;
  return (
    <div className="fixed bottom-6 right-6 bg-sheen text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-pop">
      {message}
    </div>
  );
}
