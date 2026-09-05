"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";

import { requestPasswordResetAction } from "@/lib/actions/password-reset";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(requestPasswordResetAction, undefined);

  if (state?.success) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-status-success-bg">
          <CheckCircle2 className="size-6 text-status-success" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Check your email</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            If an account matches the details you provided, we&apos;ve sent password reset
            instructions to the registered email address.
          </p>
        </div>
        {state.devResetUrl && (
          <div className="rounded-md border border-dashed bg-muted/50 p-3 text-left text-xs">
            <p className="font-medium text-muted-foreground">Development mode only:</p>
            <Link href={state.devResetUrl} className="break-all text-primary hover:underline">
              {state.devResetUrl}
            </Link>
          </div>
        )}
        <Button asChild variant="outline" className="w-full">
          <Link href="/login">
            <ArrowLeft className="size-4" />
            Back to login
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Forgot your password?</h2>
        <p className="text-sm text-muted-foreground">
          Enter your email or username and we&apos;ll send you instructions to reset it.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="identifier">Email or Username</Label>
        <Input id="identifier" name="identifier" placeholder="you@ccdi.edu.ph" autoComplete="email" required />
        {state?.fieldErrors?.identifier && (
          <p className="text-xs text-status-danger">{state.fieldErrors.identifier[0]}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending && <Loader2 className="size-4 animate-spin" />}
        {pending ? "Sending..." : "Send reset instructions"}
      </Button>

      <Button asChild variant="ghost" className="w-full">
        <Link href="/login">
          <ArrowLeft className="size-4" />
          Back to login
        </Link>
      </Button>
    </form>
  );
}
