import { Bot, Brain, Code2, Gauge, Globe, Lock } from "lucide-react";

const features = [
  {
    name: "Intelligent Website Crawling",
    description:
      "Our AI automatically crawls and indexes your entire website, understanding your content's context and structure to provide accurate responses.",
    icon: Globe,
  },
  {
    name: "Easy Integration",
    description:
      "Add our chat widget to your site with just two lines of code. No complex setup or backend configuration required.",
    icon: Code2,
  },
  {
    name: "Smart Context Understanding",
    description:
      "Our AI understands user queries in context, providing relevant answers from your website's content with high accuracy.",
    icon: Brain,
  },
  {
    name: "Real-time Learning",
    description:
      "The AI continuously learns from new content and user interactions, staying up-to-date with your website's latest information.",
    icon: Bot,
  },
  {
    name: "Enterprise-grade Security",
    description:
      "Bank-level encryption and data protection ensure your website's information and user interactions remain secure.",
    icon: Lock,
  },
  {
    name: "Performance Optimized",
    description:
      "Lightweight widget with minimal impact on your website's load time. Responses are delivered in milliseconds.",
    icon: Gauge,
  },
];

export function Features() {
  return (
    <div className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">
            Powerful Features
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to enhance your website's user experience
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Transform your website into an interactive knowledge base with our
            AI-powered chat widget. Let your users find exactly what they need,
            instantly.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                  <feature.icon
                    className="h-5 w-5 flex-none text-primary"
                    aria-hidden="true"
                  />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
