const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "StarterApp";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

function baseLayout(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${APP_NAME}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f9fafb; margin: 0; padding: 0; }
    .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,.1); }
    .header { background: #111827; padding: 24px 32px; }
    .header h1 { color: #fff; margin: 0; font-size: 20px; }
    .body { padding: 32px; color: #374151; line-height: 1.6; }
    .body h2 { font-size: 22px; margin-top: 0; }
    .btn { display: inline-block; background: #4f46e5; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; margin: 16px 0; }
    .footer { padding: 24px 32px; background: #f3f4f6; font-size: 12px; color: #9ca3af; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header"><h1>${APP_NAME}</h1></div>
    <div class="body">${content}</div>
    <div class="footer">
      <p>You received this email from ${APP_NAME}. <a href="${APP_URL}">Visit our website</a>.</p>
      <p>© ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
}

export function welcomeEmail({
  name,
  loginUrl = `${APP_URL}/login`,
}: {
  name: string;
  loginUrl?: string;
}): string {
  return baseLayout(`
    <h2>Welcome to ${APP_NAME}, ${name}! 🎉</h2>
    <p>We're thrilled to have you on board. Your account has been created and you're ready to get started.</p>
    <p>Here's what you can do next:</p>
    <ul>
      <li>Explore your new dashboard</li>
      <li>Set up your profile</li>
      <li>Invite your team members</li>
    </ul>
    <a href="${loginUrl}" class="btn">Go to Dashboard</a>
    <p>If you have any questions, just reply to this email — we're always happy to help.</p>
    <p>Cheers,<br/>The ${APP_NAME} team</p>
  `);
}

export function resetPasswordEmail({
  name,
  resetUrl,
}: {
  name: string;
  resetUrl: string;
}): string {
  return baseLayout(`
    <h2>Reset your password</h2>
    <p>Hi ${name},</p>
    <p>We received a request to reset your password. Click the button below to choose a new password:</p>
    <a href="${resetUrl}" class="btn">Reset Password</a>
    <p>This link will expire in <strong>1 hour</strong>.</p>
    <p>If you didn't request a password reset, you can safely ignore this email — your password won't change.</p>
    <p>Cheers,<br/>The ${APP_NAME} team</p>
  `);
}

export function paymentConfirmationEmail({
  name,
  plan,
  amount,
  invoiceUrl,
  nextBillingDate,
}: {
  name: string;
  plan: string;
  amount: string;
  invoiceUrl?: string;
  nextBillingDate?: string;
}): string {
  return baseLayout(`
    <h2>Payment confirmed ✅</h2>
    <p>Hi ${name},</p>
    <p>Your payment of <strong>${amount}</strong> for the <strong>${plan}</strong> plan has been processed successfully.</p>
    ${nextBillingDate ? `<p>Your next billing date is <strong>${nextBillingDate}</strong>.</p>` : ""}
    ${invoiceUrl ? `<p><a href="${invoiceUrl}" class="btn">View Invoice</a></p>` : ""}
    <p>Thank you for your continued support! If you have any questions about your billing, please <a href="${APP_URL}/dashboard/settings">visit your billing settings</a> or reply to this email.</p>
    <p>Cheers,<br/>The ${APP_NAME} team</p>
  `);
}
