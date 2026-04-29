import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

const ChangePassword = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const submit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    // Re-authenticate with the current password before allowing the update.
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: oldPassword,
    });

    if (signInError) {
      toast.error("Current password is incorrect");
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

    toast.success("Password changed successfully");
    navigate("/profile");
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
          Change Password
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your current password and choose a new one.
        </p>

        <form onSubmit={submit} className="space-y-4">
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
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password (at least 6 chars)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />

          <input
            type="password"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? "Updating..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
