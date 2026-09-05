"use client";

import { usePathname } from "next/navigation";
import { Menu, PanelLeft, Search } from "lucide-react";

import type { NavItem } from "@/lib/nav-config";
import { ROLE_BASE_PATH } from "@/lib/roles";
import { Input } from "@/components/ui/input";
import { ProfileMenu, type ProfileMenuUser } from "@/components/layout/profile-menu";
import { NotificationBell, type NotificationPreview } from "@/components/layout/notification-bell";

export function Navbar({
  navItems,
  user,
  notifications,
  unreadCount,
  onMenuClick,
  onToggleCollapse,
}: {
  navItems: NavItem[];
  user: ProfileMenuUser;
  notifications: NotificationPreview[];
  unreadCount: number;
  onMenuClick: () => void;
  onToggleCollapse: () => void;
}) {
  const pathname = usePathname();
  const current = navItems.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  );

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b bg-card px-4 sm:px-6">
      <button
        type="button"
        className="cursor-pointer text-muted-foreground hover:text-foreground lg:hidden"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </button>
      <button
        type="button"
        className="hidden cursor-pointer text-muted-foreground hover:text-foreground lg:inline-flex"
        onClick={onToggleCollapse}
        aria-label="Toggle sidebar"
      >
        <PanelLeft className="size-5" />
      </button>

      <h1 className="truncate text-base font-semibold text-foreground">
        {current?.label ?? "Dashboard"}
      </h1>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-3">
        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search..." className="w-44 pl-8 lg:w-64" aria-label="Search" />
        </div>
        <NotificationBell
          notifications={notifications}
          unreadCount={unreadCount}
          viewAllHref={`${ROLE_BASE_PATH[user.role]}/notifications`}
        />
        <ProfileMenu user={user} />
      </div>
    </header>
  );
}
