"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import type { NavItem } from "@/lib/nav-config";

export function Sidebar({
  navItems,
  collapsed,
  mobileOpen,
  onMobileClose,
}: {
  navItems: NavItem[];
  collapsed: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-200 lg:translate-x-0",
          collapsed ? "lg:w-[4.5rem]" : "lg:w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-sidebar-border px-4">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-white p-1 shadow-sm">
            <Image
              src="/assets/ccdi-logo.png"
              alt="CCDI Sorsogon logo"
              width={28}
              height={28}
              className="h-auto w-full object-contain"
            />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">CCDI Sorsogon</p>
              <p className="truncate text-[11px] text-sidebar-foreground/60">OJT Monitoring</p>
            </div>
          )}
          <button
            type="button"
            className="ml-auto cursor-pointer text-sidebar-foreground/70 hover:text-sidebar-foreground lg:hidden"
            onClick={onMobileClose}
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  collapsed && "lg:justify-center lg:px-2"
                )}
              >
                <Icon className="size-[18px] shrink-0" />
                <span className={cn(collapsed && "lg:hidden")}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
