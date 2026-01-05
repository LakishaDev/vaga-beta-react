// src/components/icons/users-icon.jsx
// Animated users icon - itshover style
import { motion } from "framer-motion";
import { forwardRef } from "react";

const UsersIcon = forwardRef((props, ref) => {
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
        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
        variants={{
          initial: { x: 0 },
          hover: { x: -2 },
        }}
        transition={{ duration: 0.3 }}
      />
      <motion.circle
        cx="9"
        cy="7"
        r="4"
        variants={{
          initial: { scale: 1 },
          hover: { scale: 1.1 },
        }}
        transition={{ duration: 0.3, type: "spring" }}
      />
      <motion.path
        d="M22 21v-2a4 4 0 0 0-3-3.87"
        variants={{
          initial: { x: 0, opacity: 0.7 },
          hover: { x: 2, opacity: 1 },
        }}
        transition={{ duration: 0.3 }}
      />
      <motion.path
        d="M16 3.13a4 4 0 0 1 0 7.75"
        variants={{
          initial: { scale: 1, opacity: 0.7 },
          hover: { scale: 1.05, opacity: 1 },
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.svg>
  );
});

UsersIcon.displayName = "UsersIcon";

export default UsersIcon;
