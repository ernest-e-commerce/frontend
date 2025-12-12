import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import api from "../api/axios";
import { User, ShoppingBag, LogOut } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'orders'
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (activeTab === 'orders') {
      const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await api.get('/order');
          setOrders(response);
        } catch (err) {
          setError(err.message || "Failed to fetch orders.");
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    }
  }, [activeTab]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  const formatCurrency = (amount) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(amount);
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });


  return (
    <div className="px-4 md:px-8 lg:px-16 py-10 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-orange-500 text-white flex items-center justify-center text-2xl font-bold">
                  {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{user.firstName} {user.lastName}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left font-semibold transition ${activeTab === 'profile' ? 'bg-orange-500 text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <User size={20} />
                  <span>My Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left font-semibold transition ${activeTab === 'orders' ? 'bg-orange-500 text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <ShoppingBag size={20} />
                  <span>My Orders</span>
                </button>
                <button
                  onClick={logout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left font-semibold text-red-500 hover:bg-red-50 transition"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold mb-8 text-gray-800">Profile Information</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                    <p className="text-lg text-gray-900">{user.firstName} {user.lastName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                    <p className="text-lg text-gray-900">{user.email}</p>
                  </div>
                  <div className="border-t pt-6">
                     <h3 className="text-xl font-bold text-gray-800 mb-4">Shipping Address</h3>
                     <p className="text-lg text-gray-900">{user.address || 'Not provided'}</p>
                     <p className="text-lg text-gray-900">{user.city || ''}, {user.state || ''} {user.zip || ''}</p>
                     <p className="text-lg text-gray-900">{user.country || ''}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold mb-8 text-gray-800">My Orders</h2>
                {loading && <p>Loading orders...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!loading && !error && (
                  <div className="space-y-6">
                    {orders.length > 0 ? (
                      orders.map(order => (
                        <div key={order._id} className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="font-bold text-lg text-gray-800">Order ID: <span className="font-mono text-orange-600">{order._id}</span></p>
                              <p className="text-sm text-gray-500">Placed on: {formatDate(order.createdAt)}</p>
                            </div>
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                                order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                order.status === 'Pending Payment' ? 'bg-gray-100 text-gray-800' :
                                'bg-red-100 text-red-800'
                            }`}>{order.status}</span>
                          </div>
                          <div className="border-t border-gray-200 pt-4">
                            {order.items.map(item => (
                              <div key={item._id} className="flex items-center justify-between py-2">
                                <p className="text-gray-700">{item.name} × {item.quantity}</p>
                                <p className="font-semibold text-gray-800">{formatCurrency(item.price * item.quantity)}</p>
                              </div>
                            ))}
                          </div>
                          <div className="border-t border-dashed border-gray-200 mt-4 pt-4 flex justify-between items-center">
                            <p className="text-gray-600">Payment Method: <span className="font-semibold">{order.paymentMethod.replace('_', ' ')}</span></p>
                            <p className="text-xl font-bold text-gray-900">Total: {formatCurrency(order.totalAmount)}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>You have not placed any orders yet.</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;