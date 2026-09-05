import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  GraduationCap,
  ClipboardList,
  FolderKanban,
  CalendarClock,
  NotebookPen,
  FileCheck2,
  BarChart3,
  Megaphone,
  Settings,
  Users,
  FileText,
  Clock,
  ListChecks,
  Bell,
} from "lucide-react";
import type { UserRole } from "@/generated/prisma/enums";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  STUDENT: [
    { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
    { label: "My OJT", href: "/student/ojt", icon: GraduationCap },
    { label: "Daily Time Record", href: "/student/dtr", icon: Clock },
    { label: "Weekly Accomplishment", href: "/student/weekly-reports", icon: FileText },
    { label: "Tasks / Activities", href: "/student/tasks", icon: ListChecks },
    { label: "Narrative Summary", href: "/student/narrative-report", icon: NotebookPen },
    { label: "Reports", href: "/student/reports", icon: BarChart3 },
    { label: "Announcements", href: "/student/announcements", icon: Megaphone },
    { label: "Settings", href: "/student/settings", icon: Settings },
  ],
  ADMIN: [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Students", href: "/admin/students", icon: Users },
    { label: "OJT Records", href: "/admin/ojt-records", icon: GraduationCap },
    { label: "DTR Monitoring", href: "/admin/dtr-monitoring", icon: CalendarClock },
    { label: "Accomplishment Reports", href: "/admin/accomplishment-reports", icon: ClipboardList },
    { label: "Reports", href: "/admin/reports", icon: BarChart3 },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ],
};
