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
    if (mode !== "verifyEmail" || !oobCode) {
      setStatus("fail");
      return;
    }
    applyActionCode(auth, oobCode)
      .then(() => {
        setStatus("success");
        auth.currentUser.reload()
      })
      .catch(() => {
        setStatus("fail");
      });
  }, [location.search]);

  if (status === "loading") return <Loader />;
  if (status === "fail") return (
    <div className="flex flex-col items-center my-16">
      <span className="text-red-600 font-bold text-2xl">Neuspešna verifikacija.</span>
    </div>
  );
  return (
    <EmailVerifiedSuccess email={auth.currentUser?.email || "tvoj email"} />
  );
}
