/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as SettingsImport } from './routes/settings'
import { Route as ChangelogImport } from './routes/changelog'
import { Route as IndexImport } from './routes/index'
import { Route as OnboardingIndexImport } from './routes/onboarding/index'
import { Route as DashboardIndexImport } from './routes/dashboard/index'
import { Route as OnboardingStepImport } from './routes/onboarding/$step'
import { Route as DashboardSiteIdRouteImport } from './routes/dashboard/$siteId/route'
import { Route as DashboardSiteIdIndexImport } from './routes/dashboard/$siteId/index'
import { Route as DashboardSiteIdSettingsImport } from './routes/dashboard/$siteId/settings'
import { Route as DashboardSiteIdInsightsImport } from './routes/dashboard/$siteId/insights'
import { Route as DashboardSiteIdDocumentsImport } from './routes/dashboard/$siteId/documents'
import { Route as DashboardSiteIdAgentsImport } from './routes/dashboard/$siteId/agents'
import { Route as DashboardSiteIdAccountRouteImport } from './routes/dashboard/$siteId/account/route'
import { Route as DashboardSiteIdUsageIndexImport } from './routes/dashboard/$siteId/usage/index'
import { Route as DashboardSiteIdSupportIndexImport } from './routes/dashboard/$siteId/support/index'
import { Route as DashboardSiteIdPagesIndexImport } from './routes/dashboard/$siteId/pages/index'
import { Route as DashboardSiteIdContextIndexImport } from './routes/dashboard/$siteId/context/index'
import { Route as DashboardSiteIdChatsIndexImport } from './routes/dashboard/$siteId/chats/index'
import { Route as DashboardSiteIdPagesPageIdImport } from './routes/dashboard/$siteId/pages/$pageId'
import { Route as DashboardSiteIdContextEditFaqImport } from './routes/dashboard/$siteId/context/edit-faq'
import { Route as DashboardSiteIdContextEditImport } from './routes/dashboard/$siteId/context/edit'
import { Route as DashboardSiteIdContextAddImport } from './routes/dashboard/$siteId/context/add'

// Create/Update Routes

const SettingsRoute = SettingsImport.update({
  id: '/settings',
  path: '/settings',
  getParentRoute: () => rootRoute,
} as any)

const ChangelogRoute = ChangelogImport.update({
  id: '/changelog',
  path: '/changelog',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const OnboardingIndexRoute = OnboardingIndexImport.update({
  id: '/onboarding/',
  path: '/onboarding/',
  getParentRoute: () => rootRoute,
} as any)

const DashboardIndexRoute = DashboardIndexImport.update({
  id: '/dashboard/',
  path: '/dashboard/',
  getParentRoute: () => rootRoute,
} as any)

const OnboardingStepRoute = OnboardingStepImport.update({
  id: '/onboarding/$step',
  path: '/onboarding/$step',
  getParentRoute: () => rootRoute,
} as any)

const DashboardSiteIdRouteRoute = DashboardSiteIdRouteImport.update({
  id: '/dashboard/$siteId',
  path: '/dashboard/$siteId',
  getParentRoute: () => rootRoute,
} as any)

const DashboardSiteIdIndexRoute = DashboardSiteIdIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => DashboardSiteIdRouteRoute,
} as any)

const DashboardSiteIdSettingsRoute = DashboardSiteIdSettingsImport.update({
  id: '/settings',
  path: '/settings',
  getParentRoute: () => DashboardSiteIdRouteRoute,
} as any)

const DashboardSiteIdInsightsRoute = DashboardSiteIdInsightsImport.update({
  id: '/insights',
  path: '/insights',
  getParentRoute: () => DashboardSiteIdRouteRoute,
} as any)

const DashboardSiteIdDocumentsRoute = DashboardSiteIdDocumentsImport.update({
  id: '/documents',
  path: '/documents',
  getParentRoute: () => DashboardSiteIdRouteRoute,
} as any)

const DashboardSiteIdAgentsRoute = DashboardSiteIdAgentsImport.update({
  id: '/agents',
  path: '/agents',
  getParentRoute: () => DashboardSiteIdRouteRoute,
} as any)

