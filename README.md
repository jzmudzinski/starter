# 🚀 StarterApp — Universal SaaS Starter

A production-ready Next.js 16 SaaS starter template with everything you need to ship fast.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org) with Turbopack |
| Auth | [Better Auth](https://www.better-auth.com) |
| Database | [Drizzle ORM](https://orm.drizzle.team) + [Neon](https://neon.tech) (serverless Postgres) |
| Payments | [Stripe](https://stripe.com) (subscriptions + webhooks) |
| Email | [Resend](https://resend.com) |
| Analytics | [PostHog](https://posthog.com) |
| Error Tracking | [Sentry](https://sentry.io) |
| UI | [shadcn/ui](https://ui.shadcn.com) + [Tailwind CSS](https://tailwindcss.com) |
| Testing | [Playwright](https://playwright.dev) (E2E) |

## Features

- ✅ Email/password authentication with sessions
- ✅ Password reset via email
- ✅ Stripe subscription billing (Free / Pro / Business)
- ✅ Billing portal & checkout
- ✅ Stripe webhook handler (subscription lifecycle)
- ✅ DB-backed rate limiting per user/plan
- ✅ GDPR: data export + account deletion
- ✅ Transactional email templates (welcome, reset, payment)
- ✅ PostHog analytics integration
- ✅ Sentry error tracking
- ✅ Cookie consent banner
- ✅ Dark mode (next-themes)
- ✅ Landing page with pricing
- ✅ Dashboard with plan overview
- ✅ Settings: account, billing, theme, danger zone
- ✅ Sitemap + robots.txt
- ✅ E2E test suite (Playwright)

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/jzmudzinski/starter.git
cd starter
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
# Edit .env.local with your keys
```

### 3. Set up external services

#### Neon (Database)
1. Create a free account at [neon.tech](https://neon.tech)
2. Create a new project and copy the connection string
3. Paste into `DATABASE_URL`

#### Stripe (Billing)
1. Create account at [stripe.com](https://stripe.com)
2. Get API keys from Dashboard → Developers → API keys
3. Create products and prices for each plan (Pro monthly/yearly, Business monthly/yearly)
4. Set up a webhook endpoint at `https://yourdomain.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`

#### Resend (Email)
1. Create account at [resend.com](https://resend.com)
2. Add and verify your domain
3. Get API key and set `RESEND_API_KEY` and `EMAIL_FROM`

#### PostHog (Analytics — optional)
1. Create account at [posthog.com](https://posthog.com)
2. Get project API key, set `NEXT_PUBLIC_POSTHOG_KEY`

#### Sentry (Error tracking — optional)
1. Create account at [sentry.io](https://sentry.io)
2. Create a Next.js project, get DSN, set `NEXT_PUBLIC_SENTRY_DSN`

### 4. Initialize database

```bash
npx tsx scripts/setup.ts
# or directly:
npx drizzle-kit push
```

### 5. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
├── app/
│   ├── (auth)/         # Login, signup, forgot/reset password
│   ├── (dashboard)/    # Protected dashboard pages
│   ├── api/            # API routes (auth, stripe)
│   ├── layout.tsx      # Root layout (theme, analytics)
│   ├── page.tsx        # Landing page
│   ├── privacy/        # Privacy policy
│   └── terms/          # Terms of service
├── components/         # Shared components (ui/, theme, posthog, cookie-consent)
├── lib/
│   ├── auth/           # Better Auth config + session helpers
│   ├── db/             # Drizzle schema + client
│   ├── email.ts        # Resend helper
│   ├── email-templates.ts  # HTML email templates
│   ├── plans.ts        # Subscription tiers
│   ├── rate-limit.ts   # DB-backed rate limiting
│   └── stripe.ts       # Stripe client
├── middleware.ts        # Auth middleware (protect routes)
├── tests/e2e/          # Playwright tests
└── drizzle.config.ts   # Drizzle configuration
```

## Customization

### Rename the app
1. Update `NEXT_PUBLIC_APP_NAME` in `.env.local`
2. Update the logo/name in `app/page.tsx` and `app/(dashboard)/layout.tsx`

### Add OAuth (Google, GitHub)
Add to `lib/auth/auth.ts`:
```ts
import { google } from "better-auth/social-providers";

export const auth = betterAuth({
  // ...existing config
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});
```

### Modify pricing plans
Edit `lib/plans.ts` to update plan names, prices, limits, and features.

### Add a new protected page
Create a file in `app/(dashboard)/your-page/page.tsx`. The middleware automatically protects all `/dashboard/*` routes.

## Deployment

### Vercel (recommended)
```bash
vercel --prod
```

Set all environment variables from `.env.example` in your Vercel project settings.

## Running Tests

```bash
# Install browsers (first time)
npx playwright install chromium

# Run E2E tests
npx playwright test

# UI mode
npx playwright test --ui
```

## License

MIT — use freely for personal and commercial projects.

---

Built with ❤️ by [jzmudzinski](https://github.com/jzmudzinski)
