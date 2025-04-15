import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const create = mutation({
  args: {
    chapterId: v.id("chapters"),
    content: v.string(),
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

    // Only allow comments on published chapters
    if (!chapter.published) {
      throw new Error("Cannot comment on unpublished chapters");
    }

    const commentId = await ctx.db.insert("comments", {
      chapterId: args.chapterId,
      userId: identity.subject,
      content: args.content,
      createdAt: Date.now(),
    });

    return commentId;
  },
});

export const listComments = query({
  args: { chapterId: v.id("chapters") },
  handler: async (ctx, args) => {
    const chapter = await ctx.db.get(args.chapterId);
    if (!chapter) {
      throw new Error("Chapter not found");
    }

    // Only show comments for published chapters unless user is the author
    if (!chapter.published) {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        throw new Error("Not authenticated");
      }
      const book = await ctx.db.get(chapter.bookId);
      if (!book || book.authorId !== identity.subject) {
        throw new Error("Not authorized");
      }
    }

    const comments = await ctx.db
      .query("comments")
      .withIndex("by_chapter", (q) => q.eq("chapterId", args.chapterId))
      .collect();

    return comments.sort((a, b) => a.createdAt - b.createdAt);
  },
});
