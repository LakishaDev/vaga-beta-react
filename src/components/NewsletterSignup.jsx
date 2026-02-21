import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useNewsletterSignup } from "../hooks/useNewsletterSignup";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);
}

export default function NewsletterSignup({
  title = "Newsletter prijava",
  description = "Primajte novosti o uslugama, akcijama i novim proizvodima.",
  submitLabel = "Prijavi se",
  className = "rounded-2xl border border-neutral-border bg-white/70 p-4 sm:p-5 shadow-sm",
  onSuccessfulSubscribe,
}) {
  const [searchParams] = useSearchParams();
  const source = searchParams.get("source") || "";

  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [fieldError, setFieldError] = useState("");

  const {
    isSubmitting,
    successMessage,
    errorMessage,
    submitNewsletter,
    resetMessages,
  } = useNewsletterSignup();

  const handleSubmit = async (event) => {
    event.preventDefault();
    resetMessages();
    setFieldError("");

    if (!isValidEmail(email)) {
      setFieldError("Unesite ispravnu email adresu.");
      return;
    }

    if (!consent) {
      setFieldError("Morate potvrditi saglasnost.");
      return;
    }

    const result = await submitNewsletter({
      email,
      consent,
      source,
      honeypot,
    });

    if (result?.ok) {
      onSuccessfulSubscribe?.(email.trim().toLowerCase());
    }
  };

  return (
    <section className={className}>
      <h3 className="font-heading text-base font-bold text-text-primary">
        {title}
      </h3>
      <p className="mt-1 text-sm text-text-secondary">{description}</p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-text-primary">
            Email
          </span>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="vas@email.com"
            className="w-full rounded-xl border border-neutral-border bg-white px-3 py-2 text-sm text-text-primary outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
            disabled={isSubmitting}
            required
          />
        </label>

        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
          className="hidden"
          aria-hidden="true"
        />

        <label className="flex items-start gap-2 text-sm text-text-secondary">
          <input
            type="checkbox"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-neutral-border text-brand-primary focus:ring-brand-primary/30"
            disabled={isSubmitting}
            required
          />
          <span>
            Slazem se da primam obavestenja i prihvatam{" "}
            <Link to="/privacy" className="text-brand-primary hover:underline">
              Politiku privatnosti
            </Link>
          </span>
        </label>

        {(fieldError || errorMessage) && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {fieldError || errorMessage}
          </p>
        )}

        {successMessage && (
          <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
            {successMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white" />
          )}
          {isSubmitting ? "Sending..." : submitLabel}
        </button>
      </form>
    </section>
  );
}
