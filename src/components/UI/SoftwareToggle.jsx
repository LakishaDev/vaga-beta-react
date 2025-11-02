import { motion as Motion, AnimatePresence } from "framer-motion";
import { FileCode, Upload, X } from "lucide-react";
import { FiFile } from "react-icons/fi";

/**
 * SoftwareToggle Component
 * Modern toggle for enabling software mode with markdown file upload
 * 
 * @param {Object} props
 * @param {boolean} props.isSoftware - Software mode enabled state
 * @param {Function} props.onToggle - Toggle callback
 * @param {Array} props.markdownFiles - Array of markdown file objects
 * @param {Function} props.onFilesChange - Callback when files are added
 * @param {Function} props.onFileRemove - Callback when file is removed
 */
export default function SoftwareToggle({
  isSoftware = false,
  onToggle,
  markdownFiles = [],
  onFilesChange,
  onFileRemove,
}) {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const mdFiles = files
      .filter((file) => file.name.endsWith(".md"))
      .map((file) => ({
        file,
        name: file.name,
        preview: URL.createObjectURL(file),
      }));
    
    if (mdFiles.length > 0) {
      onFilesChange(mdFiles);
    }
  };

  return (
    <Motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      {/* Toggle Container with glassmorphism */}
      <div
        className="rounded-2xl p-4 backdrop-blur-xl border shadow-lg"
        style={{
          background: "rgba(145, 206, 193, 0.15)",
          backdropFilter: "blur(20px)",
          border: "1.5px solid rgba(110, 174, 162, 0.3)",
        }}
      >
        {/* Toggle Switch */}
        <Motion.label
          whileHover={{ scale: 1.01 }}
          className="flex items-center justify-between cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <Motion.div
              animate={{
                rotate: isSoftware ? 360 : 0,
                scale: isSoftware ? 1.1 : 1,
              }}
              transition={{ duration: 0.5, type: "spring" }}
              className={`p-2 rounded-xl transition-all ${
                isSoftware
                  ? "bg-gradient-to-br from-[#6EAEA2] to-[#5A9D92]"
                  : "bg-gray-200"
              }`}
            >
              <FileCode
                size={24}
                className={`transition-colors ${
                  isSoftware ? "text-white" : "text-gray-600"
                }`}
              />
            </Motion.div>
            <div>
              <h4 className="font-bold text-[#1E3E49] text-base">
                Softver
              </h4>
              <p className="text-xs text-gray-600">
                Omogući dokumentaciju u markdown formatu
              </p>
            </div>
          </div>

          {/* Custom Toggle Switch */}
          <div className="relative">
            <input
              type="checkbox"
              checked={isSoftware}
              onChange={(e) => onToggle(e.target.checked)}
              className="sr-only peer"
            />
            <Motion.div
              className={`w-16 h-8 rounded-full transition-all duration-300 shadow-inner ${
                isSoftware
                  ? "bg-gradient-to-r from-[#6EAEA2] to-[#5A9D92]"
                  : "bg-gray-300"
              }`}
            >
              <Motion.div
                animate={{
                  x: isSoftware ? 32 : 4,
                }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
                className={`absolute top-1 w-6 h-6 rounded-full shadow-lg transition-all ${
                  isSoftware
                    ? "bg-white"
                    : "bg-white"
                }`}
              />
            </Motion.div>
          </div>
        </Motion.label>

        {/* File Upload Section - Animates in/out */}
        <AnimatePresence>
          {isSoftware && (
            <Motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 16 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div
                className="rounded-xl p-4 border-2 border-dashed"
                style={{
                  background: "rgba(255, 255, 255, 0.6)",
                  borderColor: "rgba(110, 174, 162, 0.4)",
                }}
              >
                {/* Upload Button */}
                <Motion.label
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="cursor-pointer flex flex-col items-center gap-3 py-6 transition-all group"
                >
                  <Motion.div
                    animate={{
                      y: [0, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="p-4 rounded-full bg-[#6EAEA2]/20 group-hover:bg-[#6EAEA2]/30 transition-all"
                  >
                    <Upload
                      size={32}
                      className="text-[#6EAEA2] group-hover:text-[#5A9D92] transition-colors"
                    />
                  </Motion.div>
                  <div className="text-center">
                    <p className="font-semibold text-[#1E3E49] mb-1">
                      Dodaj Markdown fajlove
                    </p>
                    <p className="text-xs text-gray-500">
                      Kliknite ili prevucite .md fajlove ovde
                    </p>
                  </div>
                  <input
                    type="file"
                    accept=".md,.markdown"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </Motion.label>

                {/* File List */}
                {markdownFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <AnimatePresence mode="popLayout">
                      {markdownFiles.map((file, idx) => (
                        <Motion.div
                          key={`${file.name}-${idx}`}
                          initial={{ opacity: 0, x: -20, scale: 0.9 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: 20, scale: 0.9 }}
                          transition={{
                            duration: 0.3,
                            type: "spring",
                            damping: 25,
                          }}
                          whileHover={{ scale: 1.02, x: 5 }}
                          className="flex items-center gap-3 p-3 rounded-lg bg-white/80 backdrop-blur-sm border border-[#6EAEA2]/30 shadow-sm hover:shadow-md transition-all group"
                        >
                          {/* Animated file icon */}
                          <Motion.div
                            animate={{
                              rotate: [0, 5, -5, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            className="flex-shrink-0"
                          >
                            <div className="p-2 rounded-lg bg-gradient-to-br from-[#6EAEA2] to-[#5A9D92]">
                              <FileCode size={20} className="text-white" />
                            </div>
                          </Motion.div>

                          {/* File info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[#1E3E49] truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              Markdown dokumentacija
                            </p>
                          </div>

                          {/* Remove button */}
                          <Motion.button
                            type="button"
                            whileHover={{ scale: 1.2, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onFileRemove(idx)}
                            className="flex-shrink-0 p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-all shadow-sm hover:shadow-md"
                            aria-label="Ukloni fajl"
                          >
                            <X size={16} />
                          </Motion.button>
                        </Motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}

                {/* Info text */}
                <Motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-blue-50/50 border border-blue-200/50"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <FiFile className="text-blue-600" size={16} />
                  </div>
                  <p className="text-xs text-blue-800 leading-relaxed">
                    <strong>Napomena:</strong> Markdown fajlovi će biti dostupni
                    za preuzimanje na stranici proizvoda. Korisni su za
                    softversku dokumentaciju, uputstva, i release notes.
                  </p>
                </Motion.div>
              </div>
            </Motion.div>
          )}
        </AnimatePresence>
      </div>
    </Motion.div>
  );
}
