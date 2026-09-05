"use server";

import { randomBytes } from "crypto";
import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/auth/password";
import { logAudit } from "@/lib/audit";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  type ForgotPasswordFormState,
  type ResetPasswordFormState,
} from "@/lib/validations/auth";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function requestPasswordResetAction(
  _prevState: ForgotPasswordFormState,
  formData: FormData
): Promise<ForgotPasswordFormState> {
  const parsed = forgotPasswordSchema.safeParse({
    identifier: formData.get("identifier"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { identifier } = parsed.data;

  const user = await prisma.user.findFirst({
    where: { OR: [{ email: identifier }, { username: identifier }] },
  });

  // Always report success, even if no matching account exists, so we never
  // reveal which identifiers are registered in the system.
  if (!user || user.status !== "ACTIVE") {
    return { success: true };
  }

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

  await prisma.passwordResetToken.create({
    data: { userId: user.id, token, expiresAt },
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/reset-password?token=${token}`;

  // NOTE: no transactional email provider is configured yet. Wire this up to
  // a real service (e.g. Resend/SendGrid, using an API key from environment
  // variables) before going to production. For now the link is logged
  // server-side so the flow is fully testable in development.
  console.log(`[password-reset] Reset link for ${user.email}: ${resetUrl}`);

  await logAudit({
    userId: user.id,
    action: "PASSWORD_RESET_REQUESTED",
    entityType: "User",
    entityId: user.id,
  });

  return {
    success: true,
    devResetUrl: process.env.NODE_ENV !== "production" ? resetUrl : undefined,
  };
}

export async function resetPasswordAction(
  _prevState: ResetPasswordFormState,
  formData: FormData
): Promise<ResetPasswordFormState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { token, password } = parsed.data;

  const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });

  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    return {
      error: "This password reset link is invalid or has expired. Please request a new one.",
    };
  }

  const passwordHash = await hashPassword(password);

  await prisma.$transaction([
    prisma.user.update({ where: { id: resetToken.userId }, data: { passwordHash } }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    }),
  ]);

  await logAudit({
    userId: resetToken.userId,
    action: "PASSWORD_RESET_COMPLETED",
    entityType: "User",
    entityId: resetToken.userId,
  });

  return { success: true };
}
