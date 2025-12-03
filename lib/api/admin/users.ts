import { apiRequest } from '../request';

export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    country?: string;
    role: string;
    banned: boolean;
    banReason?: string;
    banExpires?: string;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
    _count?: {
        orders: number;
        reviews: number;
        customRequests: number;
    };
}

export interface UserStats {
    totalUsers: number;
    totalAdmins: number;
    bannedUsers: number;
    verifiedUsers: number;
    activeUsers: number;
}

export interface UsersListResponse {
    users: User[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

/**
 * Get all users with filters
 */
export const getUsers = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: 'user' | 'admin';
    banned?: boolean;
    sortBy?: 'createdAt' | 'name' | 'email';
    sortOrder?: 'asc' | 'desc';
}): Promise<UsersListResponse> => {
    try {
        const queryParams = new URLSearchParams();

        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.search) queryParams.append('search', params.search);
        if (params?.role) queryParams.append('role', params.role);
        if (params?.banned !== undefined) queryParams.append('banned', params.banned.toString());
        if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
        if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

        const response = await apiRequest<UsersListResponse>(`/api/v1/admin/users?${queryParams.toString()}`);

        // Debug logging
        console.log('=== GET USERS DEBUG ===');
        console.log('Full Response:', JSON.stringify(response, null, 2));
        console.log('Response.success:', response.success);
        console.log('Response.data:', response.data);
        console.log('Response.error:', response.error);
        console.log('======================');

        if (!response.success) {
            throw new Error(response.error || response.message || 'Failed to fetch users');
        }

        if (!response.data) {
            throw new Error('No data in response');
        }

        return response.data;
    } catch (error: any) {
        console.error('getUsers error:', error);
        throw error;
    }
};

/**
 * Get user by ID
 */
export const getUserById = async (id: string): Promise<User> => {
    const response = await apiRequest<User>(`/api/v1/admin/users/${id}`);
    if (!response.data) throw new Error(response.error || 'Failed to fetch user');
    return response.data;
};

/**
 * Update user details
 */
export const updateUser = async (
    id: string,
    data: {
        name?: string;
        email?: string;
        phone?: string;
        country?: string;
        role?: 'user' | 'admin';
    }
): Promise<User> => {
    const response = await apiRequest<User>(`/api/v1/admin/users/${id}`, {
        method: 'PATCH',
        body: data,
    });
    if (!response.data) throw new Error(response.error || 'Failed to update user');
    return response.data;
};

/**
 * Ban a user
 */
export const banUser = async (
    id: string,
    data: {
        reason: string;
        expiresAt?: string;
    }
): Promise<User> => {
    const response = await apiRequest<User>(`/api/v1/admin/users/${id}/ban`, {
        method: 'PATCH',
        body: data,
    });
    if (!response.data) throw new Error(response.error || 'Failed to ban user');
    return response.data;
};

/**
 * Unban a user
 */
export const unbanUser = async (id: string): Promise<User> => {
    const response = await apiRequest<User>(`/api/v1/admin/users/${id}/unban`, {
        method: 'PATCH',
    });
    if (!response.data) throw new Error(response.error || 'Failed to unban user');
    return response.data;
};

/**
 * Get user's order history
 */
export const getUserOrders = async (
    id: string,
    params?: {
        page?: number;
        limit?: number;
        status?: string;
    }
): Promise<any> => {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);

    const response = await apiRequest<any>(`/api/v1/admin/users/${id}/orders?${queryParams.toString()}`);
    if (!response.data) throw new Error(response.error || 'Failed to fetch user orders');
    return response.data;
};

/**
 * Get user statistics
 */
export const getUserStats = async (): Promise<UserStats> => {
    const response = await apiRequest<UserStats>('/api/v1/admin/users/stats');
    if (!response.data) throw new Error(response.error || 'Failed to fetch user stats');
    return response.data;
};
