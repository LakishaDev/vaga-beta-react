import { motion as Motion } from "framer-motion";
import { Upload, CheckCircle2, XCircle } from "lucide-react";

/**
 * ProgressBar Component
 * A glassmorphism progress bar with smooth animations
 * 
 * @param {Object} props
 * @param {number} props.progress - Progress value (0-100)
 * @param {string} props.status - Status: 'uploading' | 'success' | 'error' | 'idle'
 * @param {string} props.label - Optional label text
 * @param {boolean} props.showPercentage - Show percentage text
 */
export default function ProgressBar({
  progress = 0,
  status = "idle",
  label = "Učitavanje...",
  showPercentage = true,
}) {
  const getStatusColor = () => {
    switch (status) {
      case "success":
        return "from-green-400 to-emerald-500";
      case "error":
        return "from-red-400 to-rose-500";
      case "uploading":
        return "from-blue-400 to-indigo-500";
      default:
        return "from-gray-400 to-slate-500";
    }
  };

  const getIcon = () => {
    switch (status) {
      case "success":
        return <CheckCircle2 size={20} className="text-green-500" />;
      case "error":
        return <XCircle size={20} className="text-red-500" />;
      case "uploading":
        return (
          <Motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Upload size={20} className="text-blue-500" />
          </Motion.div>
        );
      default:
        return null;
    }
  };

  if (status === "idle") return null;

  return (
    <Motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      {/* Container with glassmorphism */}
      <div
        className="rounded-2xl p-4 backdrop-blur-xl border shadow-lg"
        style={{
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(20px)",
          border: "1.5px solid rgba(110, 174, 162, 0.3)",
        }}
      >
        {/* Header with icon and label */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {getIcon()}
            <span className="text-sm font-semibold text-gray-700">
              {status === "success"
                ? "Uspešno!"
                : status === "error"
                ? "Greška!"
                : label}
            </span>
          </div>
          {showPercentage && status === "uploading" && (
            <Motion.span
              key={progress}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-sm font-bold text-blue-600"
            >
              {Math.round(progress)}%
            </Motion.span>
          )}
        </div>

        {/* Progress bar track */}
        <div className="relative h-3 bg-gray-200/80 rounded-full overflow-hidden backdrop-blur-sm">
          {/* Progress bar fill */}
          <Motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
            className={`h-full bg-gradient-to-r ${getStatusColor()} rounded-full relative overflow-hidden shadow-md`}
          >
            {/* Shimmer effect */}
            {status === "uploading" && (
              <Motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            )}
          </Motion.div>

          {/* Glowing effect for active progress */}
          {status === "uploading" && progress > 0 && (
            <Motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                boxShadow: [
                  "0 0 10px rgba(59, 130, 246, 0.4)",
                  "0 0 20px rgba(59, 130, 246, 0.6)",
                  "0 0 10px rgba(59, 130, 246, 0.4)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}
        </div>

        {/* Status message */}
        {(status === "success" || status === "error") && (
          <Motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`mt-2 text-xs ${
              status === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {status === "success"
              ? "Svi fajlovi su uspešno učitani"
              : "Došlo je do greške pri učitavanju"}
          </Motion.div>
        )}
      </div>
    </Motion.div>
  );
}
