// src/components/icons/trash-icon.jsx
// Animated trash icon - itshover style
import { motion } from "framer-motion";
import { forwardRef } from "react";

const TrashIcon = forwardRef((props, ref) => {
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
        d="M3 6h18"
        variants={{
          initial: { scaleX: 1 },
          hover: { scaleX: 1.1 },
        }}
        transition={{ duration: 0.3 }}
      />
      <motion.path
        d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"
        variants={{
          initial: { y: 0 },
          hover: { y: 2 },
        }}
        transition={{ duration: 0.3, type: "spring" }}
      />
      <motion.path
        d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"
        variants={{
          initial: { y: 0 },
          hover: { y: -2 },
        }}
        transition={{ duration: 0.3 }}
      />
      <motion.line
        x1="10"
        x2="10"
        y1="11"
        y2="17"
        variants={{
          initial: { scaleY: 1 },
          hover: { scaleY: 0.8 },
        }}
        transition={{ duration: 0.3 }}
      />
      <motion.line
        x1="14"
        x2="14"
        y1="11"
        y2="17"
        variants={{
          initial: { scaleY: 1 },
          hover: { scaleY: 0.8 },
        }}
        transition={{ duration: 0.3, delay: 0.05 }}
      />
    </motion.svg>
  );
});

TrashIcon.displayName = "TrashIcon";

export default TrashIcon;
