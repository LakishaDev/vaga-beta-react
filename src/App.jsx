import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import './App.css';

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Proizvodi from "./pages/Proizvodi";
import Usluge from "./pages/Usluge";
import Kontakt from "./pages/Kontakt";
import Onama from "./pages/Onama";

function App() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#CBCFBB] via-[#91CEC1] to-[#6EAEA2]">
      <Router>
        <Navbar />
        <main className="max-w-5xl mx-auto px-3 sm:px-8 py-8 pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/proizvodi" element={<Proizvodi />} />
            <Route path="/usluge" element={<Usluge />} />
            <Route path="/kontakt" element={<Kontakt />} />
            <Route path="/onama" element={<Onama />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
