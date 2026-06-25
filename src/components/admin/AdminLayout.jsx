// src/components/admin/AdminLayout.jsx
// Admin shell: guard + navigacija za admin.vagabeta.rs

import { useContext } from "react";
import { Navigate, Outlet, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/shop/auth/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { Key, RefreshCw, LogOut, ShieldCheck } from "lucide-react";
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
      ? "bg-brand-secondary/10 text-brand-secondary"
      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
  }`;

export default function AdminLayout() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  if (loading) return <Loader />;

  if (!user) return <Navigate to="/login" replace />;
  if (!isAdminUser(user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-10 bg-white rounded-2xl shadow-lg border border-red-100 max-w-sm">
          <ShieldCheck size={40} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Pristup odbijen</h2>
          <p className="text-gray-500 text-sm">
            Nalog <strong>{user.email}</strong> nema admin privilegije.
          </p>
          <button
            onClick={() => signOut(auth)}
            className="mt-5 text-sm text-gray-500 hover:text-gray-800 underline"
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
    <div className="admin-shell min-h-screen bg-gray-50 flex flex-col">
      {/* Topbar */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 h-14 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <ShieldCheck size={20} className="text-brand-secondary" />
          <span className="font-bold text-gray-900 text-sm">eVaga Admin</span>
        </div>

        <nav className="flex items-center gap-1">
          <NavLink to="/licenses" className={navLinkClass}>
            <Key size={15} />
            <span className="hidden sm:inline">Licence</span>
          </NavLink>
          <NavLink to="/updates" className={navLinkClass}>
            <RefreshCw size={15} />
            <span className="hidden sm:inline">Updates</span>
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 hidden md:block">{user.email}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition-colors px-2 py-1.5 rounded-lg hover:bg-red-50"
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
