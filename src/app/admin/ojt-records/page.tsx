import Link from "next/link";
import { GraduationCap } from "lucide-react";

import { getAdminStudentList } from "@/services/admin";
import { formatDate, formatHours } from "@/lib/format";

import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function AdminOjtRecordsPage() {
  const { students } = await getAdminStudentList({ page: 1, pageSize: 100 });

  return (
    <div className="space-y-6">
      <PageHeader title="OJT Records" description="Monitor OJT progress for all students." />

      <Card className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((s) => {
              const pct = s.requiredHours > 0 ? Math.min(100, (s.completedHours / s.requiredHours) * 100) : 0;
              return (
                <TableRow key={s.id}>
                  <TableCell>
                    <Link href={`/admin/students/${s.id}`} className="font-medium hover:underline">{s.firstName} {s.lastName}</Link>
                    <p className="text-xs text-muted-foreground">{s.studentId}</p>
                  </TableCell>
                  <TableCell>{s.companyName ?? "—"}</TableCell>
                  <TableCell>{s.designation ?? "—"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={pct} className="h-2 w-24" />
                      <span className="text-xs">{formatHours(s.completedHours)} / {formatHours(s.requiredHours)}</span>
                    </div>
                  </TableCell>
                  <TableCell><StatusBadge status={s.status} /></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
