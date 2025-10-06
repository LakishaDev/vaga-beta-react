// src/App.jsx
// Glavna aplikaciona komponenta
// Koristi React Router za navigaciju
// Uključuje rute za Home, Usluge, Kontakt, Onama i Prodavnica
// Ako je ruta /prodavnica/*, renderuje samo Prodavnica komponentu
// Inače renderuje Navbar, Footer i glavne stranice
// Stilizovana sa Tailwind CSS
// Responsive i pristupačna
// Koristi React Router v6
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Usluge from "./pages/Usluge";
import Kontakt from "./pages/Kontakt";
import Onama from "./pages/Onama";
import Prodavnica from "./Prodavnica";

function AppContent() {
  const location = useLocation();
  const isShop = location.pathname.startsWith("/prodavnica");

  // Ako je ruta za prodavnicu, renderuj samo Prodavnica komponentu
  if (isShop) {
    return <Prodavnica />;
  }

  // Inače renderuj glavne stranice sa Navbar i Footer
  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-3 sm:px-8 py-8 pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/usluge" element={<Usluge />} />
          <Route path="/kontakt" element={<Kontakt />} />
          <Route path="/onama" element={<Onama />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

// Glavna App komponenta sa Router-om
function App() {
  return (
    <div className="min-h-screen w-full napredniGradient">
      <Router>
        <AppContent />
      </Router>
    </div>
  );
}

export default App;
