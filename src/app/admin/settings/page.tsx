import { prisma } from "@/lib/db/prisma";

import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";

export default async function AdminSettingsPage() {
  const settings = await prisma.systemSetting.findMany({ orderBy: { key: "asc" } });

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="System configuration and settings." />

      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold">System Settings</h2>
        <div className="space-y-4">
          {settings.map((s) => (
            <div key={s.id} className="flex items-center justify-between border-b pb-3 last:border-0">
              <div>
                <p className="font-medium">{s.key}</p>
                <p className="text-sm text-muted-foreground">{s.description ?? "No description"}</p>
              </div>
              <p className="text-sm font-mono">{s.value}</p>
            </div>
          ))}
          {settings.length === 0 && (
            <p className="text-muted-foreground">No settings configured.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
