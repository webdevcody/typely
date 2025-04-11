import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Loader2, CheckCircle2, Globe, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { DashboardHeader } from "@/components/ui/dashboard-header";

export const Route = createFileRoute("/dashboard/$siteId/pages/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { siteId } = Route.useParams();
  const reindexSite = useMutation(api.sites.reindexSite);

  const { data: site } = useQuery(
    convexQuery(api.sites.getSite, { siteId: siteId as Id<"sites"> })
  );

  const { data: pages } = useQuery(
    convexQuery(api.pages.getPagesBySiteId, {
      siteId: siteId as Id<"sites">,
    })
  );

  const getPathFromUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname || "/";
    } catch (e) {
      return url;
    }
  };

  const getBaseUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return `${urlObj.protocol}//${urlObj.host}`;
    } catch (e) {
      return url;
    }
  };

  const handleReindex = async () => {
    try {
      await reindexSite({ siteId: siteId as Id<"sites"> });
      toast.success("Site reindexing started");
    } catch (error) {
      toast.error("Failed to start reindexing");
    }
  };

  if (!site) {
    return (
      <div className="w-full flex items-center justify-center p-8">
        <Loader2 className="animate-spin h-8 w-8 text-gray-400" />
      </div>
    );
  }

  const isSiteCrawling = site.crawlStatus === "crawling";

  return (
    <div className="p-8 space-y-6 bg-[#0D0F12] min-h-full">
      <DashboardHeader title="Dashboard/Pages" />

      <DashboardCard>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Pages</h1>
          <Button
            onClick={handleReindex}
            variant="outline"
            disabled={isSiteCrawling}
            className="border-[#262932] text-gray-300 hover:bg-[#262932] hover:text-white"
          >
            {isSiteCrawling ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {isSiteCrawling ? "Reindexing..." : "Reindex Site"}
          </Button>
        </div>

        <div className="flex items-center gap-2 mb-6 p-4 bg-[#1C1F26] rounded-xl">
          <Globe className="h-5 w-5 text-gray-400" />
          <a
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white hover:underline font-medium"
          >
            {getBaseUrl(site.url)}
          </a>
        </div>

        <p className="text-gray-400 mb-8">
          View all pages from your website and their current crawl status.
        </p>

        <div className="space-y-2">
          {pages?.map((page) => (
            <Link
              key={page._id}
              to="/dashboard/$siteId/pages/$pageId"
              params={{ siteId, pageId: page._id }}
              className="flex items-center gap-3 p-4 bg-[#1C1F26] rounded-xl w-full hover:bg-[#262932] transition-colors"
            >
              {page.crawlStatus === "completed" ? (
                <CheckCircle2 className="text-green-500 h-5 w-5 flex-shrink-0" />
              ) : (
                <Loader2 className="animate-spin h-5 w-5 text-blue-400 flex-shrink-0" />
              )}
              <span className="text-sm truncate flex-1 min-w-0 overflow-hidden text-gray-300">
                {getPathFromUrl(page.url)}
              </span>
              <span
                className={cn(
                  "text-xs px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0",
                  page.crawlStatus === "completed"
                    ? "bg-green-500/10 text-green-500"
                    : page.crawlStatus === "failed"
                      ? "bg-red-500/10 text-red-500"
                      : "bg-blue-500/10 text-blue-500"
                )}
              >
                {page.crawlStatus}
              </span>
            </Link>
          ))}

          {(!pages || pages.length === 0) && (
            <div className="w-full flex items-center justify-center p-8">
              <Loader2 className="animate-spin h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>
      </DashboardCard>
    </div>
  );
}
