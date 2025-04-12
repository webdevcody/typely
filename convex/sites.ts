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
import { isSiteAdmin } from "./authorization";

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
    const site = await isSiteAdmin(ctx, args.siteId);
    if (!site) {
      return null;
    }
    return site.site;
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

export const reindexSite = mutation({
  args: {
    siteId: v.id("sites"),
  },
  handler: async (ctx, args) => {
    const site = await isSiteAdmin(ctx, args.siteId);

    if (!site) {
      throw new Error("You are not authorized to reindex this site");
    }

    await workflow.start(ctx, internal.crawler.crawlSiteWorkflow, {
      siteId: args.siteId,
      userId: site.site.userId,
    });
  },
});

export const deleteSite = mutation({
  args: {
    siteId: v.id("sites"),
  },
  handler: async (ctx, args) => {
    // Check if user has permission to delete this site
    const site = await isSiteAdmin(ctx, args.siteId);
    if (!site) {
      throw new Error("You are not authorized to delete this site");
    }

    // 1. Delete all chat messages related to chat sessions of this site
    const chatSessions = await ctx.db
      .query("chatSessions")
      .withIndex("by_siteId", (q) => q.eq("siteId", args.siteId))
      .collect();

    await Promise.all(
      chatSessions.map(async (session) => {
        // Delete all messages for this session
        const messages = await ctx.db
          .query("chatMessages")
          .withIndex("by_chatSessionId", (q) =>
            q.eq("chatSessionId", session._id)
          )
          .collect();

        await Promise.all(
          messages.map((message) => ctx.db.delete(message._id))
        );

        // Delete the session itself
        await ctx.db.delete(session._id);
      })
    );

    // 2. Delete all context entries and their associated storage files
    const contexts = await ctx.db
      .query("contexts")
      .withIndex("by_siteId", (q) => q.eq("siteId", args.siteId))
      .collect();

    await Promise.all(
      contexts.map(async (context) => {
        if (context.storageId) {
          await ctx.storage.delete(context.storageId);
        }
        await ctx.db.delete(context._id);
      })
    );

    // 3. Delete all pages
    const pages = await ctx.db
      .query("pages")
      .withIndex("by_siteId", (q) => q.eq("siteId", args.siteId))
      .collect();

    await Promise.all(pages.map((page) => ctx.db.delete(page._id)));

    // 4. Finally, delete the site itself
    await ctx.db.delete(args.siteId);
  },
});
