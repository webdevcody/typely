import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/$siteId/pages/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { siteId } = Route.useParams();

  const pages = useQuery(api.pages.getPagesBySiteId, {
    siteId: siteId as Id<"sites">,
  });

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Pages</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        View all pages from your website and their current crawl status.
      </p>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-4">
        {pages?.map((page) => (
          <Link
            key={page._id}
            to="/dashboard/$siteId/pages/$pageId"
            params={{ siteId, pageId: page._id }}
            className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg h-14 w-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {page.crawlStatus === "completed" ? (
              <CheckCircle2 className="text-green-500 dark:text-green-400 h-5 w-5 flex-shrink-0" />
            ) : (
              <Loader2 className="animate-spin h-5 w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
            )}
            <span className="text-sm truncate flex-1 min-w-0 overflow-hidden dark:text-gray-200">
              {page.url.replace(/(https?:\/\/)?(www\.)?/, "")}
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
