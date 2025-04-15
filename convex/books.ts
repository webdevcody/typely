import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    coverImage: v.optional(v.string()),
    price: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;
    const bookId = await ctx.db.insert("books", {
      title: args.title,
      description: args.description,
      coverImage: args.coverImage,
      authorId: userId,
      published: false,
      price: args.price,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return bookId;
  },
});

export const update = mutation({
  args: {
    bookId: v.id("books"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    price: v.optional(v.number()),
    published: v.optional(v.boolean()),
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

    await ctx.db.patch(args.bookId, {
      ...(args.title && { title: args.title }),
      ...(args.description && { description: args.description }),
      ...(args.coverImage && { coverImage: args.coverImage }),
      ...(args.price !== undefined && { price: args.price }),
      ...(args.published !== undefined && { published: args.published }),
      updatedAt: Date.now(),
    });
  },
});

export const getBook = query({
  args: { bookId: v.id("books") },
  handler: async (ctx, args) => {
    const book = await ctx.db.get(args.bookId);
    if (!book) {
      throw new Error("Book not found");
    }
    return book;
  },
});

export const listBooks = query({
  args: {
    authorId: v.optional(v.string()),
    publishedOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let books;
    if (args.authorId) {
      books = await ctx.db
        .query("books")
        .withIndex("by_author", (q) => q.eq("authorId", args.authorId!))
        .collect();
    } else {
      books = await ctx.db.query("books").collect();
    }

    if (args.publishedOnly) {
      books = books.filter((book) => book.published);
    }

    return books;
  },
});
