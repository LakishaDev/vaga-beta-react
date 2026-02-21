import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import NewsletterSignup from "./NewsletterSignup";

const SUBSCRIBED_KEY = "newsletter_subscribed_email";
const DISMISSED_KEY = "newsletter_modal_dismissed_session";
const EXIT_INTENT_KEY = "newsletter_modal_exit_intent_triggered";
const COOLDOWN_UNTIL_KEY = "newsletter_modal_cooldown_until";
const COOLDOWN_MS = 24 * 60 * 60 * 1000;

function shouldNeverShow(pathname) {
  return pathname === "/privacy";
}

function isInCooldown() {
  if (typeof window === "undefined") return false;
  const rawValue = window.localStorage.getItem(COOLDOWN_UNTIL_KEY);
  if (!rawValue) return false;

  const cooldownUntil = Number(rawValue);
  if (!Number.isFinite(cooldownUntil)) {
    window.localStorage.removeItem(COOLDOWN_UNTIL_KEY);
    return false;
  }

  return cooldownUntil > Date.now();
}

function setCooldown() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    COOLDOWN_UNTIL_KEY,
    String(Date.now() + COOLDOWN_MS),
  );
}

export default function NewsletterModal() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isSubscribed = useMemo(() => {
    if (typeof window === "undefined") return false;
    return Boolean(window.localStorage.getItem(SUBSCRIBED_KEY));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isSubscribed) return;
    if (shouldNeverShow(location.pathname)) return;
    if (window.sessionStorage.getItem(DISMISSED_KEY) === "1") return;
    if (isInCooldown()) return;

    const delay = 10000 + Math.floor(Math.random() * 5000);
    const timer = window.setTimeout(() => {
      setIsOpen(true);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [isSubscribed, location.pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isSubscribed) return;
    if (isOpen) return;
    if (shouldNeverShow(location.pathname)) return;
    if (window.sessionStorage.getItem(DISMISSED_KEY) === "1") return;
    if (window.sessionStorage.getItem(EXIT_INTENT_KEY) === "1") return;
    if (isInCooldown()) return;

    const handleMouseOut = (event) => {
      if (event.relatedTarget || event.clientY > 20) return;
      window.sessionStorage.setItem(EXIT_INTENT_KEY, "1");
      setIsOpen(true);
    };

    document.addEventListener("mouseout", handleMouseOut);
    return () => document.removeEventListener("mouseout", handleMouseOut);
  }, [isSubscribed, isOpen, location.pathname]);

  useEffect(() => {
    if (!isOpen || typeof window === "undefined") return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        window.sessionStorage.setItem(DISMISSED_KEY, "1");
        setCooldown();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const closeModal = () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(DISMISSED_KEY, "1");
      setCooldown();
    }
    setIsOpen(false);
  };

  const handleSubscribed = (email) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(SUBSCRIBED_KEY, email);
      window.sessionStorage.setItem(DISMISSED_KEY, "1");
    }
    setIsOpen(false);
  };

  if (isSubscribed || !isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[12000] flex items-center justify-center bg-black/70 px-4 py-6"
      onClick={closeModal}
      role="dialog"
      aria-modal="true"
      aria-label="Newsletter popup"
    >
      <div
        className="relative w-full max-w-2xl rounded-3xl border border-brand-primary/20 bg-white p-5 shadow-2xl sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-neutral-border text-text-secondary transition hover:bg-neutral-100 hover:text-text-primary"
          onClick={closeModal}
          aria-label="Zatvori newsletter modal"
        >
          ✕
        </button>

        <p className="inline-flex rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-primary">
          Limited ponuda
        </p>
        <h2 className="mt-3 font-heading text-2xl font-extrabold text-text-primary sm:text-3xl">
          Budite prvi koji saznaju za popuste i akcije
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary sm:text-base">
          Prijavite se na newsletter i dobijajte info odmah kada pustimo novi
          popust, servisnu akciju ili specijalnu ponudu za opremu.
        </p>

        <div className="mt-5">
          <NewsletterSignup
            title="Prijavite se za VIP ponude"
            description="Bez spam poruka. Samo korisne novosti, akcije i popusti."
            submitLabel="Zelim popuste"
            className="rounded-2xl border border-neutral-border bg-neutral-50 p-4 sm:p-5"
            onSuccessfulSubscribe={handleSubscribed}
          />
        </div>

        <button
          type="button"
          onClick={closeModal}
          className="mt-4 w-full text-sm font-medium text-text-secondary transition hover:text-brand-primary"
        >
          Mozda kasnije
        </button>
      </div>
    </div>
  );
}
