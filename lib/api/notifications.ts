/**
 * Notification API Service
 */

import { apiRequest, ApiResponse } from './request';

export interface Notification {
  id: string;
  userId: string;
  type: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}

export { type ApiResponse };


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

  return apiRequest<Notification[]>(`/api/v1/notifications?${params.toString()}`);
}

/**
 * Mark notification as read
 */
export async function markAsRead(id: string): Promise<ApiResponse<Notification>> {
  return apiRequest<Notification>(`/api/v1/notifications/${id}/read`, {
    method: 'PATCH',
  });
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead(): Promise<ApiResponse<void>> {
  return apiRequest<void>('/api/v1/notifications/read-all', {
    method: 'PATCH',
  });
}

/**
 * Delete notification
 */
export async function deleteNotification(id: string): Promise<ApiResponse<void>> {
  return apiRequest<void>(`/api/v1/notifications/${id}`, {
    method: 'DELETE',
  });
}









