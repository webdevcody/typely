import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";

export function Step1() {
  const navigate = useNavigate();

  return (
    <div className="text-center max-w-2xl mx-auto pt-12">
      <h1 className="text-3xl font-bold mb-6">Adding your First Site</h1>
      <p className="text-gray-600 mb-8">
        Let's start by letting the Sensei learn all about your site! We'll crawl
        your website pages, analyze the content, and create an AI assistant that
        can answer questions about your site. This process helps Sensei
        understand your content deeply so it can provide accurate and helpful
        responses to your visitors.
      </p>
      <Button
        onClick={() =>
          navigate({ to: "/onboarding/$step", params: { step: "2" } })
        }
      >
        Get Started
      </Button>
    </div>
  );
}
