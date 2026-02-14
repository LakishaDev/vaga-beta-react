// src/pages/shop/VerifyEmailPage.jsx
// Stranica za verifikaciju email-a
// Koristi Firebase funkciju applyActionCode
// Prikazuje Loader dok se verifikacija ne završi
// Prikazuje poruku o uspehu ili neuspehu
// Ako je mode=resetPassword, preusmerava na stranicu za reset lozinke
// Stilizovana sa Tailwind CSS
// Responsive i pristupačna
// Koristi React Router za navigaciju i čitanje query parametara
// Koristi komponente iz /components
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { applyActionCode } from "firebase/auth";
import { auth } from "../../utils/firebase";
import EmailVerifiedSuccess from "../../components/shop/EmailVerifiedSuccess";
import Loader from "../../components/Loader";

export default function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get("mode");
    const oobCode = params.get("oobCode");
    // Ako nije verifyEmail - samo ignoriši
    if (mode == "resetPassword") {
      setStatus("resetPassword");
      return;
    }
    if (mode !== "verifyEmail" || !oobCode) {
      setStatus("fail");
      return;
    }
    applyActionCode(auth, oobCode)
      .then(() => {
        setStatus("success");
        auth.currentUser.reload();
      })
      .catch(() => {
        setStatus("fail");
      });
  }, [location.search]);

  if (status === "resetPassword") {
    navigate("/prodavnica/reset-password" + location.search);
    return null;
  }
  if (status === "loading") return <Loader />;
  if (status === "fail")
    return (
      <div className="w-full px-4 sm:px-8 md:px-16 py-16">
        <div className="mx-auto max-w-2xl rounded-2xl border border-error/30 bg-neutral-surface p-8 shadow-md text-center">
          <span className="text-error font-bold text-2xl">
            Neuspešna verifikacija.
          </span>
        </div>
      </div>
    );
  return (
    <EmailVerifiedSuccess email={auth.currentUser?.email || "tvoj email"} />
  );
}
