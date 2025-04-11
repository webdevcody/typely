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
    const updateObject: Partial<Doc<"pages">> = {};
    if (args.crawlStatus) {
      updateObject.crawlStatus = args.crawlStatus;
    }
    if (args.html) {
      updateObject.html = args.html;
    }
    if (args.markdown) {
      updateObject.markdown = args.markdown;
    }
    if (args.embeddings) {
      updateObject.embeddings = args.embeddings;
    }
    await ctx.db.patch(args.pageId, {
      ...updateObject,
      updatedAt: Date.now(),
    });
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
      html: "",
      markdown: "",
      embeddings: [],
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

    return page;
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
  handler: async (ctx, args) => {
    const results = await ctx.vectorSearch("pages", "embeddings", {
      vector: args.query,
      limit: MAX_RELEVANT_PAGE_RESULTS,
      filter: (q) => q.eq("siteId", args.siteId),
    });

    const pages: Doc<"pages">[] = await ctx.runQuery(
      internal.pages._getPagesByIds,
      { ids: results.map((result) => result._id) }
    );

    return pages;
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
