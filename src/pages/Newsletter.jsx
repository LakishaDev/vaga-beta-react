import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import NewsletterSignup from "../components/NewsletterSignup";

const AB_STORAGE_KEY = "newsletter_ab_variant";

const HEADLINE_VARIANTS = {
  A: {
    title: "Budite prvi koji saznaju za akcije i popuste",
    subtitle:
      "Prijavite se i dobijajte proverene informacije o novim popustima, servisnim akcijama i opremi koja vam je stvarno potrebna.",
  },
  B: {
    title: "Ne propustite sledeci popust za vasu opremu",
    subtitle:
      "Newsletter vam salje konkretne ponude, korisne savete i novosti koje mogu odmah da vam smanje troskove.",
  },
};

function resolveVariant(searchParams) {
  const forcedVariant = String(searchParams.get("ab") || "")
    .toUpperCase()
    .trim();

  if (forcedVariant === "A" || forcedVariant === "B") {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(AB_STORAGE_KEY, forcedVariant);
    }
    return forcedVariant;
  }

  if (typeof window !== "undefined") {
    const saved = window.sessionStorage.getItem(AB_STORAGE_KEY);
    if (saved === "A" || saved === "B") return saved;

    const generated = Math.random() < 0.5 ? "A" : "B";
    window.sessionStorage.setItem(AB_STORAGE_KEY, generated);
    return generated;
  }

  return "A";
}

export default function Newsletter() {
  const [searchParams] = useSearchParams();
  const [variant, setVariant] = useState("A");
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    setVariant(resolveVariant(searchParams));

    if (typeof window !== "undefined") {
      setIsSubscribed(
        Boolean(window.localStorage.getItem("newsletter_subscribed_email")),
      );
    }
  }, [searchParams]);

  const heroCopy = useMemo(
    () => HEADLINE_VARIANTS[variant] || HEADLINE_VARIANTS.A,
    [variant],
  );

  const shareLinks = useMemo(
    () => [
      {
        label: "Instagram bio",
        href: "/newsletter?source=instagram-bio",
      },
      {
        label: "WhatsApp broadcast",
        href: "/newsletter?source=whatsapp-broadcast",
      },
      {
        label: "QR servis nalepnica",
        href: "/newsletter?source=qr-servis",
      },
    ],
    [],
  );

  return (
    <main className="w-full bg-neutral-bg px-4 py-10 sm:px-8 sm:py-14 md:px-16">
      <div className="mx-auto max-w-5xl rounded-2xl border border-neutral-border bg-neutral-surface p-6 shadow-xl sm:p-10">
        <section className="rounded-2xl border border-brand-primary/20 bg-brand-primary/5 p-6 sm:p-8">
          <p className="inline-flex rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-primary">
            Newsletter
          </p>
          <h1 className="mt-3 font-heading text-3xl font-extrabold text-text-primary sm:text-4xl">
            {heroCopy.title}
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-text-secondary sm:text-lg">
            {heroCopy.subtitle}
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm text-text-secondary">
            <span className="rounded-full border border-neutral-border bg-neutral-surface px-3 py-1">
              Popusti i akcije
            </span>
            <span className="rounded-full border border-neutral-border bg-neutral-surface px-3 py-1">
              Servisna obavestenja
            </span>
            <span className="rounded-full border border-neutral-border bg-neutral-surface px-3 py-1">
              Novi proizvodi
            </span>
            <span className="rounded-full border border-neutral-border bg-neutral-surface px-3 py-1">
              Odjava u 1 klik
            </span>
          </div>
          <p className="mt-3 text-xs font-medium uppercase tracking-wide text-text-tertiary">
            AB varijanta: {variant}
          </p>
        </section>

        <section className="mt-6">
          <NewsletterSignup
            title="Prijavite se za Vaga Beta newsletter"
            description="Bez spama. Samo korisne novosti, akcije i bitna obavestenja."
            submitLabel="Prijavi se"
            className="rounded-2xl border border-neutral-border bg-white/70 p-5 shadow-sm sm:p-6"
            onSuccessfulSubscribe={() => setIsSubscribed(true)}
          />
        </section>

        {isSubscribed && (
          <section className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:p-6">
            <h2 className="font-heading text-xl font-bold text-emerald-900">
              Vas bonus je spreman
            </h2>
            <p className="mt-2 text-sm text-emerald-800 sm:text-base">
              Preuzmite besplatan mini vodic za izbor odgovarajuce vage i brzu
              procenu troskova odrzavanja.
            </p>
            <a
              href="/dokumentacija/newsletter-vodic-za-izbor-vage.txt"
              className="mt-4 inline-flex items-center rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Preuzmi mini vodic
            </a>
          </section>
        )}

        <section className="mt-5 rounded-2xl border border-neutral-border bg-white/70 p-5 sm:p-6">
          <h2 className="font-heading text-lg font-bold text-text-primary sm:text-xl">
            Kampanjski linkovi sa source oznakom
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Koristi ove linkove za kanale i lako prati konverziju po source.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {shareLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="rounded-xl border border-neutral-border bg-neutral-50 px-3 py-2 text-sm font-medium text-brand-primary transition hover:bg-brand-primary/10"
              >
                {item.label}
              </a>
            ))}
          </div>
        </section>

        <p className="mt-4 text-sm text-text-tertiary">
          Prijavom potvrdujete saglasnost sa{" "}
          <Link to="/privacy" className="text-brand-primary hover:underline">
            Politikom privatnosti
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