const DashboardSiteIdAccountRouteRoute =
  DashboardSiteIdAccountRouteImport.update({
    id: '/account',
    path: '/account',
    getParentRoute: () => DashboardSiteIdRouteRoute,
  } as any)

const DashboardSiteIdUsageIndexRoute = DashboardSiteIdUsageIndexImport.update({
  id: '/usage/',
  path: '/usage/',
  getParentRoute: () => DashboardSiteIdRouteRoute,
} as any)

const DashboardSiteIdSupportIndexRoute =
  DashboardSiteIdSupportIndexImport.update({
    id: '/support/',
    path: '/support/',
    getParentRoute: () => DashboardSiteIdRouteRoute,
  } as any)

const DashboardSiteIdPagesIndexRoute = DashboardSiteIdPagesIndexImport.update({
  id: '/pages/',
  path: '/pages/',
  getParentRoute: () => DashboardSiteIdRouteRoute,
} as any)

const DashboardSiteIdContextIndexRoute =
  DashboardSiteIdContextIndexImport.update({
    id: '/context/',
    path: '/context/',
    getParentRoute: () => DashboardSiteIdRouteRoute,
  } as any)

const DashboardSiteIdChatsIndexRoute = DashboardSiteIdChatsIndexImport.update({
  id: '/chats/',
  path: '/chats/',
  getParentRoute: () => DashboardSiteIdRouteRoute,
} as any)

const DashboardSiteIdPagesPageIdRoute = DashboardSiteIdPagesPageIdImport.update(
  {
    id: '/pages/$pageId',
    path: '/pages/$pageId',
    getParentRoute: () => DashboardSiteIdRouteRoute,
  } as any,
)

const DashboardSiteIdContextEditFaqRoute =
  DashboardSiteIdContextEditFaqImport.update({
    id: '/context/edit-faq',
    path: '/context/edit-faq',
    getParentRoute: () => DashboardSiteIdRouteRoute,
  } as any)

const DashboardSiteIdContextEditRoute = DashboardSiteIdContextEditImport.update(
  {
    id: '/context/edit',
    path: '/context/edit',
    getParentRoute: () => DashboardSiteIdRouteRoute,
  } as any,
)

const DashboardSiteIdContextAddRoute = DashboardSiteIdContextAddImport.update({
  id: '/context/add',
  path: '/context/add',
  getParentRoute: () => DashboardSiteIdRouteRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/changelog': {
      id: '/changelog'
      path: '/changelog'
      fullPath: '/changelog'
      preLoaderRoute: typeof ChangelogImport
      parentRoute: typeof rootRoute
    }
    '/settings': {
      id: '/settings'
      path: '/settings'
      fullPath: '/settings'
      preLoaderRoute: typeof SettingsImport
      parentRoute: typeof rootRoute
    }
    '/dashboard/$siteId': {
      id: '/dashboard/$siteId'
      path: '/dashboard/$siteId'
      fullPath: '/dashboard/$siteId'
      preLoaderRoute: typeof DashboardSiteIdRouteImport
      parentRoute: typeof rootRoute
    }
    '/onboarding/$step': {
      id: '/onboarding/$step'
      path: '/onboarding/$step'
      fullPath: '/onboarding/$step'
      preLoaderRoute: typeof OnboardingStepImport
      parentRoute: typeof rootRoute
    }
    '/dashboard/': {
      id: '/dashboard/'
      path: '/dashboard'
      fullPath: '/dashboard'
      preLoaderRoute: typeof DashboardIndexImport
      parentRoute: typeof rootRoute
    }
    '/onboarding/': {
      id: '/onboarding/'
      path: '/onboarding'
      fullPath: '/onboarding'
      preLoaderRoute: typeof OnboardingIndexImport
      parentRoute: typeof rootRoute
    }
    '/dashboard/$siteId/account': {
      id: '/dashboard/$siteId/account'
      path: '/account'
      fullPath: '/dashboard/$siteId/account'
      preLoaderRoute: typeof DashboardSiteIdAccountRouteImport
      parentRoute: typeof DashboardSiteIdRouteImport
    }
    '/dashboard/$siteId/agents': {
      id: '/dashboard/$siteId/agents'
      path: '/agents'
      fullPath: '/dashboard/$siteId/agents'
      preLoaderRoute: typeof DashboardSiteIdAgentsImport
      parentRoute: typeof DashboardSiteIdRouteImport
    }
    '/dashboard/$siteId/documents': {
      id: '/dashboard/$siteId/documents'
      path: '/documents'
      fullPath: '/dashboard/$siteId/documents'
      preLoaderRoute: typeof DashboardSiteIdDocumentsImport
      parentRoute: typeof DashboardSiteIdRouteImport
    }
    '/dashboard/$siteId/insights': {
      id: '/dashboard/$siteId/insights'
      path: '/insights'
      fullPath: '/dashboard/$siteId/insights'
      preLoaderRoute: typeof DashboardSiteIdInsightsImport
      parentRoute: typeof DashboardSiteIdRouteImport
    }
    '/dashboard/$siteId/settings': {
      id: '/dashboard/$siteId/settings'
      path: '/settings'
      fullPath: '/dashboard/$siteId/settings'
      preLoaderRoute: typeof DashboardSiteIdSettingsImport
      parentRoute: typeof DashboardSiteIdRouteImport
    }
    '/dashboard/$siteId/': {
      id: '/dashboard/$siteId/'
      path: '/'
      fullPath: '/dashboard/$siteId/'
      preLoaderRoute: typeof DashboardSiteIdIndexImport
      parentRoute: typeof DashboardSiteIdRouteImport
    }
    '/dashboard/$siteId/context/add': {
      id: '/dashboard/$siteId/context/add'
      path: '/context/add'
      fullPath: '/dashboard/$siteId/context/add'
      preLoaderRoute: typeof DashboardSiteIdContextAddImport
      parentRoute: typeof DashboardSiteIdRouteImport
    }
    '/dashboard/$siteId/context/edit': {
      id: '/dashboard/$siteId/context/edit'
      path: '/context/edit'
      fullPath: '/dashboard/$siteId/context/edit'
      preLoaderRoute: typeof DashboardSiteIdContextEditImport
      parentRoute: typeof DashboardSiteIdRouteImport
    }
    '/dashboard/$siteId/context/edit-faq': {
      id: '/dashboard/$siteId/context/edit-faq'
      path: '/context/edit-faq'
      fullPath: '/dashboard/$siteId/context/edit-faq'
      preLoaderRoute: typeof DashboardSiteIdContextEditFaqImport
      parentRoute: typeof DashboardSiteIdRouteImport
    }
    '/dashboard/$siteId/pages/$pageId': {
      id: '/dashboard/$siteId/pages/$pageId'
      path: '/pages/$pageId'
      fullPath: '/dashboard/$siteId/pages/$pageId'
      preLoaderRoute: typeof DashboardSiteIdPagesPageIdImport
      parentRoute: typeof DashboardSiteIdRouteImport
    }
    '/dashboard/$siteId/chats/': {
      id: '/dashboard/$siteId/chats/'
      path: '/chats'
      fullPath: '/dashboard/$siteId/chats'
      preLoaderRoute: typeof DashboardSiteIdChatsIndexImport
      parentRoute: typeof DashboardSiteIdRouteImport
    }
    '/dashboard/$siteId/context/': {
      id: '/dashboard/$siteId/context/'
      path: '/context'
      fullPath: '/dashboard/$siteId/context'
      preLoaderRoute: typeof DashboardSiteIdContextIndexImport
      parentRoute: typeof DashboardSiteIdRouteImport
    }
    '/dashboard/$siteId/pages/': {
      id: '/dashboard/$siteId/pages/'
      path: '/pages'
      fullPath: '/dashboard/$siteId/pages'
      preLoaderRoute: typeof DashboardSiteIdPagesIndexImport
      parentRoute: typeof DashboardSiteIdRouteImport
    }
    '/dashboard/$siteId/support/': {
      id: '/dashboard/$siteId/support/'
      path: '/support'
      fullPath: '/dashboard/$siteId/support'
      preLoaderRoute: typeof DashboardSiteIdSupportIndexImport
      parentRoute: typeof DashboardSiteIdRouteImport
    }
    '/dashboard/$siteId/usage/': {
      id: '/dashboard/$siteId/usage/'
      path: '/usage'
      fullPath: '/dashboard/$siteId/usage'
      preLoaderRoute: typeof DashboardSiteIdUsageIndexImport
      parentRoute: typeof DashboardSiteIdRouteImport
    }
  }
}

