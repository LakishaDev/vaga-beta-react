// src/components/admin/licensing/ResponsiveModal.jsx
// ===============================================================================
// RESPONSIVE MODAL - Wrapper za responsive modal ponašanje
// ===============================================================================
//
// @description Adaptiraj modal za različite screen sizes:
//              - Desktop (>768px): Centered modal with backdrop
//              - Mobile (<768px): Full-screen bottom sheet
//
// FEATURES:
// ✅ Responsive layout (modal -> bottom sheet)
// ✅ Swipe-to-close gesture (mobile only)
// ✅ Touch-optimized close button
// ✅ Smooth animations
// ✅ Keyboard support (ESC to close)
// ===============================================================================

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { X } from "lucide-react";

export default function ResponsiveModal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon: Icon,
  children,
  maxWidth = "2xl",
  fullScreenOnMobile = true,
  showCloseButton = true,
}) {
  // Motion values for swipe gesture
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 300], [1, 0]);

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Handle drag end (swipe to close)
  const handleDragEnd = useCallback(
    (_, info) => {
      // If swiped down more than 150px or with velocity > 500, close
      if (info.offset.y > 150 || info.velocity.y > 500) {
        onClose();
      }
    },
    [onClose]
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="responsive-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-admin-text/40 backdrop-blur-md"
            onClick={onClose}
            style={{ touchAction: "none" }}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none">
            <motion.div
              key="responsive-modal-content"
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.5 }}
              onDragEnd={handleDragEnd}
              style={{ y, opacity }}
              initial={{
                y: fullScreenOnMobile ? "100%" : 0,
                opacity: fullScreenOnMobile ? 1 : 0,
                scale: fullScreenOnMobile ? 1 : 0.9,
              }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{
                y: fullScreenOnMobile ? "100%" : 0,
                opacity: fullScreenOnMobile ? 1 : 0,
                scale: fullScreenOnMobile ? 1 : 0.9,
              }}
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 300,
              }}
              className={`
                relative bg-white/95 backdrop-blur-xl shadow-2xl 
                pointer-events-auto overflow-hidden
                w-full
                ${fullScreenOnMobile ? "h-[95vh] rounded-t-3xl md:rounded-3xl md:h-auto" : "rounded-3xl"}
                md:max-w-${maxWidth} md:mx-4
                border border-white/20
              `}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Swipe Handle (Mobile Only) */}
              {fullScreenOnMobile && (
                <div className="md:hidden flex justify-center pt-3 pb-2">
                  <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
                </div>
              )}

              {/* Decorative gradients */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-admin-primary/30 to-admin-accent/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-br from-admin-accent/30 to-admin-primary/20 rounded-full blur-3xl pointer-events-none" />

              {/* Header */}
              {(title || showCloseButton) && (
                <div className="relative bg-admin-navy px-6 py-5 md:py-6 text-white overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-admin-primary/20 via-transparent to-admin-accent/20" />
                  
                  {showCloseButton && (
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onClose}
                      className="absolute right-4 top-4 p-2.5 md:p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all z-30 min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 flex items-center justify-center"
                      aria-label="Close modal"
                    >
                      <X size={20} />
                    </motion.button>
                  )}

                  {title && (
                    <div className="relative z-10 flex items-center gap-3">
                      {Icon && (
                        <div className="p-3 rounded-xl bg-gradient-to-br from-admin-primary to-admin-accent shadow-lg">
                          <Icon size={24} />
                        </div>
                      )}
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
                        {subtitle && (
                          <p className="text-white/70 text-sm mt-0.5">{subtitle}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Content */}
              <div
                className={`
                  relative z-10 overflow-y-auto
                  ${fullScreenOnMobile ? "h-[calc(95vh-120px)] md:max-h-[70vh]" : "max-h-[80vh]"}
                `}
                data-lenis-prevent
              >
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
