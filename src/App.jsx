import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
// Component Imports
import Header from "./components/Navbar";
import Footer from "./pages/Footer";
import HomePage from "./pages/Home";
import ProductDetailPage from "./pages/ProductDetailPage";
import EmptyCart from "./components/cartPage/EmptyCart";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import CustomerSupportCenter from "./pages/CustomerService";
// 💡 New Import for Category Page
import CategoryPage from "./pages/CategoryPage";

import AuthPage from "../src/pages/LoginPage"; 

const AppContent = () => {
    const location = useLocation();
    // Check if the current route starts with '/admin' to hide header/footer
    const isAdminRoute = location.pathname.startsWith('/admin');

    return (
        <>
            {!isAdminRoute && <Header />}
            <main>
                <Routes>
                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminLogin />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />

                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    
                    {/* 💥 FIX: Login Route Added here */}
                    <Route path="/login" element={<AuthPage />} /> 

                    {/* Category Routes Added */}
                    <Route path="/category" element={<CategoryPage />} />
                    <Route path="/category/:categoryName" element={<CategoryPage />} />

                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/cart" element={<EmptyCart />} />
                    <Route path="/support" element={<CustomerSupportCenter />} />

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
