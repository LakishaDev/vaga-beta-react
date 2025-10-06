import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RecaptchaVerifier, signInWithPhoneNumber, updateProfile } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { Phone, ShieldCheck, Loader2, AlertTriangle } from "lucide-react";

const MODAL_ANIMATION = {
  initial: { scale: 0.92, opacity: 0, y: 48 },
  animate: { scale: 1, opacity: 1, y: 0 },
  exit: { scale: 0.92, opacity: 0, y: 48 },
};

export default function PhoneVerifyModal({ open, onClose, user, onSuccess }) {
  const [step, setStep] = useState("phone"); // phone | code | success
  const [phone, setPhone] = useState(user?.phoneNumber || "");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const recaptchaRef = useRef(null);

  const startRecaptcha = () => {
    if (!recaptchaRef.current) {
      recaptchaRef.current = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: (response) => { /* reCAPTCHA solved */ },
      });
    }
    return recaptchaRef.current;
  };

  const sendCode = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const appVerifier = startRecaptcha();
      const confirmationResult = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmation(confirmationResult);
      setStep("code");
      setMessage({ type: "success", text: "Kod je poslat na broj." });
    } catch (e) {
      setMessage({ type: "error", text: "Neuspešno slanje koda! Proveri broj ili pokušaj ponovo." });
    }
    setLoading(false);
  };

  const verifyCode = async () => {
    setLoading(true);
    setMessage(null);
    try {
      if (!confirmation) throw new Error("Nema potvrde.");
      await confirmation.confirm(code);
      setStep("success");
      setMessage({ type: "success", text: "Uspešno verifikovan broj!" });
      if (onSuccess) onSuccess();
    } catch (e) {
      setMessage({ type: "error", text: "Kod je pogrešan ili je istekao. Probajte ponovo." });
    }
    setLoading(false);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="modal-bg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          {...MODAL_ANIMATION}
          transition={{ type: "spring", damping: 24, stiffness: 380 }}
          className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl relative"
          onClick={e => e.stopPropagation()}
        >
          <button
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            onClick={() => {
              setStep("phone"); setCode(""); setMessage(null); setLoading(false); onClose();
            }}
          >
            &#10005;
          </button>
          
          <h2 className="text-xl font-bold mb-4 flex gap-2 items-center">
            <Phone /> Verifikacija broja telefona
          </h2>

          <div id="recaptcha-container" className="mb-2"></div>

          {step === "phone" && (
            <>
              <label className="block mb-2 font-medium text-gray-800">
                Broj telefona (format +3816xxxxxx)
              </label>
              <input
                type="tel"
                value={phone}
                disabled={loading}
                onChange={e => setPhone(e.target.value)}
                placeholder="+3816xxxxxx"
                className="border-2 rounded-lg px-4 py-3 w-full mb-3"
              />
              <motion.button
                className="w-full bg-bluegreen/90 text-white rounded-lg py-3 font-bold shadow mt-1 hover:bg-bluegreen"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading || !/^(\+3816)[0-9]{6,9}$/.test(phone)}
                onClick={sendCode}
              >
                {loading ? <Loader2 className="animate-spin mr-1" /> : "Pošalji kod"}
              </motion.button>
            </>
          )}

          {step === "code" && (
            <>
              <label className="block mb-2 font-medium text-gray-800">
                Unesi kod iz SMS poruke
              </label>
              <input
                type="text"
                value={code}
                disabled={loading}
                onChange={e => setCode(e.target.value)}
                maxLength={6}
                className="border-2 rounded-lg px-4 py-3 w-full mb-3 font-mono text-lg text-center tracking-widest"
              />
              <motion.button
                className="w-full bg-bluegreen text-white rounded-lg py-3 font-bold shadow mt-1 hover:bg-bluegreen/90"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading || code.length !== 6}
                onClick={verifyCode}
              >
                {loading ? <Loader2 className="animate-spin" /> : "Potvrdi kod"}
              </motion.button>
            </>
          )}

          {step === "success" && (
            <div className="text-center py-6">
              <ShieldCheck size={48} className="mx-auto text-green-500 mb-3 animate-bounce" />
              <div className="text-xl font-bold text-green-700 mb-2">Verifikacija uspešna!</div>
              <div className="text-gray-600">Broj je dodat i verifikovan uz tvoj nalog.</div>
            </div>
          )}

          {message && (
            <div className={`mt-4 p-3 rounded-lg text-base shadow flex items-center gap-2
              ${message.type === "success" ? "bg-green-100 text-green-800" : ""}
              ${message.type === "error" ? "bg-red-100 text-red-800" : ""}
            `}>
              {message.type === "error" && <AlertTriangle className="w-5 h-5" />}
              {message.text}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}