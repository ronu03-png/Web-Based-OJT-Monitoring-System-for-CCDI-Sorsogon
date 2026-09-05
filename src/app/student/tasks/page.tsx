import Link from "next/link";
import { redirect } from "next/navigation";
import { ListChecks, Plus } from "lucide-react";

import { getCurrentUser } from "@/lib/auth/dal";
import { getStudentTasks, getTaskStats } from "@/services/tasks";
import { formatDate } from "@/lib/format";

import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default async function StudentTasksPage() {
  const user = await getCurrentUser();
  if (!user.student) redirect("/unauthorized");

  const [tasks, stats] = await Promise.all([
    getStudentTasks(user.student.id),
    getTaskStats(user.student.id),
  ]);

  const completedPct = stats.total ? (stats.completed / stats.total) * 100 : 0;
  const ongoingPct = stats.total ? (stats.ongoing / stats.total) * 100 : 0;
  const undonePct = stats.total ? (stats.undone / stats.total) * 100 : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks / Activities"
        description="Track and manage your OJT tasks and activities."
        actions={
          <Button asChild>
            <Link href="/student/tasks/new"><Plus className="mr-1 h-4 w-4" /> Add Task</Link>
          </Button>
        }
      />

      {/* Task Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total Tasks" value={stats.total} icon={ListChecks} />
        <StatCard label="Completed" value={stats.completed} tone="success" />
        <StatCard label="Ongoing" value={stats.ongoing} tone="info" />
        <StatCard label="Undone" value={stats.undone} tone="warning" />
      </div>

      {/* Progress Bars */}
      <Card className="p-5">
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">Task Distribution</h3>
        <div className="space-y-3">
          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span>Completed</span>
              <span className="font-medium">{stats.completed} ({completedPct.toFixed(0)}%)</span>
            </div>
            <Progress value={completedPct} className="h-2" />
          </div>
          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span>Ongoing</span>
              <span className="font-medium">{stats.ongoing} ({ongoingPct.toFixed(0)}%)</span>
            </div>
            <Progress value={ongoingPct} className="h-2" />
          </div>
          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span>Undone</span>
              <span className="font-medium">{stats.undone} ({undonePct.toFixed(0)}%)</span>
            </div>
            <Progress value={undonePct} className="h-2" />
          </div>
        </div>
      </Card>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <Card key={task.id} className="p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-medium">{task.title}</h3>
                <p className="text-sm text-muted-foreground">{task.description ?? "No description"}</p>
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  {task.date && <span>{formatDate(task.date)}</span>}
                  {task.skillsLearned && <span>&bull; {task.skillsLearned}</span>}
                </div>
              </div>
              <StatusBadge status={task.status} />
            </div>
          </Card>
        ))}

        {tasks.length === 0 && (
          <div className="rounded-xl border border-dashed p-12 text-center">
            <ListChecks className="mx-auto h-10 w-10 text-muted-foreground" />
            <h3 className="mt-3 text-lg font-medium">No Tasks Yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">Start recording your OJT tasks and activities.</p>
            <Button asChild className="mt-4">
              <Link href="/student/tasks/new">Add First Task</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
