import { getCurrentUser } from "@/lib/auth/dal";
import { ROLE_LABELS } from "@/lib/roles";

import { PageHeader } from "@/components/shared/page-header";
import { ChartCard } from "@/components/shared/chart-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initialsOf } from "@/lib/format";
import { Separator } from "@/components/ui/separator";

export async function SettingsPage({ basePath }: { basePath: string }) {
  const user = await getCurrentUser();
  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account preferences and profile."
      />

      <ChartCard title="Profile" description="Your personal information">
        <div className="flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarImage src={user.avatarUrl ?? undefined} alt={fullName} />
            <AvatarFallback className="text-lg">{initialsOf(user.firstName, user.lastName)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-base font-medium text-foreground">{fullName}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="text-xs text-muted-foreground">{ROLE_LABELS[user.role]}</p>
          </div>
        </div>
      </ChartCard>

      <ChartCard title="Personal Information" description="Update your personal details">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" defaultValue={user.firstName} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" defaultValue={user.lastName} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={user.email} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" defaultValue={user.phone ?? ""} />
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex justify-end">
          <Button>Save Changes</Button>
        </div>
      </ChartCard>

      <ChartCard title="Security" description="Manage your password and security settings">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input id="currentPassword" type="password" />
          </div>
          <div />
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input id="newPassword" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" type="password" />
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex justify-end">
          <Button>Update Password</Button>
        </div>
      </ChartCard>
    </div>
  );
}
