import { useState, useContext, useRef } from "react";
import { auth } from "../../utils/firebase.js";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendEmailVerification
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { SnackbarContext } from "../../contexts/shop/SnackbarContext";
import {
  UserRound,
  Lock,
  LogIn,
  Loader2,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import PasswordResetModal from "../../components/shop/PasswordResetModal.jsx";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const navigate = useNavigate();
  const { showSnackbar } = useContext(SnackbarContext);
  const checkInterval = useRef(null);
  const [passwordResetModalOpen, setPasswordResetModalOpen] = useState(false);

  function validate() {
    if (!email.trim() || !pass.trim())
      return "Email i lozinka su obavezni!";
    if (pass.length < 6)
      return "Lozinka mora imati bar 6 karaktera!";
    return "";
  }

  // Registracija i login
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errMsg = validate();
    if (errMsg) return showSnackbar(errMsg, "error");
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, pass);
        showSnackbar("Dobrodošli nazad!", "success");
        navigate("/prodavnica/nalog");
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          pass
        );
        setVerificationSent(false);
        await handleEmailVerification(userCredential.user);
        showSnackbar("Kreiran nalog, potvrdi email!", "info");
      }
    } catch (err) {
      showSnackbar(
        err.code === "auth/wrong-password" ||
          err.code === "auth/user-not-found"
          ? "Pogrešan email ili lozinka."
          : err.message || "Greška.",
        "error"
      );
    }
    setLoading(false);
  };

  // Slanje verifikacionog mejla
  const handleEmailVerification = async (user) => {
    setVerifying(true);
    try {
      // Ako nema usera iz parametra koristi auth.currentUser
      const currentUser = user || auth.currentUser;
      if (!currentUser) {
        showSnackbar("Nalog nije pronađen, osveži stranicu!", "error");
        setVerifying(false);
        return;
      }
      await sendEmailVerification(currentUser);
      setVerificationSent(true);
      showSnackbar("Verifikacioni email poslat. Proveri inbox!", "info");
    } catch (error) {
      showSnackbar(
        "Neuspešno slanje verifikacionog emaila. " + (error?.message || ""),
        "error"
      );
    }
    setVerifying(false);
  };

  // Provera verifikovanosti
  const checkEmailVerified = async () => {
    setVerifying(true);
    try {
      await auth.currentUser.reload();
      if (auth.currentUser.emailVerified) {
        showSnackbar("Email uspešno verifikovan!", "success");
        clearInterval(checkInterval.current);
        navigate("/prodavnica/nalog");
      } else {
        showSnackbar("Email nije još uvek verifikovan.", "info");
      }
    } catch (err) {
      showSnackbar(
        "Greška pri proveri verifikacije. " + (err?.message || ""),
        "error"
      );
    }
    setVerifying(false);
  };

  // Google login
  const googleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      showSnackbar("Google login uspešan!", "success");
      navigate("/prodavnica/nalog");
    } catch (err) {
      showSnackbar(
        "Greška pri Google prijavi: " + (err.message || err.code),
        "error"
      );
    }
    setLoading(false);
  };

  // UI forma
  return (
    <div className="relative py-12 px-3 sm:px-8 flex items-center justify-center min-h-[420px] outline-none">
      {/* Back gradient sparkle/blur */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-8 left-8 w-28 h-28 bg-bluegreen/20 rounded-full blur-2xl"></div>
        <div className="absolute top-20 right-0 w-24 h-24 bg-sheen/30 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-10 w-24 h-24 bg-rust/20 rounded-full blur-2xl"></div>
      </div>
      <div
        className="relative z-10 w-full max-w-xl mx-auto bg-white/80 backdrop-blur rounded-3xl shadow-2xl py-10 px-5 flex flex-col items-center"
        style={{
          boxShadow: "0px 12px 36px 4px #6EAEA244",
          borderImage:
            "linear-gradient(90deg, #91CEC1 0%, #6EAEA2 52%, #CBCFBB 100%) 1",
        }}
      >
        <div className="flex flex-col items-center gap-3 mb-7 animate-in fade-in">
          {isLogin ? (
            <LogIn
              size={54}
              className="text-bluegreen drop-shadow-xl animate-bounce"
            />
          ) : (
            <UserRound
              size={54}
              className="text-sheen drop-shadow-xl animate-pulse"
            />
          )}
          <h2 className="text-3xl sm:text-4xl text-midnight tracking-tight font-extrabold text-center drop-shadow-lg bg-gradient-to-tr from-bluegreen via-sheen to-midnight bg-clip-text text-transparent uppercase">
            {isLogin ? "PRIJAVA" : "REGISTRACIJA"}
          </h2>
        </div>
        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 w-full max-w-md mx-auto animate-fadein"
        >
          <div className="flex items-center gap-2 rounded-2xl border-2 border-bone/60 p-2 bg-bone/25">
            <UserRound size={20} className="text-bluegreen" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email adresa"
              autoComplete="email"
              className="bg-transparent flex-1 border-none outline-none text-midnight font-medium px-2 text-base"
            />
          </div>
          <div className="flex items-center gap-2 rounded-2xl border-2 border-bone/60 p-2 bg-bone/25">
            <Lock size={20} className="text-sheen" />
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Lozinka"
              autoComplete="current-password"
              className="bg-transparent flex-1 border-none outline-none text-midnight font-medium px-2 text-base"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-tr from-bluegreen via-sheen to-midnight text-white font-bold py-2 px-5 rounded-xl flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all hover:shadow-xl uppercase tracking-wide text-lg"
          >
            {isLogin ? <ArrowRight size={22} /> : <CheckCircle2 size={22} />}
            {loading ? (
              <Loader2 size={22} className="animate-spin" />
            ) : isLogin ? (
              "Uloguj se"
            ) : (
              "Registruj se"
            )}
          </button>
          <button
            type="button"
            disabled={loading}
            className="bg-sheen text-white font-bold py-2 px-5 rounded-xl flex items-center gap-2 shadow-lg hover:bg-bluegreen active:scale-95 transition-all text-lg"
            onClick={googleLogin}
          >
            <LogIn size={22} />
            {isLogin ? "Google prijava" : "Google registracija"}
          </button>
        </form>

        {!isLogin && verificationSent && (
          <div className="flex flex-col items-center mt-5 animate-in fade-in-up">
            <CheckCircle2
              size={34}
              className="text-green-700 drop-shadow animate-bounce"
            />
            <p className="text-midnight mt-2 text-lg font-medium">
              Na adresu{" "}
              <span className="font-bold text-bluegreen">{email}</span> poslat
              je verifikacioni email.
            </p>
            <button
              disabled={verifying}
              onClick={() => handleEmailVerification()}
              className="mt-3 px-5 py-2 bg-gradient-to-r from-bluegreen to-sheen text-white rounded-xl font-semibold shadow hover:scale-105 transition-all"
            >
              {verifying ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                "Pošalji ponovo"
              )}
            </button>
            <button
              disabled={verifying}
              onClick={checkEmailVerified}
              className="mt-2 px-5 py-2 border-2 border-bluegreen text-bluegreen rounded-xl font-semibold hover:bg-bluegreen hover:text-white transition-all"
            >
              Proveri verifikaciju
            </button>
          </div>
        )}

        <div className="mt-8 text-center flex flex-col items-center gap-2">
          <span
            className="cursor-pointer text-sheen font-bold hover:underline underline-offset-2 transition"
            onClick={() => {
              setIsLogin((l) => !l);
              showSnackbar(
                isLogin
                  ? "Prebacujete se na registraciju."
                  : "Prebacujete se na prijavu.",
                "info"
              );
            }}
          >
            {isLogin ? "Nemate nalog? " : "Već imate nalog? "}
            <span className="text-midnight font-extrabold underline">
              {isLogin ? "Registrujte se!" : "Prijavite se!"}
            </span>
          </span>
            {isLogin && (
                <button
                  type="button"
                  className="text-sheen font-semibold text-base hover:underline text-left mt-1 ml-1"
                  onClick={() => { setPasswordResetModalOpen(true); }}
                  tabIndex={-1}
                >
                  Zaboravili ste lozinku?
                </button>
              )}
        </div>
      </div>
      {/* Password Reset Modal */}
      <PasswordResetModal
        isOpen={passwordResetModalOpen}
        onClose={() => setPasswordResetModalOpen(false)}
      />
    </div> 
  );
}
