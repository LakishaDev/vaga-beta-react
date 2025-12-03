// src/hooks/useLicenseOptimistic.js
// ==============================================================================
// eVaga License Optimistic Updates Hook
// ==============================================================================
//
// @description Custom React hook za optimistic updates licenci
// @author eVaga Team
// @version 1.0
// @lastmodified 2025-12-03
//
// FUNKCIONALNOSTI:
// ✅ Optimistic updates za sve license operacije
// ✅ Automatski rollback pri greškama
// ✅ Real-time sync sa Firestore
// ✅ Lokalno upravljanje state-om
// ✅ Integracija sa SnackbarContext
//
// OPERACIJE SA OPTIMISTIC UPDATES:
// - adminCreateLicense - kreiranje nove licence
// - adminUpdateLicense - ažuriranje licence
// - adminBlockLicense - blokiranje licence
// - adminUnblockLicense - odblokiranje licence
// - adminResetHardware - resetovanje hardware ID-a
// - extendLicense - produženje licence
// - convertTrialToPaid - konverzija trial licence u plaćenu
// ==============================================================================

import { useState, useEffect, useCallback, useContext } from "react";
import { subscribeLicenses } from "../services/licenseService";
import * as licenseService from "../services/licenseService";
import { SnackbarContext } from "../contexts/snackbar/SnackbarContext";

/**
 * Custom hook za optimistic updates licenci
 *
 * @param {Object} filters - Firestore filteri (status, isTrial, etc.)
 * @returns {Object} - { licenses, loading, operations }
 */
