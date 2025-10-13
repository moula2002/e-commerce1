import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
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
import CheckoutPage from "./components/cartPage/CheckoutPage";

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Header />}
      <main>
        <Routes>
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/support" element={<CustomerSupportCenter />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />

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
