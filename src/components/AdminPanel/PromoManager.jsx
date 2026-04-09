import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "../../utils/firebase";
import CountdownTimer from "../UI/CountdownTimer";

const DEFAULT_PROMO = {
  active: false,
  type: "sitewide",
  discountPercent: 20,
  startDate: "2026-04-09",
  endDate: "2026-09-19",
  theme: "easter",
  bannerText: "Uskrsnji popust -20% na sve proizvode!",
  bannerSubtext: "Iskoristite priliku dok traje akcija",
  showCountdown: true,
  promoCode: "easter-2026",
};

function formatDateInput(value) {
  if (!value) return "";
  if (typeof value?.toDate === "function") {
    return value.toDate().toISOString().slice(0, 10);
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export default function PromoManager({ showSnackbar }) {
  const [form, setForm] = useState(DEFAULT_PROMO);
  const [saving, setSaving] = useState(false);
  const [statsPeriod, setStatsPeriod] = useState("all");
  const [promoStats, setPromoStats] = useState({
    ordersCount: 0,
    totalRevenue: 0,
    totalSavings: 0,
  });

  const parsedDiscount = Math.max(
    0,
    Math.min(90, Number(form.discountPercent || 0)),
  );
  const startMs = new Date(`${form.startDate}T00:00:00+02:00`).getTime();
  const endMs = new Date(`${form.endDate}T23:59:59+02:00`).getTime();
  const hasInvalidDates =
    Number.isNaN(startMs) || Number.isNaN(endMs) || startMs > endMs;
  const previewTimeLeft = {
    days: 12,
    hours: 8,
    minutes: 41,
    seconds: 19,
  };

  useEffect(() => {
    const promoRef = doc(db, "promotions", "active-promo");
    const unsubscribe = onSnapshot(promoRef, (snapshot) => {
      if (!snapshot.exists()) {
        setForm(DEFAULT_PROMO);
        return;
      }
      const data = snapshot.data();
      setForm({
        ...DEFAULT_PROMO,
        ...data,
        startDate: formatDateInput(data.startDate),
        endDate: formatDateInput(data.endDate),
      });
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const ordersRef = collection(db, "orders");
    const promoOrdersQuery = query(
      ordersRef,
      where("promoApplied", "==", form.promoCode || DEFAULT_PROMO.promoCode),
    );

    const unsubscribe = onSnapshot(promoOrdersQuery, (snapshot) => {
      const now = Date.now();
      const periodMs =
        statsPeriod === "today"
          ? 24 * 60 * 60 * 1000
          : statsPeriod === "7d"
            ? 7 * 24 * 60 * 60 * 1000
            : statsPeriod === "30d"
              ? 30 * 24 * 60 * 60 * 1000
              : null;

      const stats = snapshot.docs.reduce(
        (acc, orderDoc) => {
          const data = orderDoc.data() || {};

          if (periodMs !== null) {
            const createdAtMs =
              typeof data?.createdAt?.toDate === "function"
                ? data.createdAt.toDate().getTime()
                : null;

            if (!createdAtMs || now - createdAtMs > periodMs) {
              return acc;
            }
          }

          acc.ordersCount += 1;
          acc.totalRevenue += Number(data.orderTotal || 0);
          acc.totalSavings += Number(data.promoSavings || 0);
          return acc;
        },
        {
          ordersCount: 0,
          totalRevenue: 0,
          totalSavings: 0,
        },
      );

      setPromoStats(stats);
    });

    return () => unsubscribe();
  }, [form.promoCode, statsPeriod]);

  const onChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (hasInvalidDates) {
      showSnackbar?.(
        "Datum pocetka mora biti pre ili isti kao datum kraja.",
        "error",
      );
      return;
    }

    setSaving(true);

    try {
      await setDoc(
        doc(db, "promotions", "active-promo"),
        {
          ...form,
          discountPercent: parsedDiscount,
          startDate: Timestamp.fromDate(
            new Date(`${form.startDate}T00:00:00+02:00`),
          ),
          endDate: Timestamp.fromDate(
            new Date(`${form.endDate}T23:59:59+02:00`),
          ),
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      showSnackbar?.("Promo podesavanja su sacuvana.", "success");
    } catch {
      showSnackbar?.("Greska pri cuvanju promo podesavanja.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-2xl border border-[#e6d2f2] bg-gradient-to-br from-[#fff9c4] via-[#f5f8ff] to-[#e8d5f5] p-5 shadow-lg">
      <h3 className="mb-4 text-xl font-black text-[#5f3f7a]">Promo Manager</h3>

      <form className="grid gap-3 md:grid-cols-2" onSubmit={handleSave}>
        <label className="flex items-center gap-2 text-sm font-semibold text-[#5f3f7a] md:col-span-2">
          <input
            type="checkbox"
            name="active"
            checked={Boolean(form.active)}
            onChange={onChange}
          />
          Aktivna promocija
        </label>

        <label className="text-sm font-semibold text-[#5f3f7a]">
          Popust (%)
          <input
            type="number"
            min="0"
            max="90"
            name="discountPercent"
            value={form.discountPercent}
            onChange={onChange}
            className="mt-1 w-full rounded-xl border border-[#d9c3ea] bg-white px-3 py-2"
          />
        </label>

        <label className="text-sm font-semibold text-[#5f3f7a]">
          Tema
          <select
            name="theme"
            value={form.theme}
            onChange={onChange}
            className="mt-1 w-full rounded-xl border border-[#d9c3ea] bg-white px-3 py-2"
          >
            <option value="easter">Easter</option>
            <option value="summer">Summer</option>
            <option value="winter">Winter</option>
            <option value="generic">Generic</option>
          </select>
        </label>

        <label className="text-sm font-semibold text-[#5f3f7a]">
          Start datum
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={onChange}
            className="mt-1 w-full rounded-xl border border-[#d9c3ea] bg-white px-3 py-2"
          />
        </label>

        <label className="text-sm font-semibold text-[#5f3f7a]">
          End datum
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={onChange}
            className="mt-1 w-full rounded-xl border border-[#d9c3ea] bg-white px-3 py-2"
          />
        </label>

        <label className="text-sm font-semibold text-[#5f3f7a] md:col-span-2">
          Banner tekst
          <input
            type="text"
            name="bannerText"
            value={form.bannerText}
            onChange={onChange}
            className="mt-1 w-full rounded-xl border border-[#d9c3ea] bg-white px-3 py-2"
          />
        </label>

        <label className="text-sm font-semibold text-[#5f3f7a] md:col-span-2">
          Banner podtekst
          <input
            type="text"
            name="bannerSubtext"
            value={form.bannerSubtext}
            onChange={onChange}
            className="mt-1 w-full rounded-xl border border-[#d9c3ea] bg-white px-3 py-2"
          />
        </label>

        <label className="flex items-center gap-2 text-sm font-semibold text-[#5f3f7a] md:col-span-2">
          <input
            type="checkbox"
            name="showCountdown"
            checked={Boolean(form.showCountdown)}
            onChange={onChange}
          />
          Prikazi countdown
        </label>

        <button
          type="submit"
          disabled={saving || hasInvalidDates}
          className="md:col-span-2 rounded-xl bg-[#6f4d8b] px-4 py-2 font-bold text-white transition hover:bg-[#5f3f7a] disabled:opacity-70"
        >
          {saving ? "Cuvanje..." : "Sacuvaj promo"}
        </button>

        {hasInvalidDates && (
          <p className="md:col-span-2 text-sm font-semibold text-red-600">
            Datum opseg nije validan. Pocetak mora biti pre kraja.
          </p>
        )}

        <div className="md:col-span-2 mt-2 rounded-xl border border-[#d8c4ea] bg-white/80 p-3">
          <h4 className="mb-2 text-sm font-black uppercase tracking-wide text-[#6f4d8b]">
            Live Preview
          </h4>
          <div className="rounded-lg border border-[#e7d4f1] bg-[linear-gradient(120deg,rgba(255,249,196,0.95)_0%,rgba(213,245,227,0.95)_45%,rgba(232,213,245,0.95)_100%)] px-3 py-2">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm sm:text-base">
                <span aria-hidden>🐣</span>
                <span className="font-semibold text-[#624579]">
                  {form.bannerText || DEFAULT_PROMO.bannerText}
                </span>
                <span className="hidden text-[#7f5d9c] sm:inline">
                  {form.bannerSubtext || DEFAULT_PROMO.bannerSubtext}
                </span>
              </div>

              {form.showCountdown && (
                <CountdownTimer timeLeft={previewTimeLeft} />
              )}
            </div>
          </div>
          <p className="mt-2 text-xs text-[#7f5d9c]">
            Trenutni popust: -{parsedDiscount}% | Tema: {form.theme}
          </p>
        </div>

        <div className="md:col-span-2 rounded-xl border border-[#d8c4ea] bg-white/90 p-3">
          <h4 className="mb-2 text-sm font-black uppercase tracking-wide text-[#6f4d8b]">
            Promo Statistika
          </h4>

          <div className="mb-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setStatsPeriod("today")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                statsPeriod === "today"
                  ? "bg-[#6f4d8b] text-white"
                  : "bg-[#f3e9fa] text-[#6f4d8b] hover:bg-[#ead8f7]"
              }`}
            >
              Danas
            </button>
            <button
              type="button"
              onClick={() => setStatsPeriod("7d")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                statsPeriod === "7d"
                  ? "bg-[#6f4d8b] text-white"
                  : "bg-[#f3e9fa] text-[#6f4d8b] hover:bg-[#ead8f7]"
              }`}
            >
              7 dana
            </button>
            <button
              type="button"
              onClick={() => setStatsPeriod("30d")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                statsPeriod === "30d"
                  ? "bg-[#6f4d8b] text-white"
                  : "bg-[#f3e9fa] text-[#6f4d8b] hover:bg-[#ead8f7]"
              }`}
            >
              30 dana
            </button>
            <button
              type="button"
              onClick={() => setStatsPeriod("all")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                statsPeriod === "all"
                  ? "bg-[#6f4d8b] text-white"
                  : "bg-[#f3e9fa] text-[#6f4d8b] hover:bg-[#ead8f7]"
              }`}
            >
              Sve
            </button>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <div className="rounded-lg border border-[#e7d4f1] bg-[#fdf7ff] p-3">
              <p className="text-xs uppercase text-[#8e6aad]">
                Porudzbine sa promo
              </p>
              <p className="mt-1 text-xl font-black text-[#5f3f7a]">
                {promoStats.ordersCount}
              </p>
            </div>
            <div className="rounded-lg border border-[#e7d4f1] bg-[#fdf7ff] p-3">
              <p className="text-xs uppercase text-[#8e6aad]">Ukupna usteda</p>
              <p className="mt-1 text-xl font-black text-[#5f3f7a]">
                {Math.round(promoStats.totalSavings).toLocaleString("sr-RS")}{" "}
                RSD
              </p>
            </div>
            <div className="rounded-lg border border-[#e7d4f1] bg-[#fdf7ff] p-3">
              <p className="text-xs uppercase text-[#8e6aad]">
                Prihod sa promo
              </p>
              <p className="mt-1 text-xl font-black text-[#5f3f7a]">
                {Math.round(promoStats.totalRevenue).toLocaleString("sr-RS")}{" "}
                RSD
              </p>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
