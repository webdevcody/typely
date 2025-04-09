import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/onboarding/")({
  component: RouteComponent,
  beforeLoad: async () => {
    throw redirect({ to: "/onboarding/$step", params: { step: "1" } });
  },
});

function RouteComponent() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent" />
    </div>
  );
}
