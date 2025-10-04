import { useState } from "react";

export default function ProgressiveImage({ src, alt = "", className = "", style = {} }) {
  const [loading, setLoading] = useState(true);

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      <img
        src={src}
        alt={alt}
        className={`object-cover w-full h-full transition-all duration-300 
          ${loading ? "blur-md scale-105" : "blur-0 scale-100 shadow-lg"}
         `}
        onLoad={() => setLoading(false)}
        draggable={false}
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-10 h-10 border-[3px] border-bluegreen border-t-transparent rounded-full animate-spin bg-white/20 shadow-xl"></div>
        </div>
      )}
    </div>
  );
}
