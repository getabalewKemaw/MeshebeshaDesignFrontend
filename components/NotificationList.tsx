"use client";

import { useEffect, useState } from "react";
import { getNotifications, markAsRead, markAllAsRead, deleteNotification, type Notification } from "@/lib/api/notifications";
import { useAuth } from "@/lib/hooks/useAuth";
import { CheckCircle2, Trash2, Circle, Package, DollarSign, AlertTriangle, Star, Bell } from "lucide-react";

export default function NotificationList() {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadNotifications = async () => {
      setLoading(true);
      const response = await getNotifications({ limit: 20, unreadOnly: false });
      if (response.success && response.data) {
        setNotifications(response.data);
        setUnreadCount(response.unreadCount || 0);
      }
      setLoading(false);
    };

    loadNotifications();
    // Poll every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleMarkAsRead = async (id: string) => {
    const response = await markAsRead(id);
    if (response.success) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  const handleMarkAllAsRead = async () => {
    const response = await markAllAsRead();
    if (response.success) {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    }
  };

  const handleDelete = async (id: string) => {
    const response = await deleteNotification(id);
    if (response.success) {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      const deleted = notifications.find((n) => n.id === id);
      if (deleted && !deleted.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    }
  };

  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    const iconClass = "h-5 w-5";
    switch (type.toLowerCase()) {
      case 'order':
      case 'new_order':
        return <Package className={iconClass} />;
      case 'payment':
      case 'payment_received':
        return <DollarSign className={iconClass} />;
      case 'stock':
      case 'low_stock':
        return <AlertTriangle className={iconClass} />;
      case 'review':
      case 'new_review':
        return <Star className={iconClass} />;
      default:
        return <Bell className={iconClass} />;
    }
  };

  // Get color based on notification type
  const getNotificationColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'order':
      case 'new_order':
        return 'from-blue-500 to-blue-600';
      case 'payment':
      case 'payment_received':
        return 'from-green-500 to-green-600';
      case 'stock':
      case 'low_stock':
        return 'from-orange-500 to-orange-600';
      case 'review':
      case 'new_review':
        return 'from-yellow-500 to-yellow-600';
      default:
        return 'from-[#310101] to-[#500202]';
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900">All Notifications</h2>
            {unreadCount > 0 && (
              <span className="px-3 py-1 bg-[#310101] text-white text-xs font-bold rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 text-sm text-[#310101] hover:text-[#500202] font-semibold transition-colors group"
            >
              <CheckCircle2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#310101] mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications yet</h3>
            <p className="text-sm text-gray-500">
              You're all caught up! New notifications will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-200 ${!notification.isRead
                    ? "bg-[#310101]/5 border-[#310101]/20 shadow-sm hover:shadow-md"
                    : "bg-gray-50/50 border-gray-200 hover:border-gray-300"
                  }`}
              >
                {/* Unread indicator bar */}
                {!notification.isRead && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#310101] to-[#500202]" />
                )}

                <div className="p-4 pl-5">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${getNotificationColor(notification.type)} flex items-center justify-center text-white shadow-md`}>
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900 leading-relaxed">
                            {typeof notification.data === "object" && notification.data?.message
                              ? String(notification.data.message)
                              : notification.type}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <span className="inline-block w-1 h-1 bg-gray-400 rounded-full" />
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>

                        {/* Status badge */}
                        {!notification.isRead && (
                          <span className="flex-shrink-0 flex items-center gap-1 px-2 py-1 bg-[#310101] text-white text-xs font-bold rounded-full">
                            <Circle className="h-2 w-2 fill-current" />
                            New
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-3">
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="flex items-center gap-1.5 text-xs text-[#310101] hover:text-[#500202] font-semibold px-3 py-1.5 rounded-lg hover:bg-[#310101]/10 transition-all"
                            title="Mark as read"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Mark read
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
