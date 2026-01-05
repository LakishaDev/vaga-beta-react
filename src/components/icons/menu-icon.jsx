// src/components/icons/menu-icon.jsx
// Animated menu icon - itshover style
import { motion } from "framer-motion";
import { forwardRef } from "react";

const MenuIcon = forwardRef((props, ref) => {
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
      <motion.line
        x1="4"
        x2="20"
        y1="12"
        y2="12"
        variants={{
          initial: { scaleX: 1 },
          hover: { scaleX: 0.8 },
        }}
        transition={{ duration: 0.3 }}
      />
      <motion.line
        x1="4"
        x2="20"
        y1="6"
        y2="6"
        variants={{
          initial: { x: 0 },
          hover: { x: -4 },
        }}
        transition={{ duration: 0.3 }}
      />
      <motion.line
        x1="4"
        x2="20"
        y1="18"
        y2="18"
        variants={{
          initial: { x: 0 },
          hover: { x: 4 },
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.svg>
  );
});

MenuIcon.displayName = "MenuIcon";

export default MenuIcon;
