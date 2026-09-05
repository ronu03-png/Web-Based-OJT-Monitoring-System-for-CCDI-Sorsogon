"use client";

import Link from "next/link";
import { ChevronDown, LogOut, Settings as SettingsIcon } from "lucide-react";

import { logoutAction } from "@/lib/actions/auth";
import { ROLE_LABELS, ROLE_BASE_PATH } from "@/lib/roles";
import type { UserRole } from "@/generated/prisma/enums";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface ProfileMenuUser {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
  role: UserRole;
}

export function ProfileMenu({ user }: { user: ProfileMenuUser }) {
  const initials = `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex cursor-pointer items-center gap-2 rounded-md p-1.5 outline-none hover:bg-accent">
        <Avatar className="size-8">
          <AvatarImage src={user.avatarUrl ?? undefined} alt={`${user.firstName} ${user.lastName}`} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="hidden text-left leading-tight sm:block">
          <p className="text-sm font-medium">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xs text-muted-foreground">{ROLE_LABELS[user.role]}</p>
        </div>
        <ChevronDown className="hidden size-4 text-muted-foreground sm:block" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-medium text-foreground">
            {user.firstName} {user.lastName}
          </p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`${ROLE_BASE_PATH[user.role]}/settings`}>
            <SettingsIcon className="size-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onSelect={(event) => {
            event.preventDefault();
            void logoutAction();
          }}
        >
          <LogOut className="size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
