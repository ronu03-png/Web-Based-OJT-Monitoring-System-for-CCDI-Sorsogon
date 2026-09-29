import { FileText, Users, Clock, ListChecks } from "lucide-react";

import { prisma } from "@/lib/db/prisma";

import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { ChartCard } from "@/components/shared/chart-card";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card } from "@/components/ui/card";

export default async function AdminReportsPage() {
  const [studentCount, dtrCount, weeklyReportCount, taskCount] = await Promise.all([
    prisma.student.count(),
    prisma.dtrRecord.count(),
    prisma.weeklyReport.count(),
    prisma.task.count(),
  ]);

  const students = await prisma.student.findMany({
    orderBy: { lastName: "asc" },
    select: { id: true, firstName: true, lastName: true, studentId: true, status: true, course: true, yearLevel: true, section: true },
  });

  const statusOrder = ["ONGOING", "COMPLETED", "NOT_STARTED", "FAILED"];
  const byStatus = statusOrder.map((status) => ({
    status,
    students: students.filter((s) => s.status === status),
  })).filter((g) => g.students.length > 0);

  const courseOrder = [...new Set(students.map((s) => s.course).filter(Boolean))].sort();
  const byCourse = courseOrder.map((course) => ({
    course: course!,
    students: students.filter((s) => s.course === course),
  }));

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
        <ChartCard title="Students by Status" description="OJT status distribution with student list">
          {byStatus.length === 0 ? (
            <EmptyState title="No data" description="No student records yet." />
          ) : (
            <div className="space-y-4">
              {byStatus.map((g) => (
                <div key={g.status}>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={g.status} />
                      <span className="text-xs text-muted-foreground">({g.students.length})</span>
                    </div>
                  </div>
                  <ul className="space-y-1.5 rounded-lg border bg-muted/20 px-3 py-2">
                    {g.students.map((s) => (
                      <li key={s.id} className="flex items-center justify-between text-sm">
                        <span className="font-medium">{s.lastName}, {s.firstName}</span>
                        <span className="text-xs text-muted-foreground">{s.studentId} &middot; {s.course} {s.yearLevel}-{s.section}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </ChartCard>

        <ChartCard title="Students by Course" description="Distribution across programs with student list">
          {byCourse.length === 0 ? (
            <EmptyState title="No data" description="No student records yet." />
          ) : (
            <div className="space-y-4">
              {byCourse.map((g) => (
                <div key={g.course}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold">{g.course}</span>
                    <span className="text-xs text-muted-foreground">({g.students.length} students)</span>
                  </div>
                  <ul className="space-y-1.5 rounded-lg border bg-muted/20 px-3 py-2">
                    {g.students.map((s) => (
                      <li key={s.id} className="flex items-center justify-between text-sm">
                        <span className="font-medium">{s.lastName}, {s.firstName}</span>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={s.status} className="text-[10px]" />
                          <span className="text-xs text-muted-foreground">{s.studentId}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
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
