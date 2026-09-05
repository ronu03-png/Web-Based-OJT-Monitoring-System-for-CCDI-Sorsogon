"use client";

import Link from "next/link";
import { Bell } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface NotificationPreview {
  id: string;
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
}

export function NotificationBell({
  notifications,
  unreadCount,
  viewAllHref,
}: {
  notifications: NotificationPreview[];
  unreadCount: number;
  viewAllHref: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="relative cursor-pointer rounded-md p-2 text-muted-foreground outline-none hover:bg-accent hover:text-foreground"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
      >
        <Bell className="size-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 flex size-4 items-center justify-center rounded-full bg-brand-accent text-[10px] font-semibold text-brand-accent-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>
          Notifications {unreadCount > 0 && `(${unreadCount})`}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <p className="px-2 py-6 text-center text-sm text-muted-foreground">
            You&apos;re all caught up.
          </p>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((n) => (
              <DropdownMenuItem key={n.id} asChild>
                <Link
                  href={n.link ?? viewAllHref}
                  className={cn(
                    "flex-col items-start gap-0.5 py-2 whitespace-normal",
                    !n.isRead && "bg-accent/60"
                  )}
                >
                  <span className="text-sm font-medium text-foreground">{n.title}</span>
                  <span className="line-clamp-2 text-xs text-muted-foreground">{n.message}</span>
                </Link>
              </DropdownMenuItem>
            ))}
          </div>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={viewAllHref} className="justify-center text-sm font-medium text-primary">
            View all notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
