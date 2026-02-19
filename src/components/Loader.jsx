// components/Loader.jsx
// Komponenta za prikaz animiranog loader-a tokom učitavanja podataka
// Koristi framer-motion za animacije
// Prikazuje 3D ikonu sa animiranim tačkicama koje orbitiraju oko nje
// Prikazuje tekst "Učitavam profil" ispod animacije
// Možeš prilagoditi boje, veličinu i tekst po želji
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import ProgressiveImage from "./UI/ProgressiveImage";
export default function Loader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="w-full min-h-[45vh] flex items-center justify-center px-6"
    >
      <motion.div
        initial={{ y: 8, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        transition={{
          duration: 0.3,
          ease: "easeOut",
        }}
        className="relative w-full max-w-sm rounded-3xl border border-border bg-card-bg/90 p-8 backdrop-blur-sm"
      >
        <div className="flex flex-col items-center gap-5">
          <div className="relative h-16 w-16">
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-brand-secondary/30"
              animate={{ scale: [1, 1.18, 1], opacity: [0.35, 0.7, 0.35] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute inset-1 rounded-full border-2 border-brand-secondary"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <ProgressiveImage
                src="/3d/fix-3d.png"
                alt="Vaga Beta"
                className="h-8 w-8 rounded-full"
              />
            </div>
          </div>

          <div className="text-center">
            <p className="text-base font-semibold text-text-primary">
              Učitavanje...
            </p>
            <p className="mt-1 text-sm text-text-secondary">
              Pripremamo sadržaj za vas
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
