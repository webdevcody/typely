import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { DashboardHeader } from "@/components/ui/dashboard-header";

export function Step1() {
  const navigate = useNavigate();

  return (
    <div className="p-8 space-y-6 min-h-screen">
      <div className="max-w-2xl mx-auto rounded-2xl bg-dashboard-panel-background border border-[#262932]/50 shadow-sm">
        <div className="border-b-2 border-[#262932]">
          <div className="p-8">
            <DashboardHeader title="Welcome (Step 1 of 3)" />
          </div>
        </div>

        <div className="flex items-center justify-center py-12">
          <div className="max-w-2xl mx-auto px-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-500 to-white bg-clip-text text-transparent">
                Adding your First Site
              </h1>
              <p className="text-gray-400 mb-8 leading-relaxed">
                We'll scan your website to create an AI assistant that can
                answer questions about your content. This helps provide accurate
                and helpful responses to your visitors.
              </p>
              <Button
                onClick={() =>
                  navigate({ to: "/onboarding/$step", params: { step: "2" } })
                }
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
