import { createFileRoute } from "@tanstack/react-router";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { DashboardHeader } from "@/components/ui/dashboard-header";

export const Route = createFileRoute("/dashboard/$siteId/documents")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-8 space-y-6 bg-[#0D0F12] min-h-full">
      <DashboardHeader title="Dashboard/Documents" />

      <DashboardCard>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Documents
            </h2>
            <p className="text-gray-400">
              Manage your site's documents and files.
            </p>
          </div>

          {/* Add documents content here */}
          <div className="text-gray-400">
            Document management interface coming soon...
          </div>
        </div>
      </DashboardCard>
    </div>
  );
}
