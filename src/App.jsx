import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// import './App.css';

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Proizvodi from "./pages/Proizvodi";
import Usluge from "./pages/Usluge";
import Kontakt from "./pages/Kontakt";
import Onama from "./pages/Onama";
import Prodavnica from "./Prodavnica"; // putanja po potrebi

function AppContent() {
  const location = useLocation();
  const isShop = location.pathname.startsWith("/prodavnica");
  
  if (isShop) {
    // Render ONLY shop!
    return <Prodavnica />;
  }
  // Render site UI
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
