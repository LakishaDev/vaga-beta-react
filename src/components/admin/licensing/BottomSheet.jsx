// src/components/admin/licensing/BottomSheet.jsx
// ===============================================================================
// BOTTOM SHEET - Mobile-optimized drawer from bottom
// ===============================================================================
//
// @description Bottom sheet drawer sa swipe gestures i responsive behavior
//
// FEATURES:
// ✅ Swipe-to-close gesture
// ✅ Drag handle indicator
// ✅ Smooth spring animations
// ✅ Touch-optimized (44px minimum touch targets)
// ✅ Backdrop blur
// ✅ Auto-height adjustment
// ===============================================================================

import { useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { X } from "lucide-react";

export default function BottomSheet({
  isOpen,
  onClose,
  title,
  subtitle,
  icon: Icon,
  children,
  height = "auto",
  showHandle = true,
}) {
  // Motion values for swipe gesture
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 300], [1, 0.5]);

  // Handle drag end (swipe to close)
  const handleDragEnd = useCallback(
    (_, info) => {
      // Close if dragged down > 150px or with high velocity
      if (info.offset.y > 150 || info.velocity.y > 800) {
        onClose();
      }
    },
    [onClose]
  );

  // Height classes
  const heightClasses = {
    auto: "max-h-[90vh]",
    full: "h-[95vh]",
    half: "h-[50vh]",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="bottom-sheet-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            style={{ touchAction: "none" }}
          />

          {/* Bottom Sheet */}
          <motion.div
            key="bottom-sheet-content"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={handleDragEnd}
            style={{ y, opacity }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
            }}
            className={`
              fixed bottom-0 left-0 right-0 z-50
              bg-white rounded-t-3xl shadow-2xl
              ${heightClasses[height]}
              overflow-hidden
            `}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag Handle */}
            {showHandle && (
              <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
              </div>
            )}

            {/* Header */}
            {(title || subtitle) && (
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    {Icon && (
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-bluegreen/10 to-sheen/10">
                        <Icon size={20} className="text-bluegreen" />
                      </div>
                    )}
                    <div>
                      {title && (
                        <h3 className="text-lg font-bold text-charcoal">{title}</h3>
                      )}
                      {subtitle && (
                        <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Close Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2.5 rounded-full hover:bg-gray-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="Close"
                  >
                    <X size={20} className="text-gray-600" />
                  </motion.button>
                </div>
              </div>
            )}

            {/* Content */}
            <div
              className={`
                overflow-y-auto
                ${height === "auto" ? "max-h-[calc(90vh-80px)]" : "h-full"}
                p-6
              `}
              data-lenis-prevent
              style={{ touchAction: "pan-y" }}
            >
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
