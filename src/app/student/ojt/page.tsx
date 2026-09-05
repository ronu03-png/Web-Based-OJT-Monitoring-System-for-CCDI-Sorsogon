import { GraduationCap, Building2, User, Calendar, Clock, MapPin } from "lucide-react";

import { getCurrentUser } from "@/lib/auth/dal";
import { prisma } from "@/lib/db/prisma";
import { formatDate, formatHours } from "@/lib/format";

import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { ChartCard } from "@/components/shared/chart-card";
import { Progress } from "@/components/ui/progress";

export default async function StudentOjtPage() {
  const user = await getCurrentUser();
  if (!user.student) {
    return (
      <div className="space-y-6">
        <PageHeader title="My OJT" description="Your on-the-job training overview." />
        <EmptyState icon={GraduationCap} title="No OJT profile found" description="Please contact the administrator to set up your OJT profile." />
      </div>
    );
  }

  const student = await prisma.student.findUnique({
    where: { id: user.student.id },
    select: {
      completedHours: true,
      requiredHours: true,
      status: true,
      companyName: true,
      companyAddress: true,
      designation: true,
      startDate: true,
      expectedEndDate: true,
      actualEndDate: true,
    },
  });

  if (!student) {
    return (
      <div className="space-y-6">
        <PageHeader title="My OJT" description="Your on-the-job training overview." />
        <EmptyState icon={GraduationCap} title="No OJT profile found" description="Please contact the administrator to set up your OJT profile." />
      </div>
    );
  }

  const progressPct = student.requiredHours > 0 ? Math.min(100, (student.completedHours / student.requiredHours) * 100) : 0;
  const remainingHours = Math.max(student.requiredHours - student.completedHours, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="My OJT" description="Your on-the-job training placement and progress." />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Completed Hours" value={formatHours(student.completedHours)} icon={Clock} tone="success" />
        <StatCard label="Required Hours" value={formatHours(student.requiredHours)} icon={Clock} />
        <StatCard label="Remaining" value={formatHours(remainingHours)} icon={Clock} tone="warning" />
        <StatCard label="Status" value={<StatusBadge status={student.status} />} icon={GraduationCap} />
      </div>

      <ChartCard title="OJT Progress" description="Hours completed toward requirement">
        <div className="space-y-3">
          <Progress value={progressPct} className="h-3" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{formatHours(student.completedHours)} of {formatHours(student.requiredHours)} hours</span>
            <span className="font-medium text-foreground">{progressPct.toFixed(1)}%</span>
          </div>
        </div>
      </ChartCard>

      <div className="grid gap-4 sm:grid-cols-2">
        <ChartCard title="Placement Details">
          <dl className="space-y-3">
            <div>
              <dt className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase">
                <Building2 className="size-3.5" /> Company
              </dt>
              <dd className="mt-1 text-sm font-medium text-foreground">{student.companyName ?? "Not assigned"}</dd>
              {student.companyAddress && (
                <dd className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="size-3" /> {student.companyAddress}</dd>
              )}
            </div>
            <div>
              <dt className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase">
                <User className="size-3.5" /> Designation
              </dt>
              <dd className="mt-1 text-sm font-medium text-foreground">{student.designation ?? "Not assigned"}</dd>
            </div>
          </dl>
        </ChartCard>

        <ChartCard title="Timeline">
          <dl className="space-y-3">
            <div>
              <dt className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase">
                <Calendar className="size-3.5" /> Start Date
              </dt>
              <dd className="mt-1 text-sm font-medium text-foreground">{formatDate(student.startDate)}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase">
                <Calendar className="size-3.5" /> Expected End
              </dt>
              <dd className="mt-1 text-sm font-medium text-foreground">{formatDate(student.expectedEndDate)}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase">
                <Calendar className="size-3.5" /> Actual End
              </dt>
              <dd className="mt-1 text-sm font-medium text-foreground">{formatDate(student.actualEndDate)}</dd>
            </div>
          </dl>
        </ChartCard>
      </div>
    </div>
  );
}
