// src/components/AdminPanel/ProductForm.jsx
// ===============================================================================
// PRODUCT FORM COMPONENT
// ===============================================================================
//
// @component ProductForm
// @description Kompletan form za dodavanje novih proizvoda sa svim poljima
// @version 2.0
// @lastmodified 2025-11-02
//
// FUNKCIONALNOSTI:
// ================
// ✅ Osnovna polja (naziv, kategorija, cena)
// ✅ Formatiranje cene sa separatorom za hiljade (sr-RS)
// ✅ Upload glavne slike
// ✅ Upload dodatnih slika sa reordering-om
// ✅ Karakteristike proizvoda
// ✅ Datasheets
// ✅ Software toggle sa markdown fajlovima
// ✅ Progress bar tokom uploada
// ✅ Responsive dizajn
//
// ===============================================================================

import { motion as Motion } from "framer-motion";
import { FiDollarSign } from "react-icons/fi";
import FloatingLabelInput from "../UI/FloatingLabelInput.jsx";
import ProgressiveImage from "../UI/ProgressiveImage.jsx";
import ProgressBar from "../UI/ProgressBar.jsx";
import SoftwareToggle from "../UI/SoftwareToggle.jsx";
import ProductImageGallery from "./ProductImageGallery.jsx";
import ProductFeatures from "./ProductFeatures.jsx";
import ProductDatasheets from "./ProductDatasheets.jsx";

/**
 * ProductForm Component
 * @param {Object} props
 * @param {Object} props.product - Product data state
 * @param {Function} props.onChange - Field change handler
 * @param {Function} props.onSubmit - Form submit handler
 * @param {Function} props.onFileChange - Main image file change
 * @param {Function} props.formatPriceInput - Price formatter
 * @param {Function} props.parsePriceInput - Price parser
 * @param {boolean} props.loading - Loading state
 * @param {number} props.uploadProgress - Upload progress (0-100)
 * ... and all other handlers for images, features, datasheets, etc.
 */
