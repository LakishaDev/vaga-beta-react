import { useContext } from "react";
import { Navigate, Outlet, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/shop/auth/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { Key, RefreshCw, LogOut, ShieldCheck, Users } from "lucide-react";
import Loader from "../Loader";

const ADMIN_EMAILS =
  (import.meta.env.VITE_ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

function isAdminUser(user) {
  return user && ADMIN_EMAILS.includes(user.email);
}

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
    isActive
      ? "bg-white/20 text-white"
      : "text-admin-surface-tint/80 hover:bg-white/10 hover:text-white"
  }`;

export default function AdminLayout() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  if (loading) return <Loader />;

  if (!user) return <Navigate to="/login" replace />;
  if (!isAdminUser(user)) {
    return (
      <div className="admin-shell min-h-screen flex items-center justify-center bg-admin-surface-tint">
        <div className="text-center p-10 bg-white rounded-2xl shadow-lg border border-admin-border max-w-sm">
          <ShieldCheck size={40} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-admin-text mb-2">Pristup odbijen</h2>
          <p className="text-admin-text-muted text-sm">
            Nalog <strong>{user.email}</strong> nema admin privilegije.
          </p>
          <button
            onClick={() => signOut(auth)}
            className="mt-5 text-sm text-admin-text-muted hover:text-admin-text underline"
          >
            Odjavi se
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login", { replace: true });
  };

  return (
    <div className="admin-shell min-h-screen bg-admin-surface-tint flex flex-col">
      {/* Topbar */}
      <header className="bg-admin-navy px-4 sm:px-6 h-14 flex items-center justify-between sticky top-0 z-30 shadow-lg shadow-admin-navy/30">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-admin-primary">
            <ShieldCheck size={16} className="text-white" />
          </div>
          <span className="font-bold text-white text-sm tracking-wide">eVaga Admin</span>
        </div>

        <nav className="flex items-center gap-1">
          <NavLink to="/licenses" end className={navLinkClass}>
            <Key size={15} />
            <span className="hidden sm:inline">Licence</span>
          </NavLink>
          <NavLink to="/updates" className={navLinkClass}>
            <RefreshCw size={15} />
            <span className="hidden sm:inline">Updates</span>
          </NavLink>
          <NavLink to="/users" className={navLinkClass}>
            <Users size={15} />
            <span className="hidden sm:inline">Korisnici</span>
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <span className="text-xs text-admin-surface-tint/60 hidden md:block">{user.email}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-admin-surface-tint/70 hover:text-white transition-colors px-2 py-1.5 rounded-lg hover:bg-white/10"
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">Odjavi</span>
          </button>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
