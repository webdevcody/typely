import { Button } from "./ui/button";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Starter",
    id: "starter",
    priceMonthly: "$29",
    description: "Perfect for small websites and blogs",
    features: [
      "1 AI chat agent",
      "Up to 1,000 messages per month",
      "Basic website crawling",
      "Standard response time",
      "Email support",
      "Basic analytics",
    ],
    featured: false,
  },
  {
    name: "Professional",
    id: "professional",
    priceMonthly: "$79",
    description: "Ideal for growing businesses and e-commerce",
    features: [
      "3 AI chat agents",
      "Up to 5,000 messages per month",
      "Advanced website crawling",
      "Fast response time",
      "Priority email & chat support",
      "Advanced analytics & reporting",
      "Custom agent training",
      "Knowledge base integration",
    ],
    featured: true,
  },
  {
    name: "Enterprise",
    id: "enterprise",
    priceMonthly: "$199",
    description: "For large websites and custom requirements",
    features: [
      "Unlimited AI chat agents",
      "Unlimited messages",
      "Real-time website crawling",
      "Fastest response time",
      "24/7 priority support",
      "Enterprise analytics",
      "Custom AI model training",
      "API access",
      "SSO & team management",
      "Custom integrations",
    ],
    featured: false,
  },
];

export function Pricing() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">
            Pricing
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Choose the perfect plan for your site
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
          Start empowering your website with AI-powered chat agents. Scale as
          you grow.
        </p>

        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 xl:gap-x-12">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-3xl p-8 ring-1 xl:p-10 ${
                tier.featured
                  ? "bg-gray-900 ring-gray-900"
                  : "ring-gray-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between gap-x-4">
                <h3
                  className={`text-lg font-semibold leading-8 ${
                    tier.featured ? "text-white" : "text-gray-900"
                  }`}
                >
                  {tier.name}
                </h3>
              </div>
              <p
                className={`mt-4 text-sm leading-6 ${
                  tier.featured ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {tier.description}
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span
                  className={`text-4xl font-bold tracking-tight ${
                    tier.featured ? "text-white" : "text-gray-900"
                  }`}
                >
                  {tier.priceMonthly}
                </span>
                <span
                  className={`text-sm font-semibold leading-6 ${
                    tier.featured ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  /month
                </span>
              </p>
              <Button
                className={`mt-6 w-full ${
                  tier.featured
                    ? "bg-white text-gray-900 hover:bg-gray-100"
                    : "bg-indigo-600 text-white hover:bg-indigo-500"
                }`}
              >
                Get started
              </Button>
              <ul
                className={`mt-8 space-y-3 text-sm leading-6 ${
                  tier.featured ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <Check
                      className={`h-6 w-5 flex-none ${
                        tier.featured ? "text-white" : "text-indigo-600"
                      }`}
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
