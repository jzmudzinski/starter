import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { db } from "@/lib/db/client";
import { subscription } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import type Stripe from "stripe";
import { sendEmail } from "@/lib/email";
import { paymentConfirmationEmail } from "@/lib/email-templates";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature error:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        const userId = checkoutSession.metadata?.userId;
        const planId = checkoutSession.metadata?.planId;

        if (userId && planId && checkoutSession.subscription) {
          const stripe = getStripe();
          const sub = await stripe.subscriptions.retrieve(
            checkoutSession.subscription as string
          );

          await upsertSubscription(userId, planId, sub);
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.userId;
        const planId = sub.metadata?.planId || "pro";

        if (userId) {
          await upsertSubscription(userId, planId, sub);

          // Send payment confirmation on invoice payment
          if (sub.status === "active") {
            const stripe = getStripe();
            const customer = await stripe.customers.retrieve(
              sub.customer as string
            ) as Stripe.Customer;
            if (customer.email) {
              const periodEnd = new Date(((sub as unknown as { current_period_end: number }).current_period_end ?? 0) * 1000);
              await sendEmail({
                to: customer.email,
                subject: "Payment confirmed",
                html: paymentConfirmationEmail({
                  name: customer.name || "there",
                  plan: planId,
                  amount: "See your invoice",
                  nextBillingDate: periodEnd.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }),
                }),
              });
            }
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await db
          .update(subscription)
          .set({ plan: "free", status: "canceled", stripeSubscriptionId: null })
          .where(eq(subscription.stripeSubscriptionId, sub.id));
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice & { subscription?: string | null };
        if (invoice.subscription) {
          await db
            .update(subscription)
            .set({ status: "past_due" })
            .where(
              eq(
                subscription.stripeSubscriptionId,
                invoice.subscription as string
              )
            );
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function upsertSubscription(
  userId: string,
  planId: string,
  stripeSub: Stripe.Subscription & { current_period_end?: number; cancel_at_period_end?: boolean }
) {
  const existingSub = await db.query.subscription.findFirst({
    where: eq(subscription.userId, userId),
  });

  const data = {
    userId,
    stripeCustomerId: stripeSub.customer as string,
    stripeSubscriptionId: stripeSub.id,
    stripePriceId: stripeSub.items.data[0]?.price?.id,
    plan: planId,
    status: stripeSub.status,
    currentPeriodEnd: stripeSub.current_period_end ? new Date(stripeSub.current_period_end * 1000) : null,
    cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
    updatedAt: new Date(),
  };

  if (existingSub) {
    await db
      .update(subscription)
      .set(data)
      .where(eq(subscription.userId, userId));
  } else {
    await db.insert(subscription).values({ ...data, id: nanoid() });
  }
}
