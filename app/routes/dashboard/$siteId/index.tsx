import { createFileRoute, useParams } from "@tanstack/react-router";
import {
  BarChart3,
  AlertCircle,
  Files,
  CheckCircle,
  Clock,
  XCircle,
  Bot,
  Copy,
  Check,
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
import { DashboardCard } from "@/components/ui/dashboard-card";
import { InnerCard } from "@/components/InnerCard";
import { Highlight, themes } from "prism-react-renderer";
import { useState } from "react";
import { WidgetInstallation } from "@/components/WidgetInstallation";

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <Button
        size="icon"
        variant="ghost"
        className="absolute right-2 top-2 h-8 w-8 hover:bg-[#262932]"
        onClick={copyToClipboard}
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4 text-gray-400" />
        )}
      </Button>
      <Highlight
        theme={{
          ...themes.nightOwl,
          plain: { ...themes.nightOwl.plain, backgroundColor: "#262932" },
        }}
        code={code.trim()}
        language="html"
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className="text-sm p-4 rounded overflow-x-auto"
            style={{ ...style, backgroundColor: "#262932" }}
          >
            {tokens.map((line, i) => (
              <div
                key={i}
                {...getLineProps({ line })}
                style={{ display: "table-row" }}
              >
                <span
                  style={{
                    display: "table-cell",
                    paddingRight: "1em",
                    userSelect: "none",
                    opacity: 0.5,
                    textAlign: "right",
                    color: "#506882",
                  }}
                >
                  {i + 1}
                </span>
                <span style={{ display: "table-cell" }}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </span>
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}

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
  const { data: chatSessions } = useQuery(
    convexQuery(api.chatMessages.listSessions, {
      siteId: siteId as Id<"sites">,
    })
  );
  const reindexSite = useMutation(api.sites.reindexSite);

  const isLoading = !site || !pages || !chatSessions;

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
    <DashboardCard>
      {/* Site Info Panel */}
      <div>
        <div className="space-y-2">
          {isLoading ? (
            <Skeleton type="title" />
          ) : (
            <h1 className="text-3xl font-bold text-white">{site.name}</h1>
          )}

          <div className="flex items-center gap-4">
            {isLoading ? (
              <Skeleton type="description" />
            ) : (
              <p className="text-gray-400">{site.url}</p>
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
                className="bg-[#1C1F26] text-gray-300 hover:bg-[#262932]"
              >
                {site.crawlStatus}
              </Badge>
            )}
          </div>
        </div>

        {/* Widget Setup Instructions */}
        {!isLoading && (!chatSessions || chatSessions.length === 0) && (
          <WidgetInstallation siteId={siteId} className="mt-8 mb-8" />
        )}

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-8">
          <InnerCard>
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-blue-500/10 p-3">
                <Files className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Total Pages</p>
                <p className="text-2xl font-bold text-white">
                  {totalPages || 0}
                </p>
              </div>
            </div>
          </InnerCard>

          <InnerCard>
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-green-500/10 p-3">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Indexed Pages
                </p>
                <p className="text-2xl font-bold text-white">
                  {successPages || 0}
                </p>
              </div>
            </div>
          </InnerCard>

          <InnerCard>
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-yellow-500/10 p-3">
                <Clock className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Pending Pages
                </p>
                <p className="text-2xl font-bold text-white">
                  {pendingPages || 0}
                </p>
              </div>
            </div>
          </InnerCard>

          <InnerCard>
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-red-500/10 p-3">
                <XCircle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Failed Pages
                </p>
                <p className="text-2xl font-bold text-white">
                  {failedPages || 0}
                </p>
              </div>
            </div>
          </InnerCard>
        </div>
      </div>

      {/* Failed Pages Panel */}
      {failedPages !== undefined && failedPages > 0 && (
        <div className="rounded-2xl bg-[#141518] p-8 mt-6">
          <h2 className="text-xl font-bold text-white mb-6">Failed Pages</h2>
          <div className="space-y-4">
            {pages
              ?.filter((page) => page.crawlStatus === "failed")
              .map((page) => (
                <div
                  key={page._id}
                  className="flex items-center justify-between p-4 rounded-lg bg-[#1C1F26] border border-[#262932]"
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <span className="text-gray-300">{page.url}</span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handleReindex(page.url)}
                    className="border-[#262932] text-gray-300 hover:bg-[#262932] hover:text-white"
                  >
                    Reindex
                  </Button>
                </div>
              ))}
          </div>
        </div>
      )}
    </DashboardCard>
  );
}
