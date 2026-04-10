/**
 * R2 Cache Service - Upravljanje Cloudflare R2 storage-om
 * Pruža funkcionalnost za upload, download i caching fajlova
 *
 * ⚠️ OPTIONAL: R2 cache service je opcionalan
 * Ako VITE_R2_WORKER_URL nije dostupan, service će biti disabled
 */

const R2_WORKER_URL = import.meta.env.VITE_R2_WORKER_URL;

const isR2Enabled = !!R2_WORKER_URL;

if (!isR2Enabled) {
  console.warn(
    "⚠️ R2 Cache disabled: VITE_R2_WORKER_URL not set. App will work without R2 caching.",
  );
}

class R2CacheService {
  constructor() {
    this.workerUrl = R2_WORKER_URL;
    this.cacheVersion = "v1";
    this.enabled = isR2Enabled;
  }

  /**
   * Generiši unikatan cache key na osnovu fajla i metapodataka
   */
  generateCacheKey(filename, namespace = "general") {
    if (!this.enabled) return null;
    return `${this.cacheVersion}/${namespace}/${filename}`;
  }

  /**
   * Upload fajl na R2 sa cache metadata-om
   */
  async uploadFile(file, options = {}) {
    if (!this.enabled) {
      console.warn("⚠️ R2 Cache disabled - upload skipped");
      return { success: false, error: "R2 Cache disabled" };
    }
    try {
      const {
        namespace = "general",
        cacheControl = "public, max-age=31536000", // 1 god za statični sadržaj
        filename,
        customMetadata = {},
        onProgress = null,
      } = options;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("namespace", namespace);
      if (filename) {
        formData.append("filename", filename);
      }
      formData.append("cacheControl", cacheControl);
      formData.append(
        "metadata",
        JSON.stringify({
          uploadedAt: new Date().toISOString(),
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          ...customMetadata,
        }),
      );

      const xhr = new XMLHttpRequest();

      return new Promise((resolve, reject) => {
        xhr.addEventListener("load", () => {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });

        xhr.addEventListener("error", () => {
          reject(new Error("Upload failed"));
        });

        xhr.addEventListener("abort", () => {
          reject(new Error("Upload cancelled"));
        });

        if (onProgress) {
          xhr.upload.addEventListener("progress", (e) => {
            if (e.lengthComputable) {
              onProgress(e.loaded / e.total);
            }
          });
        }

        xhr.open("POST", `${this.workerUrl}/upload`);
        xhr.send(formData);
      });
    } catch (error) {
      console.error("R2 upload error:", error);
      throw error;
    }
  }

