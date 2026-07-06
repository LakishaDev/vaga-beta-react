// src/components/admin/licensing/ModuleControlPanel.jsx
// ===============================================================================
// MODULE CONTROL PANEL - Kontrola paketa i pojedinačnih modula licence
// ===============================================================================
//
// @description Deljena komponenta (drawer + create modal) za izbor paketa
// (Basic/Pro/Enterprise/Custom) i ručno čekiranje pojedinačnih modula.
// Čist prezentacioni komponent — sav I/O ide kroz onChange.
// ===============================================================================

// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Check } from "lucide-react";
import {
  LICENSE_TYPES,
  LICENSE_MODULE_CATALOG,
  PACKAGE_MODULES,
  getPackageFromModules,
  normalizeModules,
} from "../../../utils/licenseUtils";

const PACKAGE_CHIPS = [
  { value: LICENSE_TYPES.BASIC, label: "Basic" },
  { value: LICENSE_TYPES.PRO, label: "Pro" },
  { value: LICENSE_TYPES.ENTERPRISE, label: "Enterprise" },
  { value: LICENSE_TYPES.CUSTOM, label: "Prilagođeno" },
];

const GROUP_ORDER = ["Merenje", "Ambalaža i lica", "Napredno"];

export default function ModuleControlPanel({
  licenseType,
  modules,
  onChange,
  disabled = false,
  compact = false,
}) {
  const currentModules = normalizeModules(modules);
  const activePackage = licenseType || getPackageFromModules(currentModules);

  const handleSelectPackage = (pkg) => {
    if (disabled) return;
    if (pkg === LICENSE_TYPES.CUSTOM) {
      onChange({ licenseType: LICENSE_TYPES.CUSTOM, modules: currentModules });
      return;
    }
    onChange({ licenseType: pkg, modules: PACKAGE_MODULES[pkg] });
  };

  const handleToggleModule = (key) => {
    if (disabled) return;
    const mod = LICENSE_MODULE_CATALOG.find((m) => m.key === key);
    const childKeys = LICENSE_MODULE_CATALOG.filter(
      (m) => m.parentKey === key,
    ).map((m) => m.key);

    let next;
    if (currentModules.includes(key)) {
      // Isključivanjem roditelja isključuju se i njegovi submoduli
      next = currentModules.filter(
        (m) => m !== key && !childKeys.includes(m),
      );
    } else {
      next = [...currentModules, key];
      // Uključivanjem submodula automatski se uključuje i roditelj
      if (mod?.parentKey && !next.includes(mod.parentKey)) {
        next.push(mod.parentKey);
      }
    }
    onChange({ licenseType: getPackageFromModules(next), modules: next });
  };

  const groups = GROUP_ORDER.map((group) => ({
    group,
    modules: LICENSE_MODULE_CATALOG.filter((m) => m.group === group),
  }));

  return (
    <div className={compact ? "space-y-4" : "space-y-6"}>
      {/* Paket chip selektor */}
      <div className="flex flex-wrap gap-2">
        {PACKAGE_CHIPS.map((chip) => {
          const isSelected = activePackage === chip.value;
          const isCustom = chip.value === LICENSE_TYPES.CUSTOM;
          return (
            <motion.button
              key={chip.value}
              type="button"
              whileHover={disabled ? {} : { scale: 1.03, y: -1 }}
              whileTap={disabled ? {} : { scale: 0.97 }}
              onClick={() => handleSelectPackage(chip.value)}
              disabled={disabled}
              className={`relative px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all min-h-[44px] ${
                isSelected
                  ? "border-admin-primary bg-gradient-to-br from-admin-primary/10 to-admin-accent/5 text-admin-primary"
                  : "border-admin-border/60 bg-white text-admin-text hover:border-admin-primary/40"
              } ${isCustom ? "border-dashed" : ""} ${
                disabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {chip.label}
            </motion.button>
          );
        })}
      </div>

      {/* Moduli grupisani */}
      <div className="space-y-5">
        {groups.map(({ group, modules: groupModules }) => (
          <div key={group}>
            <h5 className="text-xs font-bold uppercase tracking-wide text-admin-text-muted mb-2 pb-1 border-b border-admin-border/40">
              {group}
            </h5>
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
              {groupModules.map((mod) => {
                const ModIcon = Icons[mod.icon] || Icons.Box;
                const isSelected = currentModules.includes(mod.key);
                const isSubmodule = !!mod.parentKey;
                const parentActive =
                  !isSubmodule || currentModules.includes(mod.parentKey);
                const isDisabled = disabled || !parentActive;
                return (
                  <motion.button
                    key={mod.key}
                    type="button"
                    whileHover={isDisabled ? {} : { scale: 1.01 }}
                    whileTap={isDisabled ? {} : { scale: 0.98 }}
                    onClick={() => handleToggleModule(mod.key)}
                    disabled={isDisabled}
                    title={
                      isSubmodule && !parentActive
                        ? "Zahteva Upravljanje licima"
                        : undefined
                    }
                    className={`relative flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all min-h-[44px] ${
                      isSubmodule ? "ml-6 xs:ml-8" : ""
                    } ${
                      isSelected
                        ? "border-admin-primary bg-admin-surface-tint"
                        : "border-admin-border/60 bg-white hover:border-admin-primary/40"
                    } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {isSubmodule && (
                      <Icons.CornerDownRight
                        size={14}
                        className="absolute -left-5 top-4 text-admin-text-muted flex-shrink-0"
                      />
                    )}
                    <div className="p-1.5 rounded-lg bg-admin-surface-tint text-admin-primary flex-shrink-0">
                      <ModIcon size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-sm text-admin-text">
                          {mod.label}
                        </span>
                        {mod.enterpriseOnly && (
                          <span className="px-1.5 py-0.5 rounded-full bg-admin-primary/10 text-admin-primary text-[10px] font-bold">
                            Enterprise
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-admin-text-muted mt-0.5">
                        {mod.description}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 p-1 rounded-full bg-admin-primary text-white flex-shrink-0">
                        <Check size={12} />
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
