// src/App.jsx
// Glavna aplikaciona komponenta
// Koristi React Router za navigaciju
// SSR kompatibilna verzija - bez useLocation u roditeljskoj komponenti

import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import RenderBoundary from "./components/RenderBoundary";
import PromoBanner from "./components/PromoBanner";
import { EVagaDesktopProvider } from "./contexts/EVagaDesktopContext";
import { PromoProvider } from "./contexts/PromoContext";
import { lazy, Suspense, useEffect, useState } from "react";

const Home = lazy(() => import("./pages/home/HomeModern"));
const Usluge = lazy(() => import("./pages/services/UslugaModern"));
const Kontakt = lazy(() => import("./pages/contact/KontaktModern"));
const Onama = lazy(() => import("./pages/about/OnamaModern"));
const Aplikacija = lazy(() => import("./pages/Aplikacija"));
const Booking = lazy(() => import("./pages/Booking"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const NewsletterPage = lazy(() => import("./pages/Newsletter"));
const EVagaDesktop = lazy(() => import("./pages/EVagaDesktop"));
const DesignSystemDemo = lazy(() => import("./pages/DesignSystemDemo"));
const Prodavnica = lazy(() => import("./Prodavnica"));
const NewsletterModal = lazy(() => import("./components/NewsletterModal"));

function AppContent() {
  // useLocation hook - dobija se iz router context-a
  // Sigurno je koristiti jer je App uvek unutar BrowserRouter ili StaticRouter
  const location = useLocation();
  const isShop =
    location.pathname.startsWith("/prodavnica") ||
    location.pathname.startsWith("/p/");

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
          <Suspense fallback={<Loader />} key={location.pathname}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/usluge" element={<Usluge />} />
              <Route path="/kontakt" element={<Kontakt />} />
              <Route path="/onama" element={<Onama />} />
              <Route path="/aplikacija" element={<Aplikacija />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/evaga-desktop" element={<EVagaDesktop />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/newsletter" element={<NewsletterPage />} />
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
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);

  // Inicijalizacija Lenis za glatko skrolovanje
  // Samo u browser okruženju (ne na serveru)
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    let lenisInstance = null;
    let isMounted = true;

    const startLenis = async () => {
      try {
        const { default: Lenis } = await import("lenis");
        if (!isMounted) return;

        lenisInstance = new Lenis({
          lerp: 0.08,
          smoothWheel: true,
          autoRaf: true,
          anchors: true,
          touchMultiplier: 0.5,
        });

        window.lenis = lenisInstance;
      } catch {
        // noop
      }
    };

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(startLenis, { timeout: 2000 });
    } else {
      setTimeout(startLenis, 1200);
    }

    return () => {
      isMounted = false;
      if (lenisInstance) {
        lenisInstance.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const showModal = () => setShowNewsletterModal(true);

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(showModal, { timeout: 2500 });
    } else {
      setTimeout(showModal, 1400);
    }
  }, []);

  return (
    <PromoProvider>
      <EVagaDesktopProvider>
        <div
          className="min-h-screen w-full bg-neutral-bg text-text-primary"
          suppressHydrationWarning
        >
          <PromoBanner />
          <AppContent />
          {showNewsletterModal && (
            <Suspense fallback={null}>
              <NewsletterModal />
            </Suspense>
          )}
          {import.meta.env.DEV ? (
            <Suspense fallback={null}>
              <CloudflareDeploymentDebugLazy />
            </Suspense>
          ) : null}
        </div>
      </EVagaDesktopProvider>
    </PromoProvider>
  );
}

const CloudflareDeploymentDebugLazy = lazy(
  () => import("./components/CloudflareDeploymentDebug"),
);

export default App;
