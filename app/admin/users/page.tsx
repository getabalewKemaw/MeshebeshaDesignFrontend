'use client';

import { useState, useEffect } from 'react';
import { getUsers, getUserStats, banUser, unbanUser, type User, type UserStats } from '@/lib/api/admin/users';
import Link from 'next/link';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<'user' | 'admin' | ''>('');
    const [bannedFilter, setBannedFilter] = useState<boolean | ''>('');
    const [sortBy, setSortBy] = useState<'createdAt' | 'name' | 'email'>('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Pagination
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    // Ban modal
    const [showBanModal, setShowBanModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [banReason, setBanReason] = useState('');
    const [banExpires, setBanExpires] = useState('');

    useEffect(() => {
        fetchUsers();
        fetchStats();
    }, [page, roleFilter, bannedFilter, sortBy, sortOrder]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await getUsers({
                page,
                limit,
                search: search || undefined,
                role: roleFilter || undefined,
                banned: bannedFilter === '' ? undefined : bannedFilter,
                sortBy,
                sortOrder,
            });

            setUsers(response.users);
            setTotalPages(response.pagination.totalPages);
            setTotal(response.pagination.total);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const stats = await getUserStats();
            setStats(stats);
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchUsers();
    };

    const handleBanUser = async () => {
        if (!selectedUser || !banReason) return;

        try {
            await banUser(selectedUser.id, {
                reason: banReason,
                expiresAt: banExpires || undefined,
            });
            setShowBanModal(false);
            setBanReason('');
            setBanExpires('');
            setSelectedUser(null);
            fetchUsers();
            fetchStats();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to ban user');
        }
    };

    const handleUnbanUser = async (userId: string) => {
        if (!confirm('Are you sure you want to unban this user?')) return;

        try {
            await unbanUser(userId);
            fetchUsers();
            fetchStats();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to unban user');
        }
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">User Management</h1>
                <p className="text-gray-600">Manage users, roles, and permissions</p>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <p className="text-sm text-gray-600">Total Users</p>
                        <p className="text-2xl font-bold">{stats.totalUsers}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <p className="text-sm text-gray-600">Active Users</p>
                        <p className="text-2xl font-bold text-[#310101]">{stats.activeUsers}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <p className="text-sm text-gray-600">Admins</p>
                        <p className="text-2xl font-bold text-[#310101]">{stats.totalAdmins}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <p className="text-sm text-gray-600">Verified</p>
                        <p className="text-2xl font-bold text-[#310101]">{stats.verifiedUsers}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <p className="text-sm text-gray-600">Banned</p>
                        <p className="text-2xl font-bold text-red-600">{stats.bannedUsers}</p>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
                    <input
                        type="text"
                        placeholder="Search by name, email, or phone..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 min-w-[200px] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#310101]"
                    />

                    <select
                        value={roleFilter}
                        onChange={(e) => {
                            setRoleFilter(e.target.value as any);
                            setPage(1);
                        }}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#310101]"
                    >
                        <option value="">All Roles</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>

                    <select
                        value={bannedFilter === '' ? '' : bannedFilter.toString()}
                        onChange={(e) => {
                            setBannedFilter(e.target.value === '' ? '' : e.target.value === 'true');
                            setPage(1);
                        }}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#310101]"
                    >
                        <option value="">All Status</option>
                        <option value="false">Active</option>
                        <option value="true">Banned</option>
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#310101]"
                    >
                        <option value="createdAt">Created Date</option>
                        <option value="name">Name</option>
                        <option value="email">Email</option>
                    </select>

                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as any)}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#310101]"
                    >
                        <option value="desc">Descending</option>
                        <option value="asc">Ascending</option>
                    </select>

                    <button
                        type="submit"
                        className="px-6 py-2 bg-[#310101] text-white rounded-lg hover:bg-[#500202] transition"
                    >
                        Search
                    </button>
                </form>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contact
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Activity
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Joined
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                        Loading users...
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="font-medium text-gray-900">{user.name}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{user.phone || 'N/A'}</div>
                                            <div className="text-sm text-gray-500">{user.country || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin'
                                                    ? 'bg-[#310101]/10 text-[#310101]'
                                                    : 'bg-gray-100 text-gray-800'
                                                    }`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {user.banned ? (
                                                <div>
                                                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                                        Banned
                                                    </span>
                                                    {user.banReason && (
                                                        <div className="text-xs text-gray-500 mt-1">{user.banReason}</div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                    Active
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div>{user._count?.orders || 0} orders</div>
                                            <div>{user._count?.reviews || 0} reviews</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/admin/users/${user.id}`}
                                                    className="text-[#310101] hover:text-[#500202] font-semibold"
                                                >
                                                    View
                                                </Link>
                                                {user.role !== 'admin' && (
                                                    <>
                                                        {user.banned ? (
                                                            <button
                                                                onClick={() => handleUnbanUser(user.id)}
                                                                className="text-green-600 hover:text-green-900"
                                                            >
                                                                Unban
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedUser(user);
                                                                    setShowBanModal(true);
                                                                }}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                Ban
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
                        <div className="text-sm text-gray-700">
                            Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
                            <span className="font-medium">{Math.min(page * limit, total)}</span> of{' '}
                            <span className="font-medium">{total}</span> users
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                                className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                            >
                                Previous
                            </button>
                            <span className="px-4 py-2 border rounded-lg bg-white">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(page + 1)}
                                disabled={page === totalPages}
                                className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Ban Modal */}
            {showBanModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h2 className="text-xl font-bold mb-4">Ban User</h2>
                        <p className="text-gray-600 mb-4">
                            You are about to ban <strong>{selectedUser.name}</strong>
                        </p>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Reason <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={banReason}
                                onChange={(e) => setBanReason(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#310101]"
                                rows={3}
                                placeholder="Enter reason for banning..."
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ban Expires (Optional)
                            </label>
                            <input
                                type="datetime-local"
                                value={banExpires}
                                onChange={(e) => setBanExpires(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#310101]"
                            />
                            <p className="text-xs text-gray-500 mt-1">Leave empty for permanent ban</p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowBanModal(false);
                                    setBanReason('');
                                    setBanExpires('');
                                    setSelectedUser(null);
                                }}
                                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBanUser}
                                disabled={!banReason}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Ban User
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
