// src/components/AdminSidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
  // Define navigation links
  const links = [
    { name: 'Dashboard', path: '/admin', icon: '📊' },
    { name: 'Products', path: '/admin/products', icon: '📦' },
    { name: 'Orders', path: '/admin/orders', icon: '🛒' },
    { name: 'Users', path: '/admin/users', icon: '🧑‍💻' }, // Assuming you added this page
  ];

  // Tailwind classes for link styling
  const baseClasses = "flex items-center p-3 rounded-lg transition-colors duration-200";
  const activeClasses = "bg-orange-500 text-white shadow-md font-semibold";
  const inactiveClasses = "text-gray-700 hover:bg-gray-200";

  return (
    <div className="w-64 bg-white shadow-xl p-6 flex flex-col h-full border-r border-gray-200">
      
      {/* Header */}
      <div className="mb-8 pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-extrabold text-gray-900">Admin Panel</h2>
        <p className="text-sm text-orange-600 mt-1">Management Console</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow">
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                // 'end' prop ensures that '/admin' only matches the dashboard route exactly, 
                // preventing it from being active on '/admin/products'
                end={link.path === '/admin'} 
                className={({ isActive }) => 
                  `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
                }
              >
                <span className="text-xl mr-3">{link.icon}</span>
                <span className="text-sm">{link.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Optional: Footer or Exit Link */}
      <div className="mt-auto pt-4 border-t border-gray-200">
        <NavLink 
          to="/" 
          className="text-sm text-gray-600 hover:text-orange-500 flex items-center p-3"
        >
          <span className="text-lg mr-3">🏠</span>
          Back to Store
        </NavLink>
      </div>
      
    </div>
  );
};

export default AdminSidebar;