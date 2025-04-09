import { useCurrentUser } from "@/hooks/useCurrentUser";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  redirect,
  Outlet,
  useRouter,
} from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import {
  LayoutDashboard,
  FileText,
  Settings,
  MessageSquare,
  Bot,
  Files,
} from "lucide-react";

import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const sidebarNavItems = [
  {
    title: "Overview",
    href: "/dashboard/$siteId",
    icon: LayoutDashboard,
  },
  {
    title: "Pages",
    href: "/dashboard/$siteId/pages",
    icon: Files,
  },
  // {
  //   title: "Documents",
  //   href: "/dashboard/$siteId/documents",
  //   icon: FileText,
  // },
  {
    title: "Chats",
    href: "/dashboard/$siteId/chats",
    icon: MessageSquare,
  },
  // {
  //   title: "Agents",
  //   href: "/dashboard/$siteId/agents",
  //   icon: Bot,
  // },
  {
    title: "Settings",
    href: "/dashboard/$siteId/settings",
    icon: Settings,
  },
];

export const Route = createFileRoute("/dashboard/$siteId")({
  component: RouteComponent,
  beforeLoad: () => {
    // We'll handle the redirect in the component since we need to wait for the query results
  },
});

function RouteComponent() {
  const router = useRouter();
  const { data: sites, isLoading } = useQuery(
    convexQuery(api.sites.getUserSites, {})
  );
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { siteId } = Route.useParams();

  useEffect(() => {
    if (isLoading || userLoading) return;
    if (!sites || sites.length === 0) {
      router.navigate({ to: "/onboarding/$step", params: { step: "1" } });
    }
  }, [sites, isLoading, userLoading, router]);

  if (isLoading || userLoading || !sites || sites.length === 0) {
    return (
      <div className="h-[calc(100vh-65px)] w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-65px)]">
      {/* Sidebar */}
      <aside className="fixed left-0 w-64 h-full border-r bg-white dark:bg-gray-950 dark:border-gray-800">
        <nav className="flex flex-col gap-1 p-4">
          {sidebarNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                params={{ siteId: siteId }}
                activeProps={{
                  className:
                    "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100",
                }}
                activeOptions={{
                  exact: true,
                }}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto ml-64 p-8">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
