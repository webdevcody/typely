import { useCurrentUser } from "@/hooks/useCurrentUser";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  redirect,
  Outlet,
  useRouter,
  useRouterState,
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
  Search,
  BarChart4,
  Wallet,
  LineChart,
  User,
  ChevronsUpDown,
  PlusCircle,
  Check,
} from "lucide-react";

import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { DashboardHeader } from "@/components/ui/dashboard-header";
import { SiteSelector } from "./-components/SiteSelector";
import { Logo } from "@/components/logo";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/Panel";

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
    title: "Context",
    href: "/dashboard/$siteId/context",
    icon: FileText,
  },
  {
    title: "Sessions",
    href: "/dashboard/$siteId/chats",
    icon: MessageSquare,
  },
  {
    title: "Insights",
    href: "/dashboard/$siteId/insights",
    icon: BarChart4,
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
  const routerState = useRouterState();
  const { data: sites, isLoading } = useQuery(
    convexQuery(api.sites.getUserSites, {})
  );
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { siteId } = Route.useParams();

  // Get the current route path and map it to a title
  const currentPath = routerState.location.pathname;
  const getHeaderTitle = () => {
    const basePath = `/dashboard/${siteId}`;
    if (currentPath === basePath) return "Dashboard/Overview";
    const section = currentPath.replace(basePath, "").split("/")[1];
    if (!section) return "Dashboard/Overview";
    return `Dashboard/${section.charAt(0).toUpperCase() + section.slice(1)}`;
  };

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
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="fixed left-0 w-64 h-screen overflow-hidden">
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Logo and Site Selector */}
          <div className="p-4 space-y-4">
            <Logo />
            <SiteSelector siteId={siteId} />
          </div>

          {/* Search Bar */}
          {/* <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search anything..."
                className="w-full bg-[#141518] border-none pl-10 text-sm text-gray-300 placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-[#262932]"
              />
            </div>
          </div> */}

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              {sidebarNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      params={{ siteId: siteId }}
                      activeProps={{
                        className:
                          "bg-gradient-to-r from-primary-blue/30 via-[#1d2329] via-75% to-[#1d2329] text-white border border-[#262932] shadow-[inset_0_1px_1px_rgba(0,0,0,0.4),0_2px_4px_-1px_rgba(0,0,0,0.4),inset_0_-1px_1px_rgba(255,255,255,0.05)]",
                      }}
                      activeOptions={{
                        exact: item.href === "/dashboard/$siteId",
                      }}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-4 py-3 text-gray-400 transition-all hover:text-white hover:bg-[#1C1F26] hover:ring-1 hover:ring-[#262932]"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Account and Support Section */}
          <div className="p-4 border-t border-[#262932] space-y-2">
            <Link
              to="/dashboard/$siteId/account"
              params={{ siteId }}
              activeProps={{
                className:
                  "bg-gradient-to-r from-primary-blue/30 via-[#1d2329] via-75% to-[#1d2329] text-white border border-[#262932] shadow-[inset_0_1px_1px_rgba(0,0,0,0.4),0_2px_4px_-1px_rgba(0,0,0,0.4),inset_0_-1px_1px_rgba(255,255,255,0.05)]",
              }}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-400 transition-all hover:text-white hover:bg-[#1C1F26] w-full"
            >
              <div className="flex items-center gap-3 flex-1">
                {user?.image ? (
                  <img
                    src={user.image}
                    alt="Profile"
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary-blue/20 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary-blue" />
                  </div>
                )}
                <div className="flex flex-col text-sm">
                  <span className="font-medium">{user?.name || "Account"}</span>
                  <span className="text-xs text-gray-500">{user?.email}</span>
                </div>
              </div>
            </Link>

            <button className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-400 transition-all hover:text-white hover:bg-[#1C1F26] w-full">
              <MessageSquare className="h-5 w-5" />
              <span>Support</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        <div className="p-8 space-y-6 min-h-full">
          <Panel>
            <div className="border-b-2 border-[#262932]">
              <div className="p-8">
                <DashboardHeader title={getHeaderTitle()} />
              </div>
            </div>
            <div className="p-8">
              <Outlet />
            </div>
          </Panel>
        </div>
      </main>
    </div>
  );
}
