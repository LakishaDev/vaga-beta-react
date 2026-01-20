import { useState, useCallback, useEffect } from "react";
import R2CacheService from "../services/R2CacheService";

/**
 * Hook za upravljanje R2 cache-om
 * Pruža loading, error i data stanja za R2 operacije
 */
export function useR2Cache() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadFile = useCallback(async (file, options = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await R2CacheService.uploadFile(file, options);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getFile = useCallback(
    async (filename, namespace = "general", options = {}) => {
      setLoading(true);
      setError(null);
      try {
        const file = await R2CacheService.getFile(filename, namespace, options);
        setData(file);
        return file;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const deleteFile = useCallback(async (filename, namespace = "general") => {
    setLoading(true);
    setError(null);
    try {
      const result = await R2CacheService.deleteFile(filename, namespace);
      setData(null);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const listFiles = useCallback(async (namespace = "general") => {
    setLoading(true);
    setError(null);
    try {
      const files = await R2CacheService.listFiles(namespace);
      setData(files);
      return files;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    uploadFile,
    getFile,
    deleteFile,
    listFiles,
  };
}

/**
 * Hook za upload fajla sa progress-om
 */
export function useR2Upload() {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  const upload = useCallback(async (file, options = {}) => {
    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const result = await R2CacheService.uploadFile(file, {
        ...options,
        onProgress: (percent) => setProgress(Math.round(percent * 100)),
      });

      setUploadedFile(result);
      setProgress(100);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  return { progress, uploading, error, uploadedFile, upload };
}

/**
 * Hook za lazy loading fajlova sa R2
 */
export function useR2LazyLoad(filename, namespace = "general") {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(
    async (options = {}) => {
      setLoading(true);
      setError(null);
      try {
        const data = await R2CacheService.getFile(filename, namespace, options);
        setFile(data);
        return data;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [filename, namespace],
  );

  return { file, loading, error, load };
}

export default useR2Cache;
