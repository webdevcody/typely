import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const create = mutation({
  args: {
    bookId: v.id("books"),
    title: v.string(),
    content: v.string(),
    orderIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const book = await ctx.db.get(args.bookId);
    if (!book) {
      throw new Error("Book not found");
    }

    if (book.authorId !== identity.subject) {
      throw new Error("Not authorized");
    }

    const chapterId = await ctx.db.insert("chapters", {
      bookId: args.bookId,
      title: args.title,
      content: args.content,
      orderIndex: args.orderIndex,
      published: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return chapterId;
  },
});

export const update = mutation({
  args: {
    chapterId: v.id("chapters"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    orderIndex: v.optional(v.number()),
    published: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const chapter = await ctx.db.get(args.chapterId);
    if (!chapter) {
      throw new Error("Chapter not found");
    }

    const book = await ctx.db.get(chapter.bookId);
    if (!book || book.authorId !== identity.subject) {
      throw new Error("Not authorized");
    }

    await ctx.db.patch(args.chapterId, {
      ...(args.title && { title: args.title }),
      ...(args.content && { content: args.content }),
      ...(args.orderIndex !== undefined && { orderIndex: args.orderIndex }),
      ...(args.published !== undefined && { published: args.published }),
      updatedAt: Date.now(),
    });
  },
});

export const getChapter = query({
  args: { chapterId: v.id("chapters") },
  handler: async (ctx, args) => {
    const chapter = await ctx.db.get(args.chapterId);
    if (!chapter) {
      throw new Error("Chapter not found");
    }

    // Check if the chapter is published or if the user is the author
    const identity = await ctx.auth.getUserIdentity();
    if (!chapter.published) {
      if (!identity) {
        throw new Error("Not authenticated");
      }
      const book = await ctx.db.get(chapter.bookId);
      if (!book || book.authorId !== identity.subject) {
        throw new Error("Not authorized");
      }
    }

    return chapter;
  },
});

export const listChapters = query({
  args: {
    bookId: v.id("books"),
    publishedOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let chapters = await ctx.db
      .query("chapters")
      .withIndex("by_book", (q) => q.eq("bookId", args.bookId))
      .collect();

    const identity = await ctx.auth.getUserIdentity();
    const book = await ctx.db.get(args.bookId);

    if (
      args.publishedOnly ||
      !identity ||
      !book ||
      book.authorId !== identity.subject
    ) {
      chapters = chapters.filter((chapter) => chapter.published);
    }

    return chapters.sort((a, b) => a.orderIndex - b.orderIndex);
  },
});
