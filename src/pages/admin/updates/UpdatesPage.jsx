import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  RefreshCw,
  Globe,
  EyeOff,
  Trash2,
  ChevronDown,
  ChevronUp,
  Tag,
  Clock,
  CheckCircle,
  FileText,
  AlertCircle,
  Settings,
  Save,
} from "lucide-react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { db, functions, auth } from "../../../utils/firebase";
import {
  setVersionPolicy,
  subscribeVersionPolicies,
  subscribePublishedReleases,
} from "../../../services/versionControlService";

// ─── helpers ────────────────────────────────────────────────────────────────

const fmt = (ts) => {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString("sr-RS", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const fmtBytes = (b) => {
  if (!b) return "—";
  if (b >= 1_048_576) return `${(b / 1_048_576).toFixed(1)} MB`;
  if (b >= 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${b} B`;
};

const STATUS_BADGE = {
  published: "bg-emerald-100 text-emerald-700 border-emerald-200",
  draft: "bg-amber-100 text-amber-700 border-amber-200",
};

// ─── ReleaseRow ──────────────────────────────────────────────────────────────

function ReleaseRow({ release, onPublish, onUnpublish, onDelete, loading }) {
  const [expanded, setExpanded] = useState(false);
  const isPublished = release.status === "published";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      {/* Header row */}
      <div className="flex items-center gap-4 px-5 py-4">
        <Tag className="w-4 h-4 text-gray-400 shrink-0" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-semibold text-gray-800 text-sm font-mono">
              v{release.version}
            </span>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${STATUS_BADGE[release.status] ?? "bg-gray-100 text-gray-600"}`}
            >
              {release.status === "published" ? "Objavljena" : "Draft"}
            </span>
            {release.isLatest && (
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold border bg-blue-50 text-blue-600 border-blue-100">
                najnovija
              </span>
            )}
            {release.mandatory && (
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold border bg-rose-50 text-rose-600 border-rose-100">
                obavezna
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Kreirana: {fmt(release.createdAt)}
            </span>
            {release.publishedAt && (
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Objavljena: {fmt(release.publishedAt)}
              </span>
            )}
          </div>
        </div>

        {/* Akcije */}
        <div className="flex items-center gap-2 shrink-0">
          {!isPublished && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPublish(release.version)}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors disabled:opacity-50"
            >
              <Globe className="w-3.5 h-3.5" />
              Objavi
            </motion.button>
          )}
          {isPublished && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onUnpublish(release.version)}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white transition-colors disabled:opacity-50"
            >
              <EyeOff className="w-3.5 h-3.5" />
              Povuci
            </motion.button>
          )}
          {!isPublished && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDelete(release.version)}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-100 hover:bg-red-200 text-red-600 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Obriši
            </motion.button>
          )}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="p-1.5 rounded-xl hover:bg-gray-100 transition-colors text-gray-400"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-100 px-5 py-4 space-y-4">
              {/* Artefakti */}
              <div className="grid sm:grid-cols-2 gap-4">
                {["server", "client"].map((side) => {
                  const art = release.artifacts?.[side];
                  return (
                    <div key={side} className="bg-gray-50 rounded-xl p-4 space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Download className="w-4 h-4 text-brand-secondary" />
                        <span className="font-semibold text-sm text-gray-700 capitalize">
                          {side === "server" ? "Serverska strana" : "Klijentska strana"}
                        </span>
                      </div>
                      <ArtifactRow label="Feed putanja" value={art?.feedPath} mono />
                      <ArtifactRow label="Setup URL" value={art?.setupUrl} mono />
                      <ArtifactRow label="Pun paket" value={fmtBytes(art?.fullSize)} />
                      <ArtifactRow label="Delta paket" value={fmtBytes(art?.deltaSize)} />
                      <ArtifactRow label="SHA-256" value={art?.sha256} mono truncate />
                    </div>
                  );
                })}
              </div>

              {/* Kompatibilnost */}
              <div className="flex gap-6 text-xs text-gray-500">
                <span>
                  Min. serverska verzija:{" "}
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">
                    {release.minServerVersion ?? "—"}
                  </code>
                </span>
                <span>
                  Min. klijentska verzija:{" "}
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">
                    {release.minClientVersion ?? "—"}
                  </code>
                </span>
              </div>

              {/* Changelog */}
              {release.notes && (
                <div>
                  <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    <FileText className="w-3.5 h-3.5" />
                    Changelog
                  </div>
                  <pre className="text-xs text-gray-700 bg-gray-50 rounded-xl p-4 whitespace-pre-wrap font-mono leading-relaxed border border-gray-100">
                    {release.notes}
                  </pre>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ArtifactRow({ label, value, mono, truncate }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2 text-xs">
      <span className="text-gray-400 shrink-0 w-24">{label}:</span>
      <span
        className={`text-gray-700 ${mono ? "font-mono" : ""} ${truncate ? "truncate max-w-[180px]" : "break-all"}`}
        title={value}
      >
        {value}
      </span>
    </div>
  );
}

// ─── UpdatesPage ─────────────────────────────────────────────────────────────

export default function UpdatesPage() {
  const [allowed, setAllowed] = useState(null);
  const [releases, setReleases] = useState([]);
  const [loadingAction, setLoadingAction] = useState(false);
  const [notification, setNotification] = useState(null);

  // Version policy state (po kanalu)
  const [policies, setPolicies] = useState({});
  const [publishedReleases, setPublishedReleases] = useState([]);
  const [policyForm, setPolicyForm] = useState({
    stable: { targetVersion: "", mandatory: false, defaultGraceDays: 0 },
    beta: { targetVersion: "", mandatory: false, defaultGraceDays: 0 },
  });
  const [savingPolicy, setSavingPolicy] = useState({});

  // Auth guard — isti obrazac kao LicensesPage
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      const adminEmails =
        import.meta.env.VITE_ADMIN_EMAILS?.split(",").map((e) => e.trim()) ?? [];
      setAllowed(user && adminEmails.includes(user.email));
    });
    return () => unsub();
  }, []);

  // Realtime listener na releases kolekciju
  useEffect(() => {
    if (!allowed) return;
    const q = query(collection(db, "releases"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setReleases(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [allowed]);

  // Version policies + published releases
  useEffect(() => {
    if (!allowed) return;
    const unsubPolicies = subscribeVersionPolicies((p) => {
      setPolicies(p);
      // Sinhronizuj form sa trenutnim vrednostima
      setPolicyForm((prev) => {
        const next = { ...prev };
        for (const ch of ["stable", "beta"]) {
          if (p[ch]) {
            next[ch] = {
              targetVersion: p[ch].targetVersion ?? "",
              mandatory: p[ch].mandatory ?? false,
              defaultGraceDays: p[ch].defaultGraceDays ?? 0,
            };
          }
        }
        return next;
      });
    });
    const unsubReleases = subscribePublishedReleases(setPublishedReleases);
    return () => {
      unsubPolicies();
      unsubReleases();
    };
  }, [allowed]);

  const notify = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSavePolicy = async (channel) => {
    setSavingPolicy((p) => ({ ...p, [channel]: true }));
    try {
      const form = policyForm[channel];
      await setVersionPolicy(channel, {
        targetVersion: form.targetVersion || null,
        mandatory: form.mandatory,
        defaultGraceDays: Number(form.defaultGraceDays) || 0,
      });
      notify(`Politika za kanal "${channel}" je sačuvana`);
    } catch (err) {
      notify(err.message ?? "Greška pri čuvanju politike", "error");
    } finally {
      setSavingPolicy((p) => ({ ...p, [channel]: false }));
    }
  };

  const callFn = async (name, data) => {
    setLoadingAction(true);
    try {
      const fn = httpsCallable(functions, name);
      await fn(data);
      return true;
    } catch (err) {
      notify(err.message ?? "Greška", "error");
      return false;
    } finally {
      setLoadingAction(false);
    }
  };

  const handlePublish = async (version) => {
    if (!window.confirm(`Objaviti verziju v${version}?`)) return;
    const ok = await callFn("adminPublishRelease", { version });
    if (ok) notify(`v${version} je objavljena`);
  };

  const handleUnpublish = async (version) => {
    if (!window.confirm(`Povući verziju v${version}?`)) return;
    const ok = await callFn("adminUnpublishRelease", { version });
    if (ok) notify(`v${version} je povučena`, "warning");
  };

  const handleDelete = async (version) => {
    if (!window.confirm(`Trajno obrisati draft v${version}?`)) return;
    const ok = await callFn("adminDeleteRelease", { version });
    if (ok) notify(`v${version} obrisana`);
  };

  // ─── Auth pending ──────────────────────────────────────────────────────────
  if (allowed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  // ─── Not admin ────────────────────────────────────────────────────────────
  if (!allowed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <h2 className="text-xl font-bold text-gray-800">Pristup odbijen</h2>
        <p className="text-gray-500 text-sm">
          Nemaš admin pristup ovoj stranici.
        </p>
      </div>
    );
  }

  const publishedCount = releases.filter((r) => r.status === "published").length;
  const draftCount = releases.filter((r) => r.status === "draft").length;

  // ─── Main UI ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Download className="w-6 h-6 text-brand-secondary" />
              Upravljanje ažuriranjima
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Pregled i objava verzija eVaga Desktop softvera
            </p>
          </div>
          <div className="flex gap-3">
            <StatChip label="Objavljene" value={publishedCount} color="emerald" />
            <StatChip label="Draft" value={draftCount} color="amber" />
          </div>
        </div>

        {/* Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className={`rounded-2xl px-5 py-3 text-sm font-medium border ${
                notification.type === "error"
                  ? "bg-red-50 text-red-700 border-red-200"
                  : notification.type === "warning"
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
              }`}
            >
              {notification.msg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Globalna politika verzija */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-5">
            <Settings className="w-4 h-4 text-brand-secondary" />
            Globalna politika verzija
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {["stable", "beta"].map((channel) => {
              const form = policyForm[channel];
              const current = policies[channel];
              return (
                <div key={channel} className="border border-gray-100 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-gray-800 capitalize">{channel}</span>
                    {current?.targetVersion && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 font-mono">
                        aktivan: v{current.targetVersion}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 font-medium">Ciljna verzija</label>
                    <select
                      value={form.targetVersion}
                      onChange={(e) =>
                        setPolicyForm((p) => ({
                          ...p,
                          [channel]: { ...p[channel], targetVersion: e.target.value },
                        }))
                      }
                      className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-secondary bg-white"
                    >
                      <option value="">— Najnoviji (automatski) —</option>
                      {publishedReleases
                        .filter((r) => !r.channel || r.channel === channel)
                        .map((r) => (
                          <option key={r.id} value={r.version}>
                            v{r.version}{r.isLatest ? " (najnoviji)" : ""}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-1 space-y-1">
                      <label className="text-xs text-gray-500 font-medium">Grace period (dana)</label>
                      <input
                        type="number"
                        min={0}
                        value={form.defaultGraceDays}
                        onChange={(e) =>
                          setPolicyForm((p) => ({
                            ...p,
                            [channel]: { ...p[channel], defaultGraceDays: e.target.value },
                          }))
                        }
                        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-secondary"
                      />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer mt-5">
                      <input
                        type="checkbox"
                        checked={form.mandatory}
                        onChange={(e) =>
                          setPolicyForm((p) => ({
                            ...p,
                            [channel]: { ...p[channel], mandatory: e.target.checked },
                          }))
                        }
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700">Obavezna</span>
                    </label>
                  </div>

                  <button
                    onClick={() => handleSavePolicy(channel)}
                    disabled={savingPolicy[channel]}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-brand-secondary text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
                  >
                    <Save className="w-3.5 h-3.5" />
                    {savingPolicy[channel] ? "Čuvanje..." : "Sačuvaj"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Releases lista */}
        {releases.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Tag className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">Nema verzija. CI pipeline će ih kreirati automatski.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {releases.map((r) => (
                <ReleaseRow
                  key={r.id}
                  release={r}
                  onPublish={handlePublish}
                  onUnpublish={handleUnpublish}
                  onDelete={handleDelete}
                  loading={loadingAction}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

function StatChip({ label, value, color }) {
  const colors = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
  };
  return (
    <div className={`px-4 py-2 rounded-2xl border text-center ${colors[color]}`}>
      <div className="text-2xl font-bold leading-none">{value}</div>
      <div className="text-xs mt-1 font-medium">{label}</div>
    </div>
  );
}
