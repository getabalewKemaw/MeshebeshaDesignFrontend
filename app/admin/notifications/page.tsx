"use client";

import { Bell } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import NotificationList from "@/components/NotificationList";

export default function AdminNotificationsPage() {
  const { isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-gray-500">
        Access denied
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-indigo-50 p-2 text-indigo-600">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-sm text-gray-500">
              These are real notifications from your system: orders, payments, stock alerts,
              reviews, and other admin events.
            </p>
          </div>
        </div>
      </header>

      {/* Full notification list backed by /api/v1/notifications */}
      <NotificationList />
    </div>
  );
}
