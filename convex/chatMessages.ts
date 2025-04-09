import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

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
    let query = ctx.db
      .query("chatMessages")
      .withIndex("by_chatSessionId", (q) =>
        q.eq("chatSessionId", args.chatSessionId)
      );

    if (args.createdAfter !== undefined) {
      query = query.filter((q) =>
        q.gt(q.field("createdAt"), args.createdAfter!)
      );
    }

    return await query.order("asc").collect();
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
