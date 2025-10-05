// components/DeleteAccountModal.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, AlertTriangle, X, Shield, Mail } from "lucide-react";
import AnimatedInput from "../AnimatedInput";
import { deleteUserAccount } from "../../utils/userService";
import { useUserData } from "../../hooks/useUserData";
import {  
  sendEmailVerification
} from "firebase/auth";

const DeleteAccountModal = ({ isOpen, onClose, onSuccess }) => {
  const { user, userData } = useUserData();
  const [step, setStep] = useState(1); // 1: Warning, 2: Confirmation, 3: Email Verification (for email users)
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const isGoogleUser = user?.providerData?.some(provider => provider.providerId === 'google.com');
  const requiredText = userData?.username || "POTVRDI";

  const resetModal = () => {
    setStep(1);
    setConfirmText("");
    setLoading(false);
    setError("");
    setEmailSent(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleNextStep = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2 && !isGoogleUser) {
      setStep(3);
    }
  };

  const handleEmailVerification = async () => {
    setLoading(true);
    try {
      await sendEmailVerification(user);
      setEmailSent(true);
      setError("");
    } catch (err) {
      setError("Greška pri slanju email-a: " + err.message);
    }
    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    if (confirmText !== requiredText) {
      setError(`Morate uneti "${requiredText}" da potvrdite brisanje`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      await deleteUserAccount(user.uid);
      onSuccess();
      handleClose();
    } catch (err) {
      setError("Greška pri brisanju naloga: " + err.message);
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
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <Trash2 size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Brisanje naloga</h3>
                    <p className="text-red-100 text-sm">Korak {step} od {isGoogleUser ? 2 : 3}</p>
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
              {/* Step 1: Warning */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertTriangle size={40} className="text-red-500" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">
                      Upozorenje!
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Ova akcija je <strong>nepovratna</strong>. Svi vaši podaci, narudžbine 
                      i informacije će biti trajno obrisani sa naših servera.
                    </p>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <h5 className="font-semibold text-red-800 mb-2">Šta će biti obrisano:</h5>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• Vaš profil i lični podaci</li>
                      <li>• Istorija narudžbina</li>
                      <li>• Sačuvane adrese i postavke</li>
                      <li>• Sve poruke i komunikacija</li>
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleClose}
                      className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      Otkaži
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="flex-1 px-4 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors"
                    >
                      Nastavi
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Confirmation */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield size={32} className="text-orange-500" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">
                      Potvrda brisanja
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Da potvrdite brisanje naloga, ukucajte:
                    </p>
                  </div>

                  <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
                    <code className="text-lg font-bold text-gray-800">
                      {requiredText}
                    </code>
                  </div>

                  <AnimatedInput
                    label="Potvrda"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder={`Ukucajte "${requiredText}"`}
                    error={error}
                    className="w-full"
                  />

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      Nazad
                    </button>
                    <button
                      onClick={isGoogleUser ? handleDeleteAccount : handleNextStep}
                      disabled={confirmText !== requiredText || loading}
                      className="flex-1 px-4 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? "Brišem..." : isGoogleUser ? "Obriši nalog" : "Nastavi"}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Email Verification (for email users) */}
              {step === 3 && !isGoogleUser && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail size={32} className="text-blue-500" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">
                      Email potvrda
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Poslaćemo vam email sa finalno potvrdom za brisanje naloga.
                    </p>
                  </div>

                  {!emailSent ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <p className="text-blue-800 text-sm text-center">
                        Kliknite dugme ispod da pošaljemo email potvrdu na:
                        <br />
                        <strong>{user?.email}</strong>
                      </p>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <p className="text-green-800 text-sm text-center">
                        ✅ Email je poslat! Proverite svoj inbox i kliknite na link za finalno brisanje.
                      </p>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="text-red-800 text-sm text-center">{error}</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      Nazad
                    </button>
                    {!emailSent ? (
                      <button
                        onClick={handleEmailVerification}
                        disabled={loading}
                        className="flex-1 px-4 py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 disabled:bg-gray-300 transition-colors"
                      >
                        {loading ? "Šaljem..." : "Pošalji email"}
                      </button>
                    ) : (
                      <button
                        onClick={handleClose}
                        className="flex-1 px-4 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors"
                      >
                        Završi
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteAccountModal;
