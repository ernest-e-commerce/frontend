// src/pages/AdminOrders.jsx

import React from 'react';

const dummyOrders = [
    { id: 'ORD001', customer: 'Alice Johnson', date: '2025-11-25', total: 45000, status: 'Processing' },
    { id: 'ORD002', customer: 'Bob Smith', date: '2025-11-24', total: 12000, status: 'Shipped' },
    { id: 'ORD003', customer: 'Charlie Brown', date: '2025-11-23', total: 88000, status: 'Delivered' },
];

// Helper to style status badges
const getStatusBadge = (status) => {
    switch (status) {
        case 'Delivered':
            return 'bg-green-100 text-green-800';
        case 'Shipped':
            return 'bg-blue-100 text-blue-800';
        case 'Processing':
        default:
            return 'bg-yellow-100 text-yellow-800';
    }
};

const AdminOrders = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">Order Management ({dummyOrders.length} Recent)</h2>
      
      {/* Order List Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total (₦)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {dummyOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.customer}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">₦{order.total.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-orange-600 hover:text-orange-900">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;