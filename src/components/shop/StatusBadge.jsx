import { FaRegClock, FaCheckCircle, FaTruck, FaSpinner } from "react-icons/fa";

export default function StatusBadge({ status }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-2 shadow transition-all duration-300
      ${status === "završeno" ? "bg-green-100 text-green-700"
       : status === "poslato" ? "bg-indigo-100 text-indigo-700"
       : status === "u obradi" ? "bg-yellow-100 text-yellow-800"
       : "bg-gray-100 text-gray-700"}`}>
      {status === "završeno" && <FaCheckCircle className="inline text-green-500" />}
      {status === "poslato" && <FaTruck className="inline text-indigo-500" />}
      {status === "u obradi" && <FaRegClock className="inline text-yellow-500 animate-pulse" />}
      {!status && <FaSpinner className="inline animate-spin text-gray-500" />}
      {{
        "primljeno": "Primljeno",
        "u obradi": "U obradi",
        "poslato": "Poslato",
        "završeno": "Završeno"
      }[status] || "Nepoznat"}
    </span>
  );
}
