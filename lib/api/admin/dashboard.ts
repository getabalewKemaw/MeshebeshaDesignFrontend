import type { ApiResponse } from '@/types/product';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function dashboardRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {}),
            },
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Dashboard API error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Request failed',
        };
    }
}

export interface OverviewStats {
    totalProducts: number;
    activeProducts: number;
    totalOrders: number;
    totalRevenue: number;
    totalUsers: number;
    totalReviews: number;
    averageRating: number;
    pendingOrders: number;
    unreadMessages: number;
    lowStockItems: number;
    newOrdersToday: number;
}

export interface RevenueDataPoint {
    date: string;
    revenue: number;
    orders: number;
}

export interface OrderStatusBreakdown {
    status: string;
    count: number;
    percentage: number;
}

export interface TopProduct {
    id: string;
    title: string;
    slug: string;
    price: number;
    currency: string;
    totalSales: number;
    totalRevenue: number;
    image?: string | null;
}

export interface RecentOrder {
    id: string;
    orderNumber: string;
    total: number;
    currency: string;
    status: string;
    createdAt: string;
    customerName: string;
    customerEmail: string;
}

export interface UserGrowthDataPoint {
    date: string;
    newUsers: number;
    totalUsers: number;
}

export interface ReviewsStats {
    totalReviews: number;
    ratingDistribution: Array<{
        rating: number;
        count: number;
    }>;
    recentReviews: Array<{
        id: string;
        rating: number;
        comment: string | null;
        userName: string;
        productTitle: string;
        createdAt: string;
    }>;
}

/**
 * Get overview statistics
 */
export async function getOverviewStats(): Promise<ApiResponse<OverviewStats>> {
    return dashboardRequest<OverviewStats>('/api/v1/admin/dashboard/overview');
}

/**
 * Get revenue data over time
 */
export async function getRevenueStats(days: number = 30): Promise<ApiResponse<RevenueDataPoint[]>> {
    return dashboardRequest<RevenueDataPoint[]>(`/api/v1/admin/dashboard/revenue?days=${days}`);
}

/**
 * Get order statistics
 */
export async function getOrderStats(): Promise<ApiResponse<{
    total: number;
    breakdown: OrderStatusBreakdown[];
}>> {
    return dashboardRequest(`/api/v1/admin/dashboard/orders`);
}

/**
 * Get top products
 */
export async function getTopProducts(limit: number = 10): Promise<ApiResponse<TopProduct[]>> {
    return dashboardRequest<TopProduct[]>(`/api/v1/admin/dashboard/products?limit=${limit}`);
}

/**
 * Get recent orders
 */
export async function getRecentOrders(limit: number = 10): Promise<ApiResponse<RecentOrder[]>> {
    return dashboardRequest<RecentOrder[]>(`/api/v1/admin/dashboard/recent-orders?limit=${limit}`);
}

/**
 * Get user growth data
 */
export async function getUserGrowth(days: number = 30): Promise<ApiResponse<UserGrowthDataPoint[]>> {
    return dashboardRequest<UserGrowthDataPoint[]>(`/api/v1/admin/dashboard/users?days=${days}`);
}

/**
 * Get reviews statistics
 */
export async function getReviewsStats(): Promise<ApiResponse<ReviewsStats>> {
    return dashboardRequest<ReviewsStats>('/api/v1/admin/dashboard/reviews');
}
