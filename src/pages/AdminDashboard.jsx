import React, { useEffect, useState } from "react";
import { DollarSign, ShoppingCart, Package, Users } from "lucide-react";
import { getDashboardStats } from "../api/adminService";

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
    <div className={`p-4 rounded-full mr-4 ${color}`}>{icon}</div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    newOrders: 0,
    productsListed: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getDashboardStats()
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setError("Failed to fetch dashboard data.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <div className="text-center p-8">Loading dashboard...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Sales"
          value={`₦${stats.totalSales.toLocaleString()}`}
          icon={<DollarSign className="w-6 h-6 text-white" />}
          color="bg-green-500"
        />
        <StatCard
          title="Active Orders"
          value={stats.newOrders}
          icon={<ShoppingCart className="w-6 h-6 text-white" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Products Listed"
          value={stats.productsListed}
          icon={<Package className="w-6 h-6 text-white" />}
          color="bg-purple-500"
        />
        <StatCard
          title="Customers"
          value={stats.totalUsers}
          icon={<Users className="w-6 h-6 text-white" />}
          color="bg-orange-500"
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
