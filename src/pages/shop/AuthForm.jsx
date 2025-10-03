import { useState, useContext } from "react";
import { auth } from "../../utils/firebase.js";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { SnackbarContext } from "../../contexts/shop/SnackbarContext";
import { UserRound, Lock, LogIn, LogOut, Loader2, CheckCircle2, ArrowRight } from "lucide-react";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showSnackbar } = useContext(SnackbarContext);

  function validate() {
    if (!email.trim() || !pass.trim()) return "Email i lozinka su obavezni!";
    if (pass.length < 6) return "Lozinka mora imati bar 6 karaktera!";
    return "";
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errMsg = validate();
    if (errMsg) return showSnackbar(errMsg, "error");
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, pass);
        showSnackbar("Dobrodošli nazad!", "success");
      } else {
        await createUserWithEmailAndPassword(auth, email, pass);
        showSnackbar("Kreiran nalog, dobrodošao/la!", "success");
      }
      navigate("/prodavnica/profile");
    } catch (err) {
      showSnackbar(
        err.code === "auth/wrong-password" || err.code === "auth/user-not-found"
          ? "Pogrešan email ili lozinka."
          : err.message || "Greška.",
        "error"
      );
    }
    setLoading(false);
  };

  const googleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      showSnackbar("Google login uspešan!", "success");
      navigate("/prodavnica/profile");
    } catch (err) {
      showSnackbar("Greška pri Google prijavi: " + (err.message || err.code), "error");
    }
    setLoading(false);
  };

  return (
    <div className="relative py-12 px-3 sm:px-8 flex items-center justify-center min-h-[420px] outline-none">
      {/* Back gradient sparkle/blur */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-8 left-8 w-28 h-28 bg-bluegreen/20 rounded-full blur-2xl"></div>
        <div className="absolute top-20 right-0 w-24 h-24 bg-sheen/30 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-10 w-24 h-24 bg-rust/20 rounded-full blur-2xl"></div>
      </div>
      <div className="relative z-10 w-full max-w-xl mx-auto bg-white/80 backdrop-blur rounded-3xl shadow-2xl py-10 px-5 flex flex-col items-center"
        style={{
          boxShadow: "0px 12px 36px 4px #6EAEA244",
          borderImage: "linear-gradient(90deg, #91CEC1 0%, #6EAEA2 52%, #CBCFBB 100%) 1"
        }}
      >
        <div className="flex flex-col items-center gap-3 mb-7 animate-in fade-in">
          {/* Hero icon */}
          {isLogin
            ? <LogIn size={54} className="text-bluegreen drop-shadow-xl animate-bounce" />
            : <UserRound size={54} className="text-sheen drop-shadow-xl animate-pulse" />}
          <h2 className="text-3xl sm:text-4xl text-midnight tracking-tight font-extrabold text-center drop-shadow-lg bg-gradient-to-tr from-bluegreen via-sheen to-midnight bg-clip-text text-transparent uppercase">
            {isLogin ? "PRIJAVA" : "REGISTRACIJA"}
          </h2>
        </div>
        {/* Form card */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-md mx-auto animate-fadein">
          <div className="flex items-center gap-2 rounded-2xl border-2 border-bone/60 p-2 bg-bone/25">
            <UserRound size={20} className="text-bluegreen" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
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
              onChange={e => setPass(e.target.value)}
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
            ) : (
              isLogin ? "Uloguj se" : "Registruj se"
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
        <div className="mt-8 text-center flex flex-col items-center gap-2">
          <span
            className="cursor-pointer text-sheen font-bold hover:underline underline-offset-2 transition"
            onClick={() => {
              setIsLogin(l => !l);
              showSnackbar(isLogin ? "Prebacujete se na registraciju." : "Prebacujete se na prijavu.", "info");
            }}
          >
            {isLogin
              ? "Nemate nalog? "
              : "Već imate nalog? "}
            <span className="text-midnight font-extrabold underline">{isLogin ? "Registrujte se!" : "Prijavite se!"}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
