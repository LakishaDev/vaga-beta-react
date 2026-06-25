// src/components/Navbar.jsx
// Unified Navbar — radi i za main site i za prodavnicu
// Split-zone: Logo levo | Nav linkovi centar | Korpa + Auth desno
// Mobile: Slide-out drawer s desna (Framer Motion)

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CartContext } from "../contexts/shop/cart/CartContext";
import { SnackbarContext } from "../contexts/snackbar/SnackbarContext";
import { auth } from "../utils/firebase";
import {
  LogIn,
  LogOut,
  User,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { MdAdminPanelSettings } from "react-icons/md";
import { BiSolidReceipt } from "react-icons/bi";
import { PiShoppingCartDuotone } from "react-icons/pi";
import { AiTwotoneShop } from "react-icons/ai";
import {
  FaHome,
  FaCogs,
  FaBoxes,
  FaMobileAlt,
  FaInfoCircle,
  FaEnvelope,
  FaArrowRight,
} from "react-icons/fa";
import ProgressiveImage from "./UI/ProgressiveImage";
import PromoBanner from "./PromoBanner";

// ─── Nav data ─────────────────────────────────────────────────────────────────

const MAIN_NAV = [
  { to: "/", label: "Početna", icon: FaHome },
  { to: "/usluge", label: "Usluge", icon: FaCogs },
  { to: "/evaga-desktop", label: "Program", icon: FaBoxes },
  { to: "/aplikacija", label: "Aplikacija", icon: FaMobileAlt },
  { to: "/onama", label: "O nama", icon: FaInfoCircle },
];

const SHOP_NAV = [
  { to: "/", label: "Početna", icon: FaHome },
  { to: "/prodavnica/proizvodi", label: "Proizvodi", icon: AiTwotoneShop },
  {
    to: "/prodavnica/korpa",
    label: "Korpa",
    icon: PiShoppingCartDuotone,
    isCart: true,
  },
];

const ADMIN_NAV = [
  { to: "/prodavnica/admin", label: "Admin", icon: MdAdminPanelSettings },
  { to: "/prodavnica/porudzbine", label: "Porudžbine", icon: BiSolidReceipt },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isShop =
    location.pathname.startsWith("/prodavnica") ||
    location.pathname.startsWith("/p/");

  // Safe context consumption — defaults prevent crash outside providers
  const { cart } = useContext(CartContext);
  const { showSnackbar } = useContext(SnackbarContext);
  const cartCount = cart.reduce((acc, item) => acc + (item.qty ?? 1), 0);

  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  // Firebase auth listener
  useEffect(() => {
    let unsubscribe = () => {};
    let mounted = true;

    (async () => {
      try {
        const adminEmails =
          import.meta.env.VITE_ADMIN_EMAILS?.split(",").map((e) => e.trim()) ||
          [];

        unsubscribe = auth.onAuthStateChanged((u) => {
          if (!mounted) return;
          setUser(u);
          setIsAdmin(!!(u && adminEmails.includes(u.email)));
        });
      } catch {
        // Firebase not available — graceful no-op
      }
    })();

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Hide-on-scroll + compact mode
  useEffect(() => {
    if (typeof window === "undefined") return;
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      setIsCompact(y > 24);

      if (y <= 8) setIsHidden(false);
      else if (y > lastY + 8) setIsHidden(true);
      else if (y < lastY - 8) setIsHidden(false);

      lastY = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setMobileOpen(false);
      showSnackbar("Uspešno ste se odjavili.", "success");
      navigate("/prodavnica/prijava");
    } catch (err) {
      console.error("Greška pri odjavi:", err);
    }
  };

  // Active link class helper
  const linkClass = (path) =>
    `flex items-center gap-2 rounded-lg px-3 py-2 2xl:px-4 2xl:py-2.5 3xl:px-5 3xl:py-3 text-sm 2xl:text-base 3xl:text-lg font-semibold transition-colors ${
      location.pathname === path
        ? "bg-brand-primary text-white"
        : "text-text-secondary hover:bg-brand-primary/10 hover:text-brand-primary"
    }`;

  const centerLinks = isShop
    ? [...SHOP_NAV, ...(isAdmin ? ADMIN_NAV : [])]
    : MAIN_NAV;

  // ─── Render helpers ──────────────────────────────────────────────────────────

  const renderDesktopLink = (item) => {
    const Icon = item.icon;
    return (
      <Link key={item.to} to={item.to} className={linkClass(item.to)}>
        <Icon className="text-base" />
        {item.label}
        {item.isCart && cartCount > 0 && (
          <span className="ml-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary text-white text-[11px] font-bold shadow">
            {cartCount > 9 ? "9+" : cartCount}
          </span>
        )}
      </Link>
    );
  };

  const renderMobileLink = (item, onClose) => {
    const Icon = item.icon;
    const active = location.pathname === item.to;
    return (
      <Link
        key={item.to}
        to={item.to}
        onClick={onClose}
        className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-[15px] font-semibold transition-colors ${
          active
            ? "bg-brand-primary text-white"
            : "text-text-secondary hover:bg-brand-primary/10 hover:text-brand-primary"
        }`}
      >
        <span className="flex items-center gap-2.5">
          <Icon className="text-base" />
          {item.label}
          {item.isCart && cartCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary text-white text-[11px] font-bold shadow">
              {cartCount > 9 ? "9+" : cartCount}
            </span>
          )}
        </span>
        <ChevronRight size={15} className="opacity-50" />
      </Link>
    );
  };

  // Cart icon — always visible in right zone
  const cartDestination = isShop ? "/prodavnica/korpa" : "/prodavnica";
  const CartBtn = (
    <Link
      to={cartDestination}
      aria-label="Korpa"
      className="relative flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-brand-primary/10 hover:text-brand-primary"
    >
      <PiShoppingCartDuotone size={22} />
      {isShop && cartCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-primary text-white text-[10px] font-bold shadow">
          {cartCount > 9 ? "9+" : cartCount}
        </span>
      )}
    </Link>
  );

  // Right-zone auth buttons (desktop)
  const DesktopAuth = isShop ? (
    <>
      {user && (
        <Link
          to="/prodavnica/nalog"
          className="flex items-center gap-1.5 rounded-lg border border-brand-primary/30 px-3 py-1.5 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-primary/10"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary text-white text-xs font-bold">
            {user.displayName?.[0]?.toUpperCase() ||
              user.email?.[0]?.toUpperCase() ||
              "U"}
          </span>
          Nalog
        </Link>
      )}
      {user ? (
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-red-600"
        >
          <LogOut size={16} />
          Odjavi se
        </button>
      ) : (
        <Link
          to="/prodavnica/prijava"
          className="flex items-center gap-1.5 rounded-lg bg-brand-primary px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-brand-primaryHover"
        >
          <LogIn size={16} />
          Prijavi se
        </Link>
      )}
    </>
  ) : (
    <>
      <Link
        to="/kontakt"
        className="flex items-center gap-1.5 rounded-lg border border-brand-primary/30 px-3 py-1.5 2xl:px-4 2xl:py-2 3xl:px-5 3xl:py-2.5 text-sm 2xl:text-base 3xl:text-lg font-semibold text-brand-primary transition-colors hover:bg-brand-primary/10"
      >
        <FaEnvelope className="text-xs 2xl:text-sm" />
        Kontakt
      </Link>
      <Link
        to="/prodavnica"
        className="flex items-center gap-1.5 rounded-lg bg-brand-primary px-3 py-1.5 2xl:px-4 2xl:py-2 3xl:px-5 3xl:py-2.5 text-sm 2xl:text-base 3xl:text-lg font-semibold text-white transition-colors hover:bg-brand-primaryHover"
      >
        Prodavnica
        <FaArrowRight className="text-xs 2xl:text-sm" />
      </Link>
    </>
  );

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[9999] transition-transform duration-300 ${
          isHidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <nav
          className={`mx-2 mt-2 sm:mx-4 rounded-2xl border border-brand-primary/20 bg-white/90 backdrop-blur-md shadow-lg transition-all duration-300 ${
            isCompact ? "py-0.5" : "py-1"
          }`}
        >
          <div className="w-full flex items-center justify-between px-4 sm:px-6 xl:px-[3vw] 2xl:px-[2.5vw]">
            {/* ZONA 1: Logo */}
            <Link
              to={isShop ? "/prodavnica" : "/"}
              className="flex items-center gap-2 shrink-0"
            >
              <ProgressiveImage
                src="/imgs/vaga-logo.png"
                alt="Logo"
                className="h-8 w-8 2xl:h-10 2xl:w-10 3xl:h-12 3xl:w-12 rounded-lg border border-brand-primary/20 bg-white shadow"
              />
              <span className="font-heading font-extrabold text-lg 2xl:text-xl 3xl:text-2xl tracking-wide text-brand-primary">
                Vaga Beta
              </span>
            </Link>

            {/* ZONA 2: Nav linkovi (desktop only) */}
            <ul className="hidden sm:flex items-center gap-0.5">
              {centerLinks.map((item) => (
                <li key={item.to}>{renderDesktopLink(item)}</li>
              ))}
            </ul>

            {/* ZONA 3: Korpa + Auth + Hamburger */}
            <div className="flex items-center gap-2">
              {CartBtn}
              <div className="hidden sm:flex items-center gap-2">
                {DesktopAuth}
              </div>

              {/* Hamburger (mobile only) */}
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={() => setMobileOpen((o) => !o)}
                aria-label={mobileOpen ? "Zatvori meni" : "Otvori meni"}
                className="sm:hidden flex h-10 w-10 items-center justify-center rounded-xl hover:bg-brand-primary/10 transition-colors"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mobileOpen ? (
                    <motion.span
                      key="x"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                      }}
                      className="flex"
                    >
                      <X size={24} className="text-brand-primary" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                      }}
                      className="flex"
                    >
                      <Menu size={24} className="text-brand-primary" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </nav>
        <PromoBanner />
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm sm:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer panel */}
            <motion.div
              key="panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-[88%] max-w-[320px] z-[9999] bg-white shadow-2xl border-l border-neutral-border flex flex-col sm:hidden"
              role="dialog"
              aria-modal="true"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-border">
                <div className="flex items-center gap-2">
                  <ProgressiveImage
                    src="/imgs/vaga-logo.png"
                    alt="Logo"
                    className="h-8 w-8 rounded-lg border border-brand-primary/20 bg-white shadow"
                  />
                  <span className="font-heading font-bold text-brand-primary text-lg">
                    Vaga Beta
                  </span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Zatvori"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-border text-text-secondary transition-colors hover:bg-neutral-100"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation links */}
              <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1.5">
                {centerLinks.map((item) =>
                  renderMobileLink(item, () => setMobileOpen(false)),
                )}
              </div>

              {/* Auth footer */}
              <div className="px-4 pb-6 pt-3 border-t border-neutral-border flex flex-col gap-2">
                {isShop ? (
                  <>
                    {user && (
                      <Link
                        to="/prodavnica/nalog"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 rounded-lg border border-brand-primary/30 px-4 py-2.5 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-primary/10"
                      >
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-primary text-white text-sm font-bold">
                          {user.displayName?.[0]?.toUpperCase() ||
                            user.email?.[0]?.toUpperCase() ||
                            "U"}
                        </span>
                        <User size={16} />
                        Moj nalog
                      </Link>
                    )}
                    {user ? (
                      <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600"
                      >
                        <LogOut size={16} />
                        Odjavi se
                      </button>
                    ) : (
                      <Link
                        to="/prodavnica/prijava"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center gap-2 rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-primaryHover"
                      >
                        <LogIn size={16} />
                        Prijavi se
                      </Link>
                    )}
                  </>
                ) : (
                  <>
                    <Link
                      to="/kontakt"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center gap-2 rounded-lg border border-brand-primary/30 px-4 py-2.5 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-primary/10"
                    >
                      <FaEnvelope className="text-xs" />
                      Kontakt
                    </Link>
                    <Link
                      to="/prodavnica"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center gap-2 rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-primaryHover"
                    >
                      Prodavnica
                      <FaArrowRight className="text-xs" />
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
