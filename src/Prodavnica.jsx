// src/Prodavnica.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/shop/CartProvider";
import { SnackbarProvider } from "./contexts/shop/SnackbarProvider";

import HeroSection from "./pages/shop/HeroSection";
import ProductGrid from "./components/shop/ProductGrid";
import Cart from "./pages/shop/Cart";
import CheckoutForm from "./pages/shop/CheckoutForm";
import AuthForm from "./pages/shop/AuthForm";
import AdminPanel from "./pages/shop/AdminPanel";
import Navbar from "./components/shop/Navbar";
import Profile from "./pages/shop/Profile";
import ProductDetails from "./components/shop/ProductDetails";

function Prodavnica() {
  return (
    <SnackbarProvider>
      <CartProvider>
        
          <Navbar />
          <Routes>
            <Route path="/prodavnica" element={<HeroSection />} />
            <Route path="/prodavnica/products" element={<ProductGrid />} />
            <Route path="/prodavnica/product/:id" element={<ProductDetails />} />
            <Route path="/prodavnica/cart" element={<Cart />} />
            <Route path="/prodavnica/checkout" element={<CheckoutForm />} />
            <Route path="/prodavnica/login" element={<AuthForm />} />
            <Route path="/prodavnica/admin" element={<AdminPanel />} />
            <Route path="/prodavnica/profile" element={<Profile />} />
          </Routes>

      </CartProvider>
    </SnackbarProvider>
  );
}

export default Prodavnica;
