import { Megaphone } from "lucide-react";

import { prisma } from "@/lib/db/prisma";
import { formatRelativeTime } from "@/lib/format";
import { ROLE_LABELS } from "@/lib/roles";

import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PRIORITY_VARIANT: Record<string, "neutral" | "info" | "warning" | "danger"> = {
  LOW: "neutral",
  NORMAL: "info",
  HIGH: "warning",
  URGENT: "danger",
};

const PAGE_SIZE = 10;

export default async function StudentAnnouncementsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const search = typeof sp.search === "string" ? sp.search : undefined;
  const page = sp.page ? parseInt(typeof sp.page === "string" ? sp.page : sp.page[0], 10) : 1;

  const where: any = {};
  if (search) {
    where.title = { contains: search, mode: "insensitive" };
  }

  const [announcements, total] = await Promise.all([
    prisma.announcement.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { author: { select: { firstName: true, lastName: true, role: true } } },
    }),
    prisma.announcement.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <PageHeader title="Announcements" description="Stay updated with the latest announcements." />

      {announcements.length === 0 ? (
        <EmptyState icon={Megaphone} title="No announcements found" description="Announcements will appear here when published." />
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => (
            <Card key={a.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <CardTitle className="text-base">{a.title}</CardTitle>
                    <p className="mt-1 text-xs text-muted-foreground">
                      by {a.author.firstName} {a.author.lastName} &middot; {ROLE_LABELS[a.author.role]} &middot; {formatRelativeTime(a.publishedAt)}
                    </p>
                  </div>
                  <Badge variant={PRIORITY_VARIANT[a.priority] ?? "neutral"}>{a.priority}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">{a.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} basePath="/student/announcements" searchParams={{ search }} />
    </div>
  );
}
