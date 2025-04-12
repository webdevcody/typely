import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Loader2, RefreshCw, Globe, Calendar, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useAction, useMutation } from "convex/react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
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
      <div className="space-y-6 overflow-x-hidden">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard/$siteId/pages"
            params={{ siteId }}
            className="hover:text-accent-foreground"
          >
            <Button variant="outline" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to pages</span>
            </Button>
          </Link>
          <div className="flex flex-1 items-center justify-between">
            <h1 className="text-3xl font-bold">
              <a
                href={page.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 text-xl font-medium hover:underline break-all"
              >
                <Globe className="size-6 text-muted-foreground flex-shrink-0" />
                {page.url}
              </a>
            </h1>
            <Button
              onClick={handleReindex}
              variant="outline"
              size="sm"
              disabled={isPageCrawling}
            >
              {isPageCrawling ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              {isPageCrawling ? "Reindexing..." : "Reindex"}
            </Button>
          </div>
        </div>

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
