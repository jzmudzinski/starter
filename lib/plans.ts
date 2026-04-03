export type PlanId = "free" | "pro" | "business";

export interface Plan {
  id: PlanId;
  name: string;
  description: string;
  price: {
    monthly: number; // in cents
    yearly: number; // in cents
  };
  stripePriceId: {
    monthly: string | null;
    yearly: string | null;
  };
  limits: {
    apiRequestsPerDay: number;
    maxProjects: number;
    maxTeamMembers: number;
  };
  features: string[];
  highlighted?: boolean;
}

export const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for side projects and exploration",
    price: {
      monthly: 0,
      yearly: 0,
    },
    stripePriceId: {
      monthly: null,
      yearly: null,
    },
    limits: {
      apiRequestsPerDay: 100,
      maxProjects: 3,
      maxTeamMembers: 1,
    },
    features: [
      "Up to 3 projects",
      "100 API requests/day",
      "Community support",
      "Basic analytics",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "For professionals and growing teams",
    price: {
      monthly: 1900, // $19/mo
      yearly: 15200, // $152/yr (~$12.67/mo)
    },
    stripePriceId: {
      monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || null,
      yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID || null,
    },
    limits: {
      apiRequestsPerDay: 10000,
      maxProjects: 25,
      maxTeamMembers: 5,
    },
    features: [
      "Up to 25 projects",
      "10,000 API requests/day",
      "Priority support",
      "Advanced analytics",
      "Custom domains",
      "Team collaboration",
    ],
    highlighted: true,
  },
  {
    id: "business",
    name: "Business",
    description: "For large teams and enterprises",
    price: {
      monthly: 7900, // $79/mo
      yearly: 63200, // $632/yr (~$52.67/mo)
    },
    stripePriceId: {
      monthly: process.env.STRIPE_BUSINESS_MONTHLY_PRICE_ID || null,
      yearly: process.env.STRIPE_BUSINESS_YEARLY_PRICE_ID || null,
    },
    limits: {
      apiRequestsPerDay: -1, // unlimited
      maxProjects: -1, // unlimited
      maxTeamMembers: -1, // unlimited
    },
    features: [
      "Unlimited projects",
      "Unlimited API requests",
      "24/7 dedicated support",
      "Custom analytics & reporting",
      "SSO/SAML",
      "Unlimited team members",
      "SLA guarantee",
      "Custom integrations",
    ],
  },
];

export function getPlan(id: PlanId): Plan {
  return plans.find((p) => p.id === id) ?? plans[0];
}

export function formatPrice(cents: number): string {
  if (cents === 0) return "Free";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}
