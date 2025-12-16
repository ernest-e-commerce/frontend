import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

// Define the fake admin credentials
const ADMIN_EMAIL = "admin@ecom.com";
const ADMIN_PASSWORD = "password123";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  // --- 1. ADMIN QUICK LOGIN FUNCTION ---
  const quickAdminLogin = () => {
    // Manually log in the admin user
    login({ email: ADMIN_EMAIL, name: "Admin User (Quick)", role: "admin" });
    // Navigate directly to the admin dashboard
    navigate("/admin");
  };

  const submit = (e) => {
    e.preventDefault();
    setError("");

    const { email, password } = form;

    // Admin Credentials Check (for manual entry)
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      login({ email: email, name: "Admin User", role: "admin" });
      navigate("/admin");
    } 
    // Regular User Login
    else if (email.length > 0 && password.length > 0) {
      login({ email: email, name: email.split("@")[0], role: "user" });
      navigate("/");
    } 
    // Error Handling
    else {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-lg">
        <h2 className="text-3xl font-bold mb-1 text-center text-gray-800">
          Sign In
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Sign in below, or use the quick access button for development.
        </p>

        <form onSubmit={submit} className="space-y-5">
          {/* Error Message */}
          {error && (
            <div
              className="p-3 text-sm text-red-800 bg-red-100 rounded-lg text-center"
              role="alert"
            >
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((s) => ({ ...s, email: e.target.value }))
              }
              required
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm((s) => ({ ...s, password: e.target.value }))
              }
              required
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition"
          >
            Sign In
          </button>
        </form>

        <div className="text-center text-sm text-gray-600 mt-5">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-orange-500 font-medium hover:underline"
          >
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
