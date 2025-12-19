import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { changePassword, requestChangePasswordOtp, verifyChangePasswordOtp } from "../api/authService";

const ChangePassword = () => {
  const { user } = useAuth();
  const [method, setMethod] = useState("direct"); // "direct" or "otp"
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Direct change password
  const handleDirectChange = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await changePassword(oldPassword, newPassword);
      setMessage("Your password has been changed successfully.");
      setStep(3);
    } catch (err) {
      setError(err?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  // STEP 1: REQUEST OTP
  const requestOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await requestChangePasswordOtp(oldPassword, newPassword);
      setStep(2);
      setMessage("OTP has been sent to your email.");
    } catch (err) {
      setError(err?.message || "Failed to request OTP");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: VERIFY OTP
  const verifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await verifyChangePasswordOtp(otp);
      setMessage("Your password has been changed successfully.");
      setStep(3);
    } catch (err) {
      setError(err?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
          Change Password
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Secure your account by changing your password.
        </p>

        {/* Method Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Change Method
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="direct"
                checked={method === "direct"}
                onChange={(e) => setMethod(e.target.value)}
                className="mr-2"
              />
              Direct (with current password)
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="otp"
                checked={method === "otp"}
                onChange={(e) => setMethod(e.target.value)}
                className="mr-2"
              />
              With OTP verification
            </label>
          </div>
        </div>

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

        {/* Direct Change */}
        {method === "direct" && step === 1 && (
          <form onSubmit={handleDirectChange} className="space-y-4">
            <input
              type="password"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Current password"
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
              {loading ? "Changing Password..." : "Change Password"}
            </button>
          </form>
        )}

        {/* OTP STEP 1 */}
        {method === "otp" && step === 1 && (
          <form onSubmit={requestOtp} className="space-y-4">
            <input
              type="password"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Current password"
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
              {loading ? "Sending OTP..." : "Request OTP"}
            </button>
          </form>
        )}

        {/* OTP STEP 2 */}
        {method === "otp" && step === 2 && (
          <form onSubmit={verifyOtp} className="space-y-4">
            <input
              type="text"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChangePassword;
