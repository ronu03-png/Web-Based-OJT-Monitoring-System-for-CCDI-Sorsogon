import { redirect } from "next/navigation";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, getDay } from "date-fns";
import { CalendarClock, CheckCircle2, Clock, AlertCircle, Coffee } from "lucide-react";

import { getCurrentUser } from "@/lib/auth/dal";
import { getStudentDtrRecords, getStudentDtrSummary } from "@/services/dtr";
import { formatDate, formatHours } from "@/lib/format";

import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function StudentDtrPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user.student) redirect("/unauthorized");

  const { month } = await searchParams;
  const targetMonth = month ? new Date(month) : new Date();
  const { records, totalHours } = await getStudentDtrRecords(user.student.id, targetMonth);
  const summary = await getStudentDtrSummary(user.student.id);

  const monthLabel = format(targetMonth, "MMMM yyyy");
  const daysInMonth = eachDayOfInterval({ start: startOfMonth(targetMonth), end: endOfMonth(targetMonth) });
  const firstDayOfWeek = getDay(startOfMonth(targetMonth));

  const prevMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth() - 1, 1);
  const nextMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 1);

  const remainingHours = Math.max(0, user.student.requiredHours - summary.totalHours);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daily Time Record"
        description="View and manage your OJT attendance and hours."
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total Hours" value={formatHours(summary.totalHours)} icon={Clock} />
        <StatCard label="This Month" value={formatHours(totalHours)} icon={CalendarClock} />
        <StatCard label="Present Days" value={summary.presentCount} icon={CheckCircle2} tone="success" />
        <StatCard label="Remaining" value={formatHours(remainingHours)} icon={Clock} tone="warning" />
      </div>

      {/* Monthly Calendar View */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{monthLabel}</h2>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <a href={`?month=${format(prevMonth, "yyyy-MM-dd")}`}>Previous</a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href={`?month=${format(nextMonth, "yyyy-MM-dd")}`}>Next</a>
            </Button>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-muted-foreground">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="py-2">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for offset */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="h-24 rounded-lg border border-dashed border-muted" />
          ))}

          {daysInMonth.map((day) => {
            const record = records.find((r) => isSameDay(new Date(r.date), day));
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={day.toISOString()}
                className={`relative h-24 rounded-lg border p-2 text-sm ${
                  isToday ? "border-primary bg-primary/5" : "border-border"
                } ${record ? "bg-card" : "bg-muted/30"}`}
              >
                <span className={`font-medium ${isToday ? "text-primary" : ""}`}>{format(day, "d")}</span>
                {record && (
                  <div className="mt-1 space-y-0.5">
                    <div className="text-xs text-muted-foreground">
                      {record.timeIn ? format(new Date(record.timeIn), "HH:mm") : "--"} -
                      {record.timeOut ? format(new Date(record.timeOut), "HH:mm") : "--"}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">{record.totalHours}h</span>
                      <StatusBadge status={record.status} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* DTR Table */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold">DTR Entries</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-2 font-medium">Date</th>
                <th className="pb-2 font-medium">Day</th>
                <th className="pb-2 font-medium">Time In</th>
                <th className="pb-2 font-medium">Time Out</th>
                <th className="pb-2 font-medium">Break</th>
                <th className="pb-2 font-medium">Hours</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id} className="border-b last:border-0">
                  <td className="py-3">{format(new Date(r.date), "MMM d")}</td>
                  <td className="py-3">{format(new Date(r.date), "EEEE")}</td>
                  <td className="py-3">{r.timeIn ? format(new Date(r.timeIn), "h:mm aa") : "--"}</td>
                  <td className="py-3">{r.timeOut ? format(new Date(r.timeOut), "h:mm aa") : "--"}</td>
                  <td className="py-3">{r.breakMinutes} min</td>
                  <td className="py-3 font-medium">{r.totalHours.toFixed(2)}</td>
                  <td className="py-3"><StatusBadge status={r.status} /></td>
                  <td className="py-3 text-muted-foreground">{r.remarks ?? "--"}</td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-muted-foreground">
                    No DTR entries for this month.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {records.length > 0 && (
          <div className="mt-4 flex items-center justify-between border-t pt-4">
            <span className="text-sm text-muted-foreground">Total hours this month:</span>
            <span className="text-lg font-semibold">{totalHours.toFixed(2)} hours</span>
          </div>
        )}
      </Card>
    </div>
  );
}
