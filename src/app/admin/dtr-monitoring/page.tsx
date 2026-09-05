import { Download } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { formatDate } from "@/lib/format";

import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function AdminDtrMonitoringPage() {
  const records = await prisma.dtrRecord.findMany({
    orderBy: { date: "desc" },
    take: 100,
    include: { student: { select: { firstName: true, lastName: true, studentId: true } } },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="DTR Monitoring"
        description="Review all student daily time records."
        actions={
          <Button asChild variant="outline" size="sm">
            <a href="/api/export/dtr" download><Download className="mr-1 h-4 w-4" /> Export CSV</a>
          </Button>
        }
      />

      <Card className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time In</TableHead>
              <TableHead>Time Out</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  <p className="font-medium">{r.student.firstName} {r.student.lastName}</p>
                  <p className="text-xs text-muted-foreground">{r.student.studentId}</p>
                </TableCell>
                <TableCell>{formatDate(r.date)}</TableCell>
                <TableCell>{r.timeIn ? new Date(r.timeIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--"}</TableCell>
                <TableCell>{r.timeOut ? new Date(r.timeOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--"}</TableCell>
                <TableCell>{r.totalHours.toFixed(2)}</TableCell>
                <TableCell><StatusBadge status={r.status} /></TableCell>
              </TableRow>
            ))}
            {records.length === 0 && (
              <TableRow><TableCell colSpan={6} className="py-4 text-center text-muted-foreground">No DTR entries found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
