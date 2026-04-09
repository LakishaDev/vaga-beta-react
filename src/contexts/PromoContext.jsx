/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../utils/firebase";

const PromoContext = createContext(null);

const FALLBACK_PROMO = {
  active: false,
  type: "sitewide",
  discountPercent: 20,
  startDate: new Date("2026-04-09T00:00:00+02:00"),
  endDate: new Date("2026-09-19T23:59:59+02:00"),
  theme: "easter",
  bannerText: "Uskrsnji popust -20% na sve proizvode!",
  bannerSubtext: "Iskoristite priliku dok traje akcija",
  showCountdown: true,
  promoCode: "easter-2026",
};

function toDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value?.toDate === "function") return value.toDate();

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getTimeLeft(endDate, now) {
  if (!endDate) return null;
  const distance = endDate.getTime() - now.getTime();

  if (distance <= 0) {
    return {
      totalMs: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  return {
    totalMs: distance,
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((distance / (1000 * 60)) % 60),
    seconds: Math.floor((distance / 1000) % 60),
  };
}

export function PromoProvider({ children }) {
  const [promo, setPromo] = useState(FALLBACK_PROMO);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const promoRef = doc(db, "promotions", "active-promo");

    const unsubscribe = onSnapshot(
      promoRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setPromo(FALLBACK_PROMO);
          setLoading(false);
          return;
        }

        const data = snapshot.data();
        setPromo({
          ...FALLBACK_PROMO,
          ...data,
          startDate: toDate(data.startDate) || FALLBACK_PROMO.startDate,
          endDate: toDate(data.endDate) || FALLBACK_PROMO.endDate,
          discountPercent:
            Number.isFinite(Number(data.discountPercent)) &&
            Number(data.discountPercent) >= 0
              ? Number(data.discountPercent)
              : FALLBACK_PROMO.discountPercent,
        });
        setLoading(false);
      },
      () => {
        setPromo(FALLBACK_PROMO);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const isActive = useMemo(() => {
    if (!promo?.active) return false;

    const start = toDate(promo.startDate);
    const end = toDate(promo.endDate);

    if (!start || !end) return false;
    return now >= start && now <= end;
  }, [promo, now]);

  const timeLeft = useMemo(() => {
    if (!isActive) return null;
    return getTimeLeft(toDate(promo.endDate), now);
  }, [isActive, promo.endDate, now]);

  const value = useMemo(
    () => ({
      promo,
      isActive,
      loading,
      timeLeft,
      discountPercent: isActive ? Number(promo.discountPercent || 0) : 0,
    }),
    [promo, isActive, loading, timeLeft],
  );

  return (
    <PromoContext.Provider value={value}>{children}</PromoContext.Provider>
  );
}

export function usePromo() {
  const context = useContext(PromoContext);
  if (!context) {
    throw new Error(
      "usePromo mora da se koristi unutar PromoProvider komponente.",
    );
  }
  return context;
}
