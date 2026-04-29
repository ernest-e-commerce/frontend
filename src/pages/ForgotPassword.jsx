import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "../lib/supabase";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: send recovery OTP
  const requestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      toast.error(error.message || "Failed to send reset code");
      setLoading(false);
      return;
    }

    toast.success("A 6-digit code has been sent to your email.");
    setStep(2);
    setLoading(false);
  };

  // Step 2: verify OTP and set new password.
  // verifyOtp(type: 'recovery') returns a session, so we can call updateUser right after.
  const resetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "recovery",
    });

    if (verifyError) {
      toast.error(verifyError.message || "Invalid or expired code");
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      toast.error(updateError.message || "Failed to update password");
      setLoading(false);
      return;
    }

    toast.success("Password reset. Redirecting...");
    setStep(3);
    setLoading(false);

    // The verifyOtp call signed the user in, so send them straight to the app.
    setTimeout(() => navigate("/"), 1200);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
          Forgot Password
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your email to receive a reset code.
        </p>

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
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
            >
              {loading ? "Sending code..." : "Send Code"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={resetPassword} className="space-y-4">
            <input
              type="text"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit code"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center tracking-[0.5em] text-xl"
            />

            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password (at least 6 chars)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="text-center">
            <p className="mb-4 text-green-700">Password reset successful.</p>
            <Link
              to="/"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition inline-block"
            >
              Continue
            </Link>
          </div>
        )}

        <div className="text-center text-sm text-gray-600 mt-5">
          Remember your password?{" "}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
