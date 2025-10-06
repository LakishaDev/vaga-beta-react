// components/shop/EmailVerifiedSuccess.jsx
// Komponenta koja prikazuje uspešnu verifikaciju email adrese
// Prikazuje se nakon što korisnik uspešno verifikuje email
// Prikazuje poruku sa email adresom i zahvalom
// props: email (verifikovana email adresa)

// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { ShieldCheck, Sparkle, Mail } from "lucide-react";

// Moderno: animacija, boje, ikone, sparkles efekt
export default function EmailVerifiedSuccess({ email }) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 30 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.95, opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative rounded-3xl bg-gradient-to-tr from-green-100 via-white to-blue-50 shadow-2xl border-bluegreen border-2 p-8 sm:p-10 flex flex-col items-center justify-center gap-4 mb-10 overflow-hidden"
    >
      {/* Sparkle animation layer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1.2, delay: 0.4 }}
        className="absolute inset-0 pointer-events-none"
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 300 80"
          className="w-full h-16"
        >
          <Sparkle x={45} y={20} size={16} color="#08cf6a" />
          <Sparkle x={240} y={38} size={22} color="#0ea5e9" />
          <Sparkle x={150} y={58} size={20} color="#22d3ee" />
        </svg>
      </motion.div>

      <motion.div
        initial={{ scale: 0.8, rotate: -8, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="bg-gradient-to-tr from-green-500 to-bluegreen rounded-full p-5 shadow-xl mb-3 animate-bounce"
      >
        <ShieldCheck size={54} className="text-white drop-shadow-2xl" />
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.32 }}
        className="text-bluegreen text-2xl sm:text-3xl font-extrabold text-center mb-1 flex items-center gap-2"
      >
        <Mail size={28} className="text-bluegreen" />
        Email uspešno verifikovan!
      </motion.h2>
      <p className="text-gray-700 mb-1 text-center text-base sm:text-lg font-medium">
        Vaša email adresa
        <span className="font-bold text-green-700 px-1">{email}</span>
        je aktivirana i nalog je sada potpuno funkcionalan.
      </p>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.45 }}
        className="flex flex-col items-center mt-2"
      >
        <span className="block text-[15px] font-semibold text-green-700 bg-green-50 rounded-xl px-4 py-1 shadow">
          Hvala na potvrdi!
        </span>
        <span className="block mt-2 text-gray-500 text-sm">
          Sada imate pun pristup svim funkcijama prodavnice.
        </span>
      </motion.div>
    </motion.div>
  );
}
