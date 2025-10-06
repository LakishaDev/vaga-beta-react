// src/pages/shop/AuthForm.jsx
// Forma za prijavu i registraciju korisnika
// Podržava prijavu/registraciju putem emaila i lozinke, Google naloga, i broja telefona
// Koristi Firebase Authentication za upravljanje autentifikacijom
// Prikazuje različite UI elemente u zavisnosti od stanja (prijava, registracija, verifikacija emaila, telefon)
// Koristi useState, useContext i useRef iz React biblioteke
// Uvozi potrebne funkcije iz Firebase Authentication i koristi SnackbarContext za prikaz poruka
// Eksportuj AuthForm komponentu
// Možeš prilagoditi izgled i funkcionalnost po želji
// Koristi lucide-react za ikone
// Uključuje modal za resetovanje lozinke
// Validacija emaila i lozinke je osnovna, možeš je proširiti po potrebi

import { useState, useContext, useRef } from "react";
import { auth } from "../../utils/firebase.js";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { SnackbarContext } from "../../contexts/snackbar/SnackbarContext";
import {
  UserRound,
  Lock,
  LogIn,
  Loader2,
  CheckCircle2,
  ArrowRight,
  Phone,
  MessageSquare,
} from "lucide-react";
import PasswordResetModal from "../../components/shop/PasswordResetModal.jsx";

export default function AuthForm() {
  // EMAIL STATES
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // POZIVANJE MODA
  const [isLogin, setIsLogin] = useState(true);

  // ZAJEDNIČKI
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showSnackbar } = useContext(SnackbarContext);
  const checkInterval = useRef(null);
  const [passwordResetModalOpen, setPasswordResetModalOpen] = useState(false);

  // PHONE STATES
  const [authTab, setAuthTab] = useState("email"); // email | phone
  const [phone, setPhone] = useState("");
  const [phoneStep, setPhoneStep] = useState("input"); // input | code | success
  const [phoneCode, setPhoneCode] = useState("");
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [phoneMessage, setPhoneMessage] = useState(null);
  const [phoneConfirmation, setPhoneConfirmation] = useState(null);
  const phoneRecaptcha = useRef(null);

  // VALIDACIJA EMAILA
  function validate() {
    if (!email.trim() || !pass.trim()) return "Email i lozinka su obavezni!";
    if (pass.length < 6) return "Lozinka mora imati bar 6 karaktera!";
    return "";
  }

  // REGISTRACIJA I LOGIN (EMAIL)
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
        err.code === "auth/wrong-password" || err.code === "auth/user-not-found"
          ? "Pogrešan email ili lozinka."
          : err.message || "Greška.",
        "error"
      );
    }
    setLoading(false);
  };

  // SLANJE VERIFIKACIONOG EMAILA
  const handleEmailVerification = async (user) => {
    setVerifying(true);
    try {
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

  // PROVERA EMAILA
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

  // GOOGLE
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

  // -- TELEFON VALIDACIJA I KORACI
  function initPhoneRecaptcha() {
    if (!phoneRecaptcha.current) {
      phoneRecaptcha.current = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => {},
        }
      );
    }
    return phoneRecaptcha.current;
  }

  async function sendPhoneCode() {
    setPhoneLoading(true);
    setPhoneMessage(null);
    try {
      const appVerifier = initPhoneRecaptcha();
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setPhoneConfirmation(result);
      setPhoneStep("code");
      setPhoneMessage({ type: "success", text: "Kod je poslat na broj." });
    } catch (e) {
      setPhoneMessage({
        type: "error",
        text: e.message || "Neuspešno slanje koda.",
      });
    }
    setPhoneLoading(false);
  }

  async function verifyPhoneCode() {
    setPhoneLoading(true);
    setPhoneMessage(null);
    try {
      if (!phoneConfirmation) throw new Error("Potvrda nije pronađena.");
      await phoneConfirmation.confirm(phoneCode);
      setPhoneStep("success");
      setPhoneMessage({
        type: "success",
        text: "Prijava brojem telefona uspešna!",
      });
      navigate("/prodavnica/nalog");
    } catch {
      setPhoneMessage({
        type: "error",
        text: "Kod je pogrešan ili istekao. Probaj ponovo.",
      });
    }
    setPhoneLoading(false);
  }

  // ----- UI -----
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
        {/* SELECT AUTH TAB */}
        <div className="w-full flex gap-3 mb-7 px-2">
          <button
            onClick={() => setAuthTab("email")}
            className={`w-full py-2 rounded-xl font-semibold transition ${
              authTab === "email"
                ? "bg-bluegreen text-white shadow"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Email
          </button>
          <button
            onClick={() => setAuthTab("phone")}
            className={`w-full py-2 rounded-xl font-semibold transition ${
              authTab === "phone"
                ? "bg-bluegreen text-white shadow"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Telefon
          </button>
        </div>

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
          <h2 className="text-3xl sm:text-4xl text-midnight tracking-tight font-extrabold text-center drop-shadow-lg bg-gradient-to-tr from-bluegreen via-sheen to-midnight bg-clip-text uppercase">
            {isLogin ? "PRIJAVA" : "REGISTRACIJA"}
          </h2>
        </div>

        {/* === FORM CARDS === */}
        {authTab === "email" && (
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
        )}

        {authTab === "phone" && (
          <div className="flex flex-col gap-6 w-full max-w-md mx-auto animate-fadein">
            <div id="recaptcha-container" className="mb-0" />

            {/* BROJ TELEFONA */}
            {phoneStep === "input" && (
              <>
                <div className="flex items-center gap-2 rounded-2xl border-2 border-bone/60 p-2 bg-bone/25">
                  <Phone size={20} className="text-bluegreen" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+3816xxxxxxx"
                    disabled={phoneLoading}
                    className="bg-transparent flex-1 border-none outline-none text-midnight font-medium px-2 text-base"
                  />
                </div>
                <button
                  onClick={sendPhoneCode}
                  disabled={phoneLoading || !/^(\+3816)[0-9]{6,9}$/.test(phone)}
                  className="bg-bluegreen text-white w-full rounded-xl py-3 font-bold shadow hover:brightness-110 transition"
                >
                  {phoneLoading ? (
                    <Loader2 className="animate-spin mx-auto" />
                  ) : (
                    "Pošalji kod"
                  )}
                </button>
              </>
            )}

            {/* KOD */}
            {phoneStep === "code" && (
              <>
                <div className="flex items-center gap-2 rounded-2xl border-2 border-bone/60 p-2 bg-bone/25">
                  <MessageSquare size={20} className="text-bluegreen" />
                  <input
                    type="text"
                    value={phoneCode}
                    onChange={(e) => setPhoneCode(e.target.value)}
                    placeholder="Kod iz SMS"
                    maxLength={6}
                    disabled={phoneLoading}
                    className="bg-transparent flex-1 border-none outline-none text-midnight font-medium px-2 text-base"
                  />
                </div>
                <button
                  onClick={verifyPhoneCode}
                  disabled={phoneLoading || phoneCode.length !== 6}
                  className="bg-bluegreen text-white w-full rounded-xl py-3 font-bold shadow hover:brightness-110 transition"
                >
                  {phoneLoading ? (
                    <Loader2 className="animate-spin mx-auto" />
                  ) : (
                    "Potvrdi kod"
                  )}
                </button>
              </>
            )}

            {/* USPEH */}
            {phoneStep === "success" && (
              <div className="text-center text-green-700 font-semibold py-7">
                <CheckCircle2 className="mx-auto mb-2" size={36} />
                Prijava brojem telefona uspešna!
              </div>
            )}

            {/* Poruka */}
            {phoneMessage && (
              <div
                className={`mt-0 p-2 rounded-lg text-base text-center shadow ${
                  phoneMessage.type === "success"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {phoneMessage.text}
              </div>
            )}
          </div>
        )}

        {!isLogin && authTab === "email" && verificationSent && (
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
              setVerificationSent(false);
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
          {isLogin && authTab === "email" && (
            <button
              type="button"
              className="text-sheen font-semibold text-base hover:underline text-left mt-1 ml-1"
              onClick={() => {
                setPasswordResetModalOpen(true);
              }}
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
