/**
 * Primeri korišćenja R2 Cache-a
 */

// ============================================
// 1. OSNOVNI UPLOAD
// ============================================
import { useR2Cache } from "@/hooks/useR2Cache";

function BasicUploadExample() {
  const { uploadFile, loading, error } = useR2Cache();

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadFile(file, {
        namespace: "images",
        cacheControl: "public, max-age=31536000",
      });
      console.log("Uploaded:", result);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileSelect} disabled={loading} />
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

// ============================================
// 2. UPLOAD SA PROGRESS INDICATOROM
// ============================================
import { useR2Upload } from "@/hooks/useR2Cache";
import { R2CacheUploader } from "@/components/R2CacheUploader";

function UploadWithProgressExample() {
  const handleSuccess = (result) => {
    console.log("File uploaded:", result.url);
  };

  return (
    <div className="max-w-md">
      <R2CacheUploader
        namespace="documents"
        accept=".pdf,.doc,.docx"
        maxSize={10 * 1024 * 1024} // 10MB
        onSuccess={handleSuccess}
      />
    </div>
  );
}

// ============================================
// 3. LAZY LOADING SLIKA
// ============================================
import { R2CacheImage } from "@/components/R2CacheComponents";

function GalleryExample() {
  const images = ["product1.jpg", "product2.jpg", "product3.jpg"];

  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((img) => (
        <R2CacheImage
          key={img}
          filename={img}
          namespace="products"
          alt={img}
          className="w-full h-40 object-cover rounded-lg"
          loading="lazy"
        />
      ))}
    </div>
  );
}

// ============================================
// 4. DIREKTAN LINK ZA DOWNLOAD
// ============================================
import { R2CacheFile } from "@/components/R2CacheComponents";

function DownloadExample() {
  return (
    <div className="space-y-2">
      <R2CacheFile
        filename="manual.pdf"
        namespace="documents"
        displayName="📖 Uputstvo za upotrebu"
      />
      <R2CacheFile
        filename="license.txt"
        namespace="licenses"
        displayName="📜 Licenca"
      />
    </div>
  );
}

// ============================================
// 5. VIDEO STREAMING
// ============================================
import { R2CacheVideoPlayer } from "@/components/R2CacheComponents";

function VideoPlayerExample() {
  return (
    <div className="max-w-2xl">
      <R2CacheVideoPlayer
        filename="tutorial.mp4"
        namespace="videos"
        controls
        autoplay={false}
      />
    </div>
  );
}

// ============================================
// 6. NAPREDNI PRIMER - ADMIN PANEL
// ============================================
import R2CacheService from "@/services/R2CacheService";

function AdminPanelExample() {
  const [files, setFiles] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const fileList = await R2CacheService.listFiles("products");
      setFiles(fileList.files);
    } catch (err) {
      console.error("Failed to load files:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (key) => {
    try {
      await R2CacheService.deleteFile(key.split("/").pop(), "products");
      await loadFiles();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">R2 Files Management</h2>

      {loading ? (
        <p>Učitavanje...</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr>
              <th className="border p-2">Ime fajla</th>
              <th className="border p-2">Veličina</th>
              <th className="border p-2">Datum</th>
              <th className="border p-2">Akcije</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.key}>
                <td className="border p-2">{file.name}</td>
                <td className="border p-2">
                  {(file.size / 1024).toFixed(2)} KB
                </td>
                <td className="border p-2">
                  {new Date(file.uploaded).toLocaleDateString()}
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => handleDelete(file.key)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Obriši
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ============================================
// 7. OPTIMIZOVANI PROIZVODI - CACHE SA FALLBACK
// ============================================
function ProductImageWithFallback({ productId, fallbackUrl }) {
  const [imageSrc, setImageSrc] = React.useState(fallbackUrl);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadProductImage = async () => {
      try {
        const blob = await R2CacheService.getFile(
          `product-${productId}.jpg`,
          "products",
        );
        setImageSrc(URL.createObjectURL(blob));
      } catch (err) {
        // Fallback na originalnu URL ako R2 nije dostupna
        console.warn("Using fallback image:", fallbackUrl);
      } finally {
        setLoading(false);
      }
    };

    loadProductImage();
  }, [productId, fallbackUrl]);

  return (
    <img
      src={imageSrc}
      alt="Product"
      className={`w-full rounded-lg ${loading ? "opacity-50" : ""}`}
    />
  );
}

// ============================================
// 8. INTEGRACIJA U App.jsx
// ============================================
import { R2CacheProvider } from "@/contexts/R2CacheContext";

function AppWithR2Cache() {
  return (
    <R2CacheProvider>
      <div className="app">{/* Tvoja aplikacija */}</div>
    </R2CacheProvider>
  );
}

export {
  BasicUploadExample,
  UploadWithProgressExample,
  GalleryExample,
  DownloadExample,
  VideoPlayerExample,
  AdminPanelExample,
  ProductImageWithFallback,
  AppWithR2Cache,
};
