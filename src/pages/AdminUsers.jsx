import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { Users, Eye, X, Mail, Calendar, MapPin, UserCheck } from 'lucide-react';

const UserDetailModal = ({ userId, onClose }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) return;

        const fetchUser = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await api.get(`/admin/users/${userId}`);
                setUser(response);
            } catch (err) {
                setError('Failed to fetch user details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    return (
        <div className="fixed inset-0 bg-[#000000b8] bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300">
            <div className="bg-gray-50 rounded-lg shadow-2xl w-full max-w-2xl max-h-[95vh] flex flex-col">
                <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center rounded-t-lg">
                    <h3 className="text-xl font-semibold text-gray-800">User Details</h3>
                    <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="overflow-y-auto p-6">
                    {loading && <div className="p-8 text-center text-gray-600">Loading user details...</div>}
                    {error && <div className="p-8 text-center text-red-500">{error}</div>}
                    
                    {user && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <img src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`} alt="profile" className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-md"/>
                                <div>
                                    <h4 className="text-2xl font-bold text-gray-800">{user.firstName} {user.lastName}</h4>
                                    <p className="text-gray-500 font-mono text-sm">ID: {user.userId}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white p-4 rounded-lg shadow-sm border flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-gray-400"/>
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-semibold text-gray-800">{user.email}</p>
                                    </div>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm border flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-gray-400"/>
                                    <div>
                                        <p className="text-sm text-gray-500">Joined</p>
                                        <p className="font-semibold text-gray-800">{new Date(user.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm border flex items-center gap-3 col-span-1 md:col-span-2">
                                    <UserCheck className="w-5 h-5 text-gray-400"/>
                                    <div>
                                        <p className="text-sm text-gray-500">Verification Status</p>
                                        <p className={`font-semibold ${user.isVerified ? 'text-green-600' : 'text-red-600'}`}>
                                            {user.isVerified ? 'Verified' : 'Not Verified'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {(user.address || user.city) && (
                                <div className="bg-white p-6 rounded-lg shadow-sm border">
                                    <h4 className="font-semibold text-lg text-gray-800 mb-4 flex items-center"><MapPin className="w-5 h-5 mr-2 text-gray-500"/>Address</h4>
                                    <p>{user.address}</p>
                                    <p>{user.city}, {user.state} {user.zip}</p>
                                    <p>{user.country}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const selectedUserId = searchParams.get('view_user');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await api.get('/admin/users');
                setUsers(response);
            } catch (err) {
                setError('Failed to fetch users.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleViewUser = (userId) => {
        setSearchParams({ view_user: userId });
    };

    const handleCloseModal = () => {
        setSearchParams({});
    };

    if (loading) {
        return <div className="text-center p-8">Loading users...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-500">{error}</div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">
                User Management ({users.length} Total)
            </h2>

            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verified</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.userId} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {user.firstName} {user.lastName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {user.isVerified ? 'Yes' : 'No'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button 
                                        onClick={() => handleViewUser(user.userId)}
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
                {users.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <Users className="mx-auto w-12 h-12 mb-4 text-gray-300" />
                        <p>No users found.</p>
                    </div>
                )}
            </div>

            {selectedUserId && <UserDetailModal userId={selectedUserId} onClose={handleCloseModal} />}
        </div>
    );
};

export default AdminUsers;