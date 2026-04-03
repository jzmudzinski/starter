import Link from "next/link";

const APP_NAME = "StarterApp";
const CONTACT_EMAIL = "legal@yourdomain.com";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold">Terms of Service</h1>
      <p className="mt-2 text-muted-foreground">
        Last updated:{" "}
        {new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      <div className="mt-10 space-y-8">
        <section>
          <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
          <p className="mt-2 text-muted-foreground">
            By accessing or using {APP_NAME}, you agree to be bound by these Terms
            of Service. If you do not agree, please do not use the service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">2. Use of Service</h2>
          <p className="mt-2 text-muted-foreground">
            You may use {APP_NAME} for lawful purposes only. You agree not to:
          </p>
          <ul className="mt-2 list-disc pl-5 text-muted-foreground space-y-1">
            <li>Violate any applicable laws or regulations.</li>
            <li>Infringe on intellectual property rights.</li>
            <li>Transmit harmful, offensive, or spam content.</li>
            <li>Attempt to gain unauthorized access to our systems.</li>
            <li>Reverse engineer or decompile the service.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">3. Accounts</h2>
          <p className="mt-2 text-muted-foreground">
            You are responsible for maintaining the security of your account and password.
            {APP_NAME} cannot and will not be liable for any loss or damage from your
            failure to comply with this obligation.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">4. Payments & Billing</h2>
          <p className="mt-2 text-muted-foreground">
            Paid plans are billed in advance on a monthly or annual basis. All fees are
            non-refundable except as required by law. We reserve the right to change pricing
            with 30 days&apos; notice.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">5. Cancellation</h2>
          <p className="mt-2 text-muted-foreground">
            You may cancel your subscription at any time from your billing settings.
            Your plan will remain active until the end of the current billing period.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">6. Intellectual Property</h2>
          <p className="mt-2 text-muted-foreground">
            The service and its original content, features, and functionality are owned by
            {APP_NAME} and are protected by international copyright laws. Your content
            remains yours.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">7. Limitation of Liability</h2>
          <p className="mt-2 text-muted-foreground">
            {APP_NAME} shall not be liable for indirect, incidental, special, consequential,
            or punitive damages, including loss of profits or data, arising from your use
            of the service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">8. Disclaimer of Warranties</h2>
          <p className="mt-2 text-muted-foreground">
            The service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind,
            either express or implied, including merchantability, fitness for a particular
            purpose, or non-infringement.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">9. Changes to Terms</h2>
          <p className="mt-2 text-muted-foreground">
            We reserve the right to modify these terms at any time. We will provide notice
            of significant changes. Continued use after changes constitutes acceptance.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">10. Contact</h2>
          <p className="mt-2 text-muted-foreground">
            Questions about these Terms?{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
              {CONTACT_EMAIL}
            </a>
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