export const useLicenseOptimistic = (filters = {}) => {
  const { showSnackbar } = useContext(SnackbarContext);
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [firestoreLicenses, setFirestoreLicenses] = useState([]);

  // ==============================================================================
  // FIRESTORE SUBSCRIPTION - Real-time updates
  // ==============================================================================
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeLicenses((data) => {
      setFirestoreLicenses(data);
      setLicenses(data);
      setLoading(false);
    }, filters);

    return () => unsubscribe();
  }, [filters]);

  // ==============================================================================
  // HELPER FUNCTIONS
  // ==============================================================================

  /**
   * Primeni optimistic update na lokalni state
   */
  const applyOptimisticUpdate = useCallback((updateFn) => {
    setLicenses((prev) => updateFn(prev));
  }, []);

  /**
   * Rollback na poslednje poznato Firestore stanje
   */
  const rollbackToFirestore = useCallback(() => {
    setLicenses(firestoreLicenses);
  }, [firestoreLicenses]);

  /**
   * Wrapper za operacije sa optimistic updates
   */
  const executeWithOptimistic = useCallback(
    async (optimisticUpdateFn, serviceFn, successMessage, errorMessage) => {
      try {
        // 1. Primeni optimistic update
        applyOptimisticUpdate(optimisticUpdateFn);

        // 2. Izvrši cloud function
        await serviceFn();

        // 3. Prikaži success notifikaciju
        if (successMessage) {
          showSnackbar(successMessage, "success");
        }

        return true;
      } catch (error) {
        // 4. Rollback na Firestore state pri greški
        rollbackToFirestore();

        // 5. Prikaži error notifikaciju
        if (errorMessage) {
          showSnackbar(errorMessage, "error");
        }

        console.error("Optimistic update error:", error);
        return false;
      }
    },
    [applyOptimisticUpdate, rollbackToFirestore, showSnackbar]
  );

  // ==============================================================================
  // OPTIMISTIC OPERATIONS
  // ==============================================================================

  /**
   * Kreira novu licencu sa optimistic update
   */
  const createLicense = useCallback(
    async (licenseData) => {
      const tempId = `temp-${Date.now()}`;
      const newLicense = {
        id: tempId,
        ...licenseData,
        createdAt: new Date().toISOString(),
        status: "active",
        currentActivations: 0,
        isBlocked: false,
      };

      return executeWithOptimistic(
        (prev) => [newLicense, ...prev],
        async () => {
          await licenseService.adminCreateLicense(licenseData);
        },
        "Licenca uspešno kreirana!",
        "Greška pri kreiranju licence."
      );
    },
    [executeWithOptimistic]
  );

  /**
   * Ažurira licencu sa optimistic update
   */
  const updateLicense = useCallback(
    async (licenseId, data) => {
      return executeWithOptimistic(
        (prev) =>
          prev.map((license) =>
            license.id === licenseId
              ? { ...license, ...data, updatedAt: new Date().toISOString() }
              : license
          ),
        async () => {
          await licenseService.adminUpdateLicense(licenseId, data);
        },
        "Licenca uspešno ažurirana.",
        "Greška pri ažuriranju licence."
      );
    },
    [executeWithOptimistic]
  );

  /**
   * Blokira licencu sa optimistic update
   */
  const blockLicense = useCallback(
    async (licenseId, reason = "") => {
      return executeWithOptimistic(
        (prev) =>
          prev.map((license) =>
            license.id === licenseId
              ? {
                  ...license,
                  isBlocked: true,
                  status: "blocked",
                  blockedAt: new Date().toISOString(),
                  blockReason: reason,
                }
              : license
          ),
        async () => {
          await licenseService.adminBlockLicense(licenseId, reason);
        },
        "Licenca je blokirana.",
        "Greška pri blokiranju licence."
      );
    },
    [executeWithOptimistic]
  );

  /**
   * Odblokira licencu sa optimistic update
   */
  const unblockLicense = useCallback(
    async (licenseId) => {
      return executeWithOptimistic(
        (prev) =>
          prev.map((license) =>
            license.id === licenseId
              ? {
                  ...license,
                  isBlocked: false,
                  status: "active",
                  blockedAt: null,
                  blockReason: null,
                }
              : license
          ),
        async () => {
          await licenseService.adminUnblockLicense(licenseId);
        },
        "Licenca je odblokirana.",
        "Greška pri odblokiranju licence."
      );
    },
    [executeWithOptimistic]
  );

  /**
   * Resetuje hardware ID sa optimistic update
   */
  const resetHardware = useCallback(
    async (licenseId) => {
      return executeWithOptimistic(
        (prev) =>
          prev.map((license) =>
            license.id === licenseId
              ? {
                  ...license,
                  hardwareId: null,
                  currentActivations: 0,
                  lastActivatedAt: null,
                }
              : license
          ),
        async () => {
          await licenseService.adminResetHardware(licenseId);
        },
        "Hardware ID je resetovan.",
        "Greška pri resetovanju HWID-a."
      );
    },
    [executeWithOptimistic]
  );

  /**
   * Produži licencu sa optimistic update
   */
  const extendLicense = useCallback(
    async (licenseId, days) => {
      return executeWithOptimistic(
        (prev) =>
          prev.map((license) => {
            if (license.id === licenseId) {
              const currentExpiry = license.expiresAt
                ? new Date(license.expiresAt)
                : new Date();
              const newExpiry = new Date(
                currentExpiry.getTime() + days * 24 * 60 * 60 * 1000
              );

              return {
                ...license,
                expiresAt: newExpiry.toISOString(),
                status: "active",
              };
            }
            return license;
          }),
        async () => {
          await licenseService.extendLicense(licenseId, days);
        },
        `Licenca produžena za ${days} dana.`,
        "Greška pri produženju licence."
      );
    },
    [executeWithOptimistic]
  );

  /**
   * Konvertuje trial licencu u plaćenu sa optimistic update
   */
  const convertTrialToPaid = useCallback(
    async (licenseId, orderData) => {
      return executeWithOptimistic(
        (prev) =>
          prev.map((license) =>
            license.id === licenseId
              ? {
                  ...license,
                  isTrial: false,
                  status: "active",
                  convertedAt: new Date().toISOString(),
                  orderId: orderData?.orderId,
                }
              : license
          ),
        async () => {
          await licenseService.convertTrialToPaid(licenseId, orderData);
        },
        "Licenca konvertovana u plaćenu.",
        "Greška pri konverziji licence."
      );
    },
    [executeWithOptimistic]
  );

  // ==============================================================================
  // RETURN API
  // ==============================================================================
  return {
    licenses,
    loading,
    operations: {
      createLicense,
      updateLicense,
      blockLicense,
      unblockLicense,
      resetHardware,
      extendLicense,
      convertTrialToPaid,
    },
  };
};

export default useLicenseOptimistic;
