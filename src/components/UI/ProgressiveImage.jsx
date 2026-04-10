import React, { useEffect, useMemo, useState } from "react";
import { useDataSaver } from "../../contexts/DataSaverContext";
import { getImageUrl, isImageVariantsObject } from "../../utils/imageVariants";

function normalizeImageUrl(url) {
  if (!url || typeof url !== "string") return "";
  if (url.startsWith("data:") || url.startsWith("blob:")) return url;
  if (url.startsWith("imgs/")) return `/${url}`;
  return url;
}

function shouldRetryWithBuster(url) {
  return (
    typeof url === "string" &&
    (url.startsWith("/imgs/") ||
      url.startsWith("imgs/") ||
      url.includes("/imgs/"))
  );
}

function addRetryParam(url, attempt) {
  if (!url || typeof url !== "string") return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}retry=${attempt}-${Date.now()}`;
}

function isLocalImagesPath(url) {
  if (!url || typeof url !== "string") return false;
  return url.startsWith("/imgs/") || url.startsWith("imgs/");
}

function isRemoteHttpImageUrl(url) {
  if (!url || typeof url !== "string") return false;
  return url.startsWith("http://") || url.startsWith("https://");
}

function normalizeImagePath(url) {
  if (!url || typeof url !== "string") return "";
  const withLeadingSlash = url.startsWith("/") ? url : `/${url}`;
  const [basePath] = withLeadingSlash.split("?");
  return basePath;
}

function isFirebaseStorageUrl(url) {
  if (!url || typeof url !== "string") return false;
  return (
    url.includes("firebasestorage.googleapis.com") ||
    url.includes(".firebasestorage.app")
  );
}

function shouldUseCloudflareImageResize(url, hasVariants) {
  if (typeof window === "undefined") return false;
  if (hasVariants) return false;

  const host = window.location.hostname;
  const isLocalHost =
    host === "localhost" || host === "127.0.0.1" || host.endsWith(".local");

  if (isLocalHost) return false;
  if (isFirebaseStorageUrl(url)) return false;

  return isLocalImagesPath(url) || isRemoteHttpImageUrl(url);
}

function getCloudflareImageSource(url) {
  if (!url || typeof url !== "string") return "";

  if (isLocalImagesPath(url)) {
    return normalizeImagePath(url).replace(/^\/+/, "");
  }

  if (isRemoteHttpImageUrl(url)) {
    return encodeURIComponent(url);
  }

  return "";
}

function buildCloudflareImageUrl(url, width = 1280) {
  const source = getCloudflareImageSource(url);
  if (!source) return "";

  return `/cdn-cgi/image/width=${width},quality=75,format=auto/${source}`;
}

function buildCloudflareSrcSet(url) {
  const source = getCloudflareImageSource(url);
  if (!source) return "";

  const widths = [320, 480, 640, 768, 1024, 1280, 1600];
  return widths
    .map(
      (width) =>
        `/cdn-cgi/image/width=${width},quality=75,format=auto/${source} ${width}w`,
    )
    .join(", ");
}

function preloadImage(url) {
  return new Promise((resolve, reject) => {
    if (!url) {
      resolve(false);
      return;
    }

    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => reject(new Error("Image preload failed"));
    img.src = url;
  });
}

function resolveVariants(src, variants) {
  if (isImageVariantsObject(variants)) return variants;
  if (isImageVariantsObject(src)) return src;
  return null;
}

function resolveBaseSrc(src, resolvedVariants, isDataSaver, variantPreference) {
  if (resolvedVariants) {
    if (variantPreference === "original") {
      return getImageUrl(resolvedVariants, ["original", "medium", "thumb"]);
    }

    if (variantPreference === "medium") {
      return getImageUrl(resolvedVariants, ["medium", "thumb", "original"]);
    }

    if (variantPreference === "thumb") {
      return getImageUrl(resolvedVariants, ["thumb", "medium", "original"]);
    }

    if (isDataSaver) {
      return getImageUrl(resolvedVariants, ["thumb", "medium", "original"]);
    }

    return getImageUrl(resolvedVariants, ["medium", "thumb", "original"]);
  }

  return normalizeImageUrl(typeof src === "string" ? src : "");
}

const imgCache = new Set();

export default function ProgressiveImage({
  src,
  variants,
  alt = "",
  className = "",
  style = {},
  fit = "cover",
  fallbackSrc = "/imgs/vaga-logo.png",
  width,
  height,
  sizes,
  imageLoading = "lazy",
  decoding = "async",
  fetchPriority,
  variantPreference = "auto",
}) {
  const { isDataSaver } = useDataSaver();

  const resolvedVariants = useMemo(
    () => resolveVariants(src, variants),
    [src, variants],
  );

  const initialSrc = useMemo(
    () => resolveBaseSrc(src, resolvedVariants, isDataSaver, variantPreference),
    [src, resolvedVariants, isDataSaver, variantPreference],
  );

  const [loading, setLoading] = useState(() => !imgCache.has(initialSrc));
  const [imageSrc, setImageSrc] = useState(initialSrc);
  const [primaryRetried, setPrimaryRetried] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const [fallbackRetried, setFallbackRetried] = useState(false);
  const [optimizationDisabled, setOptimizationDisabled] = useState(false);
  const isPriorityImage = imageLoading === "eager" || fetchPriority === "high";

  useEffect(() => {
    setImageSrc(initialSrc);
    setLoading(!imgCache.has(initialSrc));
    setPrimaryRetried(false);
    setUsingFallback(false);
    setFallbackRetried(false);
    setOptimizationDisabled(false);
  }, [initialSrc]);

  useEffect(() => {
    const canUpgradeVariants =
      resolvedVariants &&
      variantPreference === "auto" &&
      !isDataSaver &&
      !isPriorityImage;

    if (!canUpgradeVariants) return;

    let active = true;

    const runProgressiveUpgrade = async () => {
      const mediumSrc = normalizeImageUrl(
        getImageUrl(resolvedVariants, ["medium", "original", "thumb"]),
      );
      const originalSrc = normalizeImageUrl(
        getImageUrl(resolvedVariants, ["original", "medium", "thumb"]),
      );

      if (mediumSrc && mediumSrc !== imageSrc) {
        try {
          await preloadImage(mediumSrc);
          if (active) setImageSrc(mediumSrc);
        } catch {
          // noop
        }
      }

      const shouldLoadOriginal =
        typeof window !== "undefined" && window.innerWidth > 512;
      if (shouldLoadOriginal && originalSrc && originalSrc !== mediumSrc) {
        try {
          await preloadImage(originalSrc);
          if (active) setImageSrc(originalSrc);
        } catch {
          // noop
        }
      }
    };

    runProgressiveUpgrade();

    return () => {
      active = false;
    };
  }, [
    resolvedVariants,
    variantPreference,
    isDataSaver,
    imageSrc,
    isPriorityImage,
  ]);

  const fitClass = fit === "contain" ? "object-contain" : "object-cover";
  const canUseCloudflareResize =
    !optimizationDisabled &&
    shouldUseCloudflareImageResize(imageSrc, Boolean(resolvedVariants));
  const priorityWidth =
    Number.isFinite(Number(width)) && Number(width) > 0 ? Number(width) : 1280;
  const resolvedSrc =
    isPriorityImage && canUseCloudflareResize
      ? buildCloudflareImageUrl(imageSrc, priorityWidth)
      : imageSrc;
  const responsiveSrcSet =
    !isPriorityImage && canUseCloudflareResize
      ? buildCloudflareSrcSet(imageSrc)
      : undefined;
  const resolvedSizes = responsiveSrcSet ? sizes || "100vw" : sizes;

  return (
    <div
      className={`relative overflow-hidden group ${className}`}
      style={style}
      tabIndex={0}
      aria-label={alt}
      aria-busy={loading}
    >
      <img
        src={resolvedSrc}
        alt={alt}
        width={width}
        height={height}
        srcSet={responsiveSrcSet}
        sizes={resolvedSizes}
        loading={imageLoading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        draggable={false}
        className={`${fitClass} transition-all duration-500 ease-out
          ${
            loading
              ? isPriorityImage
                ? "opacity-100"
                : "blur-2xl grayscale scale-105 opacity-30"
              : "blur-0 scale-100 opacity-100 shadow-lg animate-imgfadein"
          }
          group-focus:ring-2 group-focus:ring-brand-secondary
        `}
        style={{ width: "100%", height: "100%", backfaceVisibility: "hidden" }}
        onLoad={() => {
          imgCache.add(initialSrc);
          setLoading(false);
        }}
        onError={(e) => {
          const normalizedFallback = normalizeImageUrl(fallbackSrc);

          if (canUseCloudflareResize) {
            setOptimizationDisabled(true);
            setLoading(true);
            return;
          }

          if (
            !usingFallback &&
            !primaryRetried &&
            shouldRetryWithBuster(imageSrc)
          ) {
            setPrimaryRetried(true);
            setImageSrc(addRetryParam(imageSrc, 1));
            return;
          }

          if (
            !usingFallback &&
            normalizedFallback &&
            imageSrc !== normalizedFallback
          ) {
            setUsingFallback(true);
            setImageSrc(normalizedFallback);
            return;
          }

          if (
            usingFallback &&
            !fallbackRetried &&
            shouldRetryWithBuster(imageSrc)
          ) {
            setFallbackRetried(true);
            setImageSrc(addRetryParam(imageSrc, 1));
            return;
          }

          e.currentTarget.style.opacity = "0.35";
          setLoading(false);
        }}
      />
      {loading && !isPriorityImage && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-gradient-to-br from-white/30 via-brand-secondary/10 to-blue-100/20">
          <div
            className="w-12 h-12 sm:w-16 sm:h-16 border-[4px] border-t-brand-secondary border-l-brand-secondary/70 border-b-blue-300 border-r-transparent rounded-full
            animate-spin bg-white/30 shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
