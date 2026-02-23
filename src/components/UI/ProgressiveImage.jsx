// src/components/UI/ProgressiveImage.jsx
// Komponenta za progresivno učitavanje slike sa efektom zamućenja i preliva
// Prikazuje placeholder dok se slika učitava
// Props:
// - src: URL slike
// - alt: alt tekst slike (default "")
// - className: dodatne klase za stilizaciju
// - style: dodatni stilovi (default {})
// - fit: "cover" (default) ili "contain" za object-fit stil
// Koristi useState za praćenje stanja učitavanja slike
// Koristi Tailwind CSS za stilizaciju i animacije
import React, { useEffect, useState } from "react";

function withImageCacheBuster(url) {
  if (!url || typeof url !== "string") return url;
  if (url.startsWith("data:") || url.startsWith("blob:")) return url;

  const shouldBust =
    url.startsWith("/imgs/") ||
    url.startsWith("imgs/") ||
    url.includes("/imgs/");

  if (!shouldBust) return url;
  if (url.includes("imgv=")) return url;

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}imgv=20260223`;
}

// Modern, aspect-safe ProgressiveImage
export default function ProgressiveImage({
  src,
  alt = "",
  className = "",
  style = {},
  fit = "cover",
  fallbackSrc = "/imgs/vaga-logo.png",
}) {
  const [loading, setLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState(withImageCacheBuster(src));

  useEffect(() => {
    setImageSrc(withImageCacheBuster(src));
    setLoading(true);
  }, [src]);

  // Dozvoli izbor fit moda: "cover" (za kartice/grid), "contain" (za modale/lightbox)
  const fitClass = fit === "contain" ? "object-contain" : "object-cover";

  return (
    <div
      className={`relative overflow-hidden group ${className}`}
      style={style}
      tabIndex={0}
      aria-label={alt}
      aria-busy={loading}
    >
      <img
        src={imageSrc}
        alt={alt}
        draggable={false}
        className={`${fitClass} transition-all duration-500 ease-out
          ${
            loading
              ? "blur-2xl grayscale scale-105 opacity-30"
              : "blur-0 scale-100 opacity-100 shadow-lg animate-imgfadein"
          }
          group-focus:ring-2 group-focus:ring-brand-secondary
        `}
        style={{ width: "100%", height: "100%", backfaceVisibility: "hidden" }}
        onLoad={() => setLoading(false)}
        onError={(e) => {
          const fallbackWithBuster = withImageCacheBuster(fallbackSrc);

          if (fallbackWithBuster && imageSrc !== fallbackWithBuster) {
            setImageSrc(fallbackWithBuster);
            return;
          }

          e.currentTarget.style.opacity = "0.35";
          setLoading(false);
        }}
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-gradient-to-br from-white/30 via-brand-secondary/10 to-blue-100/20">
          <div
            className="w-12 h-12 sm:w-16 sm:h-16 border-[4px] border-t-brand-secondary border-l-brand-secondary/70 border-b-blue-300 border-r-transparent rounded-full
            animate-spin bg-white/30 shadow-2xl"
          />
        </div>
      )}
      <style>{`
        @keyframes imgfadein {
          0% { opacity:.2; transform: scale(1.08);}
          60% { opacity:.86; transform: scale(1.02);}
          100% { opacity:1; transform: scale(1);}
        }
        .animate-imgfadein {
          animation: imgfadein .7s cubic-bezier(.46,1.17,.73,.95);
        }
      `}</style>
    </div>
  );
}
