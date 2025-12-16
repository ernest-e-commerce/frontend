import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getCookie } from '../api/cookies';

const AdminAuthWrapper = () => {
  const adminToken = getCookie("adminToken")
  const isAdminLoggedIn = !!adminToken;
  if (!isAdminLoggedIn) {
    return <Navigate to="/admin-login" replace />;
  }

  return <Outlet />;
};

export default AdminAuthWrapper;