// src/components/AuthForm.jsx
import { useState } from "react";
import { auth } from "../../utils/firebase.js";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      await signInWithEmailAndPassword(auth, email, pass);
    } else {
      await createUserWithEmailAndPassword(auth, email, pass);
    }
  };

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  return (
    <div className="rounded-lg p-8 shadow bg-white max-w-md mx-auto mt-10">
      <h2 className="text-2xl mb-4 font-bold">{isLogin ? "Prijava" : "Registracija"}</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="border p-2 rounded" />
        <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Lozinka" className="border p-2 rounded" />
        <button type="submit" className="bg-bluegreen text-white font-semibold py-2 px-4 rounded">
          {isLogin ? "Uloguj se" : "Registruj se"}
        </button>
        <button type="button" className="bg-sheen text-white py-2 px-4 rounded" onClick={googleLogin}>
          {isLogin ? "Google prijava" : "Google registracija"}
        </button>
      </form>
      <div className="mt-6 text-center">
        <span className="cursor-pointer text-sheen font-medium" onClick={() => setIsLogin(l => !l)}>
          {isLogin ? "Nemate nalog? Registrujte se!" : "Već imate nalog? Prijavite se!"}
        </span>
      </div>
    </div>
  );
}
