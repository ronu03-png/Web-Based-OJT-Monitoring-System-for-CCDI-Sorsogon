import { prisma } from "@/lib/db/prisma";
import { formatDateTime, formatRelativeTime, initialsOf } from "@/lib/format";
import { ROLE_LABELS } from "@/lib/roles";

import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const PAGE_SIZE = 25;

export default async function AdminAuditLogsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const page = sp.page ? parseInt(typeof sp.page === "string" ? sp.page : sp.page[0], 10) : 1;

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { user: { select: { firstName: true, lastName: true, role: true } } },
    }),
    prisma.auditLog.count(),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <PageHeader title="Audit Logs" description="Track system activity and user actions." />

      <Card className="p-4">
        {logs.length === 0 ? (
          <EmptyState title="No audit logs" description="System activity will be recorded here." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>When</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="size-7">
                        <AvatarFallback className="text-[10px]">
                          {log.user ? initialsOf(log.user.firstName, log.user.lastName) : "SYS"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {log.user ? `${log.user.firstName} ${log.user.lastName}` : "System"}
                        </p>
                        {log.user && (
                          <p className="text-xs text-muted-foreground">{ROLE_LABELS[log.user.role]}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {log.action}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                    {log.description ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {log.entityType ? `${log.entityType}${log.entityId ? ` (${log.entityId.slice(0, 8)}…)` : ""}` : "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground font-mono">
                    {log.ipAddress ?? "—"}
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground" title={formatDateTime(log.createdAt)}>
                      {formatRelativeTime(log.createdAt)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Pagination page={page} totalPages={totalPages} basePath="/admin/audit-logs" />
      </Card>
    </div>
  );
}
