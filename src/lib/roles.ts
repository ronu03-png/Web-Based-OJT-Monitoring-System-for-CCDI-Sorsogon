import type { UserRole } from "@/generated/prisma/enums";

export const ROLE_HOME: Record<UserRole, string> = {
  ADMIN: "/admin/dashboard",
  STUDENT: "/student/dashboard",
};

export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: "Administrator",
  STUDENT: "Student",
};

export const ROLE_BASE_PATH: Record<UserRole, string> = {
  ADMIN: "/admin",
  STUDENT: "/student",
};

export function getRoleFromPath(pathname: string): UserRole | null {
  const entry = (Object.entries(ROLE_BASE_PATH) as [UserRole, string][]).find(([, base]) =>
    pathname.startsWith(base)
  );
  return entry ? entry[0] : null;
}
