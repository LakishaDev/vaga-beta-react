import { Link, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../contexts/shop/CartContext";
import { SnackbarContext } from "../../contexts/shop/SnackbarContext";
import { auth } from "../../utils/firebase";
import { useNavigate } from "react-router-dom";
import { 
  ShoppingCart, 
  LogIn, 
  LogOut,
  User, 
  Boxes,
  UserCog, 
  Menu, 
  X,
  Scale,
  Home
} from "lucide-react";
import TypingText from "../TypingText";

export default function Navbar() {
  const { showSnackbar } = useContext(SnackbarContext);
  const { cart } = useContext(CartContext);
  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const [user, setUser] = useState(null); // <-- DODAJ OVO
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user && user.email === "lazar.cve@gmail.com") setIsAdmin(true);
      else setIsAdmin(false);
    });
    return () => unsubscribe();
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
    `relative transition group font-semibold px-2 py-1 flex items-center gap-2
    ${location.pathname === path ? "text-bluegreen" : "text-white"}
    hover:text-bluegreen cursor-pointer`;

  const underlineClass = (path) =>
    `absolute left-0 -bottom-1 h-0.5 w-full rounded bg-bluegreen 
    scale-x-0 group-hover:scale-x-100 group-active:scale-x-100 transition-transform duration-300 
    ${location.pathname === path ? "scale-x-100" : ""}`;

  return (
    <nav className={`bg-midnight/80 ${!mobileMenuOpen && "backdrop-blur-sm"} text-white flex items-center justify-between px-4 sm:px-8 py-4 shadow-lg sticky top-0 z-50 font-sans`} style={{ fontFamily: "'Geist','Inter',sans-serif" }}>
      {/* Logo/brand */}
      <Link
        to="/prodavnica"
        className="font-extrabold text-2xl sm:text-3xl tracking-wider animate-pulse uppercase bg-gradient-to-tr from-bluegreen via-sheen to-midnight bg-clip-text text-transparent flex items-center gap-2"
        tabIndex={0}
        style={{ fontFamily: "'Geist','Inter',sans-serif", letterSpacing: "-0.01em" }}
      >
        <Scale size={28} className="mb-0.5 mr-1 text-bluegreen" />
        Vaga Beta Shop
      </Link>

      {/* Burger for mobile */}
      <button
        className="sm:hidden focus:outline-none flex items-center ml-4"
        onClick={() => setMobileMenuOpen((open) => !open)}
        aria-label="Otvori meni"
      >
        {mobileMenuOpen ? <X size={30} /> : <Menu size={30} />}
      </button>

      {/* Desktop nav */}
      <div className="hidden sm:flex gap-4 lg:gap-7 items-center">
        {/* Home link */}
        <Link to="/" className={navLinkClass("/")} aria-label="Početna">
          <Home size={20}/>
          Početna
          <span className={underlineClass("/")} />
        </Link>
        <Link to="/prodavnica/proizvodi" className={navLinkClass("/prodavnica/proizvodi")}>
          <Boxes size={20}/>
          Proizvodi
          <span className={underlineClass("/prodavnica/proizvodi")}></span>
        </Link>
        <Link to="/prodavnica/korpa" className={`${navLinkClass("/prodavnica/korpa")}`}>
          <span className="flex items-center">
            <ShoppingCart size={20}/>
            Korpa
            {cartCount > 0 && (
              <span className="ml-1 animate-bounce absolute -top-3 -right-4 bg-rust text-white rounded-full h-5 w-5 flex items-center justify-center text-xs shadow-lg font-bold border-2 border-white z-10">
                {cartCount}
              </span>
            )}
          </span>
          <span className={underlineClass("/prodavnica/korpa")}></span>
        </Link>
        {user && (
          <Link to="/prodavnica/nalog" className={navLinkClass("/prodavnica/nalog")}>
            <User size={20}/>
            Nalog
            <span className={underlineClass("/prodavnica/nalog")}></span>
          </Link>
        )}
        {isAdmin && (
           <>
              <Link to="/prodavnica/admin" className={navLinkClass("/prodavnica/admin")} onClick={() => setMobileMenuOpen(false)}>
                <UserCog size={22}/>
                Admin
              </Link>
              <Link to="/prodavnica/porudzbine" className={navLinkClass("/prodavnica/porudzbine")} onClick={() => setMobileMenuOpen(false)}>
                <UserCog size={22}/>
                Porudžbine
              </Link>
            </>
        )}
        {user ? (
          <button
            onClick={handleLogout}
            className="bg-rust rounded-xl px-3 py-1 text-white font-semibold hover:bg-red-600 focus:ring-2 focus:ring-red-500 transition shadow-md hover:scale-105 active:scale-95 flex items-center gap-1"
          >
            <LogOut size={20} />
            Odjavi se
          </button>
        ) : (
          <Link
            to="/prodavnica/prijava"
            className="bg-sheen rounded-xl px-3 py-1 text-white font-semibold hover:bg-bluegreen focus:ring-2 focus:ring-bluegreen transition shadow-md hover:scale-105 active:scale-95 flex items-center gap-1"
          >
            <LogIn size={20} />
            Prijava
          </Link>
        )}
      </div>

      {/* Mobile nav */}
      <div
        className={`sm:hidden fixed top-0 left-0 w-full h-full z-40 bg-midnight/80 backdrop-blur-md transform transition-transform duration-300 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ pointerEvents: mobileMenuOpen ? "auto" : "none" }}
      >
        <div className="flex flex-col gap-6 items-center justify-center h-full text-xl font-bold px-6 w-full">
          <Link
            to="/prodavnica"
            className="mb-7 font-extrabold text-2xl tracking-wider animate-pulse uppercase bg-gradient-to-tr from-bluegreen via-sheen to-midnight bg-clip-text text-transparent flex items-center gap-2"
            style={{ fontFamily: "'Geist','Inter',sans-serif", letterSpacing: "-0.01em" }}
            tabIndex={0}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Scale size={28} className="mb-0.5 mr-1 text-bluegreen" />
            <TypingText
              text="Vaga Beta Shop"
              speed={76}
              className="font-extrabold text-2xl tracking-wider animate-pulse uppercase bg-gradient-to-tr from-bluegreen via-sheen to-midnight bg-clip-text text-transparent"
              style={{ fontFamily: "'Geist','Inter',sans-serif", letterSpacing: "-0.01em" }}
            />
          </Link>


          <Link
            to="/"
            className={navLinkClass("/")}
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Početna"
          >
            <Home size={22}/>
            Početna
          </Link>


          <Link to="/prodavnica/proizvodi" className={navLinkClass("/prodavnica/proizvodi")} onClick={() => setMobileMenuOpen(false)}>
            <Boxes size={22}/>
            Proizvodi
          </Link>
          <Link to="/prodavnica/korpa" className={navLinkClass("/prodavnica/korpa")} onClick={() => setMobileMenuOpen(false)}>
            <ShoppingCart size={22}/>
            Korpa
            {cartCount > 0 && (
              <span className="ml-2 animate-bounce bg-rust text-white rounded-full h-6 w-6 flex items-center justify-center text-sm font-bold border-2 border-white z-10">
                {cartCount}
              </span>
            )}
          </Link>
          <Link to="/prodavnica/nalog" className={navLinkClass("/prodavnica/nalog")} onClick={() => setMobileMenuOpen(false)}>
            <User size={22}/>
            Nalog
          </Link>
          {isAdmin && (
            <>
              <Link to="/prodavnica/admin" className={navLinkClass("/prodavnica/admin")} onClick={() => setMobileMenuOpen(false)}>
                <UserCog size={22}/>
                Admin
              </Link>
              <Link to="/prodavnica/porudzbine" className={navLinkClass("/prodavnica/porudzbine")} onClick={() => setMobileMenuOpen(false)}>
                <UserCog size={22}/>
                Porudžbine
              </Link>
            </>
          )}
           {user ? (
          <button
            onClick={handleLogout}
            className="bg-rust rounded-xl px-3 py-1 text-white font-semibold hover:bg-red-600 focus:ring-2 focus:ring-red-500 transition shadow-md hover:scale-105 active:scale-95 flex items-center gap-1"
          >
            <LogOut size={20} />
            Odjavi se
          </button>
        ) : (
          <Link
            to="/prodavnica/prijava"
            className="bg-sheen rounded-xl px-5 py-2 text-white font-semibold hover:bg-bluegreen shadow-md hover:scale-105 active:scale-95 transition flex items-center gap-2 w-full max-w-[210px] justify-center"
            onClick={() => setMobileMenuOpen(false)}
          >
            <LogIn size={22}/>
            Prijava
          </Link>
        )}
        </div>
      </div>
    </nav>
  );
}
