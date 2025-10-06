// components/UI/AnimatedSelect.jsx
// Komponenta za prilagođeni padajući meni sa animacijama
// Omogućava izbor iz liste opcija, sa opcionalnom pretragom
// Props:
// value: trenutno izabrana vrednost
// onChange: funkcija koja se poziva pri promeni vrednosti
// name: ime inputa (za forme)
// label: tekst etikete iznad padajućeg menija
// required: da li je izbor obavezan
// disabled: da li je meni onemogućen
// placeholder: tekst koji se prikazuje kada nema izabrane vrednosti
// options: niz opcija za izbor [{value, label, icon (komponenta), description}, ...]
// className: dodatne klase za stilizaciju
// error: tekst greške (ako postoji)
// helperText: pomoćni tekst ispod menija
// dropdownFooter: JSX koji se prikazuje u podnožju padajućeg menija (npr. dugme za dodavanje nove opcije)
// dropdownHeader: JSX koji se prikazuje u zaglavlju padajućeg menija (npr. polje za pretragu)
// withSearch: da li prikazati polje za pretragu
// Koristi framer-motion za animacije i lucide-react za ikone
import { useState, useRef, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Info, XCircle } from "lucide-react";

export default function AnimatedSelect({
  value,
  onChange,
  name = "",
  label = "",
  required = false,
  disabled = false,
  placeholder = "Izaberi...",
  options = [],
  className = "",
  error = "",
  helperText = "",
  dropdownFooter = null, // JSX (npr. <AddNewOption /> ili <div>Info</div>)
  dropdownHeader = null, // JSX (search, info, ...)
  withSearch = false,
}) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const selectRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    else document.removeEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Optional search
  const filteredOptions =
    withSearch && searchTerm
      ? options.filter((opt) =>
          (opt.label ?? "").toLowerCase().includes(searchTerm.toLowerCase())
        )
      : options;

  // Helper to get selected option object
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={selectRef} className={`relative w-full ${className}`}>
      {label && (
        <label className="block mb-2 font-semibold text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <motion.button
        type="button"
        className={`
          w-full flex items-center justify-between border-2 rounded-xl py-3 px-4
          text-base font-medium shadow-sm bg-white
          transition-all duration-200
          ${
            open
              ? "border-bluegreen ring-2 ring-bluegreen/10"
              : "border-gray-200"
          }
          ${error ? "border-red-400 ring-2 ring-red-100" : ""}
          hover:shadow-lg focus:outline-none
          ${disabled ? "opacity-60 cursor-not-allowed" : ""}
        `}
        whileTap={{ scale: 0.98 }}
        onClick={() => !disabled && setOpen((o) => !o)}
        aria-expanded={open}
        disabled={disabled}
      >
        <span className="flex items-center gap-2 truncate">
          {selectedOption?.icon && (
            <selectedOption.icon className="w-5 h-5 text-bluegreen" />
          )}
          {selectedOption?.label || (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </span>
        {open ? (
          <ChevronUp className="w-5 h-5 text-bluegreen" />
        ) : (
          <ChevronDown className="w-5 h-5 text-bluegreen" />
        )}
      </motion.button>

      {/* Error or Helper */}
      <div className="-mt-1 mb-1">
        {error ? (
          <div className="flex items-center gap-1 text-red-500 text-sm font-medium">
            <XCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        ) : (
          helperText && (
            <div className="flex items-center mt-3 ml-1 gap-1 text-gray-500 text-sm">
              <Info className="w-4 h-4" /> <span>{helperText}</span>
            </div>
          )
        )}
      </div>

      {/* Dropdown list */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
            className="absolute left-0 w-full bg-white border-2 border-bluegreen rounded-xl shadow-2xl z-50 mt-2"
          >
            {/* Header (search, info, ... optional) */}
            {dropdownHeader ||
              (withSearch && (
                <div className="p-2 bg-bluegreen/10 flex">
                  <input
                    autoFocus
                    className="w-full px-3 py-2 rounded-md border border-bluegreen text-base outline-none bg-white"
                    placeholder="Pretraga..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              ))}

            {/* Options */}
            <ul className="max-h-72 overflow-y-auto overflow-x-hidden scrollbar-thin rounded-b-xl">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <motion.li
                    key={opt.value}
                    whileHover={{ scale: 1.02, backgroundColor: "#dffcfb" }}
                    whileTap={{ scale: 0.97 }}
                    className={`flex items-center gap-2 px-4 py-3 cursor-pointer text-base select-none
                      ${
                        value === opt.value
                          ? "bg-bluegreen/20 font-semibold"
                          : "bg-white"
                      }
                    `}
                    onClick={() => {
                      onChange({ target: { name, value: opt.value } });
                      setOpen(false);
                      setSearchTerm("");
                    }}
                  >
                    {opt.icon && (
                      <opt.icon className="w-5 h-5 text-bluegreen" />
                    )}
                    <span>{opt.label}</span>
                    {opt.description && (
                      <span className="ml-2 text-gray-400 text-xs">
                        {opt.description}
                      </span>
                    )}
                  </motion.li>
                ))
              ) : (
                <li className="px-4 py-3 text-gray-400 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Nema rezultata.
                </li>
              )}
            </ul>
            {/* Footer content (npr. "Dodaj novu opciju" dugme) */}
            {dropdownFooter && (
              <div className="p-2 border-t bg-sheen/10">{dropdownFooter}</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
