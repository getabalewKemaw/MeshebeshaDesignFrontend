'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getUserById, getUserOrders, updateUser, banUser, unbanUser, type User } from '@/lib/api/admin/users';
import Link from 'next/link';

export default function UserDetailPage() {
    const params = useParams();
    const router = useRouter();
    const userId = params.id as string;

    const [user, setUser] = useState<User | null>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'details' | 'orders'>('details');

    // Edit mode
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        email: '',
        phone: '',
        country: '',
        role: 'user' as 'user' | 'admin',
    });

    useEffect(() => {
        fetchUser();
        fetchOrders();
    }, [userId]);

    const fetchUser = async () => {
        try {
            setLoading(true);
            const userData = await getUserById(userId);
            setUser(userData);
            setEditForm({
                name: userData.name,
                email: userData.email,
                phone: userData.phone || '',
                country: userData.country || '',
                role: userData.role as 'user' | 'admin',
            });
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch user');
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        try {
            const ordersData = await getUserOrders(userId, { limit: 10 });
            setOrders(ordersData.orders);
        } catch (err) {
            console.error('Failed to fetch orders:', err);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateUser(userId, editForm);
            setIsEditing(false);
            fetchUser();
            alert('User updated successfully');
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to update user');
        }
    };

    const handleBan = async () => {
        const reason = prompt('Enter reason for banning:');
        if (!reason) return;

        try {
            await banUser(userId, { reason });
            fetchUser();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to ban user');
        }
    };

    const handleUnban = async () => {
        if (!confirm('Are you sure you want to unban this user?')) return;

        try {
            await unbanUser(userId);
            fetchUser();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to unban user');
        }
    };

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading user details...</p>
                </div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error || 'User not found'}
                </div>
                <Link href="/admin/users" className="text-blue-600 hover:underline mt-4 inline-block">
                    ← Back to Users
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <Link href="/admin/users" className="text-blue-600 hover:underline mb-2 inline-block">
                        ← Back to Users
                    </Link>
                    <h1 className="text-3xl font-bold">{user.name}</h1>
                    <p className="text-gray-600">{user.email}</p>
                </div>
                <div className="flex gap-2">
                    {user.role !== 'admin' && (
                        <>
                            {user.banned ? (
                                <button
                                    onClick={handleUnban}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    Unban User
                                </button>
                            ) : (
                                <button
                                    onClick={handleBan}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                    Ban User
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold">{user._count?.orders || 0}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600">Reviews</p>
                    <p className="text-2xl font-bold">{user._count?.reviews || 0}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600">Custom Requests</p>
                    <p className="text-2xl font-bold">{user._count?.customRequests || 0}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="text-2xl font-bold">
                        {user.banned ? (
                            <span className="text-red-600">Banned</span>
                        ) : (
                            <span className="text-green-600">Active</span>
                        )}
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow mb-6">
                <div className="border-b">
                    <div className="flex">
                        <button
                            onClick={() => setActiveTab('details')}
                            className={`px-6 py-3 font-medium ${activeTab === 'details'
                                ? 'border-b-2 border-blue-600 text-blue-600'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            User Details
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`px-6 py-3 font-medium ${activeTab === 'orders'
                                ? 'border-b-2 border-blue-600 text-blue-600'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Order History ({user._count?.orders || 0})
                        </button>
                    </div>
                </div>

                {/* Details Tab */}
                {activeTab === 'details' && (
                    <div className="p-6">
                        {isEditing ? (
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={editForm.email}
                                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                    <input
                                        type="text"
                                        value={editForm.phone}
                                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                                    <input
                                        type="text"
                                        value={editForm.country}
                                        onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                                    <select
                                        value={editForm.role}
                                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value as any })}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-100"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Name</p>
                                        <p className="font-medium">{user.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Email</p>
                                        <p className="font-medium">{user.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Phone</p>
                                        <p className="font-medium">{user.phone || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Country</p>
                                        <p className="font-medium">{user.country || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Role</p>
                                        <p className="font-medium capitalize">{user.role}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Email Verified</p>
                                        <p className="font-medium">{user.emailVerified ? 'Yes' : 'No'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Joined</p>
                                        <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Last Updated</p>
                                        <p className="font-medium">{new Date(user.updatedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                {user.banned && (
                                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                                        <p className="text-sm font-medium text-red-800">Ban Information</p>
                                        <p className="text-sm text-red-700 mt-1">Reason: {user.banReason}</p>
                                        {user.banExpires && (
                                            <p className="text-sm text-red-700">
                                                Expires: {new Date(user.banExpires).toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                )}

                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Edit User
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div className="p-6">
                        {orders.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No orders found</p>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <div key={order.id} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-medium">Order #{order.orderNumber}</p>
                                                <p className="text-sm text-gray-600">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <span
                                                className={`px-2 py-1 text-xs font-semibold rounded-full ${order.status === 'completed'
                                                    ? 'bg-green-100 text-green-800'
                                                    : order.status === 'shipped'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : order.status === 'paid'
                                                            ? 'bg-purple-100 text-purple-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}
                                            >
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            {order.items.length} item(s) • ${order.total.toFixed(2)}
                                        </p>
                                        <Link
                                            href={`/admin/orders?search=${order.orderNumber}`}
                                            className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                                        >
                                            View Order →
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
