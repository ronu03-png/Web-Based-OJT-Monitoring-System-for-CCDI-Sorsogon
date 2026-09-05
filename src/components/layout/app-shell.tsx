import { getCurrentUser } from "@/lib/auth/dal";
import { prisma } from "@/lib/db/prisma";
import { AppShellClient } from "@/components/layout/app-shell-client";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: { id: true, title: true, message: true, link: true, isRead: true },
    }),
    prisma.notification.count({ where: { userId: user.id, isRead: false } }),
  ]);

  return (
    <AppShellClient
      user={{
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatarUrl: user.avatarUrl,
        role: user.role,
      }}
      notifications={notifications}
      unreadCount={unreadCount}
    >
      {children}
    </AppShellClient>
  );
}
