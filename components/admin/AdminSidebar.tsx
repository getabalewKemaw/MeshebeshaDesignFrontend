"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Package,
  FolderTree,
  Truck,
  CreditCard,
  MessageSquare,
  Star,
  Layers,
  TrendingUp,
  Bell,
  User,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface AdminNavSection {
  label: string;
  items: AdminNavItem[];
}

const NAV_SECTIONS: AdminNavSection[] = [
  {
    label: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: TrendingUp }],
  },
  {
    label: "Store",
    items: [
      { href: "/admin/products", label: "Products", icon: Package },
      { href: "/admin/categories", label: "Categories", icon: FolderTree },
      { href: "/admin/stock", label: "Stock", icon: Layers },
      { href: "/admin/orders", label: "Orders", icon: Truck },
      { href: "/admin/payments", label: "Payments", icon: CreditCard },
      { href: "/admin/reviews", label: "Reviews", icon: Star },
      { href: "/admin/users", label: "Users", icon: Users },
    ],
  },
  {
    label: "Engagement",
    items: [
      { href: "/admin/custom-requests", label: "Custom Requests", icon: MessageSquare },
      { href: "/admin/chat", label: "Live Chat", icon: MessageSquare },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/admin/notifications", label: "Notifications", icon: Bell },
      { href: "/admin/profile", label: "Profile Settings", icon: User },
    ],
  },
];

interface AdminSidebarProps {
  onNavigate?: () => void;
  footerSlot?: ReactNode;
}

export default function AdminSidebar({ onNavigate, footerSlot }: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav className="flex h-full w-full flex-col bg-[var(--admin-primary)] text-slate-100 border-r border-slate-800">
      <div className="flex h-16 items-center gap-3 px-5 border-b border-white/10">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/20 text-lg font-bold text-purple-300">
          M
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold tracking-wide">Meshebesha Admin</span>
          <span className="text-[11px] text-slate-400">Store control center</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="space-y-2">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              {section.label}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${active
                      ? "bg-white/20 text-white"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                      }`}
                  >
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-md text-slate-200 ${active ? "bg-white/20" : "bg-white/5"
                        }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-800 px-4 py-3 text-[11px] text-slate-500 flex items-center justify-between">
        <span>Built for MeshebeshaDesign</span>
        {footerSlot}
      </div>
    </nav>
  );
}
