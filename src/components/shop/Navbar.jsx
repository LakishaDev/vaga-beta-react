// components/shop/Navbar.jsx
// Navigaciona traka za prodavnicu
// Prikazuje linkove ka različitim stranicama, stanje korpe i korisnički nalog
// Responsive dizajn sa mobilnim menijem
// Koristi kontekst za korpu i snackbar poruke
// Koristi Firebase Auth za upravljanje korisničkim nalogom

import { Link, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../contexts/shop/cart/CartContext";
import { SnackbarContext } from "../../contexts/snackbar/SnackbarContext";
import { auth } from "../../utils/firebase";
import { useNavigate } from "react-router-dom";
import {
  LogIn,
  LogOut,
  User,
  Menu,
  X,
  Scale,
  Home,
  KeyRoundIcon,
  ChevronRight,
} from "lucide-react";
import { MdAdminPanelSettings } from "react-icons/md";
import { BiSolidReceipt } from "react-icons/bi";
import { PiShoppingCartDuotone } from "react-icons/pi";
import { AiTwotoneShop } from "react-icons/ai";

export default function Navbar() {
  const { showSnackbar } = useContext(SnackbarContext);
  const { cart } = useContext(CartContext);
  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      const adminEmails =
        import.meta.env.VITE_ADMIN_EMAILS?.split(",").map((e) => e.trim()) ||
        [];
      if (user && adminEmails.includes(user.email)) setIsAdmin(true);
      else setIsAdmin(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let lastY = window.scrollY;

    const onScroll = () => {
      const currentY = window.scrollY;
      setIsCompact(currentY > 24);

      if (currentY <= 8) {
        setIsHidden(false);
      } else if (currentY > lastY + 8) {
        setIsHidden(true);
      } else if (currentY < lastY - 8) {
        setIsHidden(false);
      }

      lastY = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // LOGOUT HANDLER
  const handleLogout = async () => {
    try {
      await auth.signOut();
      setMobileMenuOpen(false); // zatvori mobilni meni
      showSnackbar("Uspešno ste se odjavili.", "success");
      navigate("/prodavnica/prijava");
    } catch (error) {
      console.error("Greška pri odjavi:", error);
    }
  };

  const navLinkClass = (path) =>
    `relative transition group font-semibold px-3 py-2 rounded-lg flex items-center gap-2 ${
      location.pathname === path
        ? "bg-brand-primary text-white"
        : "text-text-secondary hover:bg-brand-primary/10 hover:text-brand-primary"
    }`;

  const baseLinks = [
    { to: "/", label: "Početna", icon: Home },
    { to: "/prodavnica/proizvodi", label: "Proizvodi", icon: AiTwotoneShop },
    { to: "/prodavnica/korpa", label: "Korpa", icon: PiShoppingCartDuotone },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[9999] transition-transform duration-300 ${
        isHidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <nav
        className={`mx-2 mt-2 sm:mx-4 rounded-2xl border border-brand-primary/20 bg-white/95 text-text-primary shadow-lg backdrop-blur-sm transition-all duration-300 ${
          isCompact ? "py-2" : "py-3"
        }`}
        style={{ fontFamily: "'Geist','Inter',sans-serif" }}
      >
        <div className="flex items-center justify-between px-4 sm:px-8">
          {/* Logo/brand */}
          <Link
            to="/prodavnica"
            className="font-extrabold text-xl sm:text-2xl tracking-wider uppercase text-brand-primary flex items-center gap-2"
            tabIndex={0}
            style={{
              fontFamily: "'Geist','Inter',sans-serif",
              letterSpacing: "-0.01em",
            }}
          >
            <Scale size={24} className="mb-0.5 mr-1 text-brand-primary" />
          </Link>

          {/* Burger for mobile */}
          <button
            className="sm:hidden focus:outline-none flex items-center ml-4 h-10 w-10 rounded-xl hover:bg-brand-primary/10 justify-center"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label="Otvori meni"
          >
            {mobileMenuOpen ? <X size={30} /> : <Menu size={30} />}
          </button>

          {/* Desktop nav */}
          <div className="hidden sm:flex gap-4 lg:gap-7 items-center">
            {baseLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={navLinkClass(item.to)}
                >
                  <span className="flex items-center gap-2">
                    <Icon size={20} />
                    {item.label}
                  </span>
                  {item.to === "/prodavnica/korpa" && cartCount > 0 && (
                    <span className="ml-1 bg-brand-primary text-white rounded-full h-5 w-5 flex items-center justify-center text-xs shadow font-bold">
                      {cartCount}
                    </span>
                  )}
                </Link>
              );
            })}

            {user && (
              <Link
                to="/prodavnica/nalog"
                className={navLinkClass("/prodavnica/nalog")}
              >
                <User size={20} />
                Nalog
              </Link>
            )}

            {isAdmin && (
              <>
                <Link
                  to="/prodavnica/admin"
                  className={navLinkClass("/prodavnica/admin")}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <MdAdminPanelSettings size={22} />
                  Admin
                </Link>
                <Link
                  to="/prodavnica/admin/licenses"
                  className={navLinkClass("/prodavnica/admin/licenses")}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <KeyRoundIcon size={22} />
                  Licence
                </Link>
                <Link
                  to="/prodavnica/porudzbine"
                  className={navLinkClass("/prodavnica/porudzbine")}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <BiSolidReceipt size={22} />
                  Porudžbine
                </Link>
              </>
            )}

            {user ? (
              <button
                onClick={handleLogout}
                className="bg-error-main rounded-xl px-3 py-2 text-white font-semibold hover:bg-red-700 focus:ring-2 focus:ring-red-500 transition shadow-md hover:scale-105 active:scale-95 flex items-center gap-1 text-xs"
              >
                <LogOut size={20} />
                Odjavi se
              </button>
            ) : (
              <Link
                to="/prodavnica/prijava"
                className="bg-brand-primary rounded-xl px-3 py-2 text-white font-semibold hover:bg-brand-primary-hover focus:ring-2 focus:ring-brand-secondary transition shadow-md hover:scale-105 active:scale-95 flex items-center gap-1"
              >
                <LogIn size={20} />
                Prijavi se
              </Link>
            )}
          </div>
        </div>

        {/* Mobile nav */}
        <div
          className={`sm:hidden fixed top-0 left-0 w-full h-full z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
            mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            className={`absolute top-0 right-0 h-full w-[88%] max-w-sm bg-white shadow-2xl border-l border-neutral-border p-5 transition-transform duration-300 ${
              mobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="font-heading font-bold text-brand-primary text-xl">
                Meni
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Zatvori meni"
                className="h-10 w-10 rounded-lg border border-neutral-border flex items-center justify-center"
              >
                <X size={22} />
              </button>
            </div>

            <div className="flex flex-col gap-2 text-[15px] font-semibold">
              {baseLinks.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg ${
                      active
                        ? "bg-brand-primary text-white"
                        : "text-text-secondary hover:bg-brand-primary/10 hover:text-brand-primary"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="flex items-center gap-2">
                      <Icon size={20} />
                      {item.label}
                    </span>
                    <ChevronRight size={16} />
                  </Link>
                );
              })}

              {user && (
                <Link
                  to="/prodavnica/nalog"
                  className={navLinkClass("/prodavnica/nalog")}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User size={22} />
                  Nalog
                </Link>
              )}

              {isAdmin && (
                <>
                  <Link
                    to="/prodavnica/admin"
                    className={navLinkClass("/prodavnica/admin")}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <MdAdminPanelSettings size={22} />
                    Admin
                  </Link>
                  <Link
                    to="/prodavnica/admin/licenses"
                    className={navLinkClass("/prodavnica/admin/licenses")}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <KeyRoundIcon size={22} />
                    Licence
                  </Link>
                  <Link
                    to="/prodavnica/porudzbine"
                    className={navLinkClass("/prodavnica/porudzbine")}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <BiSolidReceipt size={22} />
                    Porudžbine
                  </Link>
                </>
              )}

              <div className="pt-3 border-t border-neutral-border mt-2">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="w-full bg-error-main rounded-xl px-3 py-2 text-white font-semibold hover:bg-red-700 transition shadow-md flex items-center justify-center gap-2"
                  >
                    <LogOut size={20} />
                    Odjavi se
                  </button>
                ) : (
                  <Link
                    to="/prodavnica/prijava"
                    className="w-full bg-brand-primary rounded-xl px-3 py-2 text-white font-semibold hover:bg-brand-primary-hover transition shadow-md flex items-center justify-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LogIn size={22} />
                    Prijavi se
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
