import "server-only";
import { headers } from "next/headers";
import { prisma } from "@/lib/db/prisma";

export async function getClientIp(): Promise<string | null> {
  try {
    const h = await headers();
    const forwarded = h.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0]?.trim() ?? null;
    return h.get("x-real-ip");
  } catch {
    return null;
  }
}

export async function logAudit(params: {
  userId?: string | null;
  action: string;
  description?: string;
  entityType?: string;
  entityId?: string;
}) {
  const ipAddress = await getClientIp();
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId ?? null,
        action: params.action,
        description: params.description,
        entityType: params.entityType,
        entityId: params.entityId,
        ipAddress: ipAddress ?? undefined,
      },
    });
  } catch (error) {
    console.error("Failed to write audit log", error);
  }
}
