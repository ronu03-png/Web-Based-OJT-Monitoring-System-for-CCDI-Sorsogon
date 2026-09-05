import "server-only";
import { prisma } from "@/lib/db/prisma";

export interface AuditLogFilters {
  search?: string;
  action?: string;
  page?: number;
  pageSize?: number;
}

export async function getAuditLogs(filters: AuditLogFilters = {}) {
  const { search, action, page = 1, pageSize = 20 } = filters;

  const where = {
    ...(action && action !== "ALL" ? { action } : {}),
    ...(search
      ? {
          OR: [
            { action: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
            { user: { OR: [
              { firstName: { contains: search, mode: "insensitive" as const } },
              { lastName: { contains: search, mode: "insensitive" as const } },
            ] } },
          ],
        }
      : {}),
  };

  const [logs, total, actions] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: {
        user: { select: { firstName: true, lastName: true, role: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.auditLog.count({ where }),
    prisma.auditLog.findMany({
      select: { action: true },
      distinct: ["action"],
      orderBy: { action: "asc" },
    }),
  ]);

  return {
    logs,
    total,
    totalPages: Math.ceil(total / pageSize),
    page,
    actions: actions.map((a) => a.action),
  };
}
