import Link from "next/link";
import { redirect } from "next/navigation";
import { FileText, Printer, Eye } from "lucide-react";

import { getCurrentUser } from "@/lib/auth/dal";
import { getStudentWeeklyReports } from "@/services/weekly-reports";
import { formatDate } from "@/lib/format";

import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function StudentWeeklyReportsPage() {
  const user = await getCurrentUser();
  if (!user.student) redirect("/unauthorized");

  const reports = await getStudentWeeklyReports(user.student.id);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Weekly Accomplishment Reports"
        description="View and manage your weekly accomplishment reports."
        actions={
          <Button asChild>
            <Link href="/student/weekly-reports/create">Create New Report</Link>
          </Button>
        }
      />

      <div className="space-y-4">
        {reports.map((report) => (
          <Card key={report.id} className="p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">Week {report.weekNumber}</h3>
                  <StatusBadge status={report.status} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatDate(report.weekStartDate)} - {formatDate(report.weekEndDate)} &bull; {report.totalHours.toFixed(1)} hours
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {report.activities.length} activity entries
                </p>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/student/weekly-reports/${report.id}`}>
                    <Eye className="mr-1 h-4 w-4" /> View
                  </Link>
                </Button>
                {report.status === "SUBMITTED" && (
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/student/weekly-reports/${report.id}/print`}>
                      <Printer className="mr-1 h-4 w-4" /> Print
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}

        {reports.length === 0 && (
          <div className="rounded-xl border border-dashed p-12 text-center">
            <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
            <h3 className="mt-3 text-lg font-medium">No Weekly Reports Yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">Create your first weekly accomplishment report.</p>
            <Button asChild className="mt-4">
              <Link href="/student/weekly-reports/create">Create Report</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
