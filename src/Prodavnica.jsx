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
// Uključuje rute za admin licensing: LicensesPage, OrdersPage
// Koristi komponente iz /components i /pages/shop
// Koristi Firebase Auth i React Firebase Hooks
// Error handling je uključen
// Ignoriše greške pri brisanju slike profila ako slika ne postoji
import { Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/shop/cart/CartProvider";
import { SnackbarProvider } from "./contexts/snackbar/SnackbarProvider";
import { useEffect } from "react";
import HeroSectionModern from "./pages/shop/HeroSectionModern";
import ProductGrid from "./components/shop/ProductGrid";
import Cart from "./pages/shop/Cart";
import CheckoutForm from "./pages/shop/CheckoutForm";
import AuthForm from "./pages/shop/AuthForm";
import AdminPanel from "./pages/shop/AdminPanel";
import Navbar from "./components/shop/Navbar";
import RenderBoundary from "./components/RenderBoundary";
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
import { LicensesPage, OrdersPage } from "./pages/admin/licensing";
import { Toaster } from "react-hot-toast";

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
          <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
              duration: 3000,
              style: {
                background: "#fff",
                color: "#1f2937",
                padding: "16px",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                fontSize: "14px",
                fontWeight: "500",
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: "#10b981",
                  secondary: "#fff",
                },
                style: {
                  border: "1px solid #10b981",
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
                style: {
                  border: "1px solid #ef4444",
                },
              },
              loading: {
                iconTheme: {
                  primary: "#3b82f6",
                  secondary: "#fff",
                },
              },
            }}
          />
          <Navbar />
          <main className="pt-24 sm:pt-28">
            <RenderBoundary>
              <Routes>
                <Route path="/prodavnica" element={<HeroSectionModern />} />
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
                <Route
                  path="/prodavnica/porudzbine"
                  element={<AdminOrders />}
                />
                <Route
                  path="/prodavnica/reset-password"
                  element={<PasswordResetForm />}
                />
                {/* Admin Licensing Routes */}
                <Route
                  path="/prodavnica/admin/licenses"
                  element={<LicensesPage />}
                />
                <Route
                  path="/prodavnica/admin/licenses/orders"
                  element={<OrdersPage />}
                />
              </Routes>
            </RenderBoundary>
          </main>
          <Footer />
        </CartProvider>
      </AuthProvider>
    </SnackbarProvider>
  );
}

export default Prodavnica;
