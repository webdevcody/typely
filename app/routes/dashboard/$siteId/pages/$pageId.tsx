import { createFileRoute, Link } from "@tanstack/react-router";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Loader2, RefreshCw, Globe, Calendar, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InnerCard } from "@/components/InnerCard";
import { DashboardCard } from "@/components/ui/dashboard-card";

export const Route = createFileRoute("/dashboard/$siteId/pages/$pageId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { pageId, siteId } = Route.useParams();
  const reindexPage = useMutation(api.pages.reindexPage);

  const { data: page, isLoading } = useQuery(
    convexQuery(api.pages.getPageById, {
      pageId: pageId as Id<"pages">,
    })
  );

  const isPageCrawling = page?.crawlStatus === "crawling";

  const handleReindex = async () => {
    try {
      await reindexPage({ pageId: pageId as Id<"pages"> });
      toast.success("Reindexing started");
    } catch (error) {
      toast.error("Failed to start reindexing");
    }
  };

  if (isLoading || !page) {
    return (
      <div className="container mx-auto flex items-center justify-center p-8">
        <Loader2 className="animate-spin h-8 w-8 text-indigo-600 dark:text-indigo-400" />
      </div>
    );
  }

  return (
    <DashboardCard>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard/$siteId/pages"
            params={{ siteId }}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-2xl font-bold text-white">Page Details</h1>
        </div>
        <Button
          onClick={handleReindex}
          variant="outline"
          disabled={isPageCrawling}
          className="border-[#262932] text-gray-300 hover:bg-[#262932] hover:text-white"
        >
          {isPageCrawling ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          {isPageCrawling ? "Reindexing..." : "Reindex Page"}
        </Button>
      </div>

      <div className="space-y-6">
        <InnerCard>
          <a
            href={page.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white hover:underline font-medium flex items-center gap-2"
          >
            <Globe className="h-5 w-5 text-gray-400" />
            {page.url}
          </a>
        </InnerCard>

        <InnerCard className="gap-4">
          <div className="flex items-center justify-between text-muted-foreground text-sm">
            <div
              className={cn(
                "px-3 py-1 rounded-full",
                page.crawlStatus === "completed"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : page.crawlStatus === "failed"
                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    : "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
              )}
            >
              Index Status: {page.crawlStatus}
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                First Index {format(new Date(page._creationTime), "PPpp")}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                Last Updated{" "}
                {format(new Date(page.updatedAt || page._creationTime), "PPpp")}
              </span>
            </div>
          </div>
        </InnerCard>

        <h2 className="text-2xl font-bold">Parsed Content</h2>
        <InnerCard>
          <ScrollArea className="h-[500px]">
            <div className="prose dark:prose-invert max-w-none p-1">
              <ReactMarkdown
                components={{
                  code: ({ node, ...props }) => (
                    <code
                      className="break-all whitespace-pre-wrap"
                      {...props}
                    />
                  ),
                  pre: ({ node, ...props }) => (
                    <pre className="break-all whitespace-pre-wrap" {...props} />
                  ),
                }}
              >
                {page.markdown || "No content available"}
              </ReactMarkdown>
            </div>
          </ScrollArea>
        </InnerCard>
      </div>
    </DashboardCard>
  );
}
