// src/components/icons/x-close-icon.jsx
// Animated X close icon - itshover style
import { motion } from "framer-motion";
import { forwardRef } from "react";

const XCloseIcon = forwardRef((props, ref) => {
  const { className, ...rest } = props;

  return (
    <motion.svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      whileHover="hover"
      initial="initial"
      {...rest}
    >
      <motion.path
        d="M18 6 6 18"
        variants={{
          initial: { rotate: 0 },
          hover: { rotate: 90 },
        }}
        transition={{ duration: 0.3 }}
        style={{ originX: "50%", originY: "50%" }}
      />
      <motion.path
        d="m6 6 12 12"
        variants={{
          initial: { rotate: 0 },
          hover: { rotate: -90 },
        }}
        transition={{ duration: 0.3 }}
        style={{ originX: "50%", originY: "50%" }}
      />
    </motion.svg>
  );
});

XCloseIcon.displayName = "XCloseIcon";

export default XCloseIcon;
