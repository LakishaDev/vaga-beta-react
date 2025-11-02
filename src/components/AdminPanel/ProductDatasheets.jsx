// src/components/AdminPanel/ProductDatasheets.jsx
// ===============================================================================
// PRODUCT DATASHEETS COMPONENT
// ===============================================================================
// 
// @component ProductDatasheets
// @description Komponenta za upravljanje datasheets fajlovima (PDF, DOC)
// @version 2.0
// @lastmodified 2025-11-02
// 
// FUNKCIONALNOSTI:
// ================
// ✅ Upload datasheet fajlova (.pdf, .doc, .docx)
// ✅ Prikazivanje liste fajlova
// ✅ Uklanjanje fajlova
// ✅ Glassmorphism dizajn sa animacijama
// 
// ===============================================================================

import { motion as Motion, AnimatePresence } from "framer-motion";
import { FiFile, FiPlus, FiX } from "react-icons/fi";

/**
 * ProductDatasheets Component
 * @param {Object} props
 * @param {Array} props.datasheets - Array objekata sa {file, name}
 * @param {Function} props.onDatasheetsChange - Callback za dodavanje fajlova
 * @param {Function} props.onRemoveDatasheet - Callback za uklanjanje (index)
 */
export default function ProductDatasheets({
  datasheets = [],
  onDatasheetsChange,
  onRemoveDatasheet,
}) {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="p-4 rounded-xl bg-white/90 backdrop-blur-md border border-[#6EAEA2]/30 shadow-lg"
      style={{
        background: "rgba(30, 62, 73, 0.05)",
        backdropFilter: "blur(10px)",
      }}
    >
      <h4 className="font-bold text-[#1E3E49] mb-3 flex items-center gap-2">
        <FiFile className="text-[#6EAEA2]" /> Datasheets / Preuzimanja
      </h4>
      <Motion.label
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[#6EAEA2] text-white rounded-lg hover:bg-[#91CEC1] transition-all shadow-md hover:shadow-lg"
      >
        <FiPlus /> Dodaj datoteke
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          multiple
          onChange={onDatasheetsChange}
          className="hidden"
        />
      </Motion.label>
      <div className="space-y-2 mt-3">
        <AnimatePresence>
          {datasheets.map((ds, idx) => (
            <Motion.div
              key={idx}
              initial={{ opacity: 0, x: -20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.9 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              whileHover={{ scale: 1.02, x: 5 }}
              className="flex items-center gap-2 p-3 bg-white/80 backdrop-blur-sm rounded-lg border border-[#6EAEA2]/30 shadow-sm hover:shadow-md transition-shadow group"
            >
              <Motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                }}
              >
                <FiFile className="text-[#6EAEA2]" size={20} />
              </Motion.div>
              <span className="flex-1 text-sm text-[#1E3E49] truncate font-medium">
                {ds.name}
              </span>
              <Motion.button
                type="button"
                onClick={() => onRemoveDatasheet(idx)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="p-1 bg-[#AD5637] text-white rounded hover:bg-[#8A4D34] transition-all shadow-sm hover:shadow-md"
              >
                <FiX size={16} />
              </Motion.button>
            </Motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Motion.div>
  );
}
