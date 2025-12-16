import React, { useState } from "react";
import { useAuth } from "../context/AuthContext"; // <-- RE-ADDED: Fixes ReferenceError
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { toast } from "sonner";

/* ============================================
    OTP MODAL - LAYERED TECH THEME
============================================ */
const OtpModal = ({ isOpen, onClose, onSubmit, email, loading }) => {
    const [otp, setOtp] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(otp);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            {/* THEME: Clear elevation (shadow-2xl) and rounded corners */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-200">
                <h2 className="text-2xl font-bold text-center mb-4 text-gray-900">Verify Your Account</h2>
                <p className="text-center text-gray-500 mb-6">
                    An OTP has been sent to <strong className="text-blue-800">{email}</strong>. Please enter it below.
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                            6-Digit OTP
                        </label>
                        <input
                            type="text"
                            id="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength="6"
                            // THEME: Input field focus ring uses brand blue (blue-800)
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center tracking-[1em] text-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-800 outline-none transition"
                            placeholder="_ _ _ _ _ _"
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            // THEME: Secondary button is clean and subtle
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            // THEME: Primary CTA style with brand blue and strong shadow
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


/* ============================================
    REGISTER PAGE - LAYERED TECH THEME
============================================ */
const Register = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [isOtpModalOpen, setOtpModalOpen] = useState(false);


    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/auth/signup", {
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                password: form.password,
            });
            toast.success("Account created successfully! Please verify your email.");
            setOtpModalOpen(true);
        } catch (err) {
            // Error toast handled by axios
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (otp) => {
        setLoading(true);
        try {
            const response = await api.post("/auth/verify-signup-otp", {
                email: form.email,
                otp,
            });
            const { token, user } = response.data; // Assuming response is { data: { token, user } }
            login(user, token, "user");
            toast.success("Account verified successfully!");
            navigate("/");
        } catch (err) {
            // Error toast handled by axios
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Helper function for input class consistency
    const inputClass = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-800 outline-none transition";

    return (
        <>
            <OtpModal
                isOpen={isOtpModalOpen}
                onClose={() => setOtpModalOpen(false)}
                onSubmit={handleOtpSubmit}
                email={form.email}
                loading={loading}
            />
            {/* THEME: Light background for floating card effect */}
            <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
                {/* THEME: Elevated card style */}
                <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
                    <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">
                        Create Account
                    </h2>

                    <form onSubmit={submit} className="space-y-5">
                        {/* First Name Field */}
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

                        {/* Last Name Field */}
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

                        {/* Email Field */}
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

                        {/* Password Field */}
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
                                className={inputClass}
                            />
                        </div>

                        {/* Submission Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            // THEME: Primary CTA style with brand blue and strong shadow
                            className="w-full py-3 bg-blue-800 hover:bg-blue-900 text-white rounded-lg font-semibold transition disabled:opacity-50 shadow-xl shadow-blue-800/40"
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>

                        {/* Sign In Link */}
                        <div className="text-center text-sm text-gray-600 mt-2">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                // THEME: Link color uses brand blue
                                className="text-blue-800 font-medium hover:underline"
                            >
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