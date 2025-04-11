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
        <Loader2 className="animate-spin h-8 w-8 text-indigo-600 dark:text-indigo-400" />
      </div>
    );
  }

  const isSiteCrawling = site.crawlStatus === "crawling";

  return (
    <div className="container mx-auto px-4 sm:px-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold dark:text-white">Pages</h1>
        <Button
          onClick={handleReindex}
          variant="outline"
          disabled={isSiteCrawling}
        >
          {isSiteCrawling ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          {isSiteCrawling ? "Reindexing..." : "Reindex Site"}
        </Button>
      </div>

      <div className="flex items-center gap-2 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <Globe className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        <a
          href={site.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-700 dark:text-gray-300 hover:underline font-medium"
        >
          {getBaseUrl(site.url)}
        </a>
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-8">
        View all pages from your website and their current crawl status.
      </p>

      <div className="mb-8 space-y-2">
        {pages?.map((page) => (
          <Link
            key={page._id}
            to="/dashboard/$siteId/pages/$pageId"
            params={{ siteId, pageId: page._id }}
            className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg w-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {page.crawlStatus === "completed" ? (
              <CheckCircle2 className="text-green-500 dark:text-green-400 h-5 w-5 flex-shrink-0" />
            ) : (
              <Loader2 className="animate-spin h-5 w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
            )}
            <span className="text-sm truncate flex-1 min-w-0 overflow-hidden dark:text-gray-200">
              {getPathFromUrl(page.url)}
            </span>
            <span
              className={cn(
                "text-xs px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0",
                page.crawlStatus === "completed"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : page.crawlStatus === "failed"
                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    : "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
              )}
            >
              {page.crawlStatus}
            </span>
          </Link>
        ))}
      </div>

      {(!pages || pages.length === 0) && (
        <div className="w-full flex items-center justify-center p-8">
          <Loader2 className="animate-spin h-8 w-8 text-indigo-600 dark:text-indigo-400" />
        </div>
      )}
    </div>
  );
}
