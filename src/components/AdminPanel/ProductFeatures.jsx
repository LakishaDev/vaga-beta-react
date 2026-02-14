// src/components/AdminPanel/ProductFeatures.jsx
// ===============================================================================
// PRODUCT FEATURES COMPONENT
// ===============================================================================
//
// @component ProductFeatures
// @description Komponenta za upravljanje karakteristikama proizvoda (key-value parovi)
// @version 2.0
// @lastmodified 2025-11-02
//
// FUNKCIONALNOSTI:
// ================
// ✅ Dodavanje karakteristika (label + value)
// ✅ Uređivanje karakteristika
// ✅ Uklanjanje karakteristika
// ✅ Glassmorphism dizajn sa animacijama
//
// ===============================================================================

import { motion as Motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiTrash2 } from "react-icons/fi";

/**
 * ProductFeatures Component
 * @param {Object} props
 * @param {Array} props.features - Array objekata sa {label, value}
 * @param {Function} props.onAddFeature - Callback za dodavanje nove karakteristike
 * @param {Function} props.onUpdateFeature - Callback za update (index, field, value)
 * @param {Function} props.onRemoveFeature - Callback za uklanjanje (index)
 */
export default function ProductFeatures({
  features = [],
  onAddFeature,
  onUpdateFeature,
  onRemoveFeature,
}) {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="p-4 rounded-xl bg-neutral-surface/90 backdrop-blur-md border border-neutral-border shadow-lg"
      style={{
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
      }}
    >
      <h4 className="font-bold text-text-primary mb-3 flex items-center gap-2">
        <FiPlus className="text-brand-secondary" /> Karakteristike
      </h4>
      <Motion.button
        type="button"
        onClick={onAddFeature}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center gap-2 px-4 py-2 bg-brand-secondary text-white rounded-lg hover:bg-brand-accent transition-all shadow-md hover:shadow-lg mb-3"
      >
        <FiPlus /> Dodaj karakteristiku
      </Motion.button>
      <div className="space-y-2">
        <AnimatePresence>
          {features.map((feature, idx) => (
            <Motion.div
              key={idx}
              initial={{ opacity: 0, x: -20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.9 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex gap-2 items-center p-2 rounded-lg bg-white/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow"
            >
              <input
                type="text"
                placeholder="Naziv (npr. Težina)"
                value={feature.label}
                onChange={(e) => onUpdateFeature(idx, "label", e.target.value)}
                className="flex-1 px-3 py-2 border border-neutral-border rounded-lg focus:ring-2 focus:ring-brand-secondary bg-white/90 backdrop-blur-sm transition-all"
              />
              <input
                type="text"
                placeholder="Vrednost (npr. 2kg)"
                value={feature.value}
                onChange={(e) => onUpdateFeature(idx, "value", e.target.value)}
                className="flex-1 px-3 py-2 border border-neutral-border rounded-lg focus:ring-2 focus:ring-brand-secondary bg-white/90 backdrop-blur-sm transition-all"
              />
              <Motion.button
                type="button"
                onClick={() => onRemoveFeature(idx)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-error text-white rounded-lg hover:brightness-95 transition-all shadow-sm hover:shadow-md"
              >
                <FiTrash2 />
              </Motion.button>
            </Motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Motion.div>
  );
}
