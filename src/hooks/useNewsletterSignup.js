import { useCallback, useState } from "react";

const DEFAULT_SUCCESS_MESSAGE = "Hvala! Proverite email za potvrdu prijave.";
const DEFAULT_ERROR_MESSAGE =
  "Doslo je do greske. Pokusajte ponovo za nekoliko minuta.";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);
}

export function useNewsletterSignup() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const resetMessages = useCallback(() => {
    setSuccessMessage("");
    setErrorMessage("");
  }, []);

  const submitNewsletter = useCallback(
    async ({ email, consent, source, honeypot }) => {
      resetMessages();

      const normalizedEmail = String(email || "")
        .trim()
        .toLowerCase();
      const normalizedHoneypot = String(honeypot || "").trim();
      const normalizedSource = String(source || "").trim();

      if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
        const message = "Unesite ispravnu email adresu.";
        setErrorMessage(message);
        return { ok: false, message };
      }

      if (!consent) {
        const message = "Morate potvrditi saglasnost za prijavu.";
        setErrorMessage(message);
        return { ok: false, message };
      }

      if (normalizedHoneypot) {
        setSuccessMessage(DEFAULT_SUCCESS_MESSAGE);
        return { ok: true, message: DEFAULT_SUCCESS_MESSAGE };
      }

      setIsSubmitting(true);

      try {
        const response = await fetch("/api/newsletter/subscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: normalizedEmail,
            consent: true,
            source: normalizedSource || undefined,
            honeypot: "",
          }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok || data?.ok === false) {
          const message = data?.message || DEFAULT_ERROR_MESSAGE;
          setErrorMessage(message);
          return { ok: false, message };
        }

        const message = data?.message || DEFAULT_SUCCESS_MESSAGE;
        if (typeof window !== "undefined") {
          window.localStorage.setItem(
            "newsletter_subscribed_email",
            normalizedEmail,
          );
          window.localStorage.setItem(
            "newsletter_subscribed_at",
            new Date().toISOString(),
          );
        }
        setSuccessMessage(message);
        return { ok: true, message };
      } catch {
        setErrorMessage(DEFAULT_ERROR_MESSAGE);
        return { ok: false, message: DEFAULT_ERROR_MESSAGE };
      } finally {
        setIsSubmitting(false);
      }
    },
    [resetMessages],
  );

  return {
    isSubmitting,
    successMessage,
    errorMessage,
    submitNewsletter,
    resetMessages,
  };
}
