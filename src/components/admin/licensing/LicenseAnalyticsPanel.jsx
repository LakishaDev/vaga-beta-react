// src/components/admin/licensing/LicenseAnalyticsPanel.jsx
// ===============================================================================
// LICENSE ANALYTICS PANEL - Dashboard sa statistikama licenci
// ===============================================================================
//
// @description Prikaz statistika i analitike licenci sa glassmorphism dizajnom
// @author eVaga Team
// @version 1.1 - UI/UX Polish
// @lastmodified 2025-12-01
//
// FUNKCIONALNOSTI:
// ✅ Glassmorphism kartice sa ukupnim brojevima
// ✅ Aktivne/blokirane/istekle licence
// ✅ Trial vs Paid odnos
// ✅ Prosečan broj aktivacija
// ✅ Last seen statistike
// ✅ Filter po vremenskom periodu (7/30/90 dana)
// ✅ Animirani progress bars
// ===============================================================================

import { useState, useEffect, useCallback } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  Key,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Activity,
  Monitor,
  TrendingUp,
  Calendar,
  Sparkles,
  BarChart3,
} from "lucide-react";
import { getLicenses } from "../../../services/licenseService";

/**
 * Pojedinačna kartica statistike sa glassmorphism efektom
 */
const StatCard = ({
  title,
  value,
  icon: IconComp,
  color = "bluegreen",
  subtitle,
  delay = 0,
}) => {
  const colorClasses = {
    bluegreen: {
      gradient: "from-bluegreen/20 via-sheen/10 to-bluegreen/5",
      iconBg: "from-bluegreen to-sheen",
      text: "text-bluegreen",
      border: "border-bluegreen/20",
      glow: "shadow-bluegreen/10",
    },
    green: {
      gradient: "from-green-100/80 via-emerald-50/60 to-green-50/40",
      iconBg: "from-green-500 to-emerald-500",
      text: "text-green-700",
      border: "border-green-200/50",
      glow: "shadow-green-100",
    },
    red: {
      gradient: "from-red-100/80 via-rose-50/60 to-red-50/40",
      iconBg: "from-red-500 to-rose-500",
      text: "text-red-700",
      border: "border-red-200/50",
      glow: "shadow-red-100",
    },
    amber: {
      gradient: "from-amber-100/80 via-orange-50/60 to-amber-50/40",
      iconBg: "from-amber-500 to-orange-500",
      text: "text-amber-700",
      border: "border-amber-200/50",
      glow: "shadow-amber-100",
    },
    purple: {
      gradient: "from-purple-100/80 via-violet-50/60 to-purple-50/40",
      iconBg: "from-purple-500 to-violet-500",
      text: "text-purple-700",
      border: "border-purple-200/50",
      glow: "shadow-purple-100",
    },
    gray: {
      gradient: "from-gray-100/80 via-slate-50/60 to-gray-50/40",
      iconBg: "from-gray-500 to-slate-500",
      text: "text-gray-700",
      border: "border-gray-200/50",
      glow: "shadow-gray-100",
    },
  };

  const style = colorClasses[color] || colorClasses.bluegreen;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`relative overflow-hidden bg-gradient-to-br ${style.gradient} backdrop-blur-xl rounded-2xl p-5 border ${style.border} shadow-lg ${style.glow} hover:shadow-xl transition-all duration-300`}
    >
      {/* Decorative circles */}
      <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-white/20 blur-2xl" />
      <div className="absolute -left-2 -bottom-2 w-16 h-16 rounded-full bg-white/10 blur-xl" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div
            className={`p-2.5 rounded-xl bg-gradient-to-br ${style.iconBg} shadow-lg`}
          >
            <IconComp size={20} className="text-white" />
          </div>
        </div>
        <motion.div
          className={`text-3xl font-black mb-1 ${style.text}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.2 }}
        >
          {value}
        </motion.div>
        <div className={`text-sm font-semibold ${style.text} opacity-80`}>
          {title}
        </div>
        {subtitle && (
          <div className="text-xs opacity-60 mt-1 text-gray-600">
            {subtitle}
          </div>
        )}
      </div>
    </motion.div>
  );
};

/**
 * Animirana progress bar komponenta
 */
const ProgressBar = ({ label, value, max, color = "bluegreen", delay = 0 }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  const colorClasses = {
    bluegreen: "from-bluegreen to-sheen",
    green: "from-green-500 to-emerald-500",
    amber: "from-amber-500 to-orange-500",
    red: "from-red-500 to-rose-500",
    purple: "from-purple-500 to-violet-500",
  };

  return (
    <motion.div
      className="mb-4 last:mb-0"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
    >
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-600 font-medium">{label}</span>
        <span className="font-bold text-charcoal">{value}</span>
      </div>
      <div className="h-2.5 bg-gray-200/80 rounded-full overflow-hidden shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, delay: delay + 0.2, ease: "easeOut" }}
          className={`h-full bg-gradient-to-r ${colorClasses[color]} rounded-full shadow-sm`}
        />
      </div>
    </motion.div>
  );
};

export default function LicenseAnalyticsPanel() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState(30);

  const loadStats = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getLicenses(timeFilter);
      setStats(data);
    } catch (err) {
      console.error("Greška pri učitavanju statistika:", err);
    } finally {
      setLoading(false);
    }
  }, [timeFilter]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  if (loading || !stats) {
    return (
      <div className="flex flex-col justify-center items-center py-12">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-bluegreen/30 rounded-full" />
          <div className="w-12 h-12 border-4 border-bluegreen border-t-transparent rounded-full animate-spin absolute inset-0" />
        </div>
        <p className="mt-4 text-gray-500 font-medium">
          Učitavanje statistika...
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header with time filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-bluegreen to-sheen shadow-lg">
            <BarChart3 size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-charcoal">
              Statistika licenci
            </h3>
            <p className="text-sm text-gray-500">Pregled ključnih metrika</p>
          </div>
        </div>
        <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
          {[7, 30, 90].map((days) => (
            <motion.button
              key={days}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTimeFilter(days)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                timeFilter === days
                  ? "bg-gradient-to-r from-bluegreen to-sheen text-white shadow-md"
                  : "text-gray-600 hover:bg-white hover:shadow-sm"
              }`}
            >
              {days} dana
            </motion.button>
          ))}
        </div>
      </div>

      {/* Main stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Ukupno licenci"
          value={stats.totalLicenses}
          icon={Key}
          color="bluegreen"
          delay={0}
        />
        <StatCard
          title="Aktivne licence"
          value={stats.activeLicenses}
          icon={CheckCircle}
          color="green"
          subtitle={`${(
            (stats.activeLicenses / stats.totalLicenses) * 100 || 0
          ).toFixed(0)}% od ukupno`}
          delay={0.1}
        />
        <StatCard
          title="Blokirane"
          value={stats.blockedLicenses}
          icon={XCircle}
          color="red"
          delay={0.2}
        />
        <StatCard
          title="Istekle"
          value={stats.expiredLicenses}
          icon={Clock}
          color="gray"
          delay={0.3}
        />
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Trial licence"
          value={stats.trialLicenses}
          icon={Users}
          color="amber"
          delay={0.4}
        />
        <StatCard
          title="Plaćene licence"
          value={stats.paidLicenses}
          icon={TrendingUp}
          color="purple"
          delay={0.5}
        />
        <StatCard
          title="Ukupno aktivacija"
          value={stats.totalActivations}
          icon={Monitor}
          color="bluegreen"
          delay={0.6}
        />
        <StatCard
          title={`Aktivno (${timeFilter}d)`}
          value={stats.recentlyActive}
          icon={Calendar}
          color="green"
          subtitle="Last seen u periodu"
          delay={0.7}
        />
      </div>

      {/* Detailed stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* License ratios */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-100/80"
        >
          {/* Decorative element */}
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-gradient-to-br from-bluegreen/10 to-sheen/5 blur-2xl" />

          <div className="relative z-10">
            <h4 className="text-sm font-bold text-charcoal mb-5 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-bluegreen/20 to-sheen/10">
                <TrendingUp size={16} className="text-bluegreen" />
              </div>
              Odnos licenci
            </h4>
            <ProgressBar
              label="Aktivne"
              value={stats.activeLicenses}
              max={stats.totalLicenses}
              color="green"
              delay={0.5}
            />
            <ProgressBar
              label="Trial"
              value={stats.trialLicenses}
              max={stats.totalLicenses}
              color="amber"
              delay={0.6}
            />
            <ProgressBar
              label="Plaćene"
              value={stats.paidLicenses}
              max={stats.totalLicenses}
              color="purple"
              delay={0.7}
            />
            <ProgressBar
              label="Blokirane"
              value={stats.blockedLicenses}
              max={stats.totalLicenses}
              color="red"
              delay={0.8}
            />
          </div>
        </motion.div>

        {/* Key metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-100/80"
        >
          {/* Decorative element */}
          <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-gradient-to-br from-sheen/10 to-bluegreen/5 blur-2xl" />

          <div className="relative z-10">
            <h4 className="text-sm font-bold text-charcoal mb-5 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-bluegreen/20 to-sheen/10">
                <Activity size={16} className="text-bluegreen" />
              </div>
              Ključne metrike
            </h4>

            <div className="space-y-3">
              <motion.div
                className="flex items-center justify-between p-3.5 bg-gradient-to-r from-gray-50/80 to-white rounded-xl border border-gray-100/50"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <span className="text-sm text-gray-600 font-medium">
                  Prosečno aktivacija
                </span>
                <span className="font-bold text-charcoal bg-bluegreen/10 px-3 py-1 rounded-lg">
                  {stats.avgActivationsPerLicense} po licenci
                </span>
              </motion.div>

              <motion.div
                className="flex items-center justify-between p-3.5 bg-gradient-to-r from-gray-50/80 to-white rounded-xl border border-gray-100/50"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <span className="text-sm text-gray-600 font-medium">
                  Trial/Paid odnos
                </span>
                <span className="font-bold text-charcoal bg-amber-100/50 px-3 py-1 rounded-lg">
                  {stats.trialToPaidRatio} : 1
                </span>
              </motion.div>

              <motion.div
                className="flex items-center justify-between p-3.5 bg-gradient-to-r from-gray-50/80 to-white rounded-xl border border-gray-100/50"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <span className="text-sm text-gray-600 font-medium">
                  Stopa aktivnosti ({timeFilter}d)
                </span>
                <span className="font-bold text-charcoal bg-green-100/50 px-3 py-1 rounded-lg">
                  {(
                    (stats.recentlyActive / stats.totalLicenses) * 100 || 0
                  ).toFixed(1)}
                  %
                </span>
              </motion.div>

              <motion.div
                className="flex items-center justify-between p-4 bg-gradient-to-r from-bluegreen/10 via-sheen/5 to-bluegreen/10 rounded-xl border border-bluegreen/20"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-bluegreen" />
                  <span className="text-sm text-bluegreen font-semibold">
                    Konverzija trial → paid
                  </span>
                </div>
                <span className="font-black text-bluegreen text-lg">
                  {stats.paidLicenses > 0
                    ? (
                        (stats.paidLicenses /
                          (stats.trialLicenses + stats.paidLicenses)) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
