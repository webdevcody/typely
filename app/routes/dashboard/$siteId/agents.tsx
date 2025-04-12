import { createFileRoute } from "@tanstack/react-router";
import { DashboardCard } from "@/components/ui/dashboard-card";

export const Route = createFileRoute("/dashboard/$siteId/agents")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <DashboardCard>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Agents
          </h2>
          <p className="text-gray-400">
            Manage your AI agents and their configurations.
          </p>
        </div>

        {/* Add agent content here */}
        <div className="text-gray-400">
          Agent management interface coming soon...
        </div>
      </div>
    </DashboardCard>
  );
}
