import { v } from "convex/values";
import {
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import { isSiteAdmin } from "./authorization";
import { internal } from "./_generated/api";
import { MAX_RELEVANT_PAGE_RESULTS } from ".";

export const getPagesBySiteId = query({
  args: {
    siteId: v.id("sites"),
  },
  handler: async (ctx, args) => {
    const site = await isSiteAdmin(ctx, args.siteId);

    if (!site) {
      return [];
    }

    return await ctx.db
      .query("pages")
      .withIndex("by_siteId", (q) => q.eq("siteId", args.siteId))
      .collect();
  },
});

export const _getPagesBySiteIds = internalQuery({
  args: {
    siteIds: v.array(v.id("sites")),
  },
  handler: async (ctx, args) => {
    const pages = await Promise.all(
      args.siteIds.map(async (siteId) => {
        return await ctx.db.get(siteId);
      })
    );
    return pages;
  },
});

// Internal version that doesn't require auth
export const _getPagesBySiteId = internalQuery({
  args: {
    siteId: v.id("sites"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pages")
      .withIndex("by_siteId", (q) => q.eq("siteId", args.siteId))
      .collect();
  },
});

export const getPageByUrl = internalQuery({
  args: {
    url: v.string(),
    siteId: v.id("sites"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pages")
      .withIndex("by_siteId_url", (q) =>
        q.eq("siteId", args.siteId).eq("url", args.url)
      )
      .first();
  },
});

export const updatePage = internalMutation({
  args: {
    pageId: v.id("pages"),
    crawlStatus: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("crawling"),
        v.literal("completed"),
        v.literal("failed")
      )
    ),
    html: v.optional(v.string()),
    markdown: v.optional(v.string()),
    embeddings: v.optional(v.array(v.number())),
  },
  handler: async (ctx, args) => {
    // Update page status
    if (args.crawlStatus) {
      await ctx.db.patch(args.pageId, {
        crawlStatus: args.crawlStatus,
        updatedAt: Date.now(),
      });
    }

    // If we have content to update, handle it in pagesContent table
    if (args.html || args.markdown || args.embeddings) {
      const page = await ctx.db.get(args.pageId);
      if (!page) throw new Error("Page not found");

      // Get existing content or create new
      const existingContent = await ctx.db
        .query("pagesContent")
        .withIndex("by_pageId", (q) => q.eq("pageId", args.pageId))
        .first();

      const contentUpdate = {
        ...(args.html && { html: args.html }),
        ...(args.markdown && { markdown: args.markdown }),
        ...(args.embeddings && { embeddings: args.embeddings }),
        updatedAt: Date.now(),
      };

      if (existingContent) {
        await ctx.db.patch(existingContent._id, contentUpdate);
      } else {
        await ctx.db.insert("pagesContent", {
          pageId: args.pageId,
          siteId: page.siteId,
          html: args.html || "",
          markdown: args.markdown || "",
          embeddings: args.embeddings || [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }
    }
  },
});

export const createPage = internalMutation({
  args: {
    url: v.string(),
    siteId: v.id("sites"),
  },
  handler: async (ctx, args) => {
    const pageId = await ctx.db.insert("pages", {
      url: args.url,
      siteId: args.siteId,
      crawlStatus: "pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return pageId;
  },
});

export const getPageById = query({
  args: {
    pageId: v.id("pages"),
  },
  handler: async (ctx, args) => {
    const page = await ctx.db.get(args.pageId);
    if (!page) {
      return null;
    }

    const site = await isSiteAdmin(ctx, page.siteId);
    if (!site) {
      return null;
    }

    // Get the page content
    const content = await ctx.db
      .query("pagesContent")
      .withIndex("by_pageId", (q) => q.eq("pageId", args.pageId))
      .first();

    // Merge page with content
    return {
      ...page,
      html: content?.html || "",
      markdown: content?.markdown || "",
      embeddings: content?.embeddings || [],
    };
  },
});

export const _getPage = internalQuery({
  args: {
    pageId: v.id("pages"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.pageId);
  },
});

export const reindexPage = mutation({
  args: {
    pageId: v.id("pages"),
  },
  handler: async (ctx, args) => {
    const page = await ctx.runQuery(internal.pages._getPage, {
      pageId: args.pageId,
    });

    if (!page) {
      throw new Error("Page not found");
    }

    const site = await isSiteAdmin(ctx, page.siteId);

    if (!site) {
      throw new Error("You are not authorized to reindex this page");
    }

    await ctx.scheduler.runAfter(0, internal.crawler.indexPage, {
      url: page.url,
      siteId: page.siteId,
    });
  },
});

export const getRelevantPages = internalAction({
  args: {
    siteId: v.id("sites"),
    query: v.array(v.float64()),
  },
  handler: async (
    ctx,
    args
  ): Promise<
    Array<
      Doc<"pages"> & { html: string; markdown: string; embeddings: number[] }
    >
  > => {
    const results = await ctx.vectorSearch("pagesContent", "embeddings", {
      vector: args.query,
      limit: MAX_RELEVANT_PAGE_RESULTS,
      filter: (q) => q.eq("siteId", args.siteId),
    });

    // Get the page content records
    const pageContents: Array<Doc<"pagesContent">> = await ctx.runQuery(
      internal.pages._getPageContentsByIds,
      {
        ids: results.map((result) => result._id),
      }
    );

    // Get the associated pages
    const pages: Array<Doc<"pages">> = await ctx.runQuery(
      internal.pages._getPagesByIds,
      {
        ids: pageContents.map((content) => content.pageId),
      }
    );

    // Merge pages with their content
    return pages.map((page) => {
      const content = pageContents.find((c) => c.pageId === page._id);
      return {
        ...page,
        html: content?.html || "",
        markdown: content?.markdown || "",
        embeddings: content?.embeddings || [],
      };
    });
  },
});

export const _getPageContentsByIds = internalQuery({
  args: {
    ids: v.array(v.id("pagesContent")),
  },
  handler: async (ctx, args) => {
    const contents = await Promise.all(
      args.ids.map(async (id) => {
        return await ctx.db.get(id);
      })
    );
    return contents.filter((content) => content !== null);
  },
});

export const _getPagesByIds = internalQuery({
  args: {
    ids: v.array(v.id("pages")),
  },
  handler: async (ctx, args) => {
    const pages = await Promise.all(
      args.ids.map(async (id) => {
        return await ctx.db.get(id);
      })
    );
    return pages.filter((page) => page !== null);
  },
});

export const updatePageContent = internalMutation({
  args: {
    pageId: v.id("pages"),
    html: v.string(),
    markdown: v.string(),
    embeddings: v.array(v.float64()),
  },
  handler: async (ctx, args) => {
    const page = await ctx.db.get(args.pageId);
    if (!page) throw new Error("Page not found");

    const existingContent = await ctx.db
      .query("pagesContent")
      .withIndex("by_pageId", (q) => q.eq("pageId", args.pageId))
      .first();

    if (existingContent) {
      await ctx.db.patch(existingContent._id, {
        html: args.html,
        markdown: args.markdown,
        embeddings: args.embeddings,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("pagesContent", {
        pageId: args.pageId,
        siteId: page.siteId,
        html: args.html,
        markdown: args.markdown,
        embeddings: args.embeddings,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  },
});
