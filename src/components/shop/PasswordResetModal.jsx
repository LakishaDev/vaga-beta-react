// components/PasswordResetModal.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KeyRound, Mail, X, CheckCircle } from "lucide-react";
import AnimatedInput from "../UI/AnimatedInput";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../utils/firebase";

const PasswordResetModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleClose = () => {
    setEmail("");
    setLoading(false);
    setSuccess(false);
    setError("");
    onClose();
  };

  const handleSendReset = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError("Unesite email adresu");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (err) {
      switch (err.code) {
        case 'auth/user-not-found':
          setError("Nalog sa ovom email adresom ne postoji");
          break;
        case 'auth/invalid-email':
          setError("Neispravna email adresa");
          break;
        case 'auth/too-many-requests':
          setError("Previše zahteva. Pokušajte ponovo kasnije");
          break;
        default:
          setError("Greška pri slanju email-a: " + err.message);
      }
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-bluegreen px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <KeyRound size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Reset lozinke</h3>
                    <p className="text-blue-100 text-sm">Resetujte vašu lozinku</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6">
              {!success ? (
                <motion.form
                  onSubmit={handleSendReset}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail size={32} className="text-blue-500" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      Zaboravili ste lozinku?
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Unesite vašu email adresu i poslaćemo vam link za reset lozinke.
                    </p>
                  </div>

                  <AnimatedInput
                    label="Email adresa"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vasa@email.com"
                    icon={Mail}
                    error={error}
                    required
                    disabled={loading}
                  />

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      Otkaži
                    </button>
                    <motion.button
                      type="submit"
                      disabled={loading || !email}
                      className="flex-1 px-4 py-3 bg-bluegreen text-white font-semibold rounded-xl hover:bg-bluegreen/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Šaljem...
                        </div>
                      ) : (
                        "Pošalji email"
                      )}
                    </motion.button>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle size={40} className="text-green-500" />
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">
                      Email poslat!
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Proverite svoj inbox na adresi:
                      <br />
                      <strong className="text-bluegreen">{email}</strong>
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-blue-800 text-sm">
                      💡 Ako ne vidite email, proverite spam folder ili pokušajte ponovo.
                    </p>
                  </div>

                  <button
                    onClick={handleClose}
                    className="w-full px-4 py-3 bg-bluegreen text-white font-semibold rounded-xl hover:bg-bluegreen/90 transition-colors"
                  >
                    U redu
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PasswordResetModal;
