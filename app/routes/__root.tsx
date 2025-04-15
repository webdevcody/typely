import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import * as React from "react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { Button } from "../components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

import appCss from "@/styles/app.css?url";
import { ConvexReactClient } from "convex/react";
import { Header } from "@/components/header";
import { Footer } from "@/components/Footer";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Typely - A better way to write",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  notFoundComponent: () => <div>Route not found</div>,
  component: RootComponent,
});

function RootComponent() {
  const navigate = useNavigate();
  const identity = useQuery(api.users.getCurrentUser);

  return (
    <RootDocument>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-8">
                <Button
                  variant="ghost"
                  className="text-xl font-bold"
                  onClick={() => navigate({ to: "/" })}
                >
                  BookPlatform
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate({ to: "/books" })}
                >
                  Browse Books
                </Button>
                {identity && (
                  <Button
                    variant="ghost"
                    onClick={() => navigate({ to: "/books" })}
                  >
                    Write a Book
                  </Button>
                )}
              </div>
              <div>
                {identity ? (
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                      {identity.name || "User"}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Handle sign out through your existing auth system
                        navigate({ to: "/" });
                      }}
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => navigate({ to: "/" })}>Sign In</Button>
                )}
              </div>
            </div>
          </div>
        </nav>

        <main className="min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>

        <Footer />
      </div>
    </RootDocument>
  );
}

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);
const convexQueryClient = new ConvexQueryClient(convex);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryKeyHashFn: convexQueryClient.hashFn(),
      queryFn: convexQueryClient.queryFn(),
    },
  },
});
convexQueryClient.connect(queryClient);

function RootDocument({ children }: { children: React.ReactNode }) {
  const prevPathnameRef = React.useRef("");
  const routerState = useRouterState();

  React.useEffect(() => {
    const currentPathname = routerState.location.pathname;
    const pathnameChanged = prevPathnameRef.current !== currentPathname;

    if (pathnameChanged && routerState.status === "pending") {
      NProgress.start();
      prevPathnameRef.current = currentPathname;
    }

    if (routerState.status === "idle") {
      NProgress.done();
    }
  }, [routerState.status, routerState.location.pathname]);

  return (
    <html className="light" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              let theme = document.cookie.match(/ui-theme=([^;]+)/)?.[1] || 'system';
              let root = document.documentElement;
              
              if (theme === 'system') {
                theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
              }
              
              root.classList.add(theme);
            `,
          }}
        />

        <style>{`
          #nprogress .bar {
            background: #06b6d4 !important;
            height: 3px;
          }
          #nprogress .peg {
            box-shadow: 0 0 10px #06b6d4, 0 0 5px #06b6d4;
          }
          #nprogress .spinner-icon {
            display: none;
          }
        `}</style>
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <ConvexAuthProvider client={convex}>
            <ThemeProvider defaultTheme="system" storageKey="site-sensei-theme">
              {children}
            </ThemeProvider>
          </ConvexAuthProvider>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}
