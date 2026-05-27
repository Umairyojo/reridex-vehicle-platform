// src/App.jsx
import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast"; // 🔥 1. Imported Toaster

// Import Components (Navbar + Footer always visible, so keep them eager)
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";

// 🚀 LAZY LOAD all pages — each page is a separate JS chunk.
// The browser only downloads a page's code when the user navigates to it.
// This cuts the initial bundle size dramatically.
const Home = lazy(() => import("./Pages/Home/Home"));
const AboutUs = lazy(() => import("./Pages/AboutUs/AboutUs"));
const SellNow = lazy(() => import("./Pages/SellNow/SellNow"));
const BuyBikes = lazy(() => import("./Pages/BuyBikes/BuyBikes"));
const BikeDetails = lazy(() => import("./Pages/BikeDetails/BikeDetails"));
const AdminLogin = lazy(() => import("./Pages/AdminDashboard/AdminLogin"));
const AdminDashboard = lazy(() => import("./Pages/AdminDashboard/AdminDashboard")); // 🔥 Uncommented this!

// Simple full-page loading spinner shown while a lazy chunk loads
const PageLoader = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "60vh",
    }}
  >
    <div
      style={{
        width: 44,
        height: 44,
        border: "4px solid #e0e0e0",
        borderTop: "4px solid #004AAD",
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
      }}
    />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

// ==========================================
// 🔥 SECURITY WALL 1: The Bouncer (Protected Route)
// ==========================================
const ProtectedAdminRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("reRideX_admin_auth") === "true";

  if (!isAuthenticated) {
    // If they don't have the VIP pass, kick them back to login
    return <Navigate to="/admin" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      {/* 🔥 Global Toaster for beautiful notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#333",
            color: "#fff",
            borderRadius: "10px",
            fontSize: "1rem",
          },
        }}
      />

      <div
        className="App"
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Navbar />

        <main style={{ flex: 1 }}>
          {/* Suspense shows PageLoader while a lazy chunk is being downloaded */}
          <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<Home />} />
            <Route path="/buy" element={<BuyBikes />} />
            <Route path="/sell" element={<SellNow />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/bike/:id" element={<BikeDetails />} />

            {/* ADMIN LOGIN (The Door) */}
            <Route path="/admin" element={<AdminLogin />} />

            {/* 🔥 SECURE ADMIN DASHBOARD (Protected by the Bouncer) */}
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              }
            />

            {/* 🔥 UX FIX: The 404 Catch-All Page */}
            {/* If someone types a wrong URL (like "localhost:5173/admin dashboard"), show this! */}
            <Route
              path="*"
              element={
                <div
                  style={{
                    padding: "100px 20px",
                    textAlign: "center",
                    minHeight: "60vh",
                  }}
                >
                  <h1
                    style={{
                      color: "#004AAD",
                      fontSize: "4rem",
                      marginBottom: "10px",
                      fontWeight: "900",
                    }}
                  >
                    404
                  </h1>
                  <h2 style={{ color: "#333", fontSize: "2rem" }}>
                    Oops! Page Not Found.
                  </h2>
                  <p
                    style={{
                      color: "#666",
                      marginBottom: "30px",
                      fontSize: "1.1rem",
                    }}
                  >
                    The URL you entered doesn't exist or has been moved.
                  </p>
                  <a
                    href="/"
                    style={{
                      background: "#FFC107",
                      color: "#111",
                      padding: "12px 24px",
                      textDecoration: "none",
                      borderRadius: "8px",
                      fontWeight: "bold",
                    }}
                  >
                    &larr; Back to Home
                  </a>
                </div>
              }
            />
          </Routes>
          </Suspense>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
