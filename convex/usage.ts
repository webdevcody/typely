import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";
import { isSiteAdmin } from "./authorization";

export const getSiteUsage = query({
  args: { siteId: v.id("sites") },
  handler: async (ctx, args) => {
    const site = await isSiteAdmin(ctx, args.siteId);
    if (!site) {
      return [];
    }

    const usage = await ctx.db
      .query("usage")
      .withIndex("by_siteId", (q) => q.eq("siteId", args.siteId))
      .collect();

    return usage.sort((a, b) => a.date.localeCompare(b.date));
  },
});

export const trackUsage = internalMutation({
  args: {
    siteId: v.id("sites"),
    tokens: v.number(),
    cost: v.number(),
  },
  handler: async (ctx, args) => {
    const today = new Date().toISOString().split("T")[0];

    // Try to find existing usage for today
    const existingUsage = await ctx.db
      .query("usage")
      .withIndex("by_siteId_and_date", (q) =>
        q.eq("siteId", args.siteId).eq("date", today)
      )
      .first();

    if (existingUsage) {
      // Update existing usage
      await ctx.db.patch(existingUsage._id, {
        tokens: existingUsage.tokens + args.tokens,
        cost: existingUsage.cost + args.cost,
        updatedAt: Date.now(),
      });
    } else {
      // Create new usage entry
      await ctx.db.insert("usage", {
        siteId: args.siteId,
        date: today,
        tokens: args.tokens,
        cost: args.cost,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  },
});
