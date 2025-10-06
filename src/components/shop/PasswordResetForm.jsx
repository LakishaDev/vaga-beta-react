// components/PasswordResetForm.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { KeyRound, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useNavigate, useSearchParams } from "react-router-dom";
import AnimatedInput from "../UI/AnimatedInput";

const PasswordResetForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [oobCode, setOobCode] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const passwordStrength = {
    hasLength: newPassword.length >= 8,
    hasUpper: /[A-Z]/.test(newPassword),
    hasLower: /[a-z]/.test(newPassword),
    hasNumber: /\d/.test(newPassword),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
  };

  const isStrongPassword = Object.values(passwordStrength).every(Boolean);
  const passwordsMatch = newPassword === confirmPassword;

  useEffect(() => {
    const code = searchParams.get('oobCode');
    const mode = searchParams.get("mode");
    // Ako nije resetPassword - samo ignoriši
    if (mode !== "resetPassword" || !code) {
      setError("Neispravan ili nedostaje kod za reset lozinke");
      setVerifying(false);
      return;
    }

    setOobCode(code);
    verifyCode(code);
  }, [searchParams]);

  const verifyCode = async (code) => {
    try {
      const email = await verifyPasswordResetCode(auth, code);
      setEmail(email);
      setVerifying(false);
    } catch (err) {
      setError("Kod je istekao ili nije valjan");
      setVerifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isStrongPassword) {
      setError("Lozinka ne ispunjava sve uslove");
      return;
    }

    if (!passwordsMatch) {
      setError("Lozinke se ne poklapaju");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setSuccess(true);
      setTimeout(() => {
        navigate('/prodavnica/prijava');
      }, 3000);
    } catch (err) {
      setError("Greška pri resetovanju lozinke: " + err.message);
    }
    setLoading(false);
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-bluegreen/10 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-8 text-center"
        >
          <div className="w-16 h-16 border-4 border-bluegreen border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800">Verifikujem kod...</h3>
        </motion.div>
      </div>
    );
  }

  if (error && !oobCode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md"
        >
          <AlertCircle size={64} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Greška</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/prodavnica/prijava')}
            className="px-6 py-3 bg-bluegreen text-white font-semibold rounded-xl hover:bg-bluegreen/90 transition-colors"
          >
            Nazad na prijavu
          </button>
        </motion.div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md"
        >
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Uspešno!</h3>
          <p className="text-gray-600 mb-6">
            Lozinka je uspešno resetovana. Preusmeriću vas na stranicu za prijavu...
          </p>
          <div className="w-8 h-8 border-2 border-bluegreen border-t-transparent rounded-full animate-spin mx-auto" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-bluegreen/10 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-bluegreen/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <KeyRound size={40} className="text-bluegreen" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Nova lozinka
          </h2>
          <p className="text-gray-600 text-sm">
            Kreiranje nove lozinke za: <strong>{email}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password */}
          <AnimatedInput
            label="Nova lozinka"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Unesite novu lozinku"
            icon={KeyRound}
            required
          />

          {/* Password Strength Indicator */}
          {newPassword && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-2"
            >
              <p className="text-sm font-medium text-gray-700">Jačina lozinke:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries({
                  "Najmanje 8 karaktera": passwordStrength.hasLength,
                  "Veliko slovo": passwordStrength.hasUpper,
                  "Malo slovo": passwordStrength.hasLower,
                  "Broj": passwordStrength.hasNumber,
                  "Specijalni karakter": passwordStrength.hasSpecial
                }).map(([label, met]) => (
                  <div key={label} className={`flex items-center gap-1 ${met ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-2 h-2 rounded-full ${met ? 'bg-green-500' : 'bg-gray-300'}`} />
                    {label}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Confirm Password */}
          <AnimatedInput
            label="Potvrdi lozinku"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Ponovo unesite lozinku"
            icon={KeyRound}
            error={confirmPassword && !passwordsMatch ? "Lozinke se ne poklapaju" : ""}
            success={confirmPassword && passwordsMatch ? "Lozinke se poklapaju" : ""}
            required
          />

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-2"
            >
              <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={loading || !isStrongPassword || !passwordsMatch}
            className="w-full px-4 py-4 bg-bluegreen text-white font-bold rounded-xl shadow-lg hover:shadow-xl disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Resetujem lozinku...
              </div>
            ) : (
              "Resetuj lozinku"
            )}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/prodavnica/prijava')}
            className="text-bluegreen text-sm font-medium hover:underline"
          >
            ← Nazad na prijavu
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PasswordResetForm;
