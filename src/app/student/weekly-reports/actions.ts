"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";

interface ActivityInput {
  date: string;
  activity: string;
  hoursSpent: number;
  remarks: string;
}

export async function createWeeklyReport(formData: {
  studentId: string;
  weekNumber: number;
  weekStartDate: string;
  weekEndDate: string;
  activities: ActivityInput[];
}) {
  const totalHours = formData.activities.reduce((sum, a) => sum + (Number(a.hoursSpent) || 0), 0);

  const report = await prisma.weeklyReport.create({
    data: {
      studentId: formData.studentId,
      weekNumber: formData.weekNumber,
      weekStartDate: new Date(formData.weekStartDate),
      weekEndDate: new Date(formData.weekEndDate),
      totalHours,
      status: "SUBMITTED",
      activities: {
        create: formData.activities.map((a) => ({
          date: new Date(a.date),
          activity: a.activity,
          hoursSpent: Number(a.hoursSpent) || 0,
          remarks: a.remarks || null,
        })),
      },
    },
  });

  revalidatePath("/student/weekly-reports");
  return { success: true, id: report.id };
}
