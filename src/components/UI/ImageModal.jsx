import { useState, useCallback, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

/**
 * ImageModal Component
 * A reusable modal for displaying images with zoom, magnifier, and carousel features
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Modal visibility state
 * @param {Function} props.onClose - Close callback
 * @param {Array<string>} props.images - Array of image URLs
 * @param {number} props.initialIndex - Initial image index to display
 * @param {string} props.productName - Product name for alt text
 */
export default function ImageModal({
  isOpen,
  onClose,
  images = [],
  initialIndex = 0,
  productName = "Product",
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Reset state when modal opens or image changes
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setIsZoomed(false);
      setZoomLevel(1);
      setImagePosition({ x: 50, y: 50 });
      setImageLoaded(false);
    }
  }, [isOpen, initialIndex]);

  // Reset zoom when changing images
  useEffect(() => {
    setIsZoomed(false);
    setZoomLevel(1);
    setImagePosition({ x: 50, y: 50 });
    setImageLoaded(false);
  }, [currentIndex]);

  const nextImage = useCallback(() => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const prevImage = useCallback(() => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onClose();
      setIsAnimating(false);
    }, 300);
  };

  const toggleZoom = () => {
    if (isZoomed) {
      setIsZoomed(false);
      setZoomLevel(1);
      setImagePosition({ x: 50, y: 50 });
    } else {
      setIsZoomed(true);
      setZoomLevel(2);
    }
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 4));
    setIsZoomed(true);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoomLevel - 0.5, 1);
    setZoomLevel(newZoom);
    if (newZoom === 1) {
      setIsZoomed(false);
      setImagePosition({ x: 50, y: 50 });
    }
  };

  const handleMouseMove = (e) => {
    if (!isZoomed || isDragging) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setImagePosition({ x, y });
  };

  const handleMouseDown = (e) => {
    if (!isZoomed) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;

    const deltaX = (e.clientX - dragStart.x) / 5;
    const deltaY = (e.clientY - dragStart.y) / 5;

    setImagePosition((prev) => ({
      x: Math.max(0, Math.min(100, prev.x - deltaX)),
      y: Math.max(0, Math.min(100, prev.y - deltaY)),
    }));

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  // Touch handling for mobile pinch-to-zoom
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY,
      );
      setDragStart({ x: distance, y: 0 });
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY,
      );

      const scale = distance / dragStart.x;
      const newZoom = Math.max(1, Math.min(4, zoomLevel * scale));
      setZoomLevel(newZoom);
      setIsZoomed(newZoom > 1);
      setDragStart({ x: distance, y: 0 });
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowLeft":
          prevImage();
          break;
        case "ArrowRight":
          nextImage();
          break;
        case "Escape":
          handleClose();
          break;
        case "+":
        case "=":
          handleZoomIn();
          break;
        case "-":
        case "_":
          handleZoomOut();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, nextImage, prevImage]);

  if (!isOpen) return null;

  const currentImage = images[currentIndex];

  return (
    <AnimatePresence>
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md ${
          isAnimating ? "pointer-events-none" : ""
        }`}
        onClick={handleClose}
      >
        {/* Close button */}
        <Motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          className="absolute right-4 top-4 z-50 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-all backdrop-blur-md border border-white/20 shadow-xl"
          onClick={handleClose}
          aria-label="Zatvori modal"
        >
          <X size={28} />
        </Motion.button>

        {/* Zoom controls */}
        <div className="absolute left-4 top-4 z-50 flex flex-col gap-2">
          <Motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              handleZoomIn();
            }}
            className="bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-all backdrop-blur-md border border-white/20 shadow-xl"
            aria-label="Zumiraj"
          >
            <ZoomIn size={24} />
          </Motion.button>
          <Motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              handleZoomOut();
            }}
            className="bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-all backdrop-blur-md border border-white/20 shadow-xl"
            aria-label="Odzumiraj"
          >
            <ZoomOut size={24} />
          </Motion.button>
          {isZoomed && (
            <div className="bg-black/60 backdrop-blur-md text-white rounded-lg px-3 py-2 text-sm font-semibold border border-white/20">
              {Math.round(zoomLevel * 100)}%
            </div>
          )}
        </div>

        {/* Navigation arrows - only show if multiple images */}
        {images.length > 1 && (
          <>
            <Motion.button
              whileHover={{ scale: 1.15, x: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-40 bg-white/10 backdrop-blur-md text-white p-4 rounded-full shadow-xl hover:bg-white/20 transition-all border border-white/20"
              aria-label="Prethodna slika"
            >
              <ChevronLeft size={32} />
            </Motion.button>
            <Motion.button
              whileHover={{ scale: 1.15, x: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-40 bg-white/10 backdrop-blur-md text-white p-4 rounded-full shadow-xl hover:bg-white/20 transition-all border border-white/20"
              aria-label="Sledeća slika"
            >
              <ChevronRight size={32} />
            </Motion.button>
          </>
        )}

        {/* Image container with fixed aspect ratio to prevent jumping */}
        <Motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3, type: "spring", damping: 25 }}
          className="relative flex flex-col items-center max-w-[90vw] max-h-[85vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Fixed size container to prevent layout shift */}
          <div className="relative w-full" style={{ minHeight: "60vh" }}>
            {/* Loading skeleton */}
            {/* {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
              </div>
            )} */}

            {/* Actual image */}
            <AnimatePresence mode="wait">
              <Motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: imageLoaded ? 1 : 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`relative rounded-2xl overflow-hidden shadow-2xl bg-white/5 backdrop-blur-sm border border-white/10
                  flex items-center justify-center
                ${isZoomed ? "cursor-move" : "cursor-zoom-in"}`}
                onClick={toggleZoom}
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                style={{
                  maxWidth: "85vw",
                  maxHeight: "70vh",
                }}
              >
                <Motion.img
                  src={currentImage}
                  alt={`${productName} - ${currentIndex + 1}`}
                  className="max-w-full max-h-[70vh] object-contain select-none"
                  style={{
                    transform: isZoomed ? `scale(${zoomLevel})` : "scale(1)",
                    transformOrigin: `${imagePosition.x}% ${imagePosition.y}%`,
                    transition: isDragging ? "none" : "transform 0.3s ease-out",
                  }}
                  onLoad={() => setImageLoaded(true)}
                  onMouseMove={isDragging ? handleDragMove : undefined}
                  draggable={false}
                />
              </Motion.div>
            </AnimatePresence>
          </div>

          {/* Product name and counter */}
          <div className="mt-6 text-center">
            <Motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl font-bold text-white drop-shadow-lg mb-2"
            >
              {productName}
            </Motion.div>
            {images.length > 1 && (
              <Motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-white/80 backdrop-blur-sm bg-black/40 px-4 py-2 rounded-full inline-block border border-white/20"
              >
                {currentIndex + 1} / {images.length}
              </Motion.div>
            )}
          </div>

          {/* Dots indicator */}
          {images.length > 1 && (
            <Motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center gap-2 mt-4"
            >
              {images.map((_, idx) => (
                <Motion.button
                  key={idx}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  className={`transition-all rounded-full border border-white/30 ${
                    idx === currentIndex
                      ? "bg-white w-10 h-3"
                      : "bg-white/40 hover:bg-white/60 w-3 h-3"
                  }`}
                  aria-label={`Idi na sliku ${idx + 1}`}
                />
              ))}
            </Motion.div>
          )}

          {/* Hint text */}
          {isZoomed && (
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-sm text-white/60 text-center"
            >
              Kliknite i prevucite za pomeranje • ESC za zatvaranje
            </Motion.div>
          )}
        </Motion.div>
      </Motion.div>
    </AnimatePresence>
  );
}
