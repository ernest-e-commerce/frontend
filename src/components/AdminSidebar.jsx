import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const links = [
    { name: 'Dashboard', path: '/admin', icon: '📊' },
    { name: 'Products', path: '/admin/products', icon: '📦' },
    { name: 'Orders', path: '/admin/orders', icon: '🛒' },
    { name: 'Users', path: '/admin/users', icon: '🧑‍💻' },
  ];

  const baseClasses = "flex items-center p-3 rounded-lg transition-colors duration-200";
  const activeClasses = "bg-orange-500 text-white shadow-md font-semibold";
  const inactiveClasses = "text-gray-700 hover:bg-gray-200";

  return (
    <div className="w-64 bg-white shadow-xl p-6 flex flex-col h-full border-r border-gray-200">
      <div className="mb-8 pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-extrabold text-gray-900">Admin Panel</h2>
        <p className="text-sm text-orange-600 mt-1">Management Console</p>
      </div>
      <nav className="grow">
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
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
      <div className="mt-auto pt-4 border-t border-gray-200">
        <NavLink
          to="/"
          className="text-sm text-gray-600 hover:text-orange-500 flex items-center p-3"
        >
          <span className="text-lg mr-3">🏠</span>
          Back to Store
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full text-left flex items-center p-3 text-sm text-gray-600 hover:text-orange-500"
        >
          <LogOut size={20} className="mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;