"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";

import { resetPasswordAction } from "@/lib/actions/password-reset";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(resetPasswordAction, undefined);
  const [showPassword, setShowPassword] = useState(false);

  if (state?.success) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-status-success-bg">
          <CheckCircle2 className="size-6 text-status-success" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Password updated</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your password has been reset successfully. You can now log in with your new password.
          </p>
        </div>
        <Button asChild className="w-full">
          <Link href="/login">Go to login</Link>
        </Button>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Set a new password</h2>
        <p className="text-sm text-muted-foreground">
          Choose a strong password with at least 8 characters, including a letter and a number.
        </p>
      </div>

      <input type="hidden" name="token" value={token} />

      {state?.error && (
        <div
          role="alert"
          className="rounded-md border border-status-danger/30 bg-status-danger-bg px-3 py-2 text-sm text-status-danger"
        >
          {state.error}
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="password">New password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {state?.fieldErrors?.password && (
          <p className="text-xs text-status-danger">{state.fieldErrors.password[0]}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          required
        />
        {state?.fieldErrors?.confirmPassword && (
          <p className="text-xs text-status-danger">{state.fieldErrors.confirmPassword[0]}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending && <Loader2 className="size-4 animate-spin" />}
        {pending ? "Updating..." : "Reset password"}
      </Button>
    </form>
  );
}
