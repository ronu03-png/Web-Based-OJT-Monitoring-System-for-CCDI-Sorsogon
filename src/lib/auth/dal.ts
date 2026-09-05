import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt, SESSION_COOKIE_NAME } from "./session";
import { prisma } from "@/lib/db/prisma";
import { ROLE_HOME } from "@/lib/roles";
import type { UserRole } from "@/generated/prisma/enums";

export interface AuthSession {
  userId: string;
  role: UserRole;
}

/** Reads and decrypts the session cookie. Returns null if absent/invalid. Does not redirect. */
export const getSession = cache(async (): Promise<AuthSession | null> => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const payload = await decrypt(cookie);
  if (!payload?.userId) return null;
  return { userId: payload.userId, role: payload.role };
});

/** Requires an authenticated session. Redirects to /login when missing. */
export const verifySession = cache(async (): Promise<AuthSession> => {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return session;
});

/** Requires an authenticated session AND one of the allowed roles. */
export async function requireRole(allowed: UserRole[]): Promise<AuthSession> {
  const session = await verifySession();
  if (!allowed.includes(session.role)) {
    redirect("/unauthorized");
  }
  return session;
}

const currentUserSelect = {
  id: true,
  email: true,
  username: true,
  role: true,
  status: true,
  firstName: true,
  lastName: true,
  avatarUrl: true,
  phone: true,
  student: { select: { id: true, studentId: true, course: true, yearLevel: true, status: true, requiredHours: true, completedHours: true, companyName: true, designation: true } },
} as const;

/** Fetches the full current user record (safe fields only, no password hash). Redirects if unauthenticated. */
export const getCurrentUser = cache(async () => {
  const session = await verifySession();
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: currentUserSelect,
  });

  if (!user || user.status !== "ACTIVE") {
    redirect("/logout");
  }

  return user;
});

export type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

export function homeForRole(role: UserRole) {
  return ROLE_HOME[role];
}
