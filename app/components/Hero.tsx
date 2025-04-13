import { Button } from "./ui/button";

export function Hero() {
  return (
    <div className="relative isolate bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-7xl py-12 sm:py-16 lg:flex lg:items-center lg:gap-x-10 lg:py-20">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
            <h1 className="mt-10 max-w-lg text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Add AI chat to your website in minutes
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Transform your website into an interactive knowledge base. Our AI
              automatically learns your content and helps users find exactly
              what they're looking for.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Button>Get Started Free</Button>
            </div>
          </div>
          <div className="mt-16 sm:mt-20 lg:mt-0 lg:flex-shrink-0"></div>
        </div>
      </div>
    </div>
  );
}
