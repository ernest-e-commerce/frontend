import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "../lib/supabase";

const OtpModal = ({ isOpen, onClose, onSubmit, email, loading }) => {
  const [otp, setOtp] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(otp);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-900">
          Verify Your Account
        </h2>
        <p className="text-center text-gray-500 mb-6">
          A 6-digit code has been sent to{" "}
          <strong className="text-blue-800">{email}</strong>. Enter it below to
          confirm your account.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              6-Digit Code
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength="6"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center tracking-[1em] text-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-800 outline-none transition"
              placeholder="------"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-800 text-white rounded-lg font-semibold hover:bg-blue-900 transition disabled:opacity-50 shadow-lg shadow-blue-800/40"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [isOtpModalOpen, setOtpModalOpen] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          first_name: form.firstName,
          last_name: form.lastName,
        },
      },
    });

    if (error) {
      toast.error(error.message || "Failed to create account");
      setLoading(false);
      return;
    }

    toast.success("Account created! Check your email for the verification code.");
    setOtpModalOpen(true);
    setLoading(false);
  };

  const handleOtpSubmit = async (otp) => {
    setLoading(true);

    const { error } = await supabase.auth.verifyOtp({
      email: form.email,
      token: otp,
      type: "signup",
    });

    if (error) {
      toast.error(error.message || "Invalid or expired code");
      setLoading(false);
      return;
    }

    toast.success("Account verified successfully!");
    navigate("/");
    setLoading(false);
  };

  const inputClass =
    "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-800 outline-none transition";

  return (
    <>
      <OtpModal
        isOpen={isOtpModalOpen}
        onClose={() => setOtpModalOpen(false)}
        onSubmit={handleOtpSubmit}
        email={form.email}
        loading={loading}
      />
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">
            Create Account
          </h2>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                value={form.firstName}
                onChange={(e) =>
                  setForm((s) => ({ ...s, firstName: e.target.value }))
                }
                required
                placeholder="Enter your first name"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                value={form.lastName}
                onChange={(e) =>
                  setForm((s) => ({ ...s, lastName: e.target.value }))
                }
                required
                placeholder="Enter your last name"
                className={inputClass}
              />
            </div>

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
                className={inputClass}
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
                minLength={6}
                placeholder="At least 6 characters"
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-800 hover:bg-blue-900 text-white rounded-lg font-semibold transition disabled:opacity-50 shadow-xl shadow-blue-800/40"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <div className="text-center text-sm text-gray-600 mt-2">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-800 font-medium hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
