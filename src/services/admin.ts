import "server-only";
import { prisma } from "@/lib/db/prisma";

export async function getAdminStudentList({
  search,
  course,
  status,
  page = 1,
  pageSize = 10,
}: {
  search?: string;
  course?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  const where: any = {};
  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { studentId: { contains: search, mode: "insensitive" } },
    ];
  }
  if (course && course !== "ALL") where.course = course;
  if (status && status !== "ALL") where.status = status;

  const [students, total, courses] = await Promise.all([
    prisma.student.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { lastName: "asc" },
      select: {
        id: true,
        studentId: true,
        firstName: true,
        lastName: true,
        course: true,
        yearLevel: true,
        section: true,
        companyName: true,
        designation: true,
        requiredHours: true,
        completedHours: true,
        startDate: true,
        expectedEndDate: true,
        status: true,
      },
    }),
    prisma.student.count({ where }),
    prisma.student.groupBy({ by: ["course"], _count: { _all: true } }),
  ]);

  return { students, total, courses: courses.map((c) => c.course), pageCount: Math.ceil(total / pageSize) };
}

export async function getStudentDetail(id: string) {
  return prisma.student.findUnique({
    where: { id },
    include: {
      dtrRecords: { orderBy: { date: "desc" } },
      weeklyReports: { orderBy: { weekNumber: "asc" }, include: { activities: true } },
      tasks: { orderBy: { createdAt: "desc" } },
      ojtEvaluations: { orderBy: { evaluationDate: "desc" } },
    },
  });
}
