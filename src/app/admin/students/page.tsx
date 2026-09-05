import Link from "next/link";
import { GraduationCap, Users, TrendingUp, Search, Download } from "lucide-react";

import { getAdminStudentList } from "@/services/admin";
import { formatDate, formatHours } from "@/lib/format";

import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const STATUS_OPTIONS = [
  { value: "NOT_STARTED", label: "Not Started" },
  { value: "ONGOING", label: "Ongoing" },
  { value: "COMPLETED", label: "Completed" },
  { value: "FAILED", label: "Failed" },
];

export default async function AdminStudentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const search = typeof sp.search === "string" ? sp.search : undefined;
  const status = typeof sp.status === "string" ? sp.status : undefined;
  const course = typeof sp.course === "string" ? sp.course : undefined;
  const page = sp.page ? parseInt(typeof sp.page === "string" ? sp.page : sp.page[0], 10) : 1;

  const { students, total, courses, pageCount } = await getAdminStudentList({ search, course, status, page });

  const ongoingCount = students.filter((s) => s.status === "ONGOING").length;
  const completedCount = students.filter((s) => s.status === "COMPLETED").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Students"
        description="View and manage all student records across the system."
        actions={
          <Button asChild variant="outline" size="sm">
            <a href="/api/export/students" download><Download className="mr-1 h-4 w-4" /> Export CSV</a>
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total Students" value={total} icon={GraduationCap} />
        <StatCard label="Ongoing" value={ongoingCount} icon={Users} tone="info" />
        <StatCard label="Completed" value={completedCount} icon={TrendingUp} tone="success" />
        <StatCard label="Courses" value={courses.length} hint="Distinct programs" icon={GraduationCap} tone="info" />
      </div>

      <Card className="p-4">
        {/* Simple filter form */}
        <form className="mb-4 flex flex-wrap gap-2" action="/admin/students" method="GET">
          <Input name="search" placeholder="Search by name or ID..." defaultValue={search ?? ""} className="w-64" />
          <select name="status" className="h-9 rounded-md border border-input bg-transparent px-3 text-sm" defaultValue={status ?? ""}>
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <select name="course" className="h-9 rounded-md border border-input bg-transparent px-3 text-sm" defaultValue={course ?? ""}>
            <option value="">All Courses</option>
            {courses.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <Button type="submit" size="sm" variant="secondary">
            <Search className="mr-1 h-4 w-4" /> Filter
          </Button>
          {(search || status || course) && (
            <Button asChild size="sm" variant="ghost">
              <Link href="/admin/students">Clear</Link>
            </Button>
          )}
        </form>

        {students.length === 0 ? (
          <EmptyState icon={GraduationCap} title="No students found" description="Try adjusting your search or filters." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expected End</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => {
                const progressPct = student.requiredHours > 0
                  ? Math.min(100, (student.completedHours / student.requiredHours) * 100)
                  : 0;
                return (
                  <TableRow key={student.id}>
                    <TableCell>
                      <Link href={`/admin/students/${student.id}`} className="group">
                        <p className="text-sm font-medium text-foreground group-hover:underline">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">{student.studentId}</p>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-foreground">{student.course}</p>
                      <p className="text-xs text-muted-foreground">Year {student.yearLevel}{student.section ? ` - ${student.section}` : ""}</p>
                    </TableCell>
                    <TableCell className="text-sm text-foreground">{student.companyName ?? "—"}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Progress value={progressPct} className="h-2 w-24" />
                        <p className="text-xs text-muted-foreground">{formatHours(student.completedHours)} / {formatHours(student.requiredHours)}</p>
                      </div>
                    </TableCell>
                    <TableCell><StatusBadge status={student.status} /></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(student.expectedEndDate)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        <Pagination page={page} totalPages={pageCount} basePath="/admin/students" searchParams={{ search, status, course }} />
      </Card>
    </div>
  );
}
