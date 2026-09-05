"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { createSession, deleteSession } from "@/lib/auth/session";
import { getSession, homeForRole } from "@/lib/auth/dal";
import { loginSchema, type LoginFormState } from "@/lib/validations/auth";
import { logAudit } from "@/lib/audit";
import { ROLE_BASE_PATH } from "@/lib/roles";

export async function loginAction(
  _prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const parsed = loginSchema.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { identifier, password } = parsed.data;

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: identifier },
        { username: identifier },
        { student: { studentId: identifier } },
      ],
    },
  });

  const genericError = "Invalid credentials. Please check your username/email and password.";

  if (!user) {
    return { error: genericError };
  }

  if (user.status === "DISABLED") {
    return { error: "Your account has been disabled. Please contact the administrator." };
  }

  if (user.status === "PENDING") {
    return { error: "Your account is pending activation. Please contact the administrator." };
  }

  const validPassword = await verifyPassword(password, user.passwordHash);
  if (!validPassword) {
    await logAudit({
      userId: user.id,
      action: "LOGIN_FAILED",
      description: "Invalid password attempt",
    });
    return { error: genericError };
  }

  const remember = formData.get("remember") === "on";
  await createSession(user.id, user.role, remember);
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });
  await logAudit({
    userId: user.id,
    action: "LOGIN",
    description: `${user.firstName} ${user.lastName} logged in`,
    entityType: "User",
    entityId: user.id,
  });

  const nextPath = formData.get("next")?.toString();
  const target =
    nextPath && nextPath.startsWith(ROLE_BASE_PATH[user.role]) ? nextPath : homeForRole(user.role);

  redirect(target);
}

export async function logoutAction() {
  const session = await getSession();
  if (session) {
    await logAudit({
      userId: session.userId,
      action: "LOGOUT",
      entityType: "User",
      entityId: session.userId,
    });
  }
  await deleteSession();
  redirect("/login");
}
