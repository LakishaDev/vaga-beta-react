// src/components/icons/filter-icon.jsx
// Animated filter icon - itshover style
import { motion } from "framer-motion";
import { forwardRef } from "react";

const FilterIcon = forwardRef((props, ref) => {
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
      <motion.polygon
        points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"
        variants={{
          initial: { scale: 1 },
          hover: { scale: 1.05, y: -2 },
        }}
        transition={{ duration: 0.3, type: "spring" }}
      />
    </motion.svg>
  );
});

FilterIcon.displayName = "FilterIcon";

export default FilterIcon;
