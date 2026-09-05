import { redirect } from "next/navigation";
import { BarChart3, Clock, FileText, TrendingUp } from "lucide-react";

import { getCurrentUser } from "@/lib/auth/dal";
import { getStudentDashboardData } from "@/services/dashboard";
import { getStudentDtrSummary } from "@/services/dtr";
import { getStudentWeeklyReports } from "@/services/weekly-reports";
import { getTaskStats } from "@/services/tasks";
import { formatDate, formatHours, formatPercent } from "@/lib/format";

import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { ChartCard } from "@/components/shared/chart-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default async function StudentReportsPage() {
  const user = await getCurrentUser();
  if (!user.student) redirect("/unauthorized");

  const [dashData, dtrSummary, weeklyReports, taskStats] = await Promise.all([
    getStudentDashboardData(user.student.id),
    getStudentDtrSummary(user.student.id),
    getStudentWeeklyReports(user.student.id),
    getTaskStats(user.student.id),
  ]);

  if (!dashData) redirect("/unauthorized");
  const { student } = dashData;
  const remainingHours = Math.max(0, student.requiredHours - student.completedHours);
  const progressPercentage = Math.min(100, (student.completedHours / student.requiredHours) * 100);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Overview of your OJT performance and progress."
      />

      {/* OJT Summary */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Required Hours" value={formatHours(student.requiredHours)} icon={Clock} />
        <StatCard label="Completed" value={formatHours(student.completedHours)} icon={TrendingUp} tone="success" />
        <StatCard label="Remaining" value={formatHours(remainingHours)} icon={Clock} tone="warning" />
        <StatCard label="Progress" value={formatPercent(progressPercentage, 1)} icon={BarChart3} tone="info" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* OJT Progress Card */}
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">OJT Progress</h2>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{formatPercent(progressPercentage, 1)} complete</span>
            <StatusBadge status={student.status} />
          </div>
          <Progress value={progressPercentage} className="h-4" />
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Company</p>
              <p className="font-medium">{student.companyName ?? "--"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Designation</p>
              <p className="font-medium">{student.designation ?? "--"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Start Date</p>
              <p className="font-medium">{student.startDate ? formatDate(student.startDate) : "--"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Expected End</p>
              <p className="font-medium">{student.expectedEndDate ? formatDate(student.expectedEndDate) : "--"}</p>
            </div>
          </div>
        </Card>

        {/* DTR Summary */}
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">DTR Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Entries</span>
              <span className="font-medium">{dtrSummary.recordCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Present Days</span>
              <span className="font-medium text-green-600">{dtrSummary.presentCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Late Days</span>
              <span className="font-medium text-yellow-600">{dtrSummary.lateCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Absent Days</span>
              <span className="font-medium text-red-600">{dtrSummary.absentCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Excused Days</span>
              <span className="font-medium text-blue-600">{dtrSummary.excusedCount}</span>
            </div>
            <div className="mt-3 border-t pt-3">
              <div className="flex justify-between text-sm font-medium">
                <span>Total Hours</span>
                <span>{dtrSummary.totalHours.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Weekly Reports */}
      <ChartCard title="Weekly Accomplishment Reports" description={`${weeklyReports.length} report(s) submitted`}>
        <div className="space-y-2">
          {weeklyReports.map((report) => (
            <div key={report.id} className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Week {report.weekNumber}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(report.weekStartDate)} - {formatDate(report.weekEndDate)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{report.totalHours.toFixed(1)} hrs</p>
                <StatusBadge status={report.status} />
              </div>
            </div>
          ))}
          {weeklyReports.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">No weekly reports submitted yet.</p>
          )}
        </div>
      </ChartCard>

      {/* Task Summary */}
      <ChartCard title="Task Summary" description={`${taskStats.total} total tasks`}>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="rounded-lg border p-4">
            <p className="text-2xl font-bold text-green-600">{taskStats.completed}</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-2xl font-bold text-blue-600">{taskStats.ongoing}</p>
            <p className="text-sm text-muted-foreground">Ongoing</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-2xl font-bold text-orange-600">{taskStats.undone}</p>
            <p className="text-sm text-muted-foreground">Undone</p>
          </div>
        </div>
      </ChartCard>
    </div>
  );
}
