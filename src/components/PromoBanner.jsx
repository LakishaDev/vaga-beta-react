import { useEffect, useMemo, useState } from "react";
import { motion as Motion } from "framer-motion";
import { X } from "lucide-react";
import { usePromo } from "../contexts/PromoContext";
import CountdownTimer from "./UI/CountdownTimer";

const DISMISS_KEY = "promo-dismissed";
const DAY_MS = 24 * 60 * 60 * 1000;

function isDismissedToday() {
  if (typeof window === "undefined") return false;

  const raw = window.localStorage.getItem(DISMISS_KEY);
  if (!raw) return false;

  const timestamp = Number(raw);
  if (!Number.isFinite(timestamp)) return false;

  return Date.now() - timestamp < DAY_MS;
}

export default function PromoBanner() {
  const { promo, isActive, timeLeft } = usePromo();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setDismissed(isDismissedToday());
  }, []);

  const visible = useMemo(() => isActive && !dismissed, [isActive, dismissed]);

  if (!visible) return null;

  return (
    <Motion.aside
      initial={{ y: -48, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -48, opacity: 0 }}
      transition={{ type: "spring", stiffness: 180, damping: 24 }}
      className="w-11/12 border-t border-[#e7d4f1] margin-auto rounded-2xl my-4 mx-auto overflow-hidden shadow-lg z-50 shadow-black/20"
      style={{
        background:
          "linear-gradient(120deg, rgba(255,249,196,0.95) 0%, rgba(213,245,227,0.95) 45%, rgba(232,213,245,0.95) 100%)",
      }}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-3 py-2 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2 text-sm sm:text-base">
          <span aria-hidden className="text-lg">
            🐣
          </span>
          <div className="font-semibold text-[#624579]">
            {promo.bannerText || "Uskrsnji popust -20% na sve proizvode!"}
          </div>
          <span className="hidden text-[#7f5d9c] sm:inline">
            {promo.bannerSubtext || "Iskoristite priliku dok traje akcija"}
          </span>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {promo.showCountdown ? <CountdownTimer timeLeft={timeLeft} /> : null}
          <button
            type="button"
            className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#d8c4ea] bg-white/80 text-[#7d59a2] transition hover:bg-white"
            aria-label="Zatvori promo banner"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
              }
              setDismissed(true);
            }}
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </Motion.aside>
  );
}
