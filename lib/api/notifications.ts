/**
 * Notification API Service
 */

export interface Notification {
  id: string;
  userId: string;
  type: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  unreadCount?: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'An error occurred',
      };
    }

    return data;
  } catch (error) {
    console.error('API call failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * Get all notifications
 */
export async function getNotifications(
  options?: { limit?: number; offset?: number; unreadOnly?: boolean }
): Promise<ApiResponse<Notification[]>> {
  const params = new URLSearchParams();
  if (options?.limit) params.append('limit', options.limit.toString());
  if (options?.offset) params.append('offset', options.offset.toString());
  if (options?.unreadOnly) params.append('unreadOnly', 'true');

  return apiCall<Notification[]>(`/api/v1/notifications?${params.toString()}`);
}

/**
 * Mark notification as read
 */
export async function markAsRead(id: string): Promise<ApiResponse<Notification>> {
  return apiCall<Notification>(`/api/v1/notifications/${id}/read`, {
    method: 'PATCH',
  });
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead(): Promise<ApiResponse<void>> {
  return apiCall<void>('/api/v1/notifications/read-all', {
    method: 'PATCH',
  });
}

/**
 * Delete notification
 */
export async function deleteNotification(id: string): Promise<ApiResponse<void>> {
  return apiCall<void>(`/api/v1/notifications/${id}`, {
    method: 'DELETE',
  });
}





