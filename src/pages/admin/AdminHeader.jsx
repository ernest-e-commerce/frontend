import React from 'react';
import { Plus, Search } from 'lucide-react';

const AdminHeader = ({ searchTerm, handleSearchChange, handleAddNew }) => {
  return (
    <div className="flex justify-between items-center mb-6 gap-4">
      <h2 className="text-3xl font-bold text-gray-800 whitespace-nowrap">Product Management</h2>
      <div className="flex-grow flex justify-center">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search products by name..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
        </div>
      </div>
      <button
        onClick={handleAddNew}
        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow whitespace-nowrap"
      >
        <Plus size={20} className="mr-2" />
        Add New Product
      </button>
    </div>
  );
};

export default AdminHeader;