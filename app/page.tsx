import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { plans, formatPrice } from "@/lib/plans";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Zap,
  Shield,
  CreditCard,
  BarChart3,
  Mail,
  CheckCircle2,

} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Authentication",
    description:
      "Email/password auth with Better Auth. Sessions, password reset, email verification all included.",
  },
  {
    icon: CreditCard,
    title: "Stripe Billing",
    description:
      "Subscription management, checkout, billing portal, and webhook handling pre-built.",
  },
  {
    icon: Zap,
    title: "Turbopack Ready",
    description:
      "Built on Next.js 16 with Turbopack for blazing fast development builds.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description:
      "PostHog integration for product analytics, feature flags, and session recording.",
  },
  {
    icon: Mail,
    title: "Transactional Email",
    description:
      "Resend integration with beautiful HTML email templates for welcome, reset, and billing.",
  },
  {
    icon: Shield,
    title: "Type-Safe Database",
    description:
      "Drizzle ORM + Neon serverless Postgres with auto-generated migrations.",
  },
];

const faqs = [
  {
    q: "Is this free to use?",
    a: "Yes! The template itself is MIT licensed. You'll need your own accounts for Neon, Stripe, Resend, and PostHog (all have generous free tiers).",
  },
  {
    q: "Can I use this for commercial projects?",
    a: "Absolutely. The MIT license allows commercial use without restrictions.",
  },
  {
    q: "How long does setup take?",
    a: "About 15-20 minutes following the README. Most time is spent configuring external service API keys.",
  },
  {
    q: "Does it support OAuth (Google, GitHub)?",
    a: "Better Auth supports many providers. OAuth can be added to the auth config in a few lines.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold">
            🚀 StarterApp
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Pricing
            </Link>
            <Link
              href="#faq"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              FAQ
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
            <Link href="/signup"><Button size="sm">Get started</Button></Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-4xl px-4 py-24 text-center">
          <Badge variant="secondary" className="mb-4">
            ✨ Open Source SaaS Template
          </Badge>
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Ship your SaaS
            <br />
            <span className="text-primary">in days, not months</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            A production-ready Next.js starter with auth, billing, database,
            analytics, and email — all pre-configured so you can focus on what
            makes your product unique.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/signup"><Button size="lg">Start for free</Button></Link>
            <a href="https://github.com/jzmudzinski/starter" target="_blank" rel="noreferrer"><Button size="lg" variant="outline">View on GitHub</Button></a>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Free forever plan · No credit card required
          </p>
        </section>

        {/* Features */}
        <section id="features" className="bg-muted/30 py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold">Everything you need</h2>
              <p className="mt-2 text-muted-foreground">
                Skip the boilerplate. Start building your actual product.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <Card key={f.title}>
                  <CardHeader>
                    <f.icon className="h-8 w-8 text-primary" />
                    <CardTitle className="text-lg">{f.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{f.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold">Simple, transparent pricing</h2>
              <p className="mt-2 text-muted-foreground">
                Start free. Upgrade when you&apos;re ready.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  className={
                    plan.highlighted ? "border-primary ring-1 ring-primary" : ""
                  }
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{plan.name}</CardTitle>
                      {plan.highlighted && (
                        <Badge>Popular</Badge>
                      )}
                    </div>
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-bold">
                        {formatPrice(plan.price.monthly)}
                      </span>
                      {plan.price.monthly > 0 && (
                        <span className="text-muted-foreground">/mo</span>
                      )}
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {plan.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-2 text-sm"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link href="/signup" className="w-full">
                      <Button
                        className="w-full"
                        variant={plan.highlighted ? "default" : "outline"}
                      >
                        {plan.id === "free"
                          ? "Get started free"
                          : `Start ${plan.name}`}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="bg-muted/30 py-20">
          <div className="mx-auto max-w-2xl px-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold">Frequently asked questions</h2>
            </div>
            <div className="mt-12 space-y-6">
              {faqs.map((faq) => (
                <div key={faq.q} className="rounded-lg border bg-background p-6">
                  <h3 className="font-semibold">{faq.q}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} StarterApp. Built with ❤️ for makers.
            </p>
            <nav className="flex gap-4 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:underline">
                Privacy
              </Link>
              <Link href="/terms" className="hover:underline">
                Terms
              </Link>
              <a
                href="https://github.com/jzmudzinski/starter"
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                GitHub
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
