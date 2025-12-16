import React, { useState } from "react";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // STEP 1: REQUEST OTP
  const requestOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:5000/auth/request-change-password-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setStep(2);
      setMessage("OTP has been sent to your email.");
    } catch (err) {
      setError(err.message || "Failed to request OTP");
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
      const res = await fetch(
        "http://localhost:5000/auth/verify-change-password-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            otp,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setMessage("Your password has been changed successfully.");
      setStep(3);
    } catch (err) {
      setError(err.message || "Invalid OTP");
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
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
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
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition"
            >
              {loading ? "Sending OTP..." : "Request OTP"}
            </button>
          </form>
        )}

        {/* STEP 2 */}
        {step === 2 && (
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
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition"
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
