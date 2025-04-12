import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { useQuery } from "convex/react";
import { useEffect } from "react";
import { Button } from "../../components/ui/button";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { DashboardHeader } from "@/components/ui/dashboard-header";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const sites = useQuery(api.sites.getUserSites, {});
  const isLoading = sites === undefined;

  useEffect(() => {
    if (sites && sites.length === 1) {
      navigate({ to: "/dashboard/$siteId", params: { siteId: sites[0]._id } });
    }

    if (sites && sites.length === 0) {
      navigate({ to: "/onboarding" });
    }
  }, [sites, navigate]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-[#0D0F12]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="text-gray-400">Loading your sites...</p>
      </div>
    );
  }

  if (!sites || sites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4 bg-[#0D0F12]">
        <h1 className="text-2xl font-bold text-white">No Sites Found</h1>
        <p className="text-gray-400">Create your first site to get started</p>
        <Button onClick={() => navigate({ to: "/onboarding" })}>
          Create a Site
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 bg-[#0D0F12] min-h-full">
      <DashboardHeader title="Dashboard/Sites" />

      <DashboardCard>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Your Sites
            </h2>
            <p className="text-gray-400">
              Select a site to manage or create a new one.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sites.map((site) => (
              <DashboardCard
                key={site._id}
                className="cursor-pointer hover:bg-[#262932] transition-colors"
                onClick={() =>
                  navigate({
                    to: "/dashboard/$siteId",
                    params: { siteId: site._id },
                  })
                }
              >
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {site.name}
                    </h3>
                    <p className="text-gray-400 text-sm">{site.url}</p>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        site.crawlStatus === "completed"
                          ? "bg-green-500/10 text-green-500"
                          : site.crawlStatus === "crawling"
                            ? "bg-blue-500/10 text-blue-500"
                            : site.crawlStatus === "failed"
                              ? "bg-red-500/10 text-red-500"
                              : "bg-gray-500/10 text-gray-400"
                      }`}
                    >
                      {site.crawlStatus.charAt(0).toUpperCase() +
                        site.crawlStatus.slice(1)}
                    </span>
                  </div>
                </div>
              </DashboardCard>
            ))}
          </div>
        </div>
      </DashboardCard>
    </div>
  );
}
