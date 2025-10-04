import { motion } from "framer-motion";
import { useState } from "react";

export default function FloatingLabelInput({
  name,
  value,
  onChange,
  type = "text",
  label,
  required = false,
  className = ""
}) {
  const [focused, setFocused] = useState(false);
  // Provera i za "0" kao falsy ali validnu vrednost za number input
  const isFloating = focused || (!!value || value === 0);

  return (
    <div className={`relative mb-6 w-full ${className}`}>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        required={required}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`
          block w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white/95 backdrop-blur-sm
          focus:border-bluegreen focus:ring-2 focus:ring-bluegreen/20 focus:outline-none
          transition-all duration-200 text-gray-800 font-medium shadow hover:shadow-lg peer
        `}
        placeholder=""  
        autoComplete="off"
      />
      <motion.label
        htmlFor={name}
        className={`
          absolute left-4 pointer-events-none z-10 font-semibold select-none
          transition-all duration-200
          ${isFloating
            ? "top-[-1.25rem] text-xs text-bluegreen px-3 bg-white rounded shadow-md border-bluegreen border"
            : "top-[1.1rem] text-gray-400 text-base"
          }
        `}
        initial={false}
        animate={{
          top: isFloating ? -20 : 17, // px=rem*16; -1.25rem=-20px; 1.1rem=17px;
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
    </div>
  );
};