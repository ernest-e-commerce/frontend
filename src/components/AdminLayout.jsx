import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <header className="mb-8 pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        </header>
        <div className="p-4 bg-white rounded-lg shadow-sm">
            <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;