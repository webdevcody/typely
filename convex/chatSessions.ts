import { v } from "convex/values";
import { internalMutation, mutation, internalQuery } from "./_generated/server";

export const createChatSession = internalMutation({
  args: {
    siteId: v.id("sites"),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const sessionId = await ctx.db.insert("chatSessions", {
      siteId: args.siteId,
      createdAt: now,
      updatedAt: now,
    });

    return { sessionId };
  },
});

export const getChatSession = internalQuery({
  args: {
    chatSessionId: v.id("chatSessions"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.chatSessionId);
  },
});
