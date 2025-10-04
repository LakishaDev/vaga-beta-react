import { motion } from "framer-motion";
import ProgressiveImage from "./ProgressiveImage";
export default function Loader() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.67 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.27 }}
      className="w-full flex flex-col items-center justify-center h-[350px] bg-gradient-to-br from-bluegreen/25 via-white/80 to-bone/30 rounded-3xl shadow-2xl"
    >
      {/* 3D animirana bubble + glowing shadow + orbit dots */}
      <motion.div
        initial={{ scale: 0.94, opacity: 0.92 }}
        animate={{
          scale: [0.95, 1.14, 0.95],
          boxShadow: [
            "0 0 0 #67e8f9c6", "0 0 44px #22d3ee44", "0 0 0 #67e8f9c6"
          ],
          rotate: [0, 12, -14, 0]
        }}
        transition={{ duration: 1.9, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        className="relative w-[68px] h-[68px] rounded-full bg-gradient-to-tr from-bluegreen/60 via-white/40 to-blue-100/20 shadow-2xl flex items-center justify-center"
      >
        {/* 3d ikon */}
        <ProgressiveImage src="/3d/fix-3d.png" alt="" className="w-10 h-10 blur-[1.5px]" />
        {/* orbiting dots */}
        {[...Array(6)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-2 h-2 rounded-full bg-bluegreen/80"
            style={{
              top: `${30 + 26 * Math.sin((i * Math.PI) / 3)}px`,
              left: `${30 + 26 * Math.cos((i * Math.PI) / 3)}px`
            }}
            animate={{ scale: [1, 1.18, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, delay: i * 0.18, repeat: Infinity, repeatType: "loop" }}
          />
        ))}
      </motion.div>
      <span className="mt-7 text-bluegreen text-lg font-semibold tracking-wide drop-shadow-xl">Učitavam profil</span>
    </motion.div>
  );
}
