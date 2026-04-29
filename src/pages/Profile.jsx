import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyOrders } from "../api/orderService";
import { User, ShoppingBag, LogOut } from "lucide-react";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(
    amount
  );

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (activeTab !== "orders") return;
    let cancelled = false;
    setOrdersLoading(true);
    getMyOrders()
      .then((data) => {
        if (!cancelled) setOrders(data);
      })
      .catch((err) => console.error("Failed to load orders:", err))
      .finally(() => {
        if (!cancelled) setOrdersLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  if (!user) return <Navigate to="/login" replace />;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="px-4 md:px-8 lg:px-16 py-10 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">My Account</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="md:col-span-1">
            <nav className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center gap-3 px-5 py-4 text-left text-sm font-medium transition ${
                  activeTab === "profile"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <User className="w-4 h-4" /> Profile
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center gap-3 px-5 py-4 text-left text-sm font-medium transition border-t border-gray-100 ${
                  activeTab === "orders"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <ShoppingBag className="w-4 h-4" /> Orders
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-5 py-4 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition border-t border-gray-100"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </nav>
          </aside>

          <section className="md:col-span-3">
            {activeTab === "profile" && (
              <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Profile Information
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Full Name
                  </label>
                  <p className="text-lg text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Email Address
                  </label>
                  <p className="text-lg text-gray-900">{user.email}</p>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Shipping Address
                  </h3>
                  <p className="text-lg text-gray-900">
                    {user.address || "Not provided"}
                  </p>
                  {(user.city || user.state || user.zip) && (
                    <p className="text-lg text-gray-900">
                      {user.city}
                      {user.city && user.state ? ", " : ""}
                      {user.state} {user.zip}
                    </p>
                  )}
                  {user.country && (
                    <p className="text-lg text-gray-900">{user.country}</p>
                  )}
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => navigate("/change-password")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  My Orders
                </h3>

                {ordersLoading && <p>Loading orders...</p>}

                {!ordersLoading && orders.length === 0 && (
                  <p className="text-gray-500">
                    You have not placed any orders yet.
                  </p>
                )}

                {!ordersLoading && orders.length > 0 && (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div
                        key={order._id}
                        className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="font-bold text-lg text-gray-800">
                              Order:{" "}
                              <span className="font-mono text-orange-600">
                                {order._id.slice(0, 8)}
                              </span>
                            </p>
                            <p className="text-sm text-gray-500">
                              Placed on: {formatDate(order.createdAt)}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 text-sm font-semibold rounded-full ${
                              order.status === "Delivered"
                                ? "bg-green-100 text-green-800"
                                : order.status === "Shipped"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "Processing"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "Pending Payment"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                          {order.items.map((item) => (
                            <div
                              key={item._id}
                              className="flex items-center justify-between py-2"
                            >
                              <p className="text-gray-700">
                                {item.name} × {item.quantity}
                              </p>
                              <p className="font-semibold text-gray-800">
                                {formatCurrency(item.price * item.quantity)}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-dashed border-gray-200 mt-4 pt-4 flex justify-between items-center">
                          <p className="text-gray-600">
                            Payment:{" "}
                            <span className="font-semibold">
                              {order.paymentMethod.replace("_", " ")}
                            </span>
                          </p>
                          <p className="text-xl font-bold text-gray-900">
                            Total: {formatCurrency(order.totalAmount)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
