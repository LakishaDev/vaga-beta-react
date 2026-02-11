// src/App.jsx
// Glavna aplikaciona komponenta
// Koristi React Router za navigaciju
// Uključuje rute za Home, Usluge, Kontakt, Onama i Prodavnica
// Ako je ruta /prodavnica/*, renderuje samo Prodavnica komponentu
// Inače renderuje Navbar, Footer i glavne stranice
// Stilizovana sa Tailwind CSS
// Responsive i pristupačna
// Koristi React Router v6
// test
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import CloudflareDeploymentDebug from "./components/CloudflareDeploymentDebug";
import { EVagaDesktopProvider } from "./contexts/EVagaDesktopContext";
import Lenis from "lenis";
import { lazy, Suspense, useEffect } from "react";

const Home = lazy(() => import("./pages/Home"));
const Usluge = lazy(() => import("./pages/Usluge"));
const Kontakt = lazy(() => import("./pages/Kontakt"));
const Onama = lazy(() => import("./pages/Onama"));
const Aplikacija = lazy(() => import("./pages/Aplikacija"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const EVagaDesktop = lazy(() => import("./pages/EVagaDesktop"));
const Prodavnica = lazy(() => import("./Prodavnica"));

function AppContent() {
  const location = useLocation();
  const isShop = location.pathname.startsWith("/prodavnica");

  // Ako je ruta za prodavnicu, renderuj samo Prodavnica komponentu
  if (isShop) {
    return (
      <Suspense fallback={<Loader />}>
        <Prodavnica />
      </Suspense>
    );
  }

  // Inače renderuj glavne stranice sa Navbar i Footer
  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-3 sm:px-8 py-8 pt-16">
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/usluge" element={<Usluge />} />
            <Route path="/kontakt" element={<Kontakt />} />
            <Route path="/onama" element={<Onama />} />
            <Route path="/aplikacija" element={<Aplikacija />} />
            <Route path="/evaga-desktop" element={<EVagaDesktop />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

// Glavna App komponenta sa Router-om
function App() {
  // Inicijalizacija Lenis za glatko skrolovanje
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08, // smoothness (0 - 1)
      smoothWheel: true, // enables smooth for mouse/touchpad
      autoRaf: true, // automatski animira
      anchors: true, // omogućava glatko skrolovanje do anchor linkova
      touchMultiplier: 0.5, // povećava brzinu skrolovanja na touch uređajima
    });

    window.lenis = lenis;

    return () => lenis.destroy();
  }, []);

  return (
    <EVagaDesktopProvider>
      <div className="min-h-screen w-full napredniGradient">
        <Router>
          <AppContent />
        </Router>
        <CloudflareDeploymentDebug />
      </div>
    </EVagaDesktopProvider>
  );
}

export default App;
