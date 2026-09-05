import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { getSession, homeForRole } from "@/lib/auth/dal";
import { Button } from "@/components/ui/button";

export default async function UnauthorizedPage() {
  const session = await getSession();
  const homeHref = session ? homeForRole(session.role) : "/login";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-status-danger-bg">
        <ShieldAlert className="size-7 text-status-danger" />
      </div>
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-foreground">Access denied</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          You don&apos;t have permission to view this page. If you believe this is a
          mistake, please contact your OJT coordinator or system administrator.
        </p>
      </div>
      <Button asChild>
        <Link href={homeHref}>Back to my dashboard</Link>
      </Button>
    </div>
  );
}
