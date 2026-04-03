import { NextRequest, NextResponse } from "next/server";
import { requireAuthAPI } from "@/lib/auth/session";
import { getStripe } from "@/lib/stripe";
import { db } from "@/lib/db/client";
import { subscription } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getPlan } from "@/lib/plans";
import type { PlanId } from "@/lib/plans";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST(req: NextRequest) {
  const { session, response } = await requireAuthAPI(req);
  if (response) return response;

  const { planId, interval = "monthly" } = await req.json();
  const plan = getPlan(planId as PlanId);
  const priceId =
    interval === "yearly"
      ? plan.stripePriceId.yearly
      : plan.stripePriceId.monthly;

  if (!priceId) {
    return NextResponse.json(
      { error: "This plan has no associated price" },
      { status: 400 }
    );
  }

  try {
    const stripe = getStripe();
    const userId = session!.user.id;
    const userEmail = session!.user.email;

    // Get or create Stripe customer
    let [sub] = await db
      .select()
      .from(subscription)
      .where(eq(subscription.userId, userId))
      .limit(1);

    let customerId = sub?.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: { userId },
      });
      customerId = customer.id;
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${APP_URL}/dashboard?checkout=success`,
      cancel_url: `${APP_URL}/dashboard/settings?checkout=canceled`,
      metadata: { userId, planId, interval },
      subscription_data: {
        metadata: { userId, planId },
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
