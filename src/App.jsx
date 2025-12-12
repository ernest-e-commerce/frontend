import React from "react";
// Import Outlet for nested routing
import { Routes, Route, Outlet, useLocation } from "react-router-dom";

// Standard Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminLayout from "./components/AdminLayout"; 
import AdminAuthWrapper from "./components/AdminAuthWrapper"; // <-- NEW IMPORT for security

// Customer Pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard"; 
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import AdminLogin from "./pages/AdminLogin"; 
import AdminUsers from "./pages/AdminUsers"; 
import { Toaster } from "sonner";

const App = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Toaster richColors position="buttom-right" expand={true} />
      <Routes>
        
        {/* =================================================== */}
        {/* --- 1. ADMIN DASHBOARD ROUTES (SECURED) --- */}
        {/* The outer Route uses AdminAuthWrapper to check login status. */}
        {/* If authenticated, it renders the AdminLayout and its children (dashboard, products, orders). */}
        <Route path="/admin" element={<AdminAuthWrapper />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} /> 
            <Route path="products" element={<AdminProducts />} /> 
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Route>
        
        {/* =================================================== */}
        
        {/* --- 2. CUSTOMER/PUBLIC ROUTES & AUTH ROUTES --- */}
        <Route
          element={
            <>
              {location.pathname !== '/admin-login' && <Navbar />}
              <main className="flex-1 min-h-screen">
                <Outlet />
              </main>
              <Footer />
            </>
          }
        >
          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          
          {/* Auth Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />

          {/* DEDICATED ADMIN LOGIN ROUTE */}
          <Route path="/admin-login" element={<AdminLogin />} />
          
          {/* 404 CATCH-ALL */}
          <Route path="*" element={<NotFound />} />
        </Route>
        
      </Routes>
    </div>
  );
};

export default App;