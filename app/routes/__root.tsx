import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import * as React from "react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";

import appCss from "@/styles/app.css?url";
import { ConvexReactClient } from "convex/react";
import { Header } from "@/components/header";
import { ConvexQueryClient } from "@convex-dev/react-query";

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
        title: "TanStack Start Starter",
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
  return (
    <RootDocument>
      <Header />
      <Outlet />
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
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <ConvexAuthProvider client={convex}>{children}</ConvexAuthProvider>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}
