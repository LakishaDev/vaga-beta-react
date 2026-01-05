// src/components/icons/search-icon.jsx
// Animated search icon - itshover style
import { motion } from "framer-motion";
import { forwardRef } from "react";

const SearchIcon = forwardRef((props, ref) => {
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
        cx="11"
        cy="11"
        r="8"
        variants={{
          initial: { scale: 1 },
          hover: { scale: 1.1 },
        }}
        transition={{ duration: 0.3, type: "spring" }}
      />
      <motion.path
        d="m21 21-4.3-4.3"
        variants={{
          initial: { x: 0, y: 0 },
          hover: { x: 2, y: 2 },
        }}
        transition={{ duration: 0.3, type: "spring" }}
      />
    </motion.svg>
  );
});

SearchIcon.displayName = "SearchIcon";

export default SearchIcon;
