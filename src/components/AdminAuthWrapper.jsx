// src/components/AdminAuthWrapper.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getCookie } from '../api/cookies';

const AdminAuthWrapper = () => {
  // 1. Check for authentication status
  // In a real app, you'd check a context/global state or validate a token.
  // For this example, we'll check a placeholder in localStorage.
  const adminToken = getCookie("adminToken")
  const isAdminLoggedIn = !!adminToken; 
  // 2. If not logged in, redirect to the admin login page
  if (!isAdminLoggedIn) {
    // Navigate will replace the current history entry
    return <Navigate to="/admin-login" replace />; 
  }

  // 3. If logged in, render the child route content (AdminLayout)
  return <Outlet />;
};

export default AdminAuthWrapper;