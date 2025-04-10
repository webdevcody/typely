import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { useQuery } from "convex/react";
import { useEffect } from "react";
import { Button } from "../../components/ui/button";

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
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="text-gray-600">Loading your sites...</p>
      </div>
    );
  }

  if (!sites || sites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <h1 className="text-2xl font-bold">No Sites Found</h1>
        <p className="text-gray-600">Create your first site to get started</p>
        <Button onClick={() => navigate({ to: "/onboarding" })}>
          Create a Site
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Your Sites</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sites.map((site) => (
          <div
            key={site._id}
            onClick={() =>
              navigate({
                to: "/dashboard/$siteId",
                params: { siteId: site._id },
              })
            }
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{site.name}</h2>
            <p className="text-gray-600 mb-4">{site.url}</p>
            <div className="flex items-center">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  site.crawlStatus === "completed"
                    ? "bg-green-100 text-green-800"
                    : site.crawlStatus === "crawling"
                      ? "bg-blue-100 text-blue-800"
                      : site.crawlStatus === "failed"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                }`}
              >
                {site.crawlStatus.charAt(0).toUpperCase() +
                  site.crawlStatus.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
