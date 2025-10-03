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
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/proizvodi" element={<Proizvodi />} />
        <Route path="/usluge" element={<Usluge />} />
        <Route path="/kontakt" element={<Kontakt />} />
        <Route path="/onama" element={<Onama />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
