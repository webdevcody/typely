import { v } from "convex/values";
import { internalMutation, internalQuery, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import { isSiteAdmin } from "./authorization";

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
