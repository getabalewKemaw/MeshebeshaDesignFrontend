"use client";

import { useState, type ReactNode } from "react";
import { Menu, Search, X } from "lucide-react";
import { UserMenu } from "@/components/UserMenu";
import AdminSidebar from "@/components/admin/AdminSidebar";

interface AdminLayoutShellProps {
  children: ReactNode;
}

export default function AdminLayoutShell({ children }: AdminLayoutShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {/* Mobile sidebar overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${
          mobileSidebarOpen ? "block" : "hidden"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setMobileSidebarOpen(false)}
        />
        <div className="relative flex h-full w-72 max-w-xs">
          <AdminSidebar onNavigate={() => setMobileSidebarOpen(false)} />
        </div>
        <button
          type="button"
          aria-label="Close sidebar"
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow"
          onClick={() => setMobileSidebarOpen(false)}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:z-30">
        <AdminSidebar />
      </div>

      {/* Main content column */}
      <div className="flex min-h-screen flex-1 flex-col lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur-md">
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Open sidebar"
                className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white p-2 text-gray-700 hover:bg-gray-100 lg:hidden"
                onClick={() => setMobileSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Admin
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  Control Center
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-500">
                <Search className="mr-2 h-4 w-4 text-gray-400" />
                <span className="whitespace-nowrap">
                  Search orders, products, customers...
                </span>
              </div>
              <UserMenu />
            </div>
          </div>
        </header>

        {/* Scrollable page content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
