import "server-only";
import { prisma } from "@/lib/db/prisma";

export async function getStudentDashboardData(studentId: string) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: {
      id: true,
      studentId: true,
      firstName: true,
      lastName: true,
      course: true,
      yearLevel: true,
      section: true,
      companyName: true,
      companyAddress: true,
      designation: true,
      requiredHours: true,
      completedHours: true,
      startDate: true,
      expectedEndDate: true,
      status: true,
    },
  });

  if (!student) return null;

  const [taskStats, weeklyReportCount, dtrCount, recentDtr, recentTasks] = await Promise.all([
    prisma.task.groupBy({
      by: ["status"],
      where: { studentId },
      _count: { _all: true },
    }),
    prisma.weeklyReport.count({ where: { studentId } }),
    prisma.dtrRecord.count({ where: { studentId } }),
    prisma.dtrRecord.findMany({
      where: { studentId },
      orderBy: { date: "desc" },
      take: 5,
      select: { id: true, date: true, timeIn: true, timeOut: true, totalHours: true, status: true },
    }),
    prisma.task.findMany({
      where: { studentId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, title: true, status: true, date: true },
    }),
  ]);

  const completedTasks = taskStats.find((s) => s.status === "COMPLETED")?._count._all ?? 0;
  const ongoingTasks = taskStats.find((s) => s.status === "ONGOING")?._count._all ?? 0;
  const undoneTasks = taskStats.find((s) => s.status === "UNDONE")?._count._all ?? 0;

  return {
    student,
    taskStats: { completed: completedTasks, ongoing: ongoingTasks, undone: undoneTasks, total: completedTasks + ongoingTasks + undoneTasks },
    weeklyReportCount,
    dtrCount,
    recentDtr,
    recentTasks,
  };
}

export async function getAdminDashboardStats() {
  const [totalStudents, ongoingCount, completedCount, notStartedCount, failedCount, totalCompletedHours] = await Promise.all([
    prisma.student.count(),
    prisma.student.count({ where: { status: "ONGOING" } }),
    prisma.student.count({ where: { status: "COMPLETED" } }),
    prisma.student.count({ where: { status: "NOT_STARTED" } }),
    prisma.student.count({ where: { status: "FAILED" } }),
    prisma.student.aggregate({ _sum: { completedHours: true } }),
  ]);

  const courseStats = await prisma.student.groupBy({
    by: ["course"],
    _count: { _all: true },
  });

  return {
    totalStudents,
    ongoingCount,
    completedCount,
    notStartedCount,
    failedCount,
    totalCompletedHours: totalCompletedHours._sum.completedHours ?? 0,
    courseStats: courseStats.map((c) => ({ course: c.course, count: c._count._all })),
  };
}
