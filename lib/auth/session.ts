import { auth } from "./auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

/**
 * Get current session on the server side (Server Components, Server Actions)
 */
export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

/**
 * Require authentication in Server Components.
 * Redirects to /login if not authenticated.
 */
export async function requireAuth() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }
  return session;
}

/**
 * Require authentication in API route handlers.
 * Returns 401 JSON response if not authenticated.
 */
export async function requireAuthAPI(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });
  if (!session?.user) {
    return {
      session: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { session, response: null };
}
