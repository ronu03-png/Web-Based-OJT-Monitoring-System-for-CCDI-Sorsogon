import "server-only";
import { prisma } from "@/lib/db/prisma";

export async function getStudentWeeklyReports(studentId: string) {
  return prisma.weeklyReport.findMany({
    where: { studentId },
    orderBy: { weekNumber: "asc" },
    include: { activities: { orderBy: { date: "asc" } } },
  });
}

export async function getWeeklyReportById(id: string, studentId: string) {
  return prisma.weeklyReport.findFirst({
    where: { id, studentId },
    include: { activities: { orderBy: { date: "asc" } } },
  });
}

export async function getWeeklyReportByIdAdmin(id: string) {
  return prisma.weeklyReport.findUnique({
    where: { id },
    include: {
      activities: { orderBy: { date: "asc" } },
      student: true,
    },
  });
}