// Create and export the route tree

interface DashboardSiteIdRouteRouteChildren {
  DashboardSiteIdAccountRouteRoute: typeof DashboardSiteIdAccountRouteRoute
  DashboardSiteIdAgentsRoute: typeof DashboardSiteIdAgentsRoute
  DashboardSiteIdDocumentsRoute: typeof DashboardSiteIdDocumentsRoute
  DashboardSiteIdInsightsRoute: typeof DashboardSiteIdInsightsRoute
  DashboardSiteIdSettingsRoute: typeof DashboardSiteIdSettingsRoute
  DashboardSiteIdIndexRoute: typeof DashboardSiteIdIndexRoute
  DashboardSiteIdContextAddRoute: typeof DashboardSiteIdContextAddRoute
  DashboardSiteIdContextEditRoute: typeof DashboardSiteIdContextEditRoute
  DashboardSiteIdContextEditFaqRoute: typeof DashboardSiteIdContextEditFaqRoute
  DashboardSiteIdPagesPageIdRoute: typeof DashboardSiteIdPagesPageIdRoute
  DashboardSiteIdChatsIndexRoute: typeof DashboardSiteIdChatsIndexRoute
  DashboardSiteIdContextIndexRoute: typeof DashboardSiteIdContextIndexRoute
  DashboardSiteIdPagesIndexRoute: typeof DashboardSiteIdPagesIndexRoute
  DashboardSiteIdSupportIndexRoute: typeof DashboardSiteIdSupportIndexRoute
  DashboardSiteIdUsageIndexRoute: typeof DashboardSiteIdUsageIndexRoute
}

const DashboardSiteIdRouteRouteChildren: DashboardSiteIdRouteRouteChildren = {
  DashboardSiteIdAccountRouteRoute: DashboardSiteIdAccountRouteRoute,
  DashboardSiteIdAgentsRoute: DashboardSiteIdAgentsRoute,
  DashboardSiteIdDocumentsRoute: DashboardSiteIdDocumentsRoute,
  DashboardSiteIdInsightsRoute: DashboardSiteIdInsightsRoute,
  DashboardSiteIdSettingsRoute: DashboardSiteIdSettingsRoute,
  DashboardSiteIdIndexRoute: DashboardSiteIdIndexRoute,
  DashboardSiteIdContextAddRoute: DashboardSiteIdContextAddRoute,
  DashboardSiteIdContextEditRoute: DashboardSiteIdContextEditRoute,
  DashboardSiteIdContextEditFaqRoute: DashboardSiteIdContextEditFaqRoute,
  DashboardSiteIdPagesPageIdRoute: DashboardSiteIdPagesPageIdRoute,
  DashboardSiteIdChatsIndexRoute: DashboardSiteIdChatsIndexRoute,
  DashboardSiteIdContextIndexRoute: DashboardSiteIdContextIndexRoute,
  DashboardSiteIdPagesIndexRoute: DashboardSiteIdPagesIndexRoute,
  DashboardSiteIdSupportIndexRoute: DashboardSiteIdSupportIndexRoute,
  DashboardSiteIdUsageIndexRoute: DashboardSiteIdUsageIndexRoute,
}

const DashboardSiteIdRouteRouteWithChildren =
  DashboardSiteIdRouteRoute._addFileChildren(DashboardSiteIdRouteRouteChildren)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/changelog': typeof ChangelogRoute
  '/settings': typeof SettingsRoute
  '/dashboard/$siteId': typeof DashboardSiteIdRouteRouteWithChildren
  '/onboarding/$step': typeof OnboardingStepRoute
  '/dashboard': typeof DashboardIndexRoute
  '/onboarding': typeof OnboardingIndexRoute
  '/dashboard/$siteId/account': typeof DashboardSiteIdAccountRouteRoute
  '/dashboard/$siteId/agents': typeof DashboardSiteIdAgentsRoute
  '/dashboard/$siteId/documents': typeof DashboardSiteIdDocumentsRoute
  '/dashboard/$siteId/insights': typeof DashboardSiteIdInsightsRoute
  '/dashboard/$siteId/settings': typeof DashboardSiteIdSettingsRoute
  '/dashboard/$siteId/': typeof DashboardSiteIdIndexRoute
  '/dashboard/$siteId/context/add': typeof DashboardSiteIdContextAddRoute
  '/dashboard/$siteId/context/edit': typeof DashboardSiteIdContextEditRoute
  '/dashboard/$siteId/context/edit-faq': typeof DashboardSiteIdContextEditFaqRoute
  '/dashboard/$siteId/pages/$pageId': typeof DashboardSiteIdPagesPageIdRoute
  '/dashboard/$siteId/chats': typeof DashboardSiteIdChatsIndexRoute
  '/dashboard/$siteId/context': typeof DashboardSiteIdContextIndexRoute
  '/dashboard/$siteId/pages': typeof DashboardSiteIdPagesIndexRoute
  '/dashboard/$siteId/support': typeof DashboardSiteIdSupportIndexRoute
  '/dashboard/$siteId/usage': typeof DashboardSiteIdUsageIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/changelog': typeof ChangelogRoute
  '/settings': typeof SettingsRoute
  '/onboarding/$step': typeof OnboardingStepRoute
  '/dashboard': typeof DashboardIndexRoute
  '/onboarding': typeof OnboardingIndexRoute
  '/dashboard/$siteId/account': typeof DashboardSiteIdAccountRouteRoute
  '/dashboard/$siteId/agents': typeof DashboardSiteIdAgentsRoute
  '/dashboard/$siteId/documents': typeof DashboardSiteIdDocumentsRoute
  '/dashboard/$siteId/insights': typeof DashboardSiteIdInsightsRoute
  '/dashboard/$siteId/settings': typeof DashboardSiteIdSettingsRoute
  '/dashboard/$siteId': typeof DashboardSiteIdIndexRoute
  '/dashboard/$siteId/context/add': typeof DashboardSiteIdContextAddRoute
  '/dashboard/$siteId/context/edit': typeof DashboardSiteIdContextEditRoute
  '/dashboard/$siteId/context/edit-faq': typeof DashboardSiteIdContextEditFaqRoute
  '/dashboard/$siteId/pages/$pageId': typeof DashboardSiteIdPagesPageIdRoute
  '/dashboard/$siteId/chats': typeof DashboardSiteIdChatsIndexRoute
  '/dashboard/$siteId/context': typeof DashboardSiteIdContextIndexRoute
  '/dashboard/$siteId/pages': typeof DashboardSiteIdPagesIndexRoute
  '/dashboard/$siteId/support': typeof DashboardSiteIdSupportIndexRoute
  '/dashboard/$siteId/usage': typeof DashboardSiteIdUsageIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/changelog': typeof ChangelogRoute
  '/settings': typeof SettingsRoute
  '/dashboard/$siteId': typeof DashboardSiteIdRouteRouteWithChildren
  '/onboarding/$step': typeof OnboardingStepRoute
  '/dashboard/': typeof DashboardIndexRoute
  '/onboarding/': typeof OnboardingIndexRoute
  '/dashboard/$siteId/account': typeof DashboardSiteIdAccountRouteRoute
  '/dashboard/$siteId/agents': typeof DashboardSiteIdAgentsRoute
  '/dashboard/$siteId/documents': typeof DashboardSiteIdDocumentsRoute
  '/dashboard/$siteId/insights': typeof DashboardSiteIdInsightsRoute
  '/dashboard/$siteId/settings': typeof DashboardSiteIdSettingsRoute
  '/dashboard/$siteId/': typeof DashboardSiteIdIndexRoute
  '/dashboard/$siteId/context/add': typeof DashboardSiteIdContextAddRoute
  '/dashboard/$siteId/context/edit': typeof DashboardSiteIdContextEditRoute
  '/dashboard/$siteId/context/edit-faq': typeof DashboardSiteIdContextEditFaqRoute
  '/dashboard/$siteId/pages/$pageId': typeof DashboardSiteIdPagesPageIdRoute
  '/dashboard/$siteId/chats/': typeof DashboardSiteIdChatsIndexRoute
  '/dashboard/$siteId/context/': typeof DashboardSiteIdContextIndexRoute
  '/dashboard/$siteId/pages/': typeof DashboardSiteIdPagesIndexRoute
  '/dashboard/$siteId/support/': typeof DashboardSiteIdSupportIndexRoute
  '/dashboard/$siteId/usage/': typeof DashboardSiteIdUsageIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/changelog'
    | '/settings'
    | '/dashboard/$siteId'
    | '/onboarding/$step'
    | '/dashboard'
    | '/onboarding'
    | '/dashboard/$siteId/account'
    | '/dashboard/$siteId/agents'
    | '/dashboard/$siteId/documents'
    | '/dashboard/$siteId/insights'
    | '/dashboard/$siteId/settings'
    | '/dashboard/$siteId/'
    | '/dashboard/$siteId/context/add'
    | '/dashboard/$siteId/context/edit'
    | '/dashboard/$siteId/context/edit-faq'
    | '/dashboard/$siteId/pages/$pageId'
    | '/dashboard/$siteId/chats'
    | '/dashboard/$siteId/context'
    | '/dashboard/$siteId/pages'
    | '/dashboard/$siteId/support'
    | '/dashboard/$siteId/usage'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/changelog'
    | '/settings'
    | '/onboarding/$step'
    | '/dashboard'
    | '/onboarding'
    | '/dashboard/$siteId/account'
    | '/dashboard/$siteId/agents'
    | '/dashboard/$siteId/documents'
    | '/dashboard/$siteId/insights'
    | '/dashboard/$siteId/settings'
    | '/dashboard/$siteId'
    | '/dashboard/$siteId/context/add'
    | '/dashboard/$siteId/context/edit'
    | '/dashboard/$siteId/context/edit-faq'
    | '/dashboard/$siteId/pages/$pageId'
    | '/dashboard/$siteId/chats'
    | '/dashboard/$siteId/context'
    | '/dashboard/$siteId/pages'
    | '/dashboard/$siteId/support'
    | '/dashboard/$siteId/usage'
  id:
    | '__root__'
    | '/'
    | '/changelog'
    | '/settings'
    | '/dashboard/$siteId'
    | '/onboarding/$step'
    | '/dashboard/'
    | '/onboarding/'
    | '/dashboard/$siteId/account'
    | '/dashboard/$siteId/agents'
    | '/dashboard/$siteId/documents'
    | '/dashboard/$siteId/insights'
    | '/dashboard/$siteId/settings'
    | '/dashboard/$siteId/'
    | '/dashboard/$siteId/context/add'
    | '/dashboard/$siteId/context/edit'
    | '/dashboard/$siteId/context/edit-faq'
    | '/dashboard/$siteId/pages/$pageId'
    | '/dashboard/$siteId/chats/'
    | '/dashboard/$siteId/context/'
    | '/dashboard/$siteId/pages/'
    | '/dashboard/$siteId/support/'
    | '/dashboard/$siteId/usage/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  ChangelogRoute: typeof ChangelogRoute
  SettingsRoute: typeof SettingsRoute
  DashboardSiteIdRouteRoute: typeof DashboardSiteIdRouteRouteWithChildren
  OnboardingStepRoute: typeof OnboardingStepRoute
  DashboardIndexRoute: typeof DashboardIndexRoute
  OnboardingIndexRoute: typeof OnboardingIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  ChangelogRoute: ChangelogRoute,
  SettingsRoute: SettingsRoute,
  DashboardSiteIdRouteRoute: DashboardSiteIdRouteRouteWithChildren,
  OnboardingStepRoute: OnboardingStepRoute,
  DashboardIndexRoute: DashboardIndexRoute,
  OnboardingIndexRoute: OnboardingIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/changelog",
        "/settings",
        "/dashboard/$siteId",
        "/onboarding/$step",
        "/dashboard/",
        "/onboarding/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/changelog": {
      "filePath": "changelog.tsx"
    },
    "/settings": {
      "filePath": "settings.tsx"
    },
    "/dashboard/$siteId": {
      "filePath": "dashboard/$siteId/route.tsx",
      "children": [
        "/dashboard/$siteId/account",
        "/dashboard/$siteId/agents",
        "/dashboard/$siteId/documents",
        "/dashboard/$siteId/insights",
        "/dashboard/$siteId/settings",
        "/dashboard/$siteId/",
        "/dashboard/$siteId/context/add",
        "/dashboard/$siteId/context/edit",
        "/dashboard/$siteId/context/edit-faq",
        "/dashboard/$siteId/pages/$pageId",
        "/dashboard/$siteId/chats/",
        "/dashboard/$siteId/context/",
        "/dashboard/$siteId/pages/",
        "/dashboard/$siteId/support/",
        "/dashboard/$siteId/usage/"
      ]
    },
    "/onboarding/$step": {
      "filePath": "onboarding/$step.tsx"
    },
    "/dashboard/": {
      "filePath": "dashboard/index.tsx"
    },
    "/onboarding/": {
      "filePath": "onboarding/index.tsx"
    },
    "/dashboard/$siteId/account": {
      "filePath": "dashboard/$siteId/account/route.tsx",
      "parent": "/dashboard/$siteId"
    },
    "/dashboard/$siteId/agents": {
      "filePath": "dashboard/$siteId/agents.tsx",
      "parent": "/dashboard/$siteId"
    },
    "/dashboard/$siteId/documents": {
      "filePath": "dashboard/$siteId/documents.tsx",
      "parent": "/dashboard/$siteId"
    },
    "/dashboard/$siteId/insights": {
      "filePath": "dashboard/$siteId/insights.tsx",
      "parent": "/dashboard/$siteId"
    },
    "/dashboard/$siteId/settings": {
      "filePath": "dashboard/$siteId/settings.tsx",
      "parent": "/dashboard/$siteId"
    },
    "/dashboard/$siteId/": {
      "filePath": "dashboard/$siteId/index.tsx",
      "parent": "/dashboard/$siteId"
    },
    "/dashboard/$siteId/context/add": {
      "filePath": "dashboard/$siteId/context/add.tsx",
      "parent": "/dashboard/$siteId"
    },
    "/dashboard/$siteId/context/edit": {
      "filePath": "dashboard/$siteId/context/edit.tsx",
      "parent": "/dashboard/$siteId"
    },
    "/dashboard/$siteId/context/edit-faq": {
      "filePath": "dashboard/$siteId/context/edit-faq.tsx",
      "parent": "/dashboard/$siteId"
    },
    "/dashboard/$siteId/pages/$pageId": {
      "filePath": "dashboard/$siteId/pages/$pageId.tsx",
      "parent": "/dashboard/$siteId"
    },
    "/dashboard/$siteId/chats/": {
      "filePath": "dashboard/$siteId/chats/index.tsx",
      "parent": "/dashboard/$siteId"
    },
    "/dashboard/$siteId/context/": {
      "filePath": "dashboard/$siteId/context/index.tsx",
      "parent": "/dashboard/$siteId"
    },
    "/dashboard/$siteId/pages/": {
      "filePath": "dashboard/$siteId/pages/index.tsx",
      "parent": "/dashboard/$siteId"
    },
    "/dashboard/$siteId/support/": {
      "filePath": "dashboard/$siteId/support/index.tsx",
      "parent": "/dashboard/$siteId"
    },
    "/dashboard/$siteId/usage/": {
      "filePath": "dashboard/$siteId/usage/index.tsx",
      "parent": "/dashboard/$siteId"
    }
  }
}
ROUTE_MANIFEST_END */
