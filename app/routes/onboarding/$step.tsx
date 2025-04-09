import { createFileRoute } from "@tanstack/react-router";
import { Step1 } from "./-steps/step1";
import { Step2 } from "./-steps/step2";
import { Step3 } from "./-steps/step3";
import { Toaster } from "sonner";

export const Route = createFileRoute("/onboarding/$step")({
  component: OnboardingComponent,
});

function OnboardingComponent() {
  const { step } = Route.useParams();

  return (
    <div className="container mx-auto py-8">
      <Toaster position="top-center" />
      {step === "1" && <Step1 />}
      {step === "2" && <Step2 />}
      {step === "3" && <Step3 />}
    </div>
  );
}
