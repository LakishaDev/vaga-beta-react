// src/components/icons/package-icon.jsx
// Animated package icon - itshover style
import { motion } from "framer-motion";
import { forwardRef } from "react";

const PackageIcon = forwardRef((props, ref) => {
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
        d="m7.5 4.27 9 5.15"
        variants={{
          initial: { pathLength: 1 },
          hover: { pathLength: 1 },
        }}
        transition={{ duration: 0.3 }}
      />
      <motion.path
        d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"
        variants={{
          initial: { scale: 1 },
          hover: { scale: 1.05, rotateY: 5 },
        }}
        transition={{ duration: 0.3, type: "spring" }}
      />
      <motion.path
        d="m3.3 7 8.7 5 8.7-5"
        variants={{
          initial: { pathLength: 1 },
          hover: { pathLength: 1 },
        }}
        transition={{ duration: 0.3 }}
      />
      <motion.path
        d="M12 22V12"
        variants={{
          initial: { scaleY: 1, originY: "top" },
          hover: { scaleY: 1.1, originY: "top" },
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.svg>
  );
});

PackageIcon.displayName = "PackageIcon";

export default PackageIcon;
