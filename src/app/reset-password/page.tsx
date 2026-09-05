import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Reset Password | CCDI Sorsogon OJT Monitoring System",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <AuthShell>
      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <div className="space-y-4 text-center">
          <h2 className="text-lg font-semibold text-foreground">Invalid reset link</h2>
          <p className="text-sm text-muted-foreground">
            This password reset link is missing or malformed. Please request a new one.
          </p>
          <Button asChild className="w-full">
            <Link href="/forgot-password">Request new link</Link>
          </Button>
        </div>
      )}
    </AuthShell>
  );
}
