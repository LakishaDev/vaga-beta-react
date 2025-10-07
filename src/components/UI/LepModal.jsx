// components/LepModal.jsx

// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";

export default function LepModal({ open, src, text, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="
            fixed inset-0 z-50 flex items-center justify-center p-4
            bg-gradient-to-br from-outerspace/80 via-midnight/30 to-outerspace/90
            backdrop-blur-xl
          "
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <motion.div
            className="
              relative w-full h-full max-w-6xl max-h-8/12 sm:max-h-10/12
              bg-white/10 backdrop-blur-2xl
              border border-white/20 rounded-3xl
              shadow-2xl shadow-black/50 overflow-hidden
              mt-7
            "
            onClick={(e) => e.stopPropagation()}
            initial={{
              scale: 0.8,
              opacity: 0,
              y: 50,
              rotateX: -15,
            }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
              rotateX: 0,
            }}
            exit={{
              scale: 0.9,
              opacity: 0,
              y: 20,
              rotateX: 10,
            }}
            transition={{
              duration: 0.7,
              ease: [0.25, 0.1, 0.25, 1],
              type: "spring",
              stiffness: 100,
              damping: 15,
            }}
          >
            {/* Close Button */}
            <motion.button
              className="
                absolute top-6 right-6 z-30
                bg-white/20 backdrop-blur-md hover:bg-rust/80
                border border-white/30 rounded-full p-3
                text-white transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-white/50
              "
              onClick={onClose}
              aria-label="Close modal"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              whileHover={{
                scale: 1.1,
                rotate: 90,
                backgroundColor: "rgba(239, 68, 68, 0.8)",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{
                duration: 0.3,
                type: "spring",
                stiffness: 200,
              }}
            >
              <IoClose className="w-6 h-6" />
            </motion.button>

            {/* Image Container */}
            <motion.div
              className="w-full h-full flex items-center justify-center p-8"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: "easeOut",
              }}
            >
              <motion.img
                src={src}
                alt={text}
                className="
                  max-w-full max-h-full object-contain
                  rounded-2xl shadow-2xl
                "
                initial={{
                  scale: 0.3,
                  opacity: 0,
                  filter: "blur(20px)",
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  filter: "blur(0px)",
                }}
                exit={{
                  scale: 0.8,
                  opacity: 0,
                  filter: "blur(10px)",
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.3,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                whileHover={{
                  scale: 1.02,
                  transition: { duration: 0.3 },
                }}
              />
            </motion.div>

            {/* Title Overlay */}
            <motion.div
              className="
                absolute bottom-0 left-0 w-full
                bg-gradient-to-t from-black/80 via-black/50 to-transparent
                backdrop-blur-md border-t border-white/20
                py-6 px-8
              "
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.4,
                ease: "easeOut",
              }}
            >
              <motion.h2
                className="text-white text-2xl md:text-3xl lg:text-4xl font-bold text-center"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.6,
                }}
              >
                {text}
              </motion.h2>
              <motion.div
                className="w-24 h-1 bg-gradient-to-r from-bluegreen to-midnight mx-auto mt-3 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                exit={{ scaleX: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.7,
                  ease: "easeInOut",
                }}
              />
            </motion.div>

            {/* Decorative Elements with Staggered Animation */}
            <motion.div
              className="absolute top-8 left-8 w-4 h-4 bg-rust/30 rounded-full"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.8,
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: 2,
              }}
            />
            <motion.div
              className="absolute top-16 left-16 w-2 h-2 bg-bluegreen/70 rounded-full"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                duration: 0.4,
                delay: 1.0,
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: 2.5,
              }}
            />
            <motion.div
              className="absolute bottom-20 right-12 w-3 h-3 bg-bone/40 rounded-full"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                duration: 0.4,
                delay: 1.2,
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: 3,
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
