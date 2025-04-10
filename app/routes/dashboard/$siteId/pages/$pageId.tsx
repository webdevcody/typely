import { createFileRoute } from "@tanstack/react-router";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/dashboard/$siteId/pages/$pageId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { pageId } = Route.useParams();

  const { data: page } = useQuery(
    convexQuery(api.pages.getPageById, {
      pageId: pageId as Id<"pages">,
    })
  );

  if (!page) {
    return (
      <div className="container mx-auto flex items-center justify-center p-8">
        <Loader2 className="animate-spin h-8 w-8 text-indigo-600 dark:text-indigo-400" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold truncate dark:text-white">
            <a
              href={page.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {page.url}
            </a>
          </h1>
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

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-sm">
            <span className="text-gray-500 dark:text-gray-400">Created:</span>{" "}
            <span className="dark:text-white">
              {format(new Date(page._creationTime), "PPpp")}
            </span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              Last Updated:
            </span>{" "}
            <span className="dark:text-white">
              {format(new Date(page.updatedAt || page._creationTime), "PPpp")}
            </span>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown>
            {page.markdown || "No content available"}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
