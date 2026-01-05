// src/components/icons/user-icon.jsx
// Animated user icon - itshover style
import { motion } from "framer-motion";
import { forwardRef } from "react";

const UserIcon = forwardRef((props, ref) => {
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
        d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
        variants={{
          initial: { pathLength: 1 },
          hover: { pathLength: 1 },
        }}
        transition={{ duration: 0.3 }}
      />
      <motion.circle
        cx="12"
        cy="7"
        r="4"
        variants={{
          initial: { scale: 1 },
          hover: { scale: 1.1 },
        }}
        transition={{ duration: 0.3, type: "spring" }}
      />
    </motion.svg>
  );
});

UserIcon.displayName = "UserIcon";

export default UserIcon;
