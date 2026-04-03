import { requireAuth } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { subscription } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getPlan } from "@/lib/plans";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";

export default async function DashboardPage() {
  const session = await requireAuth();

  const [sub] = await db
    .select()
    .from(subscription)
    .where(eq(subscription.userId, session.user.id))
    .limit(1);

  const plan = getPlan(sub?.plan as "free" | "pro" | "business" ?? "free");

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Welcome header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {session.user.name.split(" ")[0]}! 👋
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here&apos;s what&apos;s happening with your account.
        </p>
      </div>

      {/* Plan card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Current Plan
              </CardTitle>
              <CardDescription>
                Your subscription and usage details
              </CardDescription>
            </div>
            <Badge
              variant={plan.id === "free" ? "secondary" : "default"}
              className="text-sm"
            >
              {plan.name}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">API Requests/Day</p>
              <p className="text-2xl font-bold">
                {plan.limits.apiRequestsPerDay === -1
                  ? "∞"
                  : plan.limits.apiRequestsPerDay.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">Projects</p>
              <p className="text-2xl font-bold">
                {plan.limits.maxProjects === -1 ? "∞" : plan.limits.maxProjects}
              </p>
            </div>
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">Team Members</p>
              <p className="text-2xl font-bold">
                {plan.limits.maxTeamMembers === -1
                  ? "∞"
                  : plan.limits.maxTeamMembers}
              </p>
            </div>
          </div>

          {plan.id === "free" && (
            <div className="flex items-center justify-between rounded-lg border border-dashed p-4">
              <div>
                <p className="font-medium">Upgrade to Pro</p>
                <p className="text-sm text-muted-foreground">
                  Get 100x more API requests and unlock team features
                </p>
              </div>
              <Link href="/dashboard/settings">
                <Button size="sm">
                  Upgrade <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}

          {sub?.currentPeriodEnd && (
            <p className="text-sm text-muted-foreground">
              {sub.cancelAtPeriodEnd
                ? `Plan cancels on ${sub.currentPeriodEnd.toLocaleDateString()}`
                : `Next billing date: ${sub.currentPeriodEnd.toLocaleDateString()}`}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Account Settings</CardTitle>
            <CardDescription>Update your profile and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/settings"><Button variant="outline">Go to Settings</Button></Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Documentation</CardTitle>
            <CardDescription>
              Learn how to get the most from this template
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a href="https://github.com/jzmudzinski/starter" target="_blank" rel="noreferrer"><Button variant="outline">View README</Button></a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
