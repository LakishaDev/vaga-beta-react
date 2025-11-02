import { motion as Motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import {
  FiUpload,
  FiPlus,
  FiTrash2,
  FiFile,
  FiX,
  FiChevronUp,
  FiChevronDown,
  FiEye,
} from "react-icons/fi";
import FloatingLabelInput from "./FloatingLabelInput";
import ProgressiveImage from "./ProgressiveImage";
import ProgressBar from "./ProgressBar";
import SoftwareToggle from "./SoftwareToggle";

/**
 * EditProductModal Component
 * Reusable modal for editing product details
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Modal visibility
 * @param {Function} props.onClose - Close callback
 * @param {Function} props.onSubmit - Form submit callback
 * @param {Object} props.product - Product data
 * @param {Function} props.onChange - Field change callback
 * @param {boolean} props.loading - Loading state
 * @param {number} props.uploadProgress - Upload progress (0-100)
 * @param {Function} props.onMoveImageUp - Move image up callback (index, isNew)
 * @param {Function} props.onMoveImageDown - Move image down callback (index, isNew)
 * @param {Function} props.onImageClick - Image click for preview (src, text)
 * @param {Function} props.formatPriceInput - Optional price formatter
 */
export default function EditProductModal({
  isOpen,
  onClose,
  onSubmit,
  product,
  onChange,
  onFileChange,
  onMultipleImagesChange,
  onRemoveImage,
  onAddFeature,
  onUpdateFeature,
  onRemoveFeature,
  onDatasheetsChange,
  onRemoveDatasheet,
  onMarkdownChange,
  onRemoveMarkdown,
  onMoveImageUp,
  onMoveImageDown,
  onImageClick,
  formatPriceInput,
  loading = false,
  uploadProgress = 0,
}) {
  if (!isOpen || !product) return null;

  const uploadStatus =
    uploadProgress === 0
      ? "idle"
      : uploadProgress === 100
      ? "success"
      : uploadProgress > 0
      ? "uploading"
      : "idle";

  return (
    <AnimatePresence>
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        data-lenis-prevent
      >
        <Motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25 }}
          className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden border-2"
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            border: "2px solid rgba(110, 174, 162, 0.3)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-xl border-b border-gray-200/50 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-[#253869]">
                Izmena proizvoda
              </h3>
              <Motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Zatvori modal"
              >
                <X size={28} />
              </Motion.button>
            </div>

            {/* Progress bar */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-4">
                <ProgressBar
                  progress={uploadProgress}
                  status={uploadStatus}
                  label="Čuvanje izmena..."
                  showPercentage={true}
                />
              </div>
            )}
          </div>

          {/* Scrollable Content */}
          <form
            onSubmit={onSubmit}
            className="overflow-y-auto px-6 py-4 space-y-6"
            style={{ maxHeight: "calc(90vh - 180px)" }}
          >
            {/* Current Image Preview */}
            <div className="flex justify-center">
              <div className="relative">
                <ProgressiveImage
                  src={product.imgPreview}
                  alt="Current"
                  className="w-32 h-32 object-cover rounded-xl shadow-lg"
                />
                <label className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Basic Fields */}
            <FloatingLabelInput
              name="name"
              label="Naziv proizvoda"
              value={product.name}
              onChange={onChange}
              required
            />
            <FloatingLabelInput
              name="category"
              label="Kategorija"
              value={product.category}
              onChange={onChange}
              required
            />
            <FloatingLabelInput
              name="price"
              label="Cena (RSD)"
              type="text"
              value={
                formatPriceInput
                  ? formatPriceInput(product.price)
                  : product.price
              }
              onChange={onChange}
              required
            />

            {/* Hidden Price Checkbox */}
            <label className="flex items-center cursor-pointer relative group">
              <input
                type="checkbox"
                name="hasHiddenPrice"
                checked={!!product.hasHiddenPrice}
                onChange={(e) =>
                  onChange({
                    target: {
                      name: "hasHiddenPrice",
                      value: e.target.checked,
                    },
                  })
                }
                className="peer w-5 h-5 rounded border border-slate-300 checked:bg-indigo-600 checked:border-indigo-600 transition-all duration-300 shadow focus:ring-2 focus:ring-indigo-400"
              />
              <span className="absolute pointer-events-none opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 20 20"
                  stroke="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <span className="ml-2 text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors peer-checked:text-indigo-600">
                Sakrij cenu za korisnike
              </span>
            </label>

            {/* Software Toggle with Markdown Upload */}
            <SoftwareToggle
              isSoftware={product.isSoftware || false}
              onToggle={(checked) =>
                onChange({
                  target: { name: "isSoftware", value: checked },
                })
              }
              markdownFiles={product.markdownFiles || []}
              onFilesChange={onMarkdownChange}
              onFileRemove={onRemoveMarkdown}
            />

            {/* Multiple Images */}
            <Motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl backdrop-blur-md border shadow-lg"
              style={{
                background: "rgba(203, 207, 187, 0.15)",
                backdropFilter: "blur(10px)",
                border: "1.5px solid rgba(110, 174, 162, 0.3)",
              }}
            >
              <h4 className="font-semibold text-[#1E3E49] mb-3 flex items-center gap-2">
                <FiUpload className="text-[#6EAEA2]" /> Dodatne slike
              </h4>
              <Motion.label
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[#6EAEA2] text-white rounded-lg hover:bg-[#91CEC1] transition-all shadow-md hover:shadow-lg"
              >
                <FiPlus size={16} /> Dodaj slike
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={onMultipleImagesChange}
                  className="hidden"
                />
              </Motion.label>
              <div className="grid grid-cols-4 gap-2 mt-3">
                <AnimatePresence>
                  {product.images?.map((img, idx) => (
                    <Motion.div
                      key={`existing-${idx}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ scale: 1.05 }}
                      className="relative group"
                    >
                      <Motion.div
                        className="relative overflow-hidden rounded"
                        whileHover={{ scale: 1.08 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <img
                          src={img}
                          alt={`Img ${idx}`}
                          className="w-full aspect-square object-cover rounded border-2 border-[#6EAEA2]/40 group-hover:border-[#6EAEA2] shadow-sm transition-all cursor-pointer"
                          onClick={() =>
                            onImageClick &&
                            onImageClick(img, `Postojeća slika ${idx + 1}`)
                          }
                        />
                        {/* Hover overlay sa zoom ikonom */}
                        <Motion.div
                          className="absolute inset-0 bg-gradient-to-br from-[#6EAEA2]/0 to-[#1E3E49]/0 group-hover:from-[#6EAEA2]/30 group-hover:to-[#1E3E49]/50 flex items-center justify-center transition-all duration-300 cursor-pointer rounded"
                          onClick={() =>
                            onImageClick &&
                            onImageClick(img, `Postojeća slika ${idx + 1}`)
                          }
                        >
                          <Motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            whileHover={{ scale: 1, rotate: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 260,
                              damping: 20,
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FiEye
                              className="text-white drop-shadow-lg"
                              size={20}
                            />
                          </Motion.div>
                        </Motion.div>
                      </Motion.div>
                      {/* Dugmad za reorder - FIXED ANIMATION */}
                      <div className="absolute left-0.5 top-0.5 flex flex-col gap-0.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300">
                        <Motion.button
                          type="button"
                          onClick={() =>
                            onMoveImageUp && onMoveImageUp(idx, false)
                          }
                          disabled={idx === 0}
                          whileHover={{
                            scale: 1.3,
                            rotate: -15,
                            backgroundColor: "#91CEC1",
                          }}
                          whileTap={{
                            scale: 0.85,
                            rotate: -15,
                          }}
                          className="bg-gradient-to-br from-[#6EAEA2] to-[#91CEC1] text-white rounded-full p-1 shadow-md disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:shadow-lg"
                          style={{
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255, 255, 255, 0.3)",
                          }}
                          aria-label="Pomeri gore"
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 10,
                          }}
                        >
                          <FiChevronUp size={12} strokeWidth={3} />
                        </Motion.button>
                        <Motion.button
                          type="button"
                          onClick={() =>
                            onMoveImageDown && onMoveImageDown(idx, false)
                          }
                          disabled={idx === (product.images?.length || 0) - 1}
                          whileHover={{
                            scale: 1.3,
                            rotate: 15,
                            backgroundColor: "#91CEC1",
                          }}
                          whileTap={{
                            scale: 0.85,
                            rotate: 15,
                          }}
                          className="bg-gradient-to-br from-[#6EAEA2] to-[#91CEC1] text-white rounded-full p-1 shadow-md disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:shadow-lg"
                          style={{
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255, 255, 255, 0.3)",
                          }}
                          aria-label="Pomeri dole"
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 10,
                          }}
                        >
                          <FiChevronDown size={12} strokeWidth={3} />
                        </Motion.button>
                      </div>
                      <Motion.button
                        type="button"
                        onClick={() => onRemoveImage(idx, false)}
                        whileHover={{ scale: 1.2, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute -top-1 -right-1 bg-[#AD5637] text-white rounded-full p-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shadow-md"
                        aria-label="Ukloni sliku"
                      >
                        <FiX size={14} />
                      </Motion.button>
                    </Motion.div>
                  ))}
                  {product.newImages?.map((img, idx) => (
                    <Motion.div
                      key={`new-${idx}`}
                      initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
                      whileHover={{ scale: 1.05 }}
                      className="relative group"
                    >
                      <Motion.div
                        className="relative overflow-hidden rounded"
                        whileHover={{ scale: 1.08 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <img
                          src={img.preview}
                          alt={`New ${idx}`}
                          className="w-full aspect-square object-cover rounded border-2 border-[#91CEC1] group-hover:border-[#6EAEA2] shadow-sm transition-all cursor-pointer"
                          onClick={() =>
                            onImageClick &&
                            onImageClick(img.preview, `Nova slika ${idx + 1}`)
                          }
                        />
                        {/* Hover overlay sa zoom ikonom */}
                        <Motion.div
                          className="absolute inset-0 bg-gradient-to-br from-[#91CEC1]/0 to-[#6EAEA2]/0 group-hover:from-[#91CEC1]/30 group-hover:to-[#6EAEA2]/50 flex items-center justify-center transition-all duration-300 cursor-pointer rounded"
                          onClick={() =>
                            onImageClick &&
                            onImageClick(img.preview, `Nova slika ${idx + 1}`)
                          }
                        >
                          <Motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            whileHover={{ scale: 1, rotate: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 260,
                              damping: 20,
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FiEye
                              className="text-white drop-shadow-lg"
                              size={20}
                            />
                          </Motion.div>
                        </Motion.div>
                      </Motion.div>
                      {/* Dugmad za reorder - FIXED ANIMATION */}
                      <div className="absolute left-0.5 top-0.5 flex flex-col gap-0.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300">
                        <Motion.button
                          type="button"
                          onClick={() =>
                            onMoveImageUp && onMoveImageUp(idx, true)
                          }
                          disabled={idx === 0}
                          whileHover={{
                            scale: 1.3,
                            rotate: -15,
                            backgroundColor: "#91CEC1",
                          }}
                          whileTap={{
                            scale: 0.85,
                            rotate: -15,
                          }}
                          className="bg-gradient-to-br from-[#6EAEA2] to-[#91CEC1] text-white rounded-full p-1 shadow-md disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:shadow-lg"
                          style={{
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255, 255, 255, 0.3)",
                          }}
                          aria-label="Pomeri gore"
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 10,
                          }}
                        >
                          <FiChevronUp size={12} strokeWidth={3} />
                        </Motion.button>
                        <Motion.button
                          type="button"
                          onClick={() =>
                            onMoveImageDown && onMoveImageDown(idx, true)
                          }
                          disabled={
                            idx === (product.newImages?.length || 0) - 1
                          }
                          whileHover={{
                            scale: 1.3,
                            rotate: 15,
                            backgroundColor: "#91CEC1",
                          }}
                          whileTap={{ scale: 0.85, rotate: 15 }}
                          className="bg-gradient-to-br from-[#6EAEA2] to-[#91CEC1] text-white rounded-full p-1 shadow-md disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:shadow-lg"
                          style={{
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255, 255, 255, 0.3)",
                          }}
                          aria-label="Pomeri dole"
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 10,
                          }}
                        >
                          <FiChevronDown size={12} strokeWidth={3} />
                        </Motion.button>
                      </div>
                      <Motion.button
                        type="button"
                        onClick={() => onRemoveImage(idx, true)}
                        whileHover={{ scale: 1.2, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute -top-1 -right-1 bg-[#AD5637] text-white rounded-full p-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shadow-md"
                        aria-label="Ukloni sliku"
                      >
                        <FiX size={14} />
                      </Motion.button>
                    </Motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </Motion.div>

            {/* Features */}
            <Motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 rounded-xl backdrop-blur-md border shadow-lg"
              style={{
                background: "rgba(145, 206, 193, 0.15)",
                backdropFilter: "blur(10px)",
                border: "1.5px solid rgba(110, 174, 162, 0.3)",
              }}
            >
              <h4 className="font-semibold text-[#1E3E49] mb-3 flex items-center gap-2">
                <FiPlus className="text-[#6EAEA2]" /> Karakteristike
              </h4>
              <Motion.button
                type="button"
                onClick={onAddFeature}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#6EAEA2] text-white rounded-lg hover:bg-[#91CEC1] transition-all shadow-md hover:shadow-lg mb-3"
              >
                <FiPlus size={16} /> Dodaj karakteristiku
              </Motion.button>
              <div className="space-y-2">
                <AnimatePresence>
                  {product.features?.map((feature, idx) => (
                    <Motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-2 items-center p-2 rounded bg-white/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow"
                    >
                      <input
                        type="text"
                        placeholder="Naziv"
                        value={feature.label}
                        onChange={(e) =>
                          onUpdateFeature(idx, "label", e.target.value)
                        }
                        className="flex-1 px-3 py-2 border border-[#6EAEA2]/40 rounded text-sm focus:ring-2 focus:ring-[#6EAEA2] bg-white/80"
                      />
                      <input
                        type="text"
                        placeholder="Vrednost"
                        value={feature.value}
                        onChange={(e) =>
                          onUpdateFeature(idx, "value", e.target.value)
                        }
                        className="flex-1 px-3 py-2 border border-[#6EAEA2]/40 rounded text-sm focus:ring-2 focus:ring-[#6EAEA2] bg-white/80"
                      />
                      <Motion.button
                        type="button"
                        onClick={() => onRemoveFeature(idx)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-[#AD5637] text-white rounded hover:bg-[#8A4D34] transition-all shadow-sm"
                      >
                        <FiTrash2 size={16} />
                      </Motion.button>
                    </Motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </Motion.div>

            {/* Datasheets */}
            <Motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 rounded-xl backdrop-blur-md border shadow-lg"
              style={{
                background: "rgba(30, 62, 73, 0.08)",
                backdropFilter: "blur(10px)",
                border: "1.5px solid rgba(110, 174, 162, 0.3)",
              }}
            >
              <h4 className="font-semibold text-[#1E3E49] mb-3 flex items-center gap-2">
                <FiFile className="text-[#6EAEA2]" /> Datasheets
              </h4>
              <Motion.label
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[#6EAEA2] text-white rounded-lg hover:bg-[#91CEC1] transition-all shadow-md hover:shadow-lg"
              >
                <FiPlus size={16} /> Dodaj fajlove
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
                  {product.datasheets?.map((ds, idx) => (
                    <Motion.div
                      key={`existing-ds-${idx}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="flex items-center gap-2 p-3 bg-white/60 backdrop-blur-sm rounded border border-[#6EAEA2]/30 shadow-sm hover:shadow-md transition-shadow group"
                    >
                      <FiFile className="text-[#6EAEA2]" size={18} />
                      <span className="flex-1 truncate text-sm font-medium">
                        {ds.name}
                      </span>
                      <Motion.button
                        type="button"
                        onClick={() => onRemoveDatasheet(idx, false)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1 bg-[#AD5637] text-white rounded hover:bg-[#8A4D34] transition-all shadow-sm"
                      >
                        <FiX size={14} />
                      </Motion.button>
                    </Motion.div>
                  ))}
                  {product.newDatasheets?.map((ds, idx) => (
                    <Motion.div
                      key={`new-ds-${idx}`}
                      initial={{ opacity: 0, x: -20, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -20, scale: 0.9 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="flex items-center gap-2 p-3 bg-[#91CEC1]/20 backdrop-blur-sm rounded border border-[#91CEC1] shadow-sm hover:shadow-md transition-shadow group"
                    >
                      <FiFile className="text-[#6EAEA2]" size={18} />
                      <span className="flex-1 truncate text-sm font-medium">
                        {ds.name}
                      </span>
                      <Motion.button
                        type="button"
                        onClick={() => onRemoveDatasheet(idx, true)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1 bg-[#AD5637] text-white rounded hover:bg-[#8A4D34] transition-all shadow-sm"
                      >
                        <FiX size={14} />
                      </Motion.button>
                    </Motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </Motion.div>
          </form>

          {/* Footer with Actions */}
          <div className="sticky bottom-0 bg-white/90 backdrop-blur-xl border-t border-gray-200/50 px-6 py-4">
            <div className="flex gap-3 justify-end">
              <Motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl transition-all font-semibold"
              >
                Otkaži
              </Motion.button>
              <Motion.button
                type="button"
                onClick={onSubmit}
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Čuvanje...
                  </div>
                ) : (
                  "Sačuvaj izmene"
                )}
              </Motion.button>
            </div>
          </div>
        </Motion.div>
      </Motion.div>
    </AnimatePresence>
  );
}
