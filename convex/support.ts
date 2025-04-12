import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createSupportMessage = mutation({
  args: {
    userId: v.string(),
    siteId: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const supportMessage = await ctx.db.insert("support", {
      userId: args.userId,
      siteId: args.siteId,
      message: args.message,
      status: "open",
      createdAt: Date.now(),
    });
    return supportMessage;
  },
});
