// src/AdminApp.jsx
// Admin aplikacija za admin.vagabeta.rs poddomen
// Renderuje se samo na admin host-u, odvojeno od marketing/shop chrome-a

import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/shop/auth/AuthProvider";
import { SnackbarProvider } from "./contexts/snackbar/SnackbarProvider";
import AdminLayout from "./components/admin/AdminLayout";
import { lazy, Suspense } from "react";
import Loader from "./components/Loader";
import { Toaster } from "react-hot-toast";

const LicensesPage = lazy(() =>
  import("./pages/admin/licensing/LicensesPage")
);
const OrdersPage = lazy(() => import("./pages/admin/licensing/OrdersPage"));
const UpdatesPage = lazy(() => import("./pages/admin/updates/UpdatesPage"));
const AdminLoginPage = lazy(() => import("./pages/admin/AdminLoginPage"));

export default function AdminApp() {
  return (
    <SnackbarProvider>
      <AuthProvider>
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
                "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
              fontSize: "14px",
              fontWeight: "500",
            },
          }}
        />
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/login" element={<AdminLoginPage />} />
            <Route element={<AdminLayout />}>
              <Route index element={<Navigate to="/licenses" replace />} />
              <Route path="/licenses" element={<LicensesPage />} />
              <Route path="/licenses/orders" element={<OrdersPage />} />
              <Route path="/updates" element={<UpdatesPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/licenses" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </SnackbarProvider>
  );
}
