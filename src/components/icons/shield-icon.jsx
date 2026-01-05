// src/components/icons/shield-icon.jsx
// Animated shield icon - itshover style
import { motion } from "framer-motion";
import { forwardRef } from "react";

const ShieldIcon = forwardRef((props, ref) => {
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
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"
        variants={{
          initial: { scale: 1 },
          hover: { scale: 1.05 },
        }}
        transition={{ duration: 0.3, type: "spring" }}
      />
      <motion.path
        d="m9 12 2 2 4-4"
        variants={{
          initial: { pathLength: 0, opacity: 0 },
          hover: { pathLength: 1, opacity: 1 },
        }}
        transition={{ duration: 0.4, delay: 0.1 }}
      />
    </motion.svg>
  );
});

ShieldIcon.displayName = "ShieldIcon";

export default ShieldIcon;
