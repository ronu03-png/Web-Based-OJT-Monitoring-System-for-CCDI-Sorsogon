"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { loginAction } from "@/lib/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export function LoginForm({ nextPath }: { nextPath?: string }) {
  const [state, action, pending] = useActionState(loginAction, undefined);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={action} className="space-y-5">
      <div className="mb-2 flex items-center gap-3 lg:hidden">
        <Image
          src="/assets/ccdi-logo.png"
          alt="CCDI Sorsogon logo"
          width={40}
          height={40}
          className="h-10 w-10 object-contain"
        />
        <div>
          <p className="text-sm leading-tight font-semibold">CCDI Sorsogon</p>
          <p className="text-xs text-muted-foreground">OJT Monitoring System</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-foreground">Welcome back</h2>
        <p className="text-sm text-muted-foreground">
          Sign in to continue to your OJT dashboard.
        </p>
      </div>

      {state?.error && (
        <div
          role="alert"
          className="rounded-md border border-status-danger/30 bg-status-danger-bg px-3 py-2 text-sm text-status-danger"
        >
          {state.error}
        </div>
      )}

      {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}

      <div className="space-y-1.5">
        <Label htmlFor="identifier">Username / Student ID / Email</Label>
        <Input
          id="identifier"
          name="identifier"
          placeholder="e.g. 2026-001"
          autoComplete="username"
          required
        />
        {state?.fieldErrors?.identifier && (
          <p className="text-xs text-status-danger">{state.fieldErrors.identifier[0]}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link href="/forgot-password" className="text-xs font-medium text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
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

      <div className="flex items-center gap-2">
        <Checkbox id="remember" name="remember" />
        <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground">
          Remember me
        </Label>
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending && <Loader2 className="size-4 animate-spin" />}
        {pending ? "Signing in..." : "Login"}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Trouble logging in? Contact your OJT administrator.
      </p>
    </form>
  );
}
