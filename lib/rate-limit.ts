import { db } from "@/lib/db/client";
import { rateLimit } from "@/lib/db/schema";
import { and, eq, gt } from "drizzle-orm";
import { nanoid } from "nanoid";
import type { PlanId } from "./plans";

interface RateLimitConfig {
  limit: number;
  windowMs: number; // milliseconds
}

const PLAN_LIMITS: Record<PlanId, Record<string, RateLimitConfig>> = {
  free: {
    "api:default": { limit: 100, windowMs: 24 * 60 * 60 * 1000 },
  },
  pro: {
    "api:default": { limit: 10000, windowMs: 24 * 60 * 60 * 1000 },
  },
  business: {
    "api:default": { limit: -1, windowMs: 24 * 60 * 60 * 1000 }, // unlimited
  },
};

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: Date;
}

/**
 * Check and increment rate limit for a user+key combo.
 * Returns success=false when limit is exceeded.
 */
export async function checkRateLimit(
  userId: string,
  key: string,
  plan: PlanId = "free"
): Promise<RateLimitResult> {
  const config = PLAN_LIMITS[plan]?.[key] ?? PLAN_LIMITS.free["api:default"];

  // Unlimited plan
  if (config.limit === -1) {
    return { success: true, remaining: -1, resetAt: new Date() };
  }

  const now = new Date();

  // Find existing window
  const [existing] = await db
    .select()
    .from(rateLimit)
    .where(
      and(
        eq(rateLimit.userId, userId),
        eq(rateLimit.key, key),
        gt(rateLimit.resetAt, now)
      )
    )
    .limit(1);

  if (!existing) {
    // Create new window
    const resetAt = new Date(now.getTime() + config.windowMs);
    await db.insert(rateLimit).values({
      id: nanoid(),
      userId,
      key,
      count: 1,
      resetAt,
    });
    return { success: true, remaining: config.limit - 1, resetAt };
  }

  if (existing.count >= config.limit) {
    return { success: false, remaining: 0, resetAt: existing.resetAt };
  }

  // Increment
  await db
    .update(rateLimit)
    .set({ count: existing.count + 1 })
    .where(eq(rateLimit.id, existing.id));

  return {
    success: true,
    remaining: config.limit - existing.count - 1,
    resetAt: existing.resetAt,
  };
}
