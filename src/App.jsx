import React from "react";
import { Routes, Route, Outlet, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminLayout from "./components/AdminLayout";
import AdminAuthWrapper from "./components/AdminAuthWrapper";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ChangePassword from "./pages/ChangePassword";

import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import AdminLogin from "./pages/AdminLogin";

const App = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Routes>

        {/* ================= ADMIN ROUTES ================= */}
        <Route path="/admin" element={<AdminAuthWrapper />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>
        </Route>

        {/* ================= PUBLIC ROUTES ================= */}
        <Route
          element={
            <>
              {location.pathname !== "/admin-login" && <Navbar />}
              <main className="flex-1 min-h-screen">
                <Outlet />
              </main>
              <Footer />
            </>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* AUTH & PROFILE */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassword />} />

          {/* ADMIN LOGIN */}
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>

      </Routes>
    </div>
  );
};

export default App;
