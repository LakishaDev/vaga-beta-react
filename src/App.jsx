// src/App.jsx
// Glavna aplikaciona komponenta
// Koristi React Router za navigaciju
// SSR kompatibilna verzija - bez useLocation u roditeljskoj komponenti

import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import RenderBoundary from "./components/RenderBoundary";
import CloudflareDeploymentDebug from "./components/CloudflareDeploymentDebug";
import { EVagaDesktopProvider } from "./contexts/EVagaDesktopContext";
import Lenis from "lenis";
import { lazy, Suspense, useEffect } from "react";

const Home = lazy(() => import("./pages/home/HomeModern"));
const Usluge = lazy(() => import("./pages/services/UslugaModern"));
const Kontakt = lazy(() => import("./pages/contact/KontaktModern"));
const Onama = lazy(() => import("./pages/about/OnamaModern"));
const Aplikacija = lazy(() => import("./pages/Aplikacija"));
const Booking = lazy(() => import("./pages/Booking"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const EVagaDesktop = lazy(() => import("./pages/EVagaDesktop"));
const DesignSystemDemo = lazy(() => import("./pages/DesignSystemDemo"));
const Prodavnica = lazy(() => import("./Prodavnica"));

function AppContent() {
  // useLocation hook - dobija se iz router context-a
  // Sigurno je koristiti jer je App uvek unutar BrowserRouter ili StaticRouter
  const location = useLocation();
  const isShop = location.pathname.startsWith("/prodavnica");

  // Ako je ruta za prodavnicu, renderuj samo Prodavnica komponentu
  if (isShop) {
    return (
      <RenderBoundary>
        <Suspense fallback={<Loader />}>
          <Prodavnica />
        </Suspense>
      </RenderBoundary>
    );
  }

  // Inače renderuj glavne stranice sa Navbar i Footer
  return (
    <>
      <Navbar />
      <main className="pt-24 sm:pt-28" suppressHydrationWarning>
        <RenderBoundary>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/usluge" element={<Usluge />} />
              <Route path="/kontakt" element={<Kontakt />} />
              <Route path="/onama" element={<Onama />} />
              <Route path="/aplikacija" element={<Aplikacija />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/evaga-desktop" element={<EVagaDesktop />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route
                path="/design-system-demo"
                element={<DesignSystemDemo />}
              />
            </Routes>
          </Suspense>
        </RenderBoundary>
      </main>
      <Footer />
    </>
  );
}

// Glavna App komponenta - bez Router wrapper-a
// Router se dodeljuje na entry-client.jsx i entry-server.jsx
function App() {
  // Inicijalizacija Lenis za glatko skrolovanje
  // Samo u browser okruženju (ne na serveru)
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

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
      <div
        className="min-h-screen w-full bg-neutral-bg text-text-primary"
        suppressHydrationWarning
      >
        <AppContent />
        <CloudflareDeploymentDebug />
      </div>
    </EVagaDesktopProvider>
  );
}

export default App;
