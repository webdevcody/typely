import { getAuthUserId } from "@convex-dev/auth/server";
import {
  query,
  mutation,
  action,
  internalQuery,
  internalMutation,
} from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { workflow } from ".";

export const getUserSites = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }
    return await ctx.db
      .query("sites")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const createSite = mutation({
  args: {
    name: v.string(),
    url: v.string(),
  },
  async handler(ctx, args) {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("You must be logged in to create a site");
    }

    const site = await ctx.db.insert("sites", {
      name: args.name,
      url: args.url,
      userId,
      crawlStatus: "pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return site;
  },
});

export const getSite = query({
  args: {
    siteId: v.id("sites"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const site = await ctx.db.get(args.siteId);
    if (!site) {
      return null;
    }

    return site;
  },
});

export const _getSite = internalQuery({
  args: {
    siteId: v.id("sites"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.siteId);
  },
});

export const updateSiteCrawlStatus = internalMutation({
  args: {
    siteId: v.id("sites"),
    crawlStatus: v.union(
      v.literal("pending"),
      v.literal("crawling"),
      v.literal("completed"),
      v.literal("failed")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.siteId, {
      crawlStatus: args.crawlStatus,
    });
  },
});

export const indexSite = action({
  args: {
    siteId: v.id("sites"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("You must be logged in to index a site");
    }
    const site = await ctx.runQuery(internal.sites._getSite, {
      siteId: args.siteId,
    });

    if (!site) {
      throw new Error("Site not found");
    }

    if (site.userId !== userId) {
      throw new Error("You are not authorized to index this site");
    }

    await workflow.start(ctx, internal.crawler.crawlSiteWorkflow, {
      siteId: args.siteId,
      userId: userId,
    });
  },
});
