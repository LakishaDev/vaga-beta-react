// components/UI/FloatingLabelTextarea.jsx
// Textarea komponenta sa lebdećom etiketom - isti pattern kao FloatingLabelInput
import { motion } from "framer-motion";
import { useState } from "react";

export default function FloatingLabelTextarea({
  name,
  value,
  onChange,
  label,
  required = false,
  rows = 3,
  maxLength,
  className = "",
}) {
  const [focused, setFocused] = useState(false);
  const isFloating = focused || !!value;

  return (
    <div className={`relative mb-6 w-full ${className}`}>
      <textarea
        id={name}
        name={name}
        value={value}
        required={required}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        rows={rows}
        maxLength={maxLength}
        className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white/95 backdrop-blur-sm
          focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20 focus:outline-none
          transition-all duration-200 text-gray-800 font-medium shadow hover:shadow-lg resize-none"
        placeholder=""
        autoComplete="off"
      />
      <motion.label
        htmlFor={name}
        className={`
          absolute left-4 pointer-events-none z-10 font-semibold select-none
          transition-all duration-200
          ${
            isFloating
              ? "top-[-1.25rem] text-xs text-brand-secondary px-3 bg-white rounded shadow-md border-brand-secondary border"
              : "top-[1.1rem] text-gray-400 text-base"
          }
        `}
        initial={false}
        animate={{
          top: isFloating ? -20 : 17,
          left: isFloating ? 0 : 16,
          backgroundColor: isFloating && focused ? "#fff" : "transparent",
          color: isFloating ? "#14b8a6" : "#a3a3a3",
          boxShadow: isFloating && focused ? "0 2px 10px #22d3ee88" : "none",
          borderWidth: focused ? 1 : 0,
          scale: isFloating ? 0.97 : 1,
        }}
        transition={{ duration: 0.1, ease: "easeInOut" }}
      >
        {label}
      </motion.label>
      {maxLength && (
        <div
          className={`absolute bottom-2 right-3 text-xs pointer-events-none font-medium select-none
            ${(value || "").length >= maxLength ? "text-red-400" : "text-gray-400"}`}
        >
          {(value || "").length}/{maxLength}
        </div>
      )}
    </div>
  );
}