  /**
   * Batch upload više fajlova jednim request-om
   */
  async uploadBatch(files = [], options = {}) {
    if (!this.enabled) {
      console.warn("⚠️ R2 Cache disabled - batch upload skipped");
      return { success: false, error: "R2 Cache disabled" };
    }

    const {
      namespace = "general",
      slug = "",
      cacheControl = "public, max-age=31536000, immutable",
    } = options;

    const formData = new FormData();
    formData.append("namespace", namespace);
    formData.append("slug", slug);
    formData.append("cacheControl", cacheControl);

    files.forEach((item) => {
      if (!item?.file) return;
      formData.append("files", item.file);
      if (item.filename) {
        formData.append("filenames", item.filename);
      }
    });

    const response = await fetch(`${this.workerUrl}/upload-batch`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Batch upload failed (${response.status})`);
    }

    return response.json();
  }

  /**
   * Preuzmi fajl sa R2 cache-a (REQUIRED - R2 must be configured)
   */
  async getFile(filename, namespace = "general", options = {}) {
    if (!this.enabled) {
      throw new Error(
        "R2 Cache not configured - VITE_R2_WORKER_URL environment variable is required",
      );
    }

    try {
      const { useCache = true, forceRefresh = false } = options;

      const cacheKey = this.generateCacheKey(filename, namespace);

      // Prvo probaj cache
      if (useCache && !forceRefresh) {
        const cached = await this.getCachedFile(filename, namespace);
        if (cached) return cached;
      }

      // Preuzmi sa R2
      const response = await fetch(`${this.workerUrl}/download/${cacheKey}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch ${filename}: ${response.statusText}`);
      }

      const blob = await response.blob();

      // Keširaj lokalno
      if (useCache) {
        await this.setCachedFile(filename, namespace, blob);
      }

      return blob;
    } catch (error) {
      console.error("R2 download error:", error);
      throw error;
    }
  }

  /**
   * Keširaj fajl lokalno (IndexedDB)
   */
  async setCachedFile(filename, namespace, blob) {
    try {
      const db = await this.openIndexedDB();
      const transaction = db.transaction(["r2cache"], "readwrite");
      const store = transaction.objectStore("r2cache");

      await store.put({
        key: this.generateCacheKey(filename, namespace),
        blob,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.warn("Local cache save failed:", error);
    }
  }

  /**
   * Preuzmi fajl iz lokalnog cache-a
   */
  async getCachedFile(filename, namespace) {
    try {
      const db = await this.openIndexedDB();
      const transaction = db.transaction(["r2cache"], "readonly");
      const store = transaction.objectStore("r2cache");
      const key = this.generateCacheKey(filename, namespace);

      return new Promise((resolve) => {
        const request = store.get(key);
        request.onsuccess = () => {
          const result = request.result;
          // Proveri da li je cache star više od 7 dana
          if (
            result &&
            Date.now() - result.timestamp < 7 * 24 * 60 * 60 * 1000
          ) {
            resolve(result.blob);
          } else {
            resolve(null);
          }
        };
        request.onerror = () => resolve(null);
      });
    } catch (error) {
      console.warn("Local cache retrieve failed:", error);
      return null;
    }
  }

  /**
   * Otvori IndexedDB za lokalni cache
   */
  openIndexedDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("VagaBetaR2Cache", 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("r2cache")) {
          db.createObjectStore("r2cache", { keyPath: "key" });
        }
      };
    });
  }

  /**
   * Obriši fajl sa R2
   */
  async deleteFile(filename, namespace = "general") {
    try {
      const cacheKey = this.generateCacheKey(filename, namespace);
      const response = await fetch(`${this.workerUrl}/delete/${cacheKey}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete ${filename}`);
      }

      // Obriši iz lokalnog cache-a
      await this.removeCachedFile(filename, namespace);

      return true;
    } catch (error) {
      console.error("R2 delete error:", error);
      throw error;
    }
  }

  /**
   * Obriši fajl iz lokalnog cache-a
   */
  async removeCachedFile(filename, namespace) {
    try {
      const db = await this.openIndexedDB();
      const transaction = db.transaction(["r2cache"], "readwrite");
      const store = transaction.objectStore("r2cache");
      const key = this.generateCacheKey(filename, namespace);

      return new Promise((resolve) => {
        const request = store.delete(key);
        request.onsuccess = () => resolve(true);
        request.onerror = () => resolve(false);
      });
    } catch (error) {
      console.warn("Local cache delete failed:", error);
    }
  }

  /**
   * Preuzmi URL fajla sa R2 za direktan pristup (REQUIRED - R2 must be configured)
   */
  getFileUrl(filename, namespace = "general") {
    if (!this.enabled) {
      throw new Error(
        "R2 Cache not configured - VITE_R2_WORKER_URL environment variable is required",
      );
    }
    const cacheKey = this.generateCacheKey(filename, namespace);
    return `${this.workerUrl}/download/${cacheKey}`;
  }

  /**
   * Listu fajlova u namespace-u
   */
  async listFiles(namespace = "general") {
    try {
      const response = await fetch(
        `${this.workerUrl}/list?namespace=${namespace}`,
      );

      if (!response.ok) {
        throw new Error("Failed to list files");
      }

      return await response.json();
    } catch (error) {
      console.error("R2 list error:", error);
      throw error;
    }
  }

  /**
   * Očisti stari cache
   */
  async clearOldCache(daysOld = 30) {
    try {
      const db = await this.openIndexedDB();
      const transaction = db.transaction(["r2cache"], "readwrite");
      const store = transaction.objectStore("r2cache");
      const threshold = Date.now() - daysOld * 24 * 60 * 60 * 1000;

      return new Promise((resolve) => {
        const request = store.openCursor();
        let deletedCount = 0;

        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            if (cursor.value.timestamp < threshold) {
              cursor.delete();
              deletedCount++;
            }
            cursor.continue();
          } else {
            resolve(deletedCount);
          }
        };
      });
    } catch (error) {
      console.warn("Cache cleanup failed:", error);
      return 0;
    }
  }
}

export default new R2CacheService();
