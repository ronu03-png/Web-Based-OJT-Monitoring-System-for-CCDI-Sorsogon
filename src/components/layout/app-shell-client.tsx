"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/nav-config";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import type { ProfileMenuUser } from "@/components/layout/profile-menu";
import type { NotificationPreview } from "@/components/layout/notification-bell";

export function AppShellClient({
  user,
  notifications,
  unreadCount,
  children,
}: {
  user: ProfileMenuUser;
  notifications: NotificationPreview[];
  unreadCount: number;
  children: React.ReactNode;
}) {
  const navItems = NAV_ITEMS[user.role];
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        navItems={navItems}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div
        className={cn(
          "flex min-h-screen flex-col transition-[margin] duration-200",
          collapsed ? "lg:ml-[4.5rem]" : "lg:ml-64"
        )}
      >
        <Navbar
          navItems={navItems}
          user={user}
          notifications={notifications}
          unreadCount={unreadCount}
          onMenuClick={() => setMobileOpen(true)}
          onToggleCollapse={() => setCollapsed((v) => !v)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
