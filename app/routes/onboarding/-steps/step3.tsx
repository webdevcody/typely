import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useEffect, useState, useCallback, useRef } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Id } from "../../../../convex/_generated/dataModel";

export function Step3() {
  const navigate = useNavigate();
  const [siteId, setSiteId] = useState<Id<"sites"> | null>(null);

  useEffect(() => {
    // Load siteId from session storage
    const savedSiteId = localStorage.getItem("siteId");
    if (savedSiteId) {
      setSiteId(savedSiteId as Id<"sites">);
    }
  }, []);

  const pages = useQuery(
    api.pages.getPagesBySiteId,
    siteId ? { siteId } : "skip"
  );
  const site = useQuery(api.sites.getSite, siteId ? { siteId } : "skip");

  const isSiteCrawlCompleted = site?.crawlStatus === "completed";

  useEffect(() => {
    if (isSiteCrawlCompleted && pages && pages.length > 0) {
      toast.success("Site crawling completed!");
    }
  }, [isSiteCrawlCompleted, pages]);

  return (
    <div>
      <h2 className="text-center text-2xl font-bold mb-6 dark:text-white">
        Crawling Your Site
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
        We're analyzing your website content. This may take a few minutes
        depending on the size of your site.
      </p>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-4">
        {pages?.map((page) => (
          <div
            key={page._id}
            className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg h-14 w-full"
          >
            {page.crawlStatus === "completed" ? (
              <CheckCircle2 className="text-green-500 dark:text-green-400 h-5 w-5 flex-shrink-0" />
            ) : (
              <Loader2 className="animate-spin h-5 w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
            )}
            <span className="text-sm truncate flex-1 min-w-0 overflow-hidden dark:text-gray-200">
              {page.url}
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
          </div>
        ))}
      </div>

      {(!pages || pages.length === 0) && (
        <div className="w-full flex items-center justify-center p-8">
          <Loader2 className="animate-spin h-8 w-8 text-indigo-600 dark:text-indigo-400" />
        </div>
      )}

      {isSiteCrawlCompleted && pages && pages.length > 0 && siteId && (
        <Button
          onClick={() =>
            navigate({ to: "/dashboard/$siteId", params: { siteId } })
          }
        >
          Continue to Dashboard
        </Button>
      )}
    </div>
  );
}
