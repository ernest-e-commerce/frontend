import React, { useState } from "react";
import { Link } from "react-router-dom";
import { requestResetPasswordOtp, resetPasswordWithOtp } from "../api/authService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // STEP 1: REQUEST OTP
  const requestOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await requestResetPasswordOtp(email);
      setStep(2);
      setMessage("OTP has been sent to your email.");
    } catch (err) {
      setError(err?.message || "Failed to request OTP");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: RESET PASSWORD
  const resetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await resetPasswordWithOtp(email, otp, newPassword);
      setMessage("Your password has been reset successfully. You can now log in.");
      setStep(3);
    } catch (err) {
      setError(err?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
          Forgot Password
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your email to receive a reset OTP.
        </p>

        {message && (
          <div className="p-3 mb-4 text-sm text-green-800 bg-green-100 rounded-lg text-center">
            {message}
          </div>
        )}

        {error && (
          <div className="p-3 mb-4 text-sm text-red-800 bg-red-100 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <form onSubmit={requestOtp} className="space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <form onSubmit={resetPassword} className="space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />

            <input
              type="text"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />

            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="text-center">
            <Link
              to="/login"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition inline-block"
            >
              Go to Login
            </Link>
          </div>
        )}

        <div className="text-center text-sm text-gray-600 mt-5">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;