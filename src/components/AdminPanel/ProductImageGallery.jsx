// src/components/AdminPanel/ProductImageGallery.jsx
// ===============================================================================
// PRODUCT IMAGE GALLERY COMPONENT
// ===============================================================================
//
// @component ProductImageGallery
// @description Komponenta za upload i reordering dodatnih slika proizvoda
// @version 2.0
// @lastmodified 2025-11-02
//
// FUNKCIONALNOSTI:
// ================
// ✅ Upload više slika odjednom
// ✅ Reordering slika (gore/dole) sa animacijama
// ✅ Uklanjanje slika
// ✅ Preview slika sa zoom modalom
// ✅ Glassmorphism dizajn sa animacijama
//
// FIXED FRAMER-MOTION BUGS:
// ==========================
// 🐛 Spring animacije sada koriste samo 2 keyframes (bilo: [0, -10, 10, -10, 0])
// ✅ Rotate animacije koriste tween za multi-keyframe ili [0, X] za spring
//
// ===============================================================================

import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  FiUpload,
  FiPlus,
  FiX,
  FiChevronUp,
  FiChevronDown,
  FiZoomIn,
} from "react-icons/fi";

/**
 * ProductImageGallery Component
 * @param {Object} props
 * @param {Array} props.images - Array objekata sa {file, preview}
 * @param {Function} props.onImagesChange - Callback za dodavanje novih slika
 * @param {Function} props.onRemoveImage - Callback za uklanjanje slike (index)
 * @param {Function} props.onMoveImageUp - Callback za pomeranje slike gore (index)
 * @param {Function} props.onMoveImageDown - Callback za pomeranje slike dole (index)
 * @param {Function} props.onImageClick - Callback za klik na sliku za preview (src, text)
 */
export default function ProductImageGallery({
  images = [],
  onImagesChange,
  onRemoveImage,
  onMoveImageUp,
  onMoveImageDown,
  onImageClick,
}) {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-neutral-surface/90 backdrop-blur-md border border-neutral-border shadow-lg"
      style={{
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
      }}
    >
      <h4 className="font-bold text-text-primary mb-3 flex items-center gap-2">
        <FiUpload className="text-brand-secondary" /> Dodatne slike
      </h4>
      <Motion.label
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-brand-secondary text-white rounded-lg hover:bg-brand-accent transition-all shadow-md hover:shadow-lg"
      >
        <FiPlus /> Dodaj slike
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={onImagesChange}
          className="hidden"
        />
      </Motion.label>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mt-3">
        <AnimatePresence>
          {images.map((img, idx) => (
            <Motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
              transition={{ duration: 0.3, ease: "backOut" }}
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="relative group"
            >
              <Motion.div
                className="relative overflow-hidden rounded-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img
                  src={img.preview}
                  alt={`Preview ${idx}`}
                  className="w-full aspect-square object-cover rounded-lg border-2 border-brand-secondary/40 shadow-md group-hover:border-brand-secondary transition-all cursor-pointer"
                  onClick={() =>
                    onImageClick &&
                    onImageClick(img.preview, `Dodatna slika ${idx + 1}`)
                  }
                />
                {/* Hover overlay sa zoom ikonom */}
                <Motion.div
                  className="absolute inset-0 bg-gradient-to-br from-brand-secondary/0 to-text-primary/0 group-hover:from-brand-secondary/30 group-hover:to-text-primary/50 flex items-center justify-center transition-all duration-300 cursor-pointer rounded-lg"
                  onClick={() =>
                    onImageClick &&
                    onImageClick(img.preview, `Dodatna slika ${idx + 1}`)
                  }
                >
                  <Motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    whileHover={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FiZoomIn className="text-white drop-shadow-lg" size={28} />
                  </Motion.div>
                </Motion.div>
              </Motion.div>

              {/* Dugmad za reorder - FIXED ANIMATION */}
              <div className="absolute left-1 top-1 flex flex-col gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300">
                <Motion.button
                  type="button"
                  onClick={() => onMoveImageUp(idx)}
                  disabled={idx === 0}
                  whileHover={{
                    scale: 1.3,
                    rotate: -15, // FIXED: Changed from array [0, -10, 10, -10, 0] to single value
                  }}
                  whileTap={{
                    scale: 0.85,
                    rotate: -15,
                  }}
                  className="bg-gradient-to-br from-brand-secondary to-brand-accent text-white rounded-full p-1.5 shadow-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:shadow-xl"
                  style={{
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                  }}
                  aria-label="Pomeri gore"
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <FiChevronUp size={16} strokeWidth={3} />
                </Motion.button>
                <Motion.button
                  type="button"
                  onClick={() => onMoveImageDown(idx)}
                  disabled={idx === images.length - 1}
                  whileHover={{
                    scale: 1.3,
                    rotate: 15, // FIXED: Changed from array [0, 10, -10, 10, 0] to single value
                  }}
                  whileTap={{
                    scale: 0.85,
                    rotate: 15,
                  }}
                  className="bg-gradient-to-br from-brand-secondary to-brand-accent text-white rounded-full p-1.5 shadow-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:shadow-xl"
                  style={{
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                  }}
                  aria-label="Pomeri dole"
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <FiChevronDown size={16} strokeWidth={3} />
                </Motion.button>
              </div>

              {/* Delete button */}
              <Motion.button
                type="button"
                onClick={() => onRemoveImage(idx)}
                whileHover={{ scale: 1.2, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="absolute -top-2 -right-2 bg-error text-white rounded-full p-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shadow-lg"
                aria-label="Ukloni sliku"
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
