import { z } from "zod";

export const loginSchema = z.object({
  identifier: z.string().min(1, "Username, Student ID, or email is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormState =
  | {
      error?: string;
      fieldErrors?: Record<string, string[]>;
    }
  | undefined;

export const forgotPasswordSchema = z.object({
  identifier: z.string().min(1, "Email or username is required"),
});

export type ForgotPasswordFormState =
  | {
      error?: string;
      success?: boolean;
      devResetUrl?: string;
      fieldErrors?: Record<string, string[]>;
    }
  | undefined;

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[a-zA-Z]/, "Password must contain at least one letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormState =
  | {
      error?: string;
      success?: boolean;
      fieldErrors?: Record<string, string[]>;
    }
  | undefined;
