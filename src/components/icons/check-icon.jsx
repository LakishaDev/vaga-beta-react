// src/components/icons/check-icon.jsx
// Animated check icon - itshover style
import { motion } from "framer-motion";
import { forwardRef } from "react";

const CheckIcon = forwardRef((props, ref) => {
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
        d="M20 6 9 17l-5-5"
        variants={{
          initial: { pathLength: 1 },
          hover: { pathLength: 1, scale: 1.1 },
        }}
        transition={{ duration: 0.3, type: "spring" }}
      />
    </motion.svg>
  );
});

CheckIcon.displayName = "CheckIcon";

export default CheckIcon;
