import { v } from "convex/values";
import { internalMutation, internalQuery, query } from "./_generated/server";
import { isSiteAdmin } from "./authorization";

export const getMessages = query({
  args: {
    chatSessionId: v.id("chatSessions"),
  },
  handler: async (ctx, args) => {
    const chatSession = await ctx.db.get(args.chatSessionId);
    if (!chatSession) {
      return [];
    }

    const site = await isSiteAdmin(ctx, chatSession.siteId);
    if (!site) {
      return [];
    }

    return await ctx.db
      .query("chatMessages")
      .filter((q) => q.eq(q.field("chatSessionId"), args.chatSessionId))
      .collect();
  },
});
export const listSessions = query({
  args: {
    siteId: v.id("sites"),
  },
  handler: async (ctx, args) => {
    const site = await isSiteAdmin(ctx, args.siteId);
    if (!site) {
      return [];
    }
    const sessions = await ctx.db
      .query("chatSessions")
      .withIndex("by_siteId", (q) => q.eq("siteId", args.siteId))
      .order("desc")
      .take(20);

    return await Promise.all(
      sessions.map(async (session) => ({
        ...session,
        firstMessage: await ctx.db
          .query("chatMessages")
          .withIndex("by_chatSessionId", (q) =>
            q.eq("chatSessionId", session._id)
          )
          .first(),
        lastMessage: await ctx.db
          .query("chatMessages")
          .withIndex("by_chatSessionId", (q) =>
            q.eq("chatSessionId", session._id)
          )
          .order("desc")
          .first(),
      }))
    );
  },
});

export const createChatMessage = internalMutation({
  args: {
    chatSessionId: v.id("chatSessions"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const messageId = await ctx.db.insert("chatMessages", {
      chatSessionId: args.chatSessionId,
      role: args.role,
      content: args.content,
      createdAt: now,
      updatedAt: now,
    });
    return messageId;
  },
});

export const listSessionMessages = internalQuery({
  args: {
    chatSessionId: v.id("chatSessions"),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("chatMessages")
      .filter((q) => q.eq(q.field("chatSessionId"), args.chatSessionId))
      .order("desc")
      .collect();
    return messages;
  },
});

export const listMessages = internalQuery({
  args: {
    chatSessionId: v.id("chatSessions"),
    createdAfter: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let queryBuilder = ctx.db
      .query("chatMessages")
      .withIndex("by_chatSessionId", (q) =>
        q.eq("chatSessionId", args.chatSessionId)
      );

    if (args.createdAfter !== undefined) {
      queryBuilder = queryBuilder.filter((q) =>
        q.gt(q.field("createdAt"), args.createdAfter!)
      );
    }

    return await queryBuilder.order("asc").collect();
  },
});

export const addMessage = internalMutation({
  args: {
    chatSessionId: v.id("chatSessions"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("chatMessages", {
      chatSessionId: args.chatSessionId,
      role: args.role,
      content: args.content,
      createdAt: now,
      updatedAt: now,
    });
  },
});
