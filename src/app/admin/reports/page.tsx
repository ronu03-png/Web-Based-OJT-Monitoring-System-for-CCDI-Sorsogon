import { FileText, BarChart3, Users, Clock, ListChecks } from "lucide-react";

import { prisma } from "@/lib/db/prisma";

import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { ChartCard } from "@/components/shared/chart-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Card } from "@/components/ui/card";

export default async function AdminReportsPage() {
  const [studentCount, dtrCount, weeklyReportCount, taskCount] = await Promise.all([
    prisma.student.count(),
    prisma.dtrRecord.count(),
    prisma.weeklyReport.count(),
    prisma.task.count(),
  ]);

  const statusSummary = await prisma.student.groupBy({
    by: ["status"],
    _count: { _all: true },
  });

  const courseSummary = await prisma.student.groupBy({
    by: ["course"],
    _count: { _all: true },
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Reports" description="System-wide OJT reports and statistics." />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Students" value={studentCount} icon={Users} />
        <StatCard label="DTR Entries" value={dtrCount} icon={Clock} tone="info" />
        <StatCard label="Weekly Reports" value={weeklyReportCount} icon={FileText} tone="success" />
        <StatCard label="Tasks" value={taskCount} icon={ListChecks} tone="warning" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Students by Status" description="OJT status distribution">
          {statusSummary.length === 0 ? (
            <EmptyState title="No data" description="No student records yet." />
          ) : (
            <ul className="space-y-3">
              {statusSummary.map((s) => (
                <li key={s.status} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{s.status.replace(/_/g, " ")}</span>
                  <span className="text-sm text-muted-foreground">{s._count._all}</span>
                </li>
              ))}
            </ul>
          )}
        </ChartCard>

        <ChartCard title="Students by Course" description="Distribution across programs">
          {courseSummary.length === 0 ? (
            <EmptyState title="No data" description="No student records yet." />
          ) : (
            <ul className="space-y-3">
              {courseSummary.map((c) => (
                <li key={c.course} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{c.course}</span>
                  <span className="text-sm text-muted-foreground">{c._count._all}</span>
                </li>
              ))}
            </ul>
          )}
        </ChartCard>
      </div>

      <Card className="p-6">
        <h2 className="mb-2 text-lg font-semibold">Export Reports</h2>
        <p className="text-sm text-muted-foreground">Data export functionality will be implemented in a future update.</p>
      </Card>
    </div>
  );
}
