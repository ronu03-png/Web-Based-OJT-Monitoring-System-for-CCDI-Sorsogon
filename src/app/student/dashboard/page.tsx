import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, Clock, FileText, ListChecks, TrendingUp } from "lucide-react";

import { getCurrentUser } from "@/lib/auth/dal";
import { getStudentDashboardData } from "@/services/dashboard";
import { formatDate, formatHours, formatPercent } from "@/lib/format";

import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { ChartCard } from "@/components/shared/chart-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export default async function StudentDashboardPage() {
  const user = await getCurrentUser();
  if (!user.student) redirect("/unauthorized");

  const data = await getStudentDashboardData(user.student.id);
  if (!data) redirect("/unauthorized");

  const { student, taskStats, weeklyReportCount, dtrCount, recentDtr, recentTasks } = data;
  const remainingHours = Math.max(0, student.requiredHours - student.completedHours);
  const progressPercentage = Math.min(100, (student.completedHours / student.requiredHours) * 100);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${student.firstName}!`}
        description="Here's your OJT progress."
        actions={
          <>
            <Button asChild variant="outline">
              <Link href="/student/dtr">Add DTR</Link>
            </Button>
            <Button asChild>
              <Link href="/student/weekly-reports">Weekly Report</Link>
            </Button>
          </>
        }
      />

      {/* OJT Progress */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">OJT Progress</h2>
            <p className="text-sm text-muted-foreground">
              {formatHours(student.completedHours)} of {formatHours(student.requiredHours)} hours completed
            </p>
          </div>
          <StatusBadge status={student.status} />
        </div>
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{formatPercent(progressPercentage, 1)} complete</span>
          <span className="text-muted-foreground">{formatHours(remainingHours)} remaining</span>
        </div>
        <Progress value={progressPercentage} className="h-3" />
        {student.expectedEndDate && (
          <p className="mt-2 text-xs text-muted-foreground">
            Expected completion: <span className="font-medium text-foreground">{formatDate(student.expectedEndDate)}</span>
          </p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Required Hours" value={formatHours(student.requiredHours)} icon={Clock} />
        <StatCard label="Completed" value={formatHours(student.completedHours)} icon={CheckCircle2} tone="success" />
        <StatCard label="Remaining" value={formatHours(remainingHours)} icon={Clock} tone="warning" />
        <StatCard label="DTR Entries" value={dtrCount} icon={TrendingUp} />
      </div>

      {/* Task Progress + Weekly Reports */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Task Progress" description={`${taskStats.total} total tasks`}>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Completed</span>
              <span className="text-sm font-medium">{taskStats.completed}</span>
            </div>
            <Progress value={taskStats.total ? (taskStats.completed / taskStats.total) * 100 : 0} className="h-2" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Ongoing</span>
              <span className="text-sm font-medium">{taskStats.ongoing}</span>
            </div>
            <Progress value={taskStats.total ? (taskStats.ongoing / taskStats.total) * 100 : 0} className="h-2" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Undone</span>
              <span className="text-sm font-medium">{taskStats.undone}</span>
            </div>
            <Progress value={taskStats.total ? (taskStats.undone / taskStats.total) * 100 : 0} className="h-2" />
          </div>
        </ChartCard>

        <ChartCard title="Weekly Reports" description={`${weeklyReportCount} report(s) submitted`}>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Week 1</p>
                <p className="text-xs text-muted-foreground">Aug 3 - Aug 7, 2026</p>
              </div>
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">Submitted</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Week 2</p>
                <p className="text-xs text-muted-foreground">Aug 10 - Aug 14, 2026</p>
              </div>
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">Submitted</span>
            </div>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/student/weekly-reports">View All Reports</Link>
            </Button>
          </div>
        </ChartCard>
      </div>

      {/* Recent DTR + Recent Tasks */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Recent DTR Entries" description="Your latest daily time records">
          <div className="space-y-2">
            {recentDtr.map((dtr) => (
              <div key={dtr.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">{formatDate(dtr.date)}</p>
                  <p className="text-xs text-muted-foreground">
                    {dtr.timeIn ? new Date(dtr.timeIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--"} -
                    {dtr.timeOut ? new Date(dtr.timeOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{dtr.totalHours}h</p>
                  <StatusBadge status={dtr.status} />
                </div>
              </div>
            ))}
            {recentDtr.length === 0 && (
              <p className="py-4 text-center text-sm text-muted-foreground">No DTR entries yet.</p>
            )}
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/student/dtr">View All DTR</Link>
            </Button>
          </div>
        </ChartCard>

        <ChartCard title="Recent Tasks" description="Your latest task activities">
          <div className="space-y-2">
            {recentTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">{task.title}</p>
                  <p className="text-xs text-muted-foreground">{task.date ? formatDate(task.date) : "No date"}</p>
                </div>
                <StatusBadge status={task.status} />
              </div>
            ))}
            {recentTasks.length === 0 && (
              <p className="py-4 text-center text-sm text-muted-foreground">No tasks yet.</p>
            )}
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/student/tasks">View All Tasks</Link>
            </Button>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
