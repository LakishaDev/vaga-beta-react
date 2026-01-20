import React, { useState } from "react";
import { useR2Upload } from "@/hooks/useR2Cache";
import toast from "react-hot-toast";

/**
 * R2CacheUploader - Komponenta za upload fajlova na R2
 */
export function R2CacheUploader({
  namespace = "general",
  accept = "*",
  maxSize = 50 * 1024 * 1024, // 50MB default
  onSuccess = null,
  onError = null,
  className = "",
}) {
  const { progress, uploading, error, uploadedFile, upload } = useR2Upload();
  const [dragActive, setDragActive] = useState(false);

  const handleUpload = async (files) => {
    if (!files.length) return;

    const file = files[0];

    if (file.size > maxSize) {
      const message = `Fajl je prevelik. Maksimalno ${Math.round(maxSize / 1024 / 1024)}MB`;
      toast.error(message);
      onError?.(message);
      return;
    }

    try {
      const result = await upload(file, {
        namespace,
        customMetadata: {
          uploadedAt: new Date().toISOString(),
        },
      });

      toast.success("Fajl je uspešno uploadovan!");
      onSuccess?.(result);
    } catch (err) {
      toast.error(err.message);
      onError?.(err);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleUpload(e.dataTransfer.files);
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        dragActive
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 hover:border-gray-400"
      } ${className}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept={accept}
        onChange={(e) => handleUpload(e.target.files)}
        disabled={uploading}
        className="hidden"
        id="r2-upload-input"
      />

      <label htmlFor="r2-upload-input" className="cursor-pointer">
        {uploading ? (
          <div>
            <div className="mb-2 text-lg font-semibold">Uploadovanje...</div>
            <progress
              value={progress}
              max="100"
              className="w-full h-2 rounded-full"
            />
            <div className="mt-2 text-sm text-gray-600">{progress}%</div>
          </div>
        ) : (
          <div>
            <div className="text-2xl mb-2">📁</div>
            <div className="text-lg font-semibold mb-1">
              Prevuci fajl ili klikni za izbor
            </div>
            <div className="text-sm text-gray-500">
              Maksimalno: {Math.round(maxSize / 1024 / 1024)}MB
            </div>
          </div>
        )}
      </label>

      {uploadedFile && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-left">
          <div className="font-semibold text-green-800">
            Uspešno uploadovan:
          </div>
          <div className="text-sm text-green-700 break-all">
            {uploadedFile.url}
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
          <div className="font-semibold text-red-800">Greška:</div>
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}
    </div>
  );
}

export default R2CacheUploader;
