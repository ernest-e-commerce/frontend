import React from "react";
// Import Outlet for nested routing
import { Routes, Route, Outlet } from "react-router-dom"; 

// Standard Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminLayout from "./components/AdminLayout"; 

// Customer Pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard"; 
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import AdminLogin from "./pages/AdminLogin"; // NEW IMPORT

const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Routes>
        
        {/* =================================================== */}
        {/* --- 1. ADMIN DASHBOARD ROUTES --- */}
        {/* These routes use the AdminLayout (Sidebar + Content) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} /> 
          <Route path="products" element={<AdminProducts />} /> 
          <Route path="orders" element={<AdminOrders />} />
        </Route>
        {/* =================================================== */}

        
        {/* --- 2. CUSTOMER/PUBLIC ROUTES & AUTH ROUTES --- */}
        {/* These routes use the standard Navbar/Footer Layout */}
        <Route 
          element={
            <>
              <Navbar />
              <main className="flex-1 min-h-screen">
                <Outlet /> {/* Renders the specific page component */}
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
          
          {/* --- NEW DEDICATED ADMIN LOGIN ROUTE --- */}
          <Route path="/admin-login" element={<AdminLogin />} /> 
          
          {/* 404 CATCH-ALL */}
          <Route path="*" element={<NotFound />} />
        </Route>
        
      </Routes>
    </div>
  );
};

export default App;