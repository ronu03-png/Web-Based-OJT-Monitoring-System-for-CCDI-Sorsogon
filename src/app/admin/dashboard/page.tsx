import Link from "next/link";
import { Users, GraduationCap, TrendingUp, CheckCircle2, Clock, ArrowRight, FileText, Settings } from "lucide-react";

import { getAdminDashboardStats } from "@/services/dashboard";
import { getStatusMeta, type StatusVariant } from "@/lib/status-meta";
import { formatRelativeTime, formatDateTime, initialsOf } from "@/lib/format";

import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { ChartCard } from "@/components/shared/chart-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusPieChart } from "@/components/charts/status-pie-chart";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const VARIANT_COLOR: Record<StatusVariant, string> = {
  success: "var(--color-status-success)",
  warning: "var(--color-status-warning)",
  danger: "var(--color-status-danger)",
  info: "var(--color-status-info)",
  neutral: "var(--color-status-neutral)",
};

const QUICK_LINKS = [
  { label: "Students", href: "/admin/students", icon: Users, description: "View all student records" },
  { label: "OJT Records", href: "/admin/ojt-records", icon: GraduationCap, description: "Monitor OJT progress" },
  { label: "DTR Monitoring", href: "/admin/dtr-monitoring", icon: Clock, description: "Review DTR entries" },
  { label: "Accomplishment Reports", href: "/admin/accomplishment-reports", icon: FileText, description: "Weekly reports" },
  { label: "Reports", href: "/admin/reports", icon: TrendingUp, description: "Generate reports" },
  { label: "Settings", href: "/admin/settings", icon: Settings, description: "System settings" },
];

export default async function AdminDashboardPage() {
  const stats = await getAdminDashboardStats();

  const statusChartData = [
    { name: "Not Started", value: stats.notStartedCount, color: VARIANT_COLOR["neutral"] },
    { name: "Ongoing", value: stats.ongoingCount, color: VARIANT_COLOR["info"] },
    { name: "Completed", value: stats.completedCount, color: VARIANT_COLOR["success"] },
    { name: "Failed", value: stats.failedCount, color: VARIANT_COLOR["danger"] },
  ];

  const courseChartData = stats.courseStats.map((c) => ({
    name: c.course,
    value: c.count,
    color: `hsl(${(c.course.length * 45) % 360}, 70%, 50%)`,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        description="System-wide overview of students and OJT progress."
        actions={
          <Button asChild>
            <Link href="/admin/students">Manage Students</Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
        <StatCard label="Total Students" value={stats.totalStudents} icon={Users} />
        <StatCard label="Ongoing" value={stats.ongoingCount} icon={TrendingUp} tone="info" />
        <StatCard label="Completed" value={stats.completedCount} icon={CheckCircle2} tone="success" />
        <StatCard label="Not Started" value={stats.notStartedCount} icon={GraduationCap} tone="default" />
        <StatCard label="Total Hours" value={`${stats.totalCompletedHours.toFixed(0)}h`} icon={Clock} tone="warning" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Students by Status" description="Current OJT status distribution">
          <StatusPieChart data={statusChartData} />
        </ChartCard>
        <ChartCard title="Students by Course" description="Distribution across courses">
          <StatusPieChart data={courseChartData} />
        </ChartCard>
      </div>

      <ChartCard title="Quick Links" description="Jump to common administrative tasks">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex flex-col gap-2 rounded-lg border p-4 transition-colors hover:border-primary hover:bg-accent"
            >
              <link.icon className="size-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">{link.label}</p>
                <p className="text-xs text-muted-foreground">{link.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}
