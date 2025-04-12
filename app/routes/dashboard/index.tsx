import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { useQuery } from "convex/react";
import { useEffect } from "react";
import { Button } from "../../components/ui/button";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { DashboardHeader } from "@/components/ui/dashboard-header";
import { InnerCard } from "@/components/InnerCard";
import { Logo } from "@/components/logo";
import { Plus } from "lucide-react";
import { Panel } from "@/components/ui/Panel";

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
    <div className="p-8 space-y-12 min-h-full h-screen">
      <div className="flex items-center gap-8">
        <Logo />
      </div>

      <Panel>
        <div className="border-b-2 border-[#262932]">
          <div className="p-8">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Your Sites
            </h2>
            <p className="text-gray-400">
              Select a site to manage or create a new one.
            </p>
          </div>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sites.map((site) => (
              <InnerCard
                key={site._id}
                className="cursor-pointer bg-[#1C1F26] hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-blue-400/10 hover:scale-[1.02] transition-all"
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
              </InnerCard>
            ))}

            <InnerCard
              className="cursor-pointer border-2 border-dashed border-gray-500/30 hover:border-cyan-500/50 hover:bg-[#262932]/50 transition-all flex items-center justify-center"
              onClick={() => navigate({ to: "/onboarding" })}
            >
              <div className="text-center space-y-2">
                <div className="size-10 rounded-full bg-[#262932] flex items-center justify-center mx-auto">
                  <Plus className="w-5 h-5 text-cyan-500" />
                </div>
                <p className="text-gray-400 font-medium">Add a new site</p>
              </div>
            </InnerCard>
          </div>
        </div>
      </Panel>
    </div>
  );
}
