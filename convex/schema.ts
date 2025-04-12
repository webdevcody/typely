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

  usage: defineTable({
    siteId: v.id("sites"),
    date: v.string(),
    tokens: v.number(),
    cost: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_siteId", ["siteId"])
    .index("by_siteId_and_date", ["siteId", "date"]),

  contexts: defineTable({
    siteId: v.id("sites"),
    type: v.union(v.literal("text"), v.literal("file"), v.literal("faq")),
    title: v.string(),
    content: v.string(),
    storageId: v.optional(v.id("_storage")),
    embeddings: v.array(v.float64()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_siteId", ["siteId"])
    .vectorIndex("embeddings", {
      vectorField: "embeddings",
      dimensions: 1536,
      filterFields: ["siteId"],
    }),
  pages: defineTable({
    url: v.string(),
    siteId: v.id("sites"),
    crawlStatus: v.union(
      v.literal("pending"),
      v.literal("crawling"),
      v.literal("completed"),
      v.literal("failed")
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_siteId_url", ["siteId", "url"])
    .index("by_siteId", ["siteId"]),
  pagesContent: defineTable({
    pageId: v.id("pages"),
    siteId: v.id("sites"),
    html: v.string(),
    markdown: v.string(),
    embeddings: v.array(v.float64()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_pageId", ["pageId"])
    .vectorIndex("embeddings", {
      vectorField: "embeddings",
      dimensions: 1536,
      filterFields: ["siteId"],
    }),
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
  support: defineTable({
    userId: v.string(),
    siteId: v.string(),
    message: v.string(),
    status: v.optional(v.union(v.literal("open"), v.literal("closed"))),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_siteId", ["siteId"])
    .index("by_status", ["status"]),
});

export default schema;
