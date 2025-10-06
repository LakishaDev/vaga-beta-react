// src/Prodavnica.jsx
// Glavna komponenta za prodavnicu
// Koristi React Router za rute unutar prodavnice
// Uključuje Navbar i Footer specifične za prodavnicu
// Koristi kontekste za autentifikaciju, korpu i snackbar
// Stilizovana sa Tailwind CSS
// Responsive i pristupačna
// Koristi React Router v6
// Automatski kreira/ažurira korisnički nalog pri svakom loginu
// Učitava korisnički UID iz Firebase Auth
// Kreira ili ažurira korisnički dokument u Firestore kolekciji "users"
// Uključuje rute za: HeroSection, ProductGrid, ProductDetails, Cart, CheckoutForm, AuthForm, AdminPanel, Profile, VerifyEmailPage, AdminOrders, PasswordResetForm
// Koristi komponente iz /components i /pages/shop
// Koristi Firebase Auth i React Firebase Hooks
// Error handling je uključen
// Ignoriše greške pri brisanju slike profila ako slika ne postoji
import { Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/shop/cart/CartProvider";
import { SnackbarProvider } from "./contexts/snackbar/SnackbarProvider";
import { useEffect } from "react";
import HeroSection from "./pages/shop/HeroSection";
import ProductGrid from "./components/shop/ProductGrid";
import Cart from "./pages/shop/Cart";
import CheckoutForm from "./pages/shop/CheckoutForm";
import AuthForm from "./pages/shop/AuthForm";
import AdminPanel from "./pages/shop/AdminPanel";
import Navbar from "./components/shop/Navbar";
import Profile from "./pages/shop/Profile";
import ProductDetails from "./components/shop/ProductDetails";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./utils/firebase";
import { createOrUpdateUserAccount } from "./utils/userService";
import Footer from "./components/Footer";
import VerifyEmailPage from "./pages/shop/VerifyEmailPage";
import AdminOrders from "./pages/shop/AdminOrders";
import PasswordResetForm from "./components/shop/PasswordResetForm";
import { AuthProvider } from "./contexts/shop/auth/AuthProvider";

function Prodavnica() {
  const [user] = useAuthState(auth);

  // Kreiraj ili ažuriraj korisnički nalog pri svakom loginu
  useEffect(() => {
    if (user) {
      // Automatski kreiraj/ažuriraj nalog pri svakom loginu
      createOrUpdateUserAccount(user);
    }
  }, [user]);

  return (
    <SnackbarProvider>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <Routes>
            <Route path="/prodavnica" element={<HeroSection />} />
            <Route path="/prodavnica/proizvodi" element={<ProductGrid />} />
            <Route
              path="/prodavnica/proizvod/:id"
              element={<ProductDetails />}
            />
            <Route path="/prodavnica/korpa" element={<Cart />} />
            <Route path="/prodavnica/placanje" element={<CheckoutForm />} />
            <Route path="/prodavnica/prijava" element={<AuthForm />} />
            <Route path="/prodavnica/admin" element={<AdminPanel />} />
            <Route path="/prodavnica/nalog" element={<Profile />} />
            <Route
              path="/prodavnica/email-verifikovan"
              element={<VerifyEmailPage />}
            />
            <Route path="/prodavnica/porudzbine" element={<AdminOrders />} />
            <Route
              path="/prodavnica/reset-password"
              element={<PasswordResetForm />}
            />
          </Routes>
          <Footer />
        </CartProvider>
      </AuthProvider>
    </SnackbarProvider>
  );
}

export default Prodavnica;
