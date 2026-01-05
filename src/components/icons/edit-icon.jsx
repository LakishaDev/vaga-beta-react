// src/components/icons/edit-icon.jsx
// Animated edit icon - itshover style
import { motion } from "framer-motion";
import { forwardRef } from "react";

const EditIcon = forwardRef((props, ref) => {
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
        d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"
        variants={{
          initial: { x: 0, y: 0 },
          hover: { x: 2, y: -2 },
        }}
        transition={{ duration: 0.3, type: "spring" }}
      />
      <motion.path
        d="m15 5 4 4"
        variants={{
          initial: { pathLength: 1 },
          hover: { pathLength: 1.2 },
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.svg>
  );
});

EditIcon.displayName = "EditIcon";

export default EditIcon;
