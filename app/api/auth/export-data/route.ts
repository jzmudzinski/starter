import { NextRequest, NextResponse } from "next/server";
import { requireAuthAPI } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { user, subscription } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { session, response } = await requireAuthAPI(req);
  if (response) return response;

  try {
    const userId = session!.user.id;

    const [userData] = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    const [subData] = await db
      .select()
      .from(subscription)
      .where(eq(subscription.userId, userId))
      .limit(1);

    const exportData = {
      exportedAt: new Date().toISOString(),
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        emailVerified: userData.emailVerified,
        createdAt: userData.createdAt,
      },
      subscription: subData
        ? {
            plan: subData.plan,
            status: subData.status,
            currentPeriodEnd: subData.currentPeriodEnd,
          }
        : null,
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="data-export-${userId}.json"`,
      },
    });
  } catch (error) {
    console.error("Export data error:", error);
    return NextResponse.json({ error: "Failed to export data" }, { status: 500 });
  }
}
