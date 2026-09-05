import "server-only";
import { prisma } from "@/lib/db/prisma";
import type { TaskStatus } from "@/generated/prisma/enums";

export async function getStudentTasks(studentId: string) {
  return prisma.task.findMany({
    where: { studentId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getTaskStats(studentId: string) {
  const stats = await prisma.task.groupBy({
    by: ["status"],
    where: { studentId },
    _count: { _all: true },
  });
  const completed = stats.find((s) => s.status === "COMPLETED")?._count._all ?? 0;
  const ongoing = stats.find((s) => s.status === "ONGOING")?._count._all ?? 0;
  const undone = stats.find((s) => s.status === "UNDONE")?._count._all ?? 0;
  return { completed, ongoing, undone, total: completed + ongoing + undone };
}
