import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminAuthWrapper = () => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/admin-login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminAuthWrapper;
