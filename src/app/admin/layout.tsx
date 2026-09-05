import { requireRole } from "@/lib/auth/dal";
import { AppShell } from "@/components/layout/app-shell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole(["ADMIN"]);
  return <AppShell>{children}</AppShell>;
}
