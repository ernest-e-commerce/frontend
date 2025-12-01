import React from 'react';

const AdminDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome, Admin!</h1>
      {/* Summary cards, charts, etc. */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded shadow">Total Sales: ₦1,200,000</div>
        <div className="bg-white p-6 rounded shadow">New Orders: 15</div>
        <div className="bg-white p-6 rounded shadow">Products Listed: 45</div>
      </div>
    </div>
  );
};

export default AdminDashboard;