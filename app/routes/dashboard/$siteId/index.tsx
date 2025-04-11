import { createFileRoute, useParams } from "@tanstack/react-router";
import {
  BarChart3,
  AlertCircle,
  Files,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { useAction, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Id } from "../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { Skeleton } from "@/components/Skeleton";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/dashboard/$siteId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { siteId } = useParams({ from: "/dashboard/$siteId/" });
  const { data: site } = useQuery(
    convexQuery(api.sites.getSite, { siteId: siteId as Id<"sites"> })
  );
  const { data: pages } = useQuery(
    convexQuery(api.pages.getPagesBySiteId, {
      siteId: siteId as Id<"sites">,
    })
  );
  const reindexSite = useMutation(api.sites.reindexSite);

  const isLoading = !site || !pages;

  const totalPages = pages?.length;
  const successPages = pages?.filter(
    (page) => page.crawlStatus === "completed"
  ).length;
  const pendingPages = pages?.filter(
    (page) => page.crawlStatus === "pending" || page.crawlStatus === "crawling"
  ).length;
  const failedPages = pages?.filter(
    (page) => page.crawlStatus === "failed"
  ).length;

  const handleReindex = async (pageUrl: string) => {
    try {
      await reindexSite({ siteId: siteId as Id<"sites"> });
      toast.success("Reindexing started");
    } catch (error) {
      toast.error("Failed to start reindexing");
    }
  };

  return (
    <div className="space-y-4">
      {isLoading ? (
        <Skeleton type="title" />
      ) : (
        <h1 className="text-3xl font-bold">{site.name}</h1>
      )}

      <div className="flex items-center gap-4">
        {isLoading ? (
          <Skeleton type="description" />
        ) : (
          <p className="text-gray-500">{site.url}</p>
        )}

        {isLoading ? (
          <Skeleton type="badge" />
        ) : (
          <Badge
            variant={
              site.crawlStatus === "completed"
                ? "default"
                : site.crawlStatus === "failed"
                  ? "destructive"
                  : "secondary"
            }
          >
            {site.crawlStatus}
          </Badge>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <Files className="h-8 w-8 text-gray-400" />
            <div>
              <h3 className="font-semibold">Total Pages</h3>
              <p className="text-2xl font-bold">{totalPages}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <CheckCircle className="h-8 w-8 text-green-400" />
            <div>
              <h3 className="font-semibold">Indexed Pages</h3>
              <p className="text-2xl font-bold">{successPages}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <Clock className="h-8 w-8 text-yellow-400" />
            <div>
              <h3 className="font-semibold">Pending Pages</h3>
              <p className="text-2xl font-bold">{pendingPages}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <XCircle className="h-8 w-8 text-red-400" />
            <div>
              <h3 className="font-semibold">Failed Pages</h3>
              <p className="text-2xl font-bold">{failedPages}</p>
            </div>
          </div>
        </div>
      </div>

      {failedPages !== undefined && failedPages > 0 && (
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Failed Pages</h2>
          <div className="space-y-4">
            {pages
              ?.filter((page) => page.crawlStatus === "failed")
              .map((page) => (
                <div
                  key={page._id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <span>{page.url}</span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handleReindex(page.url)}
                  >
                    Reindex
                  </Button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
