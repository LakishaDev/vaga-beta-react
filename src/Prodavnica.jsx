// src/Prodavnica.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/shop/CartProvider";
import { SnackbarProvider } from "./contexts/shop/SnackbarProvider";
import { useEffect } from 'react';

import HeroSection from "./pages/shop/HeroSection";
import ProductGrid from "./components/shop/ProductGrid";
import Cart from "./pages/shop/Cart";
import CheckoutForm from "./pages/shop/CheckoutForm";
import AuthForm from "./pages/shop/AuthForm";
import AdminPanel from "./pages/shop/AdminPanel";
import Navbar from "./components/shop/Navbar";
import Profile from "./pages/shop/Profile";
import ProductDetails from "./components/shop/ProductDetails";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './utils/firebase';
import { createOrUpdateUserAccount } from './utils/userService';
import Footer from "./components/Footer";
import VerifyEmailPage from "./pages/shop/VerifyEmailPage";
import AdminOrders from "./pages/shop/AdminOrders";

function Prodavnica() {
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      // Automatski kreiraj/ažuriraj nalog pri svakom loginu
      createOrUpdateUserAccount(user);
    }
  }, [user]);

  return (
    <SnackbarProvider>
      <CartProvider>
        
          <Navbar />
          <Routes>
            <Route path="/prodavnica" element={<HeroSection />} />
            <Route path="/prodavnica/proizvodi" element={<ProductGrid />} />
            <Route path="/prodavnica/proizvod/:id" element={<ProductDetails />} />
            <Route path="/prodavnica/korpa" element={<Cart />} />
            <Route path="/prodavnica/placanje" element={<CheckoutForm />} />
            <Route path="/prodavnica/prijava" element={<AuthForm />} />
            <Route path="/prodavnica/admin" element={<AdminPanel />} />
            <Route path="/prodavnica/nalog" element={<Profile />} />
            <Route path="/prodavnica/email-verifikovan" element={<VerifyEmailPage />} />
            <Route path="/prodavnica/porudzbine" element={<AdminOrders />} />
          </Routes>
          <Footer />

      </CartProvider>
    </SnackbarProvider>
  );
}

export default Prodavnica;
