import "server-only";
import { prisma } from "@/lib/db/prisma";
import { startOfMonth, endOfMonth } from "date-fns";

export async function getStudentDtrRecords(studentId: string, month?: Date) {
  const targetMonth = month ?? new Date();
  const start = startOfMonth(targetMonth);
  const end = endOfMonth(targetMonth);

  const records = await prisma.dtrRecord.findMany({
    where: { studentId, date: { gte: start, lte: end } },
    orderBy: { date: "asc" },
  });

  const totalHours = records.reduce((sum, r) => sum + r.totalHours, 0);

  return { records, totalHours };
}

export async function getStudentDtrSummary(studentId: string) {
  const allRecords = await prisma.dtrRecord.findMany({
    where: { studentId },
    orderBy: { date: "asc" },
  });

  const totalHours = allRecords.reduce((sum, r) => sum + r.totalHours, 0);
  const presentCount = allRecords.filter((r) => r.status === "PRESENT").length;
  const lateCount = allRecords.filter((r) => r.status === "LATE").length;
  const absentCount = allRecords.filter((r) => r.status === "ABSENT").length;
  const excusedCount = allRecords.filter((r) => r.status === "EXCUSED").length;

  return { totalHours, presentCount, lateCount, absentCount, excusedCount, recordCount: allRecords.length };
}
