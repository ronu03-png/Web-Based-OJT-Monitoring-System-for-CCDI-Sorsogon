import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession, homeForRole } from "@/lib/auth/dal";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login | CCDI Sorsogon OJT Monitoring System",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await getSession();
  if (session) {
    redirect(homeForRole(session.role));
  }

  const { next } = await searchParams;

  return (
    <AuthShell>
      <LoginForm nextPath={next} />
    </AuthShell>
  );
}
