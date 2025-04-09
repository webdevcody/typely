import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  sites: defineTable({
    name: v.string(),
    url: v.string(),
    crawlStatus: v.union(
      v.literal("pending"),
      v.literal("crawling"),
      v.literal("completed"),
      v.literal("failed")
    ),
    userId: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),
  pages: defineTable({
    url: v.string(),
    siteId: v.id("sites"),
    html: v.string(),
    markdown: v.string(),
    crawlStatus: v.union(
      v.literal("pending"),
      v.literal("crawling"),
      v.literal("completed"),
      v.literal("failed")
    ),
    embeddings: v.array(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_siteId_url", ["siteId", "url"])
    .index("by_siteId", ["siteId"]),
  chatSessions: defineTable({
    siteId: v.id("sites"),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_siteId", ["siteId"]),
  chatMessages: defineTable({
    chatSessionId: v.id("chatSessions"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_chatSessionId", ["chatSessionId"]),
});

export default schema;
