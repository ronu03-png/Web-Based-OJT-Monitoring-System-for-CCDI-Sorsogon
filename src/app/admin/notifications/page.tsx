import { redirect } from "next/navigation";
import { Bell } from "lucide-react";

import { getCurrentUser } from "@/lib/auth/dal";
import { prisma } from "@/lib/db/prisma";
import { formatRelativeTime } from "@/lib/format";

import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default async function AdminNotificationsPage() {
  const user = await getCurrentUser();
  if (user.role !== "ADMIN") redirect("/unauthorized");

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Notifications" description="Your latest updates and alerts." />

      <div className="space-y-3">
        {notifications.map((n) => (
          <Card key={n.id} className={`p-4 ${!n.isRead ? "border-l-4 border-l-primary" : ""}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-sm text-muted-foreground">{n.message}</p>
                <p className="mt-1 text-xs text-muted-foreground">{formatRelativeTime(n.createdAt)}</p>
              </div>
              {n.link && (
                <Link href={n.link} className="text-sm text-primary hover:underline">
                  View
                </Link>
              )}
            </div>
          </Card>
        ))}

        {notifications.length === 0 && (
          <EmptyState icon={Bell} title="No notifications" description="You're all caught up!" />
        )}
      </div>
    </div>
  );
}
