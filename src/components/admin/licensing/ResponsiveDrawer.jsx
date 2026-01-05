// src/components/admin/licensing/ResponsiveDrawer.jsx
// ===============================================================================
// RESPONSIVE DRAWER - Adaptive drawer (side drawer -> bottom sheet)
// ===============================================================================
//
// @description Drawer koji se prilagođava screen size-u:
//              - Desktop: Side drawer from right
//              - Mobile: Bottom sheet from bottom
//
// FEATURES:
// ✅ Responsive behavior
// ✅ Swipe gestures (mobile)
// ✅ Smooth animations
// ✅ Touch-optimized
// ===============================================================================

import { useCallback, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { X } from "lucide-react";

export default function ResponsiveDrawer({
  isOpen,
  onClose,
  title,
  subtitle,
  icon: Icon,
  children,
  maxWidth = "lg",
}) {
  // Motion values for mobile swipe (bottom sheet)
  const y = useMotionValue(0);
  const mobileOpacity = useTransform(y, [0, 300], [1, 0.5]);

  // Motion values for desktop swipe (side drawer)
  const x = useMotionValue(0);

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

  // Handle mobile drag end (bottom sheet)
  const handleMobileDragEnd = useCallback(
    (_, info) => {
      if (info.offset.y > 150 || info.velocity.y > 800) {
        onClose();
      }
    },
    [onClose]
  );

  // Handle desktop drag end (side drawer)
  const handleDesktopDragEnd = useCallback(
    (_, info) => {
      if (info.offset.x > 150 || info.velocity.x > 800) {
        onClose();
      }
    },
    [onClose]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="responsive-drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-charcoal/40 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Mobile: Bottom Sheet */}
          <motion.div
            key="responsive-drawer-mobile"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={handleMobileDragEnd}
            style={{ y, opacity: mobileOpacity }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="md:hidden fixed bottom-0 left-0 right-0 h-[95vh] z-50 bg-white/95 backdrop-blur-xl rounded-t-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Decorative gradients */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-bluegreen/10 to-sheen/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-charcoal via-midnight to-charcoal px-6 py-5 text-white z-10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-bluegreen/20 via-transparent to-sheen/20" />

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute z-50 right-4 top-4 p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <X size={20} />
              </motion.button>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  {Icon && (
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-bluegreen to-sheen shadow-lg">
                      <Icon size={22} />
                    </div>
                  )}
                  {title && <h3 className="text-xl font-bold">{title}</h3>}
                </div>
                {subtitle && <p className="text-white/70 text-sm">{subtitle}</p>}
              </div>
            </div>

            {/* Content */}
            <div className="relative p-6 overflow-y-auto h-[calc(95vh-120px)]">
              {children}
            </div>
          </motion.div>

          {/* Desktop: Side Drawer */}
          <motion.div
            key="responsive-drawer-desktop"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0.5, right: 0 }}
            onDragEnd={handleDesktopDragEnd}
            style={{ x }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={`hidden md:block fixed right-0 top-0 h-full w-full max-w-${maxWidth} z-50 bg-white/95 backdrop-blur-xl shadow-2xl overflow-y-auto`}
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent
          >
            {/* Decorative gradients */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-bluegreen/10 to-sheen/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-charcoal via-midnight to-charcoal p-6 text-white z-10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-bluegreen/20 via-transparent to-sheen/20" />

              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="absolute z-50 right-4 top-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
              >
                <X size={20} />
              </motion.button>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  {Icon && (
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-bluegreen to-sheen shadow-lg">
                      <Icon size={22} />
                    </div>
                  )}
                  {title && <h3 className="text-xl font-bold">{title}</h3>}
                </div>
                {subtitle && <p className="text-white/70 text-sm">{subtitle}</p>}
              </div>
            </div>

            {/* Content */}
            <div className="relative p-6">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
