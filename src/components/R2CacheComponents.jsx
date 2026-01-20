import React, { useState, useEffect } from "react";
import { useR2LazyLoad } from "@/hooks/useR2Cache";

/**
 * R2CacheImage - Komponenta za lazy loading slika sa R2
 */
export function R2CacheImage({
  filename,
  namespace = "images",
  alt = "Image",
  className = "",
  loading = "lazy",
  ...props
}) {
  const { file, loading: isLoading, load } = useR2LazyLoad(filename, namespace);
  const [imageSrc, setImageSrc] = useState(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    // Prilagođeno za IntersectionObserver
    const loadImage = async () => {
      try {
        await load({ useCache: true });
      } catch (error) {
        setLoadError(true);
        console.error("Failed to load image:", error);
      }
    };

    if (loading === "lazy") {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          loadImage();
          observer.unobserve(entry.target);
        }
      });

      observer.observe(document.getElementById(`r2-img-${filename}`));
    } else {
      loadImage();
    }
  }, [filename, load, loading]);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setImageSrc(url);

      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  return (
    <img
      id={`r2-img-${filename}`}
      src={imageSrc}
      alt={alt}
      className={className}
      {...props}
      style={isLoading ? { opacity: 0.5 } : {}}
      onError={() => setLoadError(true)}
    />
  );
}

/**
 * R2CacheFile - Komponenta za download linkove sa R2
 */
export function R2CacheFile({
  filename,
  namespace = "documents",
  displayName = filename,
  className = "",
}) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    // U client-side, koristi R2CacheService za URL
    import("@/services/R2CacheService").then((module) => {
      const service = module.default;
      const fileUrl = service.getFileUrl(filename, namespace);
      setUrl(fileUrl);
    });
  }, [filename, namespace]);

  return (
    <a
      href={url}
      download={displayName}
      className={`inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${className}`}
    >
      <span>📥</span>
      <span>{displayName}</span>
    </a>
  );
}

/**
 * R2CacheVideoPlayer - Komponenta za streaming video-a sa R2
 */
export function R2CacheVideoPlayer({
  filename,
  namespace = "videos",
  controls = true,
  autoplay = false,
  className = "",
}) {
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    import("@/services/R2CacheService").then((module) => {
      const service = module.default;
      const url = service.getFileUrl(filename, namespace);
      setVideoUrl(url);
    });
  }, [filename, namespace]);

  return (
    <video
      src={videoUrl}
      controls={controls}
      autoPlay={autoplay}
      className={`w-full rounded-lg ${className}`}
    />
  );
}

export default { R2CacheImage, R2CacheFile, R2CacheVideoPlayer };
