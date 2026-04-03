"use client";

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;

export const forgetPassword = (data: { email: string; redirectTo: string }) =>
  (authClient as unknown as { forgetPassword?: (d: typeof data) => Promise<unknown> }).forgetPassword?.(data) ?? authClient.sendVerificationEmail?.({ email: data.email, callbackURL: data.redirectTo });

export const resetPassword = (data: { newPassword: string; token: string }) =>
  authClient.resetPassword?.(data) ?? authClient.$fetch('/auth/reset-password', { method: 'POST', body: data });
