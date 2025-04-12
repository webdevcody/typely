import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useEffect, useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Id } from "../../../../convex/_generated/dataModel";
import { DashboardHeader } from "@/components/ui/dashboard-header";

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

  const getSubPath = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname || "/";
    } catch (e) {
      return url;
    }
  };

  return (
    <div className="p-8 space-y-6 min-h-screen">
      <div className="max-w-4xl mx-auto rounded-2xl bg-dashboard-panel-background border border-[#262932]/50 shadow-sm">
        <div className="border-b-2 border-[#262932]">
          <div className="p-8">
            <DashboardHeader title="Crawling Your Site (Step 3 of 3)" />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-full max-w-3xl mx-auto px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-500 to-white bg-clip-text text-transparent">
                Crawling Your Site
              </h2>
              <p className="text-gray-400 mb-8">
                We're analyzing your website content. This may take a few
                minutes depending on the size of your site.
              </p>

              {site && (
                <div className="text-left mb-4 p-4 bg-dashboard-card-background border border-[#262932] rounded-xl">
                  <span className="text-sm text-gray-400">Site URL: </span>
                  <span className="text-sm text-gray-200">{site.url}</span>
                </div>
              )}

              <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                {pages?.map((page) => (
                  <div
                    key={page._id}
                    className="flex items-center gap-3 p-4 bg-dashboard-card-background border border-[#262932] rounded-xl text-left"
                  >
                    {page.crawlStatus === "completed" ? (
                      <CheckCircle2 className="text-green-500 h-5 w-5 flex-shrink-0" />
                    ) : (
                      <Loader2 className="animate-spin h-5 w-5 text-cyan-500 flex-shrink-0" />
                    )}
                    <span className="text-sm truncate flex-1 min-w-0 overflow-hidden text-gray-200">
                      {getSubPath(page.url)}
                    </span>
                    <span
                      className={cn(
                        "text-xs px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0",
                        page.crawlStatus === "completed"
                          ? "bg-green-500/20 text-green-400"
                          : page.crawlStatus === "failed"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-cyan-500/20 text-cyan-400"
                      )}
                    >
                      {page.crawlStatus}
                    </span>
                  </div>
                ))}
              </div>

              {(!pages || pages.length === 0) && (
                <div className="w-full flex items-center justify-center p-8">
                  <Loader2 className="animate-spin h-8 w-8 text-cyan-500" />
                </div>
              )}

              <div className="flex justify-center mt-8">
                {isSiteCrawlCompleted &&
                  pages &&
                  pages.length > 0 &&
                  siteId && (
                    <Button
                      onClick={() =>
                        navigate({
                          to: "/dashboard/$siteId",
                          params: { siteId },
                        })
                      }
                      className="bg-gradient-to-r from-cyan-500/80 to-cyan-500 hover:from-cyan-500 hover:to-cyan-500/90 text-white shadow-lg"
                    >
                      Continue to Dashboard
                    </Button>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
