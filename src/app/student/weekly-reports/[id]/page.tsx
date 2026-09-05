import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft, Printer, Clock, Calendar } from "lucide-react";

import { getCurrentUser } from "@/lib/auth/dal";
import { getWeeklyReportById } from "@/services/weekly-reports";
import { formatDate } from "@/lib/format";

import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function StudentWeeklyReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user.student) redirect("/unauthorized");

  const { id } = await params;
  const report = await getWeeklyReportById(id, user.student.id);
  if (!report) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Week ${report.weekNumber} Report`}
        description="Weekly accomplishment report details."
        actions={
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/student/weekly-reports"><ArrowLeft className="mr-1 h-4 w-4" /> Back</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={`/student/weekly-reports/${id}/print`}><Printer className="mr-1 h-4 w-4" /> Print</Link>
            </Button>
          </div>
        }
      />

      <Card className="p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Week Number</p>
            <p className="text-lg font-semibold">Week {report.weekNumber}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Period</p>
            <p className="text-sm font-medium">{formatDate(report.weekStartDate)} - {formatDate(report.weekEndDate)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Hours</p>
            <p className="text-sm font-medium flex items-center gap-1"><Clock className="size-3.5" /> {report.totalHours.toFixed(1)} hrs</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Status</p>
            <StatusBadge status={report.status} />
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Activities</h2>
        {report.activities.map((act) => (
          <Card key={act.id} className="p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-medium">{formatDate(act.date)}</p>
                <p className="text-sm text-muted-foreground">{act.activity}</p>
              </div>
              {act.description && (
                <p className="text-sm text-muted-foreground">{act.description}</p>
              )}
            </div>
          </Card>
        ))}
        {report.activities.length === 0 && (
          <p className="text-sm text-muted-foreground">No activities recorded for this week.</p>
        )}
      </div>

      {report.activities.some((a) => a.remarks) && (
        <Card className="p-4">
          <h3 className="text-sm font-medium">Activity Remarks</h3>
          <div className="mt-2 space-y-2">
            {report.activities.filter((a) => a.remarks).map((a) => (
              <p key={a.id} className="text-sm text-muted-foreground">
                <span className="font-medium">{formatDate(a.date)}:</span> {a.remarks}
              </p>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
