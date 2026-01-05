// src/components/icons/alert-circle-icon.jsx
// Animated alert circle icon - itshover style
import { motion } from "framer-motion";
import { forwardRef } from "react";

const AlertCircleIcon = forwardRef((props, ref) => {
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
      <motion.circle
        cx="12"
        cy="12"
        r="10"
        variants={{
          initial: { scale: 1 },
          hover: { scale: 1.05 },
        }}
        transition={{ duration: 0.3, type: "spring" }}
      />
      <motion.line
        x1="12"
        x2="12"
        y1="8"
        y2="12"
        variants={{
          initial: { scaleY: 1 },
          hover: { scaleY: 1.2 },
        }}
        transition={{ duration: 0.3 }}
      />
      <motion.line
        x1="12"
        x2="12.01"
        y1="16"
        y2="16"
        variants={{
          initial: { scale: 1 },
          hover: { scale: 1.5 },
        }}
        transition={{ duration: 0.3, delay: 0.1 }}
      />
    </motion.svg>
  );
});

AlertCircleIcon.displayName = "AlertCircleIcon";

export default AlertCircleIcon;
