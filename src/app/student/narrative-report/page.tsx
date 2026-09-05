import { redirect } from "next/navigation";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  GraduationCap,
  RefreshCw,
  Save,
  Send,
  Sparkles,
  Target,
  TrendingUp,
  User,
  Building2,
  ClipboardList,
  Award,
} from "lucide-react";

import { getCurrentUser } from "@/lib/auth/dal";
import { getNarrativeReport, generateNarrativeReport } from "@/services/narrative-report";
import { getStudentDashboardData } from "@/services/dashboard";
import { getStudentDtrSummary } from "@/services/dtr";
import { getStudentWeeklyReports } from "@/services/weekly-reports";
import { getTaskStats } from "@/services/tasks";
import { formatDate, formatHours, formatPercent } from "@/lib/format";

import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { NarrativeReportClient } from "./narrative-report-client";

export default async function StudentNarrativeReportPage() {
  const user = await getCurrentUser();
  if (!user.student) redirect("/unauthorized");

  const studentId = user.student.id;

  const [report, dashData, dtrSummary, weeklyReports, taskStats] = await Promise.all([
    getNarrativeReport(studentId),
    getStudentDashboardData(studentId),
    getStudentDtrSummary(studentId),
    getStudentWeeklyReports(studentId),
    getTaskStats(studentId),
  ]);

  if (!dashData) redirect("/unauthorized");
  const { student } = dashData;

  const progressPercentage = Math.min(
    100,
    (student.completedHours / student.requiredHours) * 100
  );

  const hasEnoughData =
    weeklyReports.length >= 1 ||
    taskStats.total > 0 ||
    dtrSummary.recordCount > 0;

  // If no report exists and there's enough data, auto-generate on first visit
  let reportContent = report?.content ?? null;
  let reportStatus = report?.status ?? "DRAFT";

  if (!reportContent && hasEnoughData) {
    reportContent = await generateNarrativeReport(studentId);
    // Note: we don't save here, the client will prompt the user to generate
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="OJT Narrative Summary"
        description="A comprehensive preview of your OJT journey, automatically compiled from your reports, tasks, and evaluations."
      />

      {/* Status Banner */}
      <div className="flex items-center justify-between">
        <Badge
          variant={reportStatus === "SUBMITTED" ? "default" : "secondary"}
          className="text-xs"
        >
          {reportStatus === "SUBMITTED" ? (
            <>
              <CheckCircle2 className="mr-1 h-3 w-3" /> Submitted
            </>
          ) : (
            <>
              <ClipboardList className="mr-1 h-3 w-3" /> Draft
            </>
          )}
        </Badge>
        {reportStatus === "DRAFT" && (
          <p className="text-xs text-muted-foreground">
            Edit and submit when you&apos;re ready
          </p>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Hours</span>
          </div>
          <p className="mt-1 text-2xl font-bold">{formatHours(student.completedHours)}</p>
          <p className="text-[10px] text-muted-foreground">of {formatHours(student.requiredHours)}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Weeks</span>
          </div>
          <p className="mt-1 text-2xl font-bold">{weeklyReports.length}</p>
          <p className="text-[10px] text-muted-foreground">reports submitted</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Tasks</span>
          </div>
          <p className="mt-1 text-2xl font-bold">{taskStats.completed}</p>
          <p className="text-[10px] text-muted-foreground">completed</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Progress</span>
          </div>
          <p className="mt-1 text-2xl font-bold">{formatPercent(progressPercentage, 0)}</p>
          <p className="text-[10px] text-muted-foreground">complete</p>
        </Card>
      </div>

      {/* Student Profile Card */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-sm text-muted-foreground">
                {student.course} - Year {student.yearLevel}
                {student.section ? ` ${student.section}` : ""}
              </p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <GraduationCap className="h-3 w-3" /> {student.studentId}
                </span>
                {student.companyName && (
                  <span className="inline-flex items-center gap-1">
                    <Building2 className="h-3 w-3" /> {student.companyName}
                  </span>
                )}
                {student.designation && (
                  <span className="inline-flex items-center gap-1">
                    <Award className="h-3 w-3" /> {student.designation}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Status</p>
              <Badge variant={student.status === "ONGOING" ? "default" : student.status === "COMPLETED" ? "success" : "secondary"}>
                {student.status.replace(/_/g, " ")}
              </Badge>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">OJT Progress</span>
              <span className="font-medium">{formatPercent(progressPercentage, 1)}</span>
            </div>
            <Progress value={progressPercentage} className="mt-1 h-2" />
          </div>
        </div>
      </Card>

      {/* Narrative Report Content */}
      {reportContent ? (
        <NarrativeReportClient
          studentId={studentId}
          initialContent={reportContent}
          initialStatus={reportStatus}
          hasEnoughData={hasEnoughData}
        />
      ) : (
        <Card className="p-8 text-center">
          <Sparkles className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No Data Yet</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            Start by submitting your weekly accomplishment reports, logging your daily time records, and adding tasks. Once you have enough data, a narrative summary of your OJT journey will be generated here.
          </p>
        </Card>
      )}
    </div>
  );
}
