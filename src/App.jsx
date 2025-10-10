// src/App.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Components
import Header from "./components/Navbar";
import Footer from "./pages/Footer";
import HomePage from "./pages/Home";
import ProductDetailPage from "./pages/ProductDetailPage";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import CustomerSupportCenter from "./pages/CustomerService";
import CategoryPage from "./pages/CategoryPage";
import AuthPage from "./pages/LoginPage";
import CartPage from "./components/cartPage/CartPage";

// Import the new CheckoutLoginPage component
import CheckoutLoginPage from "./components/cartPage/CheckoutLoginPage";

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {/* Show Header only for non-admin routes */}
      {!isAdminRoute && <Header />}
      <main>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/cart" element={<CartPage />} />

          {/* UPDATED: /checkout route uses CheckoutLoginPage */}
          <Route path="/checkout" element={<CheckoutLoginPage />} />

          <Route path="/support" element={<CustomerSupportCenter />} />

          {/* Category Routes */}
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />

          {/* Product Routes */}
          <Route path="/product/:id" element={<ProductDetailPage />} />

          {/* 404 Fallback */}
          <Route
            path="*"
            element={
              <div className="text-center mt-5 p-5">
                <h2>404 - Page Not Found</h2>
                <p className="text-muted">
                  The page you are looking for doesn't exist.
                </p>
              </div>
            }
          />
        </Routes>
      </main>
      {/* Show Footer only for non-admin routes */}
      {!isAdminRoute && <Footer />}
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;