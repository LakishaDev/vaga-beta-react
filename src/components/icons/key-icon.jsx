// src/components/icons/key-icon.jsx
// Animated key icon - itshover style
import { motion } from "framer-motion";
import { forwardRef } from "react";

const KeyIcon = forwardRef((props, ref) => {
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
        cx="7.5"
        cy="15.5"
        r="5.5"
        variants={{
          initial: { scale: 1 },
          hover: { scale: 1.1, rotate: 10 },
        }}
        transition={{ duration: 0.3, type: "spring" }}
      />
      <motion.path
        d="m21 2-9.6 9.6"
        variants={{
          initial: { pathLength: 1 },
          hover: { pathLength: 1.1 },
        }}
        transition={{ duration: 0.3 }}
      />
      <motion.path
        d="m15.5 7.5 3 3L22 7l-3-3"
        variants={{
          initial: { x: 0, y: 0 },
          hover: { x: 2, y: -2 },
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.svg>
  );
});

KeyIcon.displayName = "KeyIcon";

export default KeyIcon;
