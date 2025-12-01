// src/components/AdminLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar'; // You need to create this

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar (left column) */}
      <AdminSidebar /> 
      
      {/* Main Content Area (right column) */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet /> {/* Renders AdminDashboard, AdminProducts, etc. */}
      </main>
    </div>
  );
};

export default AdminLayout;