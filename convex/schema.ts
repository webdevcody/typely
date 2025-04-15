import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,

  books: defineTable({
    title: v.string(),
    description: v.string(),
    coverImage: v.optional(v.string()),
    authorId: v.string(),
    published: v.boolean(),
    price: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_author", ["authorId"]),

  chapters: defineTable({
    bookId: v.id("books"),
    title: v.string(),
    content: v.string(),
    orderIndex: v.number(),
    published: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_book", ["bookId"]),

  comments: defineTable({
    chapterId: v.id("chapters"),
    userId: v.string(),
    content: v.string(),
    createdAt: v.number(),
  }).index("by_chapter", ["chapterId"]),

  purchases: defineTable({
    bookId: v.id("books"),
    userId: v.string(),
    amount: v.number(),
    status: v.string(), // "completed" | "pending" | "failed"
    createdAt: v.number(),
  }).index("by_user", ["userId"]),
});

export default schema;
