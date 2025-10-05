// components/AnimatedInput.jsx
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";

const AnimatedInput = ({ 
  label, 
  value, 
  onChange, 
  type = "text", 
  placeholder,
  error,
  success,
  required = false,
  disabled = false,
  className = "",
  icon: Icon,
  ...props 
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef(null);
  
  const hasValue = value && value.length > 0;
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;
  
  const handleLabelClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Floating Label */}
      <motion.label
        onClick={handleLabelClick}
        className={`absolute transition-all duration-300 cursor-text select-none z-10
          ${focused || hasValue
            ? 'top-[-1px] text-xs px-2 font-semibold z-20 left-3'
            : 'top-1/2 -translate-y-1/2 text-base left-11'
          }
          ${error 
            ? 'text-red-500' 
            : success 
              ? 'text-green-500' 
              : focused 
                ? 'text-bluegreen' 
                : 'text-gray-400'
          }`}
        animate={{
          y: focused || hasValue ? -20 : 0,
          scale: focused || hasValue ? 0.85 : 1,
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        style={{
          background: focused || hasValue ? "#fff" : "transparent",
          borderRadius: focused || hasValue ? "4px" : "0"
        }}
      >
        {label} {required && <span className="text-red-400">*</span>}
      </motion.label>

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
            <Icon 
              size={20} 
              className={`transition-colors duration-200 ${
                error 
                  ? 'text-red-400' 
                  : success 
                    ? 'text-green-400' 
                    : focused 
                      ? 'text-bluegreen' 
                      : 'text-gray-400'
              }`} 
            />
          </div>
        )}

        {/* Input Field */}
        <motion.input
          ref={inputRef}
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          className={`w-full px-4 py-4 border-2 rounded-xl bg-white/90 backdrop-blur-sm
            focus:outline-none transition-all duration-200 text-gray-800 font-medium
            shadow-sm hover:shadow-md disabled:bg-gray-50 disabled:cursor-not-allowed
            ${Icon ? 'pl-12' : 'pl-4'}
            ${isPassword ? 'pr-12' : 'pr-4'}
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
              : success
                ? 'border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200'
                : 'border-gray-200 focus:border-bluegreen focus:ring-2 focus:ring-bluegreen/20'
            }`}
          placeholder={focused ? placeholder : ""}
          {...props}
        />

        {/* Password Toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg
              hover:bg-gray-100 transition-colors duration-200"
            tabIndex={-1}
          >
            <motion.div
              initial={false}
              animate={{ rotate: showPassword ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {showPassword ? (
                <EyeOff size={20} className="text-gray-400" />
              ) : (
                <Eye size={20} className="text-gray-400" />
              )}
            </motion.div>
          </button>
        )}

        {/* Status Icon */}
        {(error || success) && !isPassword && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {error ? (
              <AlertCircle size={20} className="text-red-400" />
            ) : (
              <CheckCircle size={20} className="text-green-400" />
            )}
          </div>
        )}
      </div>

      {/* Error/Success Message */}
      <AnimatePresence mode="wait">
        {(error || success) && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
            className={`mt-2 text-sm font-medium flex items-center gap-2 ${
              error ? 'text-red-500' : 'text-green-500'
            }`}
          >
            {error ? (
              <AlertCircle size={16} />
            ) : (
              <CheckCircle size={16} />
            )}
            {error || success}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Focus Animation */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        initial={false}
        animate={{
          boxShadow: focused 
            ? error
              ? "0 0 0 3px rgba(239, 68, 68, 0.1)"
              : success 
                ? "0 0 0 3px rgba(34, 197, 94, 0.1)"
                : "0 0 0 3px rgba(34, 211, 238, 0.1)"
            : "0 0 0 0px transparent"
        }}
        transition={{ duration: 0.2 }}
      />
    </div>
  );
};

export default AnimatedInput;
