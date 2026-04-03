"use client";

import { useState, useTransition } from "react";
import { useSession, signOut } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { plans, formatPrice } from "@/lib/plans";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Download, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(session?.user.name || "");
  const [profileMsg, setProfileMsg] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">("monthly");
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  async function handleCheckout(planId: string) {
    setCheckoutLoading(planId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, interval: billingInterval }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      alert("Checkout failed. Please try again.");
    } finally {
      setCheckoutLoading(null);
    }
  }

  async function handlePortal() {
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      alert("Could not open billing portal. Please try again.");
    }
  }

  async function handleDeleteAccount() {
    if (deleteConfirm !== "delete my account") return;
    startTransition(async () => {
      await fetch("/api/auth/delete-account", { method: "DELETE" });
      await signOut();
      router.push("/");
    });
  }

  async function handleExportData() {
    window.location.href = "/api/auth/export-data";
  }

  if (!session) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      <Tabs defaultValue="account">
        <TabsList className="w-full">
          <TabsTrigger value="account" className="flex-1">Account</TabsTrigger>
          <TabsTrigger value="billing" className="flex-1">Billing</TabsTrigger>
          <TabsTrigger value="appearance" className="flex-1">Appearance</TabsTrigger>
          <TabsTrigger value="danger" className="flex-1">Danger Zone</TabsTrigger>
        </TabsList>

        {/* Account tab */}
        <TabsContent value="account" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Update your display name</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={session.user.email} disabled />
                <p className="text-xs text-muted-foreground">
                  Email changes are not supported yet.
                </p>
              </div>
              {profileMsg && (
                <p className="text-sm text-green-600">{profileMsg}</p>
              )}
              <Button
                onClick={() => {
                  // TODO: implement profile update via Better Auth
                  setProfileMsg("Profile update coming soon.");
                }}
              >
                Save changes
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Export</CardTitle>
              <CardDescription>
                Download all your personal data (GDPR)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={handleExportData}>
                <Download className="mr-2 h-4 w-4" />
                Export my data
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing tab */}
        <TabsContent value="billing" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plans</CardTitle>
              <CardDescription>Choose the plan that fits your needs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm">Monthly</span>
                <Switch
                  checked={billingInterval === "yearly"}
                  onCheckedChange={(v) =>
                    setBillingInterval(v ? "yearly" : "monthly")
                  }
                />
                <span className="text-sm">
                  Yearly{" "}
                  <Badge variant="secondary" className="text-xs">
                    Save ~33%
                  </Badge>
                </span>
              </div>

              <div className="grid gap-4">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`rounded-lg border p-4 ${
                      plan.highlighted
                        ? "border-primary bg-primary/5"
                        : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{plan.name}</h3>
                          {plan.highlighted && (
                            <Badge className="text-xs">Popular</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {plan.description}
                        </p>
                        <p className="mt-2 text-2xl font-bold">
                          {formatPrice(
                            billingInterval === "yearly"
                              ? plan.price.yearly
                              : plan.price.monthly
                          )}
                          {plan.price.monthly > 0 && (
                            <span className="text-sm font-normal text-muted-foreground">
                              /{billingInterval === "yearly" ? "yr" : "mo"}
                            </span>
                          )}
                        </p>
                        <ul className="mt-2 space-y-1">
                          {plan.features.slice(0, 3).map((f) => (
                            <li
                              key={f}
                              className="text-xs text-muted-foreground"
                            >
                              ✓ {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        {plan.id === "free" ? (
                          <Badge variant="secondary">Free</Badge>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleCheckout(plan.id)}
                            disabled={checkoutLoading === plan.id}
                          >
                            {checkoutLoading === plan.id && (
                              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                            )}
                            Select
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />
              <Button variant="outline" onClick={handlePortal}>
                Manage billing & invoices
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance tab */}
        <TabsContent value="appearance" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>Choose your preferred color scheme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {["light", "dark", "system"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`rounded-lg border p-4 capitalize transition-colors ${
                      theme === t
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div
                      className={`mb-2 h-10 rounded-md border ${
                        t === "dark"
                          ? "bg-gray-900"
                          : t === "light"
                          ? "bg-white"
                          : "bg-gradient-to-b from-white to-gray-900"
                      }`}
                    />
                    <span className="text-sm font-medium">{t}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Danger zone tab */}
        <TabsContent value="danger" className="space-y-4 mt-4">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible actions. Proceed with caution.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogTrigger render={<Button variant="destructive" />}>
                  Delete Account
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete your account</DialogTitle>
                    <DialogDescription>
                      This action is permanent and cannot be undone. All your
                      data will be deleted immediately.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-2 py-2">
                    <Label>
                      Type{" "}
                      <span className="font-mono font-semibold">
                        delete my account
                      </span>{" "}
                      to confirm
                    </Label>
                    <Input
                      value={deleteConfirm}
                      onChange={(e) => setDeleteConfirm(e.target.value)}
                      placeholder="delete my account"
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setDeleteOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      disabled={
                        deleteConfirm !== "delete my account" || isPending
                      }
                      onClick={handleDeleteAccount}
                    >
                      {isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Delete Account
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
