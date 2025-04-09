import { Button } from "./ui/button";
import { CheckCircle, Copy } from "lucide-react";

export function ThreeSteps() {
  return (
    <div className="overflow-hidden bg-muted py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto w-full max-w-2xl lg:mx-0">
          <h2 className="text-base font-semibold leading-7 text-primary">
            Get Started in Minutes
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Three Simple Steps to AI-Powered Chat
          </p>

          {/* Steps */}
          <div className="mt-8 space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                1
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Create an Account
                </h3>
                <p className="text-sm text-muted-foreground">
                  Sign up in seconds - no credit card required
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                2
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Copy & Paste Code
                </h3>
                <p className="text-sm text-muted-foreground">
                  Add two lines of code to your website
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                3
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Watch It Learn
                </h3>
                <p className="text-sm text-muted-foreground">
                  Our AI automatically learns your content
                </p>
              </div>
            </div>
          </div>

          {/* Code Block */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute right-4 top-4">
                <button
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Copy code"
                >
                  <Copy size={20} />
                </button>
              </div>
              <pre className="rounded-lg bg-card p-4">
                <code className="text-sm text-muted-foreground">
                  {`<script src="https://cdn.sitesensei.ai/widget.js"></script>
<div data-sensei-id="YOUR_SITE_ID"></div>`}
                </code>
              </pre>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">
                No Code Required
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">
                5-Minute Setup
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">
                Instant AI Training
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">
                Free Trial Available
              </span>
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-8 border-t border-border pt-8">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full bg-muted border-2 border-background"
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">
                  500+ developers
                </span>{" "}
                added AI chat this week
              </p>
            </div>
          </div>

          <div className="mt-10 flex items-center gap-x-6">
            <Button className="bg-primary hover:bg-primary/90">
              Start Free Trial
            </Button>
            <div className="text-sm text-muted-foreground">
              No credit card required
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
