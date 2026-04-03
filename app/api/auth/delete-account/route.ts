import { NextRequest, NextResponse } from "next/server";
import { requireAuthAPI } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(req: NextRequest) {
  const { session, response } = await requireAuthAPI(req);
  if (response) return response;

  try {
    // Delete the user (cascades to sessions, accounts, etc.)
    await db.delete(user).where(eq(user.id, session!.user.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}
