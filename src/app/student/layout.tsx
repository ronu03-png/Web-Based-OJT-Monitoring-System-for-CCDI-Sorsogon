import { requireRole } from "@/lib/auth/dal";
import { AppShell } from "@/components/layout/app-shell";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  await requireRole(["STUDENT"]);
  return <AppShell>{children}</AppShell>;
}
