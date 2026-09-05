import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import {
  ArrowLeft, Building2, Calendar, CheckCircle2, ClipboardCheck, Clock,
  FileText, GraduationCap, ListChecks, MapPin, Printer, Star, TrendingUp, User,
} from "lucide-react";

import { getCurrentUser } from "@/lib/auth/dal";
import { getStudentDetail } from "@/services/admin";
import { formatDate, formatHours } from "@/lib/format";

import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function AdminStudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (user.role !== "ADMIN") redirect("/unauthorized");

  const { id } = await params;
  const student = await getStudentDetail(id);
  if (!student) notFound();

  const remainingHours = Math.max(0, student.requiredHours - student.completedHours);
  const progressPct = Math.min(100, (student.completedHours / student.requiredHours) * 100);

  const presentCount = student.dtrRecords.filter((r) => r.status === "PRESENT").length;
  const lateCount = student.dtrRecords.filter((r) => r.status === "LATE").length;
  const absentCount = student.dtrRecords.filter((r) => r.status === "ABSENT").length;
  const completedTasks = student.tasks.filter((t) => t.status === "COMPLETED").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Profile"
        actions={
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/students"><ArrowLeft className="mr-1 h-4 w-4" /> Back</Link>
            </Button>
            <Button asChild size="sm">
              <Link href={`/admin/students/${id}/evaluate`}><ClipboardCheck className="mr-1 h-4 w-4" /> Evaluate</Link>
            </Button>
          </div>
        }
      />

      {/* Hero Card */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/20">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold">{student.firstName} {student.lastName}</h1>
                <StatusBadge status={student.status} className="text-xs" />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1"><GraduationCap className="h-3.5 w-3.5" />{student.studentId}</span>
                <span className="inline-flex items-center gap-1"><FileText className="h-3.5 w-3.5" />{student.course} — Year {student.yearLevel}{student.section ? ` ${student.section}` : ""}</span>
                {student.companyName && <span className="inline-flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{student.companyName}</span>}
                {student.designation && <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5" />{student.designation}</span>}
              </div>
            </div>
            <div className="hidden text-right sm:block">
              <p className="text-xs text-muted-foreground">Contact</p>
              <p className="text-sm font-medium">{student.contactNumber ?? "—"}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4 rounded-lg border bg-card/60 px-4 py-2 text-sm">
            <span className="inline-flex items-center gap-1 text-muted-foreground"><Calendar className="h-3.5 w-3.5" />{student.startDate ? formatDate(student.startDate) : "No start date"}</span>
            <span className="text-muted-foreground">→</span>
            <span className="inline-flex items-center gap-1 text-muted-foreground">{student.expectedEndDate ? formatDate(student.expectedEndDate) : "No end date"}</span>
          </div>
        </div>
        <div className="border-t px-6 py-4">
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-medium">OJT Progress</span>
            <span className="text-muted-foreground">{progressPct.toFixed(1)}% complete &middot; {formatHours(remainingHours)} remaining</span>
          </div>
          <Progress value={progressPct} className="h-3" />
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
        <Card className="p-4 text-center"><Clock className="mx-auto h-5 w-5 text-muted-foreground" /><p className="mt-2 text-2xl font-bold">{formatHours(student.completedHours)}</p><p className="text-xs text-muted-foreground">Completed Hours</p></Card>
        <Card className="p-4 text-center"><TrendingUp className="mx-auto h-5 w-5 text-muted-foreground" /><p className="mt-2 text-2xl font-bold">{student.weeklyReports.length}</p><p className="text-xs text-muted-foreground">Weekly Reports</p></Card>
        <Card className="p-4 text-center"><CheckCircle2 className="mx-auto h-5 w-5 text-muted-foreground" /><p className="mt-2 text-2xl font-bold">{completedTasks}</p><p className="text-xs text-muted-foreground">Tasks Done</p></Card>
        <Card className="p-4 text-center"><Star className="mx-auto h-5 w-5 text-muted-foreground" /><p className="mt-2 text-2xl font-bold">{student.ojtEvaluations.length}</p><p className="text-xs text-muted-foreground">Evaluations</p></Card>
        <Card className="p-4 text-center col-span-2 sm:col-span-1"><ListChecks className="mx-auto h-5 w-5 text-muted-foreground" /><p className="mt-2 text-2xl font-bold">{student.dtrRecords.length}</p><p className="text-xs text-muted-foreground">DTR Entries</p></Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="dtr" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 sm:w-fit">
          <TabsTrigger value="dtr"><Clock className="mr-1.5 h-4 w-4 hidden sm:inline" />DTR ({student.dtrRecords.length})</TabsTrigger>
          <TabsTrigger value="weekly"><FileText className="mr-1.5 h-4 w-4 hidden sm:inline" />Weekly ({student.weeklyReports.length})</TabsTrigger>
          <TabsTrigger value="evaluation"><Star className="mr-1.5 h-4 w-4 hidden sm:inline" />Eval ({student.ojtEvaluations.length})</TabsTrigger>
          <TabsTrigger value="tasks"><ListChecks className="mr-1.5 h-4 w-4 hidden sm:inline" />Tasks ({student.tasks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="dtr" className="space-y-4">
          {student.dtrRecords.length > 0 && (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
              <Card className="p-3 text-center"><p className="text-lg font-bold text-green-600">{presentCount}</p><p className="text-xs text-muted-foreground">Present</p></Card>
              <Card className="p-3 text-center"><p className="text-lg font-bold text-yellow-600">{lateCount}</p><p className="text-xs text-muted-foreground">Late</p></Card>
              <Card className="p-3 text-center"><p className="text-lg font-bold text-red-600">{absentCount}</p><p className="text-xs text-muted-foreground">Absent</p></Card>
            </div>
          )}
          <Card>
            <Table>
              <TableHeader><TableRow><TableHead className="w-[120px]">Date</TableHead><TableHead>Time In</TableHead><TableHead>Time Out</TableHead><TableHead className="w-[80px]">Hours</TableHead><TableHead className="w-[100px]">Status</TableHead><TableHead>Remarks</TableHead></TableRow></TableHeader>
              <TableBody>
                {student.dtrRecords.map((dtr) => (
                  <TableRow key={dtr.id}>
                    <TableCell className="font-medium">{formatDate(dtr.date)}</TableCell>
                    <TableCell>{dtr.timeIn ? new Date(dtr.timeIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--"}</TableCell>
                    <TableCell>{dtr.timeOut ? new Date(dtr.timeOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--"}</TableCell>
                    <TableCell>{dtr.totalHours.toFixed(2)}</TableCell>
                    <TableCell><StatusBadge status={dtr.status} /></TableCell>
                    <TableCell className="text-muted-foreground max-w-[200px] truncate">{dtr.remarks ?? "—"}</TableCell>
                  </TableRow>
                ))}
                {student.dtrRecords.length === 0 && <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">No DTR entries recorded yet.</TableCell></TableRow>}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-3">
          {student.weeklyReports.map((report) => (
            <Card key={report.id} className="overflow-hidden">
              <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"><FileText className="h-5 w-5 text-primary" /></div>
                  <div><h3 className="font-semibold">Week {report.weekNumber}</h3><p className="text-xs text-muted-foreground">{formatDate(report.weekStartDate)} — {formatDate(report.weekEndDate)}</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{report.totalHours.toFixed(1)} hrs</span>
                  <StatusBadge status={report.status} />
                  <Button asChild variant="ghost" size="sm"><Link href={`/admin/students/${id}/weekly-reports/${report.id}/print`} target="_blank"><Printer className="h-4 w-4" /></Link></Button>
                </div>
              </div>
              {report.activities.length > 0 && (
                <div className="border-t bg-muted/30 px-4 py-3">
                  <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Activities</p>
                  <ul className="space-y-1.5">
                    {report.activities.map((act) => (
                      <li key={act.id} className="flex items-start gap-2 text-sm"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" /><span className="text-muted-foreground"><span className="font-medium text-foreground">{formatDate(act.date)}</span> — {act.activity}{act.hoursSpent ? ` (${act.hoursSpent.toFixed(1)} hrs)` : ""}</span></li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          ))}
          {student.weeklyReports.length === 0 && <Card className="p-8 text-center"><FileText className="mx-auto h-10 w-10 text-muted-foreground/40" /><p className="mt-3 text-sm text-muted-foreground">No weekly reports submitted yet.</p></Card>}
        </TabsContent>

        <TabsContent value="evaluation" className="space-y-3">
          {student.ojtEvaluations.map((ev) => (
            <Card key={ev.id} className="overflow-hidden">
              <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10"><Star className="h-5 w-5 text-amber-500" /></div>
                  <div><h3 className="font-semibold">OJT Evaluation</h3><p className="text-xs text-muted-foreground">{formatDate(ev.evaluationDate)} &middot; {ev.supervisorName ?? "No supervisor"}</p></div>
                </div>
                <div className="flex items-center gap-3">
                  {ev.totalScore !== null && <div className="text-right"><p className="text-2xl font-bold text-primary">{ev.totalScore.toFixed(1)}</p><p className="text-[10px] text-muted-foreground">/ 100</p></div>}
                  <Button asChild variant="outline" size="sm"><Link href={`/admin/students/${id}/evaluate/print?evalId=${ev.id}`}><Printer className="mr-1 h-4 w-4" /> Print</Link></Button>
                </div>
              </div>
              {ev.totalScore !== null && (
                <div className="border-t bg-muted/30 px-4 py-3">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {ev.workPerformanceScore != null && <div><p className="text-xs text-muted-foreground">Work Performance (40%)</p><p className="text-sm font-medium">{ev.workPerformanceScore.toFixed(2)}</p></div>}
                    {ev.knowledgeSkillsScore != null && <div><p className="text-xs text-muted-foreground">Knowledge & Skills (25%)</p><p className="text-sm font-medium">{ev.knowledgeSkillsScore.toFixed(2)}</p></div>}
                    {ev.workAttitudeScore != null && <div><p className="text-xs text-muted-foreground">Work Attitude (20%)</p><p className="text-sm font-medium">{ev.workAttitudeScore.toFixed(2)}</p></div>}
                    {ev.communicationTeamworkScore != null && <div><p className="text-xs text-muted-foreground">Communication (15%)</p><p className="text-sm font-medium">{ev.communicationTeamworkScore.toFixed(2)}</p></div>}
                  </div>
                </div>
              )}
              {ev.comments && <div className="border-t px-4 py-3"><p className="mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">Supervisor Comments</p><p className="text-sm text-muted-foreground italic">&ldquo;{ev.comments}&rdquo;</p></div>}
            </Card>
          ))}
          {student.ojtEvaluations.length === 0 && <Card className="p-8 text-center"><Star className="mx-auto h-10 w-10 text-muted-foreground/40" /><p className="mt-3 text-sm text-muted-foreground">No evaluations recorded yet. Click <strong>Evaluate</strong> to create one.</p></Card>}
        </TabsContent>

        <TabsContent value="tasks" className="space-y-3">
          {student.tasks.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              <Card className="p-3 text-center"><p className="text-lg font-bold text-green-600">{completedTasks}</p><p className="text-xs text-muted-foreground">Completed</p></Card>
              <Card className="p-3 text-center"><p className="text-lg font-bold text-blue-600">{student.tasks.filter((t) => t.status === "ONGOING").length}</p><p className="text-xs text-muted-foreground">Ongoing</p></Card>
              <Card className="p-3 text-center"><p className="text-lg font-bold text-orange-600">{student.tasks.filter((t) => t.status === "UNDONE").length}</p><p className="text-xs text-muted-foreground">Undone</p></Card>
            </div>
          )}
          <Card>
            <Table>
              <TableHeader><TableRow><TableHead>Task</TableHead><TableHead className="w-[120px]">Date</TableHead><TableHead className="w-[110px]">Status</TableHead><TableHead>Skills Learned</TableHead></TableRow></TableHeader>
              <TableBody>
                {student.tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell><p className="font-medium">{task.title}</p><p className="text-xs text-muted-foreground">{task.description ?? "—"}</p></TableCell>
                    <TableCell>{task.date ? formatDate(task.date) : "—"}</TableCell>
                    <TableCell><StatusBadge status={task.status} /></TableCell>
                    <TableCell className="text-muted-foreground">{task.skillsLearned ?? "—"}</TableCell>
                  </TableRow>
                ))}
                {student.tasks.length === 0 && <TableRow><TableCell colSpan={4} className="py-8 text-center text-muted-foreground">No tasks recorded.</TableCell></TableRow>}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
