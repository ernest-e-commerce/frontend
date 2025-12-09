import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">You are not logged in</h2>
        <Link 
          to="/login" 
          className="bg-black text-white px-6 py-2 rounded-lg"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>

        <div className="space-y-4">
          <div>
            <p className="text-gray-500 text-sm">Full Name</p>
            <p className="text-lg font-medium">{user.name}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Email</p>
            <p className="text-lg font-medium">{user.email}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Account Type</p>
            <p className="text-lg font-medium capitalize">
              {user.isAdmin ? "Admin" : "Customer"}
            </p>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Link
            to="/orders"
            className="bg-gray-800 text-white px-6 py-2 rounded-lg"
          >
            My Orders
          </Link>

          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
