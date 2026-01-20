import React, { createContext, useContext, useCallback } from "react";
import R2CacheService from "@/services/R2CacheService";

/**
 * Context za R2 Cache
 */
const R2CacheContext = createContext();

export function R2CacheProvider({ children }) {
  const uploadFile = useCallback(
    (file, options) => R2CacheService.uploadFile(file, options),
    [],
  );

  const getFile = useCallback(
    (filename, namespace, options) =>
      R2CacheService.getFile(filename, namespace, options),
    [],
  );

  const deleteFile = useCallback(
    (filename, namespace) => R2CacheService.deleteFile(filename, namespace),
    [],
  );

  const getFileUrl = useCallback(
    (filename, namespace) => R2CacheService.getFileUrl(filename, namespace),
    [],
  );

  const listFiles = useCallback(
    (namespace) => R2CacheService.listFiles(namespace),
    [],
  );

  const clearOldCache = useCallback(
    (daysOld) => R2CacheService.clearOldCache(daysOld),
    [],
  );

  const value = {
    uploadFile,
    getFile,
    deleteFile,
    getFileUrl,
    listFiles,
    clearOldCache,
  };

  return (
    <R2CacheContext.Provider value={value}>{children}</R2CacheContext.Provider>
  );
}

/**
 * Hook za korišćenje R2 Cache konteksta
 */
export function useR2CacheContext() {
  const context = useContext(R2CacheContext);

  if (!context) {
    throw new Error(
      "useR2CacheContext mora biti korišćen unutar R2CacheProvider",
    );
  }

  return context;
}

export default R2CacheProvider;
