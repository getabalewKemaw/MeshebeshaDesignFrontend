"use client";

import { Bell, BellRing } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import NotificationList from "@/components/NotificationList";

export default function AdminNotificationsPage() {
  const { isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#310101] mx-auto mb-4" />
          <p className="text-gray-600 text-sm">Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center bg-red-50 border-2 border-red-200 rounded-xl p-8 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-red-900 mb-2">Access Denied</h2>
          <p className="text-sm text-red-700">
            You don't have permission to view this page. Admin access required.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Modern Header */}
      <div className="mb-8">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#310101] to-[#500202] flex items-center justify-center shadow-lg">
            <BellRing className="h-7 w-7 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Notifications Center
            </h1>
            <p className="text-gray-600 leading-relaxed">
              Stay updated with real-time notifications from your system including orders,
              payments, stock alerts, reviews, and other important admin events.
            </p>
          </div>
        </div>

        {/* Decorative divider */}
        <div className="h-1 w-24 bg-gradient-to-r from-[#310101] to-[#500202] rounded-full" />
      </div>

      {/* Full notification list backed by /api/v1/notifications */}
      <NotificationList />
    </div>
  );
}
