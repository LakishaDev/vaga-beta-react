// src/components/icons/mail-icon.jsx
// Animated mail icon - itshover style
import { motion } from "framer-motion";
import { forwardRef } from "react";

const MailIcon = forwardRef((props, ref) => {
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
        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
        variants={{
          initial: { pathLength: 1 },
          hover: { pathLength: 1 },
        }}
        transition={{ duration: 0.3 }}
      />
      <motion.polyline
        points="22,6 12,13 2,6"
        variants={{
          initial: { pathLength: 1 },
          hover: { pathLength: 1, y: -1 },
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.svg>
  );
});

MailIcon.displayName = "MailIcon";

export default MailIcon;