export default function ProductForm({
  product,
  onChange,
  onSubmit,
  onFileChange,
  formatPriceInput,
  parsePriceInput,
  loading,
  uploadProgress,
  // Image gallery handlers
  onMultipleImagesChange,
  onRemoveImage,
  onMoveImageUp,
  onMoveImageDown,
  onImageClick,
  // Features handlers
  onAddFeature,
  onUpdateFeature,
  onRemoveFeature,
  // Datasheets handlers
  onDatasheetsChange,
  onRemoveDatasheet,
  // Markdown handlers
  onMarkdownFilesChange,
  onRemoveMarkdownFile,
  slugStatus,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-6 bg-neutral-surface rounded-xl p-4 sm:p-6 lg:p-8 shadow animate-pop w-full border border-neutral-border"
    >
      <div className="flex flex-col lg:flex-row items-start gap-6 w-full">
        <div className="flex flex-col gap-4 w-full pt-2">
          <FloatingLabelInput
            name="name"
            label="Naziv proizvoda"
            value={product.name}
            onChange={onChange}
            required
          />
          <FloatingLabelInput
            name="slug"
            label="Slug (URL putanja)"
            value={product.slug || ""}
            onChange={onChange}
            required
          />
          {slugStatus?.message ? (
            <p
              className={`text-sm font-medium ${
                slugStatus.status === "valid"
                  ? "text-emerald-600"
                  : slugStatus.status === "checking"
                    ? "text-blue-600"
                    : "text-red-600"
              }`}
            >
              {slugStatus.message}
            </p>
          ) : null}
          <FloatingLabelInput
            name="category"
            label="Kategorija"
            value={product.category}
            onChange={onChange}
            required
          />
          <Motion.div
            className="relative group"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <FloatingLabelInput
              name="price"
              label="Cena"
              type="text"
              value={formatPriceInput(product.price)}
              onChange={(e) => {
                const numericValue = parsePriceInput(e.target.value);
                onChange({ target: { name: "price", value: numericValue } });
              }}
              required
            />
            <Motion.div
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-secondary/15 text-white font-bold text-xs shadow-lg"
              style={{
                background: "rgba(145, 206, 193, 0.15)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(145, 206, 193, 0.3)",
              }}
              whileHover={{ scale: 1.05 }}
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(145, 206, 193, 0)",
                  "0 0 0 8px rgba(145, 206, 193, 0.1)",
                  "0 0 0 0 rgba(145, 206, 193, 0)",
                ],
              }}
              transition={{
                boxShadow: {
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                },
              }}
            >
              <FiDollarSign
                className="text-brand-secondary"
                size={14}
                style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))" }}
              />
              <span className="text-text-primary font-black tracking-wide">
                RSD
              </span>
            </Motion.div>

            {/* Tooltip hint */}
            <Motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{
                opacity: 0,
                y: 10,
                scale: 0.8,
              }}
              whileFocus={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              className="absolute -bottom-8 left-0 right-0 text-center"
            >
              <span className="inline-block px-3 py-1 bg-text-primary text-white text-xs rounded-lg shadow-lg">
                💡 Separator za hiljade se dodaje automatski
              </span>
            </Motion.div>
          </Motion.div>

          <div className="flex items-center gap-2">
            <label className="flex items-center cursor-pointer relative group">
              <input
                type="checkbox"
                name="hasHiddenPrice"
                checked={product.hasHiddenPrice}
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
          </div>
        </div>

        {/* Upload glavne slike */}
        <div className="flex flex-col items-center gap-4 w-full max-w-xs lg:max-w-none">
          <div className="relative">
            <label className="cursor-pointer group">
              <div className="w-28 h-28 sm:w-60 sm:h-auto aspect-square border-3 border-dashed border-blue-300 rounded-xl flex flex-col items-center justify-center bg-blue-50 hover:bg-blue-100 transition-all duration-300 group-hover:border-blue-500 group-hover:scale-105">
                {product.imgPreview ? (
                  <ProgressiveImage
                    src={product.imgPreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <>
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 group-hover:text-blue-600 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <span className="text-xs sm:text-sm text-blue-600 font-medium mt-1 sm:mt-2">
                      Upload glavnu sliku
                    </span>
                  </>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="hidden"
              />
            </label>

            {/* Upload progress */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
                  <div className="text-xs sm:text-sm font-medium">
                    {Math.round(uploadProgress)}%
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sekcija za dodatne funkcionalnosti - full width */}
      <div className="w-full lg:col-span-2 flex flex-col gap-6 mt-4">
        {/* Multiple Images - sa FIXED animacijama */}
        <ProductImageGallery
          images={product.images}
          onImagesChange={onMultipleImagesChange}
          onRemoveImage={onRemoveImage}
          onMoveImageUp={onMoveImageUp}
          onMoveImageDown={onMoveImageDown}
          onImageClick={onImageClick}
        />

        {/* Features / Karakteristike */}
        <ProductFeatures
          features={product.features}
          onAddFeature={onAddFeature}
          onUpdateFeature={onUpdateFeature}
          onRemoveFeature={onRemoveFeature}
        />

        {/* Datasheets */}
        <ProductDatasheets
          datasheets={product.datasheets}
          onDatasheetsChange={onDatasheetsChange}
          onRemoveDatasheet={onRemoveDatasheet}
        />

        {/* Software Toggle with Markdown Upload */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <SoftwareToggle
            isSoftware={product.isSoftware}
            onToggle={(checked) =>
              onChange({ target: { name: "isSoftware", value: checked } })
            }
            markdownFiles={product.markdownFiles}
            onFilesChange={onMarkdownFilesChange}
            onFileRemove={onRemoveMarkdownFile}
          />
        </Motion.div>
      </div>

      {/* Progress Bar for Upload */}
      {uploadProgress > 0 && (
        <Motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <ProgressBar
            progress={uploadProgress}
            status={
              uploadProgress === 100
                ? "success"
                : uploadProgress > 0
                  ? "uploading"
                  : "idle"
            }
            label="Dodavanje proizvoda..."
            showPercentage={true}
          />
        </Motion.div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full lg:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
      >
        {loading ? (
          <div className="flex items-center gap-2 justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Dodavanje...
          </div>
        ) : (
          "Dodaj proizvod"
        )}
      </button>
    </form>
  );
}
