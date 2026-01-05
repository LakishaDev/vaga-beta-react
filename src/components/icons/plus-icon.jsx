// src/components/icons/plus-icon.jsx
// Animated plus icon - itshover style
import { motion } from "framer-motion";
import { forwardRef } from "react";

const PlusIcon = forwardRef((props, ref) => {
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
        d="M5 12h14"
        variants={{
          initial: { scaleX: 1, originX: "center" },
          hover: { scaleX: 1.2, originX: "center" },
        }}
        transition={{ duration: 0.3, type: "spring" }}
      />
      <motion.path
        d="M12 5v14"
        variants={{
          initial: { scaleY: 1, originY: "center" },
          hover: { scaleY: 1.2, originY: "center" },
        }}
        transition={{ duration: 0.3, type: "spring" }}
      />
    </motion.svg>
  );
});

PlusIcon.displayName = "PlusIcon";

export default PlusIcon;
