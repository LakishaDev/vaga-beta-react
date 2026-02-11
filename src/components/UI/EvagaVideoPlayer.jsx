import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FaVolumeUp,
  FaVolumeMute,
  FaExpand,
  FaTimes,
  FaShareAlt,
  FaRegClosedCaptioning,
  FaBackward,
  FaForward,
  FaPlay,
  FaPause,
} from "react-icons/fa";
import { MdPictureInPictureAlt } from "react-icons/md";
import R2CacheService from "@/services/R2CacheService";

/**
 * EvagaVideoPlayer - Premium video player komponenta za e-Vaga program prezentaciju
 * Features:
 * - Auto-play kada se video pojavi u viewport-u (Intersection Observer)
 * - Loading spinner tokom učitavanja
 * - Mute toggle (početno mutovano, korisnik može odmutovati)
 * - Fullscreen podrška
 * - Responsive dizajn sa Tailwind CSS
 * - Podrška za R2 Cloudflare storage
 */
export default function EvagaVideoPlayer({
  filename = "eVaga Program 2026.mp4",
  namespace = "videos",
  posterImage = null,
  title = "e-Vaga Program Prezentacija",
  description = null,
  autoplay = true,
  className = "",
  captionsSrc = null,
  captionsLabel = "Subtitles",
  enableAnalytics = false,
  onAnalyticsEvent = null,
}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasStartedAutoplay, setHasStartedAutoplay] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [buffered, setBuffered] = useState(0); // percent buffered
  const [playbackRate, setPlaybackRate] = useState(1);
  const [pipActive, setPipActive] = useState(false);
  const [pipSupported, setPipSupported] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const controlsTimeout = useRef(null);
  const analyticsMaxProgress = useRef(0);
  const lastProgressEmit = useRef(0);

  // Učitaj video URL sa R2
  useEffect(() => {
    const loadVideoUrl = async () => {
      try {
        setIsLoading(true);
        const url = R2CacheService.getFileUrl(filename, namespace);
        setVideoUrl(url);
      } catch (error) {
        console.error("Greška pri učitavanju videa sa R2:", error);
        setLoadError(true);
      }
    };

    loadVideoUrl();
  }, [filename, namespace]);

  // Intersection Observer za auto-play - pokreće se kada je video na sredini ekrana
  useEffect(() => {
    if (!videoRef.current || !autoplay || hasStartedAutoplay) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && videoRef.current && !hasStartedAutoplay) {
          // Proveri da li je video zaista u centru viewport-a
          const rect = entry.boundingClientRect;
          const viewportHeight = window.innerHeight;
          const videoCenter = rect.top + rect.height / 2;
          const viewportCenter = viewportHeight / 2;

          // Pokreni video samo ako je centar videa blizu centra ekrana (±30% tolerancija)
          const tolerance = viewportHeight * 0.3;
          if (Math.abs(videoCenter - viewportCenter) < tolerance) {
            videoRef.current.play().catch((err) => {
              console.log("Auto-play nije dozvoljen:", err);
            });
            setIsPlaying(true);
            setHasStartedAutoplay(true);
          }
        }
      },
      {
        threshold: [0.3, 0.5, 0.7], // Više threshold-a za bolju detekciju
        rootMargin: "0px",
      },
    );

    observer.observe(videoRef.current);

    return () => observer.disconnect();
  }, [autoplay, hasStartedAutoplay]);

  // PIP support detection i touch device detekcija
  useEffect(() => {
    setPipSupported(document.pictureInPictureEnabled === true);

    // Detektuj touch uređaje
    const checkTouchDevice = () => {
      return (
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0
      );
    };

    setIsTouchDevice(checkTouchDevice());
  }, []);

  const emitAnalytics = useCallback(
    (eventName, payload = {}) => {
      if (!enableAnalytics || typeof onAnalyticsEvent !== "function") return;
      onAnalyticsEvent(eventName, payload);
    },
    [enableAnalytics, onAnalyticsEvent],
  );

  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      emitAnalytics("pause", { time: videoRef.current.currentTime });
    } else {
      videoRef.current.play();
      setIsPlaying(true);
      emitAnalytics("play", { time: videoRef.current.currentTime });
    }
  };

  const handleContainerClick = () => {
    if (isTouchDevice) {
      // Na touch uređajima toggle-uj kontrole
      setShowControls((prev) => !prev);

      // Auto-sakrij kontrole nakon 3 sekunde ako se video reprodukuje
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }

      if (isPlaying) {
        controlsTimeout.current = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
    } else {
      // Na desktop uređajima play/pause
      handlePlayPause();
    }
  };

  const handleMuteToggle = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
    emitAnalytics("mute_toggle", { muted: !isMuted });
  };

  const handleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current?.requestFullscreen) {
          await containerRef.current.requestFullscreen();
          setIsFullscreen(true);
          emitAnalytics("fullscreen", { active: true });
        }
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
        emitAnalytics("fullscreen", { active: false });
      }
    } catch (error) {
      console.error("Greška pri pokušaju fullscreen-a:", error);
    }
  };

  const seekTo = (targetSeconds, analyticsDeltaOverride) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    const clamped = Math.min(duration, Math.max(0, targetSeconds));
    const from = video.currentTime || 0;
    try {
      if (typeof video.fastSeek === "function") {
        video.fastSeek(clamped);
      } else {
        video.currentTime = clamped;
      }
    } catch (error) {
      video.currentTime = clamped;
      console.error("Seek error", error);
    }
    const delta =
      typeof analyticsDeltaOverride === "number"
        ? analyticsDeltaOverride
        : clamped - from;
    emitAnalytics("seek", { to: clamped, delta });
  };

  const handleSkip = (deltaSeconds) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    const target = (video.currentTime || 0) + deltaSeconds;
    seekTo(target, deltaSeconds);
  };

  const handleRateChange = (rate) => {
    const video = videoRef.current;
    setPlaybackRate(rate);
    if (video) video.playbackRate = rate;
    emitAnalytics("rate_change", { rate });
  };

  const handleShare = async () => {
    try {
      const shareUrl = videoUrl;
      if (navigator.share) {
        await navigator.share({
          title,
          text: description || title,
          url: shareUrl,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      }
      emitAnalytics("share", {});
    } catch (error) {
      console.error("Share error", error);
    }
  };

  const handlePip = async () => {
    const video = videoRef.current;
    if (!pipSupported || !video) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setPipActive(false);
      } else {
        await video.requestPictureInPicture();
        setPipActive(true);
      }
      emitAnalytics("pip_toggle", { active: !pipActive });
    } catch (error) {
      console.error("PiP error", error);
    }
  };

  const handleLoadedMetadata = () => {
    setIsLoading(false);
    setDuration(videoRef.current?.duration || 0);
    if (videoRef.current) videoRef.current.playbackRate = playbackRate;
  };

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current?.currentTime || 0);

    if (videoRef.current && duration) {
      const progress = (videoRef.current.currentTime / duration) * 100;
      if (progress > analyticsMaxProgress.current) {
        analyticsMaxProgress.current = progress;
      }
      // emit progress every 10% or on end
      if (progress - lastProgressEmit.current >= 10) {
        lastProgressEmit.current = progress;
        emitAnalytics("progress", {
          percent: Math.min(100, Math.round(progress)),
          maxPercent: Math.min(100, Math.round(analyticsMaxProgress.current)),
        });
      }
    }
  };

  const handleProgress = () => {
    const video = videoRef.current;
    if (!video || !video.buffered || !video.duration) return;
    const last = video.buffered.length - 1;
    if (last < 0) return;
    const bufferedEnd = video.buffered.end(last);
    const percent = Math.min(
      100,
      Math.max(0, (bufferedEnd / video.duration) * 100),
    );
    setBuffered(percent);
  };

  const handleCanPlay = () => {
    setIsLoading(false);
  };

  const handleWaiting = () => setIsLoading(true);
  const handlePlaying = () => setIsLoading(false);
  const handleEnded = () => {
    setIsPlaying(false);
    emitAnalytics("ended", {
      percent: 100,
      maxPercent: Math.min(
        100,
        Math.round(analyticsMaxProgress.current || 100),
      ),
    });
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loadError) {
    return (
      <div
        className={`w-full bg-red-100 border border-red-400 rounded-lg p-4 ${className}`}
      >
        <p className="text-red-700 font-semibold">
          Greška pri učitavanju videa. Pokušajte kasnije.
        </p>
      </div>
    );
  }

  if (!videoUrl) {
    return (
      <div
        className={`w-full bg-gray-200 rounded-lg aspect-video flex items-center justify-center ${className}`}
      >
        <div className="animate-spin">
          <div className="h-8 w-8 border-4 border-[#6EAEA2] border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <section
      className={`my-6 sm:my-10 animate-fadein duration-1000 delay-300 ${className}`}
    >
      <div className="max-w-4xl mx-auto px-3 sm:px-4">
        <div className="mb-4 sm:mb-6">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#1E3E49] mb-2 animate-fadeup">
            {title}
          </h3>
          {description && (
            <p className="text-sm sm:text-base md:text-lg text-[#2F5363] animate-fadeup delay-100">
              {description}
            </p>
          )}
        </div>

        {/* Video Container */}
        <div
          ref={containerRef}
          className={`relative bg-black rounded-2xl overflow-hidden shadow-2xl group ${
            isFullscreen ? "fixed inset-0 rounded-none" : "aspect-video"
          }`}
        >
          {/* Video element */}
          <video
            ref={videoRef}
            src={videoUrl}
            poster={posterImage}
            muted={isMuted}
            preload="auto"
            playsInline
            controlsList="nodownload"
            className="w-full h-full object-contain"
            onLoadedMetadata={handleLoadedMetadata}
            onCanPlay={handleCanPlay}
            onTimeUpdate={handleTimeUpdate}
            onProgress={handleProgress}
            onWaiting={handleWaiting}
            onPlaying={handlePlaying}
            onEnded={handleEnded}
            onError={(e) => {
              console.error("Video load error:", e);
              setLoadError(true);
              setIsLoading(false);
            }}
          >
            {captionsSrc && (
              <track
                src={captionsSrc}
                label={captionsLabel}
                kind="subtitles"
                srcLang="sr"
                default
              />
            )}
          </video>

          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
              <div className="flex flex-col items-center gap-3">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 border-4 border-transparent border-t-[#6EAEA2] border-r-[#6EAEA2] rounded-full animate-spin"></div>
                </div>
                <p className="text-white text-sm font-semibold">
                  Učitavanje...
                </p>
              </div>
            </div>
          )}

          {/* Play/Pause overlay (pokazuje se pri kliknuću) - Responsive */}
          <div
            className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer z-10"
            onClick={handleContainerClick}
          >
            {!isPlaying && (
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/30 rounded-full flex items-center justify-center backdrop-blur">
                <FaPlay size={32} className="sm:w-10 sm:h-10 text-white ml-1" />
              </div>
            )}
          </div>

          {/* Controls Bar - Responsive */}
          <div
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/60 to-transparent p-2 sm:p-4 transition-opacity duration-300 z-15 ${
              isTouchDevice
                ? showControls
                  ? "opacity-100"
                  : "opacity-0"
                : "opacity-0 group-hover:opacity-100"
            }`}
          >
            {/* Progress bar */}
            <div className="mb-2 sm:mb-4 flex items-center gap-1 sm:gap-2">
              <div
                className="relative flex-1 h-1 sm:h-1 bg-gray-600 rounded-full overflow-hidden cursor-pointer group/progress hover:h-2 transition-all touch-none"
                onClick={(e) => {
                  if (!videoRef.current || !duration) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const percent = (e.clientX - rect.left) / rect.width;
                  const target = percent * duration;
                  seekTo(target);
                }}
              >
                {/* Buffered bar */}
                <div
                  className="absolute left-0 top-0 h-full bg-white/30"
                  style={{ width: `${buffered}%` }}
                />
                <div
                  className="h-full bg-[#6EAEA2] rounded-full transition-all"
                  style={{
                    width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                  }}
                />
              </div>
              <span className="text-white text-[10px] sm:text-xs font-semibold whitespace-nowrap">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Buttons - Responsive */}
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
                {/* Play/Pause Button */}
                <button
                  onClick={handlePlayPause}
                  className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
                  title={isPlaying ? "Pauziraj" : "Reprodukuj"}
                >
                  {isPlaying ? (
                    <FaPause size={14} className="sm:w-4 sm:h-4" />
                  ) : (
                    <FaPlay size={14} className="sm:w-4 sm:h-4" />
                  )}
                </button>

                {/* Mute Toggle */}
                <button
                  onClick={handleMuteToggle}
                  className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
                  title={isMuted ? "Odmutuj" : "Mutuj"}
                >
                  {isMuted ? (
                    <FaVolumeMute
                      size={16}
                      className="sm:w-[18px] sm:h-[18px]"
                    />
                  ) : (
                    <FaVolumeUp size={16} className="sm:w-[18px] sm:h-[18px]" />
                  )}
                </button>

                {/* Backward / Forward - Sakrij na malim ekranima */}
                <button
                  onClick={() => handleSkip(-10)}
                  className="hidden sm:block p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
                  title="Premotaj -10s"
                >
                  <FaBackward size={14} className="sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={() => handleSkip(10)}
                  className="hidden sm:block p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
                  title="Premotaj +10s"
                >
                  <FaForward size={14} className="sm:w-4 sm:h-4" />
                </button>

                {/* Playback rate - Prikaži samo na većim ekranima */}
                <div className="hidden md:flex items-center gap-1 bg-white/10 rounded-lg px-2 py-1 text-white text-xs font-semibold">
                  {[1, 1.25, 1.5, 2].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => handleRateChange(rate)}
                      className={`px-2 py-1 rounded-md transition-colors ${
                        playbackRate === rate
                          ? "bg-[#6EAEA2] text-[#0F2A32]"
                          : "hover:bg-white/20"
                      }`}
                      title={`${rate}x brzina`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Right side controls */}
              <div className="flex items-center gap-1 sm:gap-2">
                {/* PiP - Sakrij na malim ekranima */}
                {pipSupported && (
                  <button
                    onClick={handlePip}
                    className="hidden sm:block p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
                    title="Mini-player (PiP)"
                  >
                    <MdPictureInPictureAlt
                      size={16}
                      className="sm:w-[18px] sm:h-[18px]"
                    />
                  </button>
                )}

                {/* Share - Sakrij na malim ekranima */}
                <button
                  onClick={handleShare}
                  className="hidden sm:block p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
                  title="Podeli video"
                >
                  <FaShareAlt size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>

                {/* Fullscreen - Uvek vidljivo */}
                <button
                  onClick={handleFullscreen}
                  className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
                  title={isFullscreen ? "Izlaz iz fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? (
                    <FaTimes size={16} className="sm:w-[18px] sm:h-[18px]" />
                  ) : (
                    <FaExpand size={16} className="sm:w-[18px] sm:h-[18px]" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Napomena */}
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-[#F5F9F7] rounded-xl border border-[#D7DACF]">
          <p className="text-[#2F5363] text-xs sm:text-sm leading-relaxed">
            <strong>Napomena:</strong> Video se automatski pokreće kada
            doskrolujete do njega i kada se pojavi na sredini ekrana.
            {isTouchDevice ? (
              <>
                Tapnite na video da prikažete kontrole za pauziranje,
                podešavanje zvuka i prelazak u fullscreen režim. Kontrole se
                automatski sakrivaju nakon 3 sekunde.
              </>
            ) : (
              <>
                Kliknite na video ili dugme za reprodukciju da ga pauzate.
                Koristite dugme za zvuk da omogućite audio, a fullscreen dugme
                za prikaz na celom ekranu.
              </>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
