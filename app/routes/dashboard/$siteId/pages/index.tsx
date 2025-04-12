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
import { InnerCard, innerCardStyles } from "@/components/InnerCard";

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
    <DashboardCard>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Pages in Site</h1>
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

      <InnerCard className="mb-6">
        <a
          href={site.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-300 hover:text-white hover:underline font-medium flex items-center gap-2"
        >
          <Globe className="h-5 w-5 text-gray-400" />
          {getBaseUrl(site.url)}
        </a>
      </InnerCard>

      <p className="text-gray-400 mb-8">
        View all pages from your website and their current crawl status.
      </p>

      <div className="space-y-4">
        {pages?.map((page) => (
          <Link
            key={page._id}
            to="/dashboard/$siteId/pages/$pageId"
            params={{ siteId, pageId: page._id }}
            className={cn(innerCardStyles, "block")}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-white">
                {getPathFromUrl(page.url)}
              </h3>
              <span
                className={cn(
                  "text-sm px-3 py-1 rounded-full",
                  page.crawlStatus === "completed"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : page.crawlStatus === "failed"
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      : "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
                )}
              >
                {page.crawlStatus}
              </span>
            </div>
            <p className="text-sm text-gray-400">{page.url}</p>
          </Link>
        ))}
      </div>
    </DashboardCard>
  );
}
