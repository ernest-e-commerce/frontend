// src/pages/AdminLogin.jsx

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

// Define the fake admin credentials here
const ADMIN_EMAIL = "admin@ecom.com";
const ADMIN_PASSWORD = "password123";

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    setError("");

    const { email, password } = form;

    // Check for ADMIN CREDENTIALS
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Log in as admin and redirect to the dashboard
      login({ email: email, name: "Admin User", role: "admin" });
      navigate("/admin");
    } else {
      setError("Invalid admin email or password.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl">
        
        <h2 className="text-3xl font-bold mb-1 text-center text-red-700">Admin Sign In</h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Access the management console.
        </p>

        <form onSubmit={submit} className="space-y-5">
          {error && (
            <div className="p-3 text-sm text-red-800 bg-red-100 rounded-lg text-center" role="alert">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
              required
              placeholder="admin@ecom.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
              required
              placeholder="password123"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
          >
            Sign In as Admin
          </button>
        </form>

        <div className="text-center text-sm text-gray-600 mt-5">
          <Link
            to="/login"
            className="text-orange-500 font-medium hover:underline"
          >
            &#x2190; Back to Customer Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;