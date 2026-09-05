import Link from "next/link";
import { Eye } from "lucide-react";

import { prisma } from "@/lib/db/prisma";
import { formatDate } from "@/lib/format";

import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function AdminAccomplishmentReportsPage() {
  const reports = await prisma.weeklyReport.findMany({
    orderBy: { weekNumber: "asc" },
    include: {
      student: { select: { firstName: true, lastName: true, studentId: true } },
      activities: true,
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Accomplishment Reports" description="Review all weekly accomplishment reports." />

      <div className="space-y-4">
        {reports.map((report) => (
          <Card key={report.id} className="p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">Week {report.weekNumber}</h3>
                  <StatusBadge status={report.status} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {report.student.firstName} {report.student.lastName} ({report.student.studentId}) &bull; {formatDate(report.weekStartDate)} - {formatDate(report.weekEndDate)}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{report.activities.length} activities &bull; {report.totalHours.toFixed(1)} hours</p>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href={`/admin/students/${report.studentId}`}><Eye className="mr-1 h-4 w-4" /> View Student</Link>
              </Button>
            </div>
          </Card>
        ))}

        {reports.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No weekly reports submitted yet.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
