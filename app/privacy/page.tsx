import Link from "next/link";

const APP_NAME = "StarterApp";
const CONTACT_EMAIL = "privacy@yourdomain.com";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold">Privacy Policy</h1>
      <p className="mt-2 text-muted-foreground">
        Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
      </p>

      <div className="prose prose-gray dark:prose-invert mt-10 space-y-8">
        <section>
          <h2 className="text-2xl font-semibold">1. Introduction</h2>
          <p className="mt-2 text-muted-foreground">
            {APP_NAME} (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your personal information.
            This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you use our service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">2. Information We Collect</h2>
          <ul className="mt-2 list-disc pl-5 text-muted-foreground space-y-1">
            <li><strong>Account data:</strong> name, email address, and password (hashed).</li>
            <li><strong>Billing data:</strong> payment information processed by Stripe (we never store card details).</li>
            <li><strong>Usage data:</strong> pages visited, features used, and session information.</li>
            <li><strong>Communications:</strong> emails you send us for support.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">3. How We Use Your Information</h2>
          <ul className="mt-2 list-disc pl-5 text-muted-foreground space-y-1">
            <li>Provide, operate, and improve our service.</li>
            <li>Process payments and send billing communications.</li>
            <li>Send transactional emails (account, security notifications).</li>
            <li>Analyze usage to improve the product.</li>
            <li>Comply with legal obligations.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">4. Data Sharing</h2>
          <p className="mt-2 text-muted-foreground">
            We do not sell your personal data. We may share data with:
          </p>
          <ul className="mt-2 list-disc pl-5 text-muted-foreground space-y-1">
            <li><strong>Stripe</strong> — payment processing.</li>
            <li><strong>Resend</strong> — transactional email delivery.</li>
            <li><strong>PostHog</strong> — product analytics (anonymized).</li>
            <li><strong>Neon</strong> — database hosting.</li>
            <li>Law enforcement when required by law.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">5. Your Rights (GDPR)</h2>
          <p className="mt-2 text-muted-foreground">
            If you are in the EU/EEA, you have the right to:
          </p>
          <ul className="mt-2 list-disc pl-5 text-muted-foreground space-y-1">
            <li>Access your data — use the &quot;Export my data&quot; feature in Settings.</li>
            <li>Correct inaccurate data — update in your account settings.</li>
            <li>Delete your data — use the &quot;Delete Account&quot; feature in Settings.</li>
            <li>Object to processing or request restriction.</li>
            <li>Data portability.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">6. Cookies</h2>
          <p className="mt-2 text-muted-foreground">
            We use cookies for authentication sessions and analytics. You can decline non-essential
            cookies via the cookie banner shown on your first visit.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">7. Data Retention</h2>
          <p className="mt-2 text-muted-foreground">
            We retain your data as long as your account is active. Upon account deletion, we delete
            your personal data within 30 days, except where required by law.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">8. Contact</h2>
          <p className="mt-2 text-muted-foreground">
            For privacy questions or requests, contact us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>
      </div>

      <div className="mt-10">
        <Link href="/" className="text-sm text-muted-foreground hover:underline">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
