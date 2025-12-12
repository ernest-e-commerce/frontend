import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { Package, Eye, X, ShoppingCart, User, MapPin } from 'lucide-react';


// Helper to style status badges
const getStatusBadge = (status) => {
    switch (status) {
        case 'Delivered':
            return 'bg-green-100 text-green-800';
        case 'Shipped':
            return 'bg-blue-100 text-blue-800';
        case 'Processing':
        case 'Pending Payment':
            return 'bg-yellow-100 text-yellow-800';
        case 'Cancelled':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const OrderDetailModal = ({ orderId, onClose }) => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [updateError, setUpdateError] = useState(null);

    const fetchOrder = useCallback(async () => {
        if (!orderId) return;
        try {
            setLoading(true);
            setError(null);
            const response = await api.get(`/admin/orders/${orderId}`);
            setOrder(response);
            setNewStatus(response.status);
        } catch (err) {
            setError('Failed to fetch order details.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [orderId]);

    useEffect(() => {
        fetchOrder();
    }, [fetchOrder]);

        const handleStatusUpdate = async () => {
        setUpdatingStatus(true);
        setUpdateError(null);
        try {
            await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
            await fetchOrder(); // Refetch to show updated status
        } catch (err) {
            setUpdateError(err.response?.data?.message || 'Failed to update status.');
            console.error(err);
        } finally {
            setUpdatingStatus(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-[#000000b8] bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300">
            <div className="bg-gray-50 rounded-lg shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col">
                <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center rounded-t-lg">
                    <h3 className="text-xl font-semibold text-gray-800">Order Details</h3>
                    <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="overflow-y-auto p-6">
                    {loading && <div className="p-8 text-center text-gray-600">Loading order details...</div>}
                    {error && <div className="p-8 text-center text-red-500">{error}</div>}
                    
                    {order && (
                        <div className="space-y-8">
                            <div className="p-4 bg-white rounded-lg shadow-sm border">
                                <p className="text-sm text-gray-500">Order ID</p>
                                <p className="font-mono text-gray-800">{order._id}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                                <div className="bg-white p-4 rounded-lg shadow-sm border">
                                    <p className="text-sm text-gray-500">Order Date</p>
                                    <p className="font-semibold text-gray-800">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm border">
                                    <p className="text-sm text-gray-500">Total Amount</p>
                                    <p className="font-semibold text-gray-800">₦{order.totalAmount.toLocaleString()}</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm border">
                                    <p className="text-sm text-gray-500">Order Status</p>
                                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadge(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm border">
                                    <p className="text-sm text-gray-500">Payment</p>
                                    <p className="font-semibold text-gray-800">{order.paymentMethod.replace('_', ' ')}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white p-6 rounded-lg shadow-sm border">
                                    <h4 className="font-semibold text-lg text-gray-800 mb-4 flex items-center"><User className="w-5 h-5 mr-2 text-gray-500"/>Customer Details</h4>
                                    <p><strong>Name:</strong> {order.userId ? `${order.userId.firstName} ${order.userId.lastName}` : 'N/A'}</p>
                                    <p><strong>Email:</strong> {order.userId ? order.userId.email : 'N/A'}</p>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow-sm border">
                                    <h4 className="font-semibold text-lg text-gray-800 mb-4 flex items-center"><MapPin className="w-5 h-5 mr-2 text-gray-500"/>Shipping Address</h4>
                                    <p>{order.shippingAddress.fullName}</p>
                                    <p>{order.shippingAddress.street}</p>
                                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                                    <p>{order.shippingAddress.country}</p>
                                </div>
                            </div>

                              <div>
                                <h4 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
                                    <Package className="w-5 h-5 mr-2 text-gray-500"/>Update Order Status
                                </h4>
                                <div className="bg-white p-6 rounded-lg shadow-sm border">
                                    <div className="flex items-center gap-4">
                                        <select
                                            value={newStatus}
                                            onChange={(e) => setNewStatus(e.target.value)}
                                            className="grow p-2 border rounded-md bg-white"
                                            disabled={updatingStatus}
                                        >
                                            {['Pending Payment', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={handleStatusUpdate}
                                            disabled={updatingStatus || newStatus === order.status}
                                            className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                                        >
                                            {updatingStatus ? 'Updating...' : 'Update Status'}
                                        </button>
                                    </div>
                                    {updateError && <p className="text-red-500 text-sm mt-2">{updateError}</p>}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-lg text-gray-800 mb-4 flex items-center"><ShoppingCart className="w-5 h-5 mr-2 text-gray-500"/>Items Ordered ({order.items.length})</h4>
                                <div className="bg-white rounded-lg shadow-sm border divide-y">
                                    {order.items.map(item => (
                                        <div key={item.productId._id} className="flex items-center p-4 gap-4">
                                            <img src={item.productId.media[0]?.url || '/placeholder.png'} alt={item.name} className="w-20 h-20 object-cover rounded-md bg-gray-100"/>
                                            <div className="grow">
                                                <p className="font-semibold text-gray-800">{item.name}</p>
                                                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-semibold text-gray-800">₦{(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const selectedOrderId = searchParams.get('view_order');

  const fetchOrders = useCallback(async () => {
        try {
            const response = await api.get('/admin/orders');
            setOrders(response);
        } catch (err) {
            setError('Failed to fetch orders.');
            console.error(err);
        }
    }, []);

    useEffect(() => {
        const initialLoad = async () => {
            setLoading(true);
            await fetchOrders();
            setLoading(false);
        };
        initialLoad();
    }, [fetchOrders]);

    const handleViewOrder = (orderId) => {
        setSearchParams({ view_order: orderId });
    };

    const handleCloseModal = () => {
        setSearchParams({});
        fetchOrders(); // Refetch orders to reflect any status changes
    };

    if (loading) {
        return <div className="text-center p-8">Loading orders...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-500">{error}</div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">
                Order Management ({orders.length} Total)
            </h2>

            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total (₦)</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 font-mono">
                                    ...{order._id.slice(-8)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {order.userId ? `${order.userId.firstName} ${order.userId.lastName}` : 'Guest'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                    ₦{order.totalAmount.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button 
                                        onClick={() => handleViewOrder(order._id)}
                                        className="text-orange-600 hover:text-orange-900 flex items-center gap-1 cursor-pointer"
                                    >
                                        <Eye className="w-4 h-4" />
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {orders.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <Package className="mx-auto w-12 h-12 mb-4 text-gray-300" />
                        <p>No orders found.</p>
                    </div>
                )}
            </div>

            {selectedOrderId && <OrderDetailModal orderId={selectedOrderId} onClose={handleCloseModal} />}
        </div>
    );
};

export default AdminOrders;