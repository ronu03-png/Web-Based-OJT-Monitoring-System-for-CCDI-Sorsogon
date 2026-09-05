"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, AlertCircle } from "lucide-react";

import { createWeeklyReport } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";

interface ActivityRow {
  id: string;
  date: string;
  hoursSpent: string;
  activity: string;
  remarks: string;
}

interface WeeklyReportFormProps {
  studentId: string;
  studentName: string;
  studentIdNumber: string;
  course: string;
  yearLevel: number;
  companyName: string;
  designation: string;
}

export default function WeeklyReportForm({
  studentId,
  studentName,
  studentIdNumber,
  course,
  yearLevel,
  companyName,
  designation,
}: WeeklyReportFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [weekNumber, setWeekNumber] = useState("");
  const [weekStartDate, setWeekStartDate] = useState("");
  const [weekEndDate, setWeekEndDate] = useState("");
  const [activities, setActivities] = useState<ActivityRow[]>([
    { id: crypto.randomUUID(), date: "", hoursSpent: "", activity: "", remarks: "" },
  ]);

  const totalHours = activities.reduce(
    (sum, a) => sum + (Number(a.hoursSpent) || 0),
    0
  );

  function addRow() {
    if (activities.length >= 5) {
      setError("Maximum 5 activities allowed (matches the official form).");
      return;
    }
    setError("");
    setActivities((prev) => [
      ...prev,
      { id: crypto.randomUUID(), date: "", hoursSpent: "", activity: "", remarks: "" },
    ]);
  }

  function removeRow(id: string) {
    setActivities((prev) => prev.filter((r) => r.id !== id));
    setError("");
  }

  function updateRow(id: string, field: keyof ActivityRow, value: string) {
    setActivities((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
    setError("");
  }

  function validate(): boolean {
    if (!weekNumber || !weekStartDate || !weekEndDate) {
      setError("Please fill in the week number and date range.");
      return false;
    }
    if (new Date(weekStartDate) > new Date(weekEndDate)) {
      setError("Start date cannot be after end date.");
      return false;
    }
    const filledActivities = activities.filter((a) => a.date && a.activity);
    if (filledActivities.length === 0) {
      setError("Please add at least one activity.");
      return false;
    }
    for (const act of filledActivities) {
      if (!act.hoursSpent || Number(act.hoursSpent) <= 0) {
        setError("Each activity must have hours greater than 0.");
        return false;
      }
    }
    setError("");
    return true;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    startTransition(async () => {
      const res = await createWeeklyReport({
        studentId,
        weekNumber: Number(weekNumber),
        weekStartDate,
        weekEndDate,
        activities: activities
          .filter((a) => a.date && a.activity)
          .map((a) => ({
            date: a.date,
            activity: a.activity,
            hoursSpent: Number(a.hoursSpent) || 0,
            remarks: a.remarks,
          })),
      });
      if (res.success) {
        router.push("/student/weekly-reports");
      }
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Weekly Report"
        description="Fill in your weekly accomplishment details."
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href="/student/weekly-reports">
              <ArrowLeft className="mr-1 h-4 w-4" /> Back
            </Link>
          </Button>
        }
      />

      {error && (
        <div className="flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Student Info - Auto-filled read-only */}
        <Card className="p-6">
          <h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Student Information (Auto-filled)
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <Label>Student Name</Label>
              <Input value={studentName} disabled />
            </div>
            <div>
              <Label>Student ID</Label>
              <Input value={studentIdNumber} disabled />
            </div>
            <div>
              <Label>Course / Year</Label>
              <Input value={`${course} - Year ${yearLevel}`} disabled />
            </div>
            <div>
              <Label>Company / Agency</Label>
              <Input value={companyName || "Not set"} disabled />
            </div>
            <div>
              <Label>Designation</Label>
              <Input value={designation || "Not set"} disabled />
            </div>
          </div>
        </Card>

        {/* Reporting Period */}
        <Card className="p-6">
          <h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Reporting Period
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="weekNumber">Week Number *</Label>
              <Input
                id="weekNumber"
                type="number"
                min={1}
                value={weekNumber}
                onChange={(e) => setWeekNumber(e.target.value)}
                placeholder="e.g. 1"
                required
              />
            </div>
            <div>
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={weekStartDate}
                onChange={(e) => setWeekStartDate(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                value={weekEndDate}
                onChange={(e) => setWeekEndDate(e.target.value)}
                required
              />
            </div>
          </div>
        </Card>

        {/* Activities */}
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Daily Activities</h3>
              <p className="text-xs text-muted-foreground">
                Max 5 rows (matches official form). Total Hours: <strong>{totalHours.toFixed(1)} hrs</strong>
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addRow}
              disabled={activities.length >= 5}
            >
              <Plus className="mr-1 h-4 w-4" /> Add Row ({activities.length}/5)
            </Button>
          </div>

          <div className="space-y-3">
            {activities.map((row, index) => (
              <div
                key={row.id}
                className="grid gap-3 rounded-lg border p-3 sm:grid-cols-[1fr_100px_1fr_1fr_auto]"
              >
                <div>
                  <Label className="text-xs">Date *</Label>
                  <Input
                    type="date"
                    value={row.date}
                    onChange={(e) => updateRow(row.id, "date", e.target.value)}
                    required={index === 0}
                  />
                </div>
                <div>
                  <Label className="text-xs">Hours *</Label>
                  <Input
                    type="number"
                    step="0.5"
                    min={0}
                    max={24}
                    value={row.hoursSpent}
                    onChange={(e) => updateRow(row.id, "hoursSpent", e.target.value)}
                    required={index === 0}
                  />
                </div>
                <div>
                  <Label className="text-xs">Activity / Task *</Label>
                  <Input
                    value={row.activity}
                    onChange={(e) => updateRow(row.id, "activity", e.target.value)}
                    placeholder="Describe what you did..."
                    required={index === 0}
                  />
                </div>
                <div>
                  <Label className="text-xs">Remarks / Details</Label>
                  <Input
                    value={row.remarks}
                    onChange={(e) => updateRow(row.id, "remarks", e.target.value)}
                    placeholder="Optional..."
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeRow(row.id)}
                    disabled={activities.length === 1}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={isPending} size="lg">
            {isPending ? "Saving..." : "Save & Generate Report"}
          </Button>
        </div>
      </form>
    </div>
  );
}
