import { v } from "convex/values";
import {
  mutation,
  internalAction,
  internalMutation,
  internalQuery,
  query,
} from "./_generated/server";
import { isSiteAdmin } from "./authorization";
import { Doc, Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";
import { QueryCtx } from "./_generated/server";
import { createEmbeddings } from "./agent";
import { MAX_RELEVANT_CONTEXT_RESULTS } from ".";

export const generateContextEmbedding = internalAction({
  args: {
    contextId: v.id("contexts"),
  },
  handler: async (ctx, args) => {
    // Get the context
    const context = await ctx.runQuery(internal.context._getContextById, {
      contextId: args.contextId,
    });

    if (!context) {
      throw new Error("Context not found");
    }

    // Generate embedding for the content
    const embedding = await createEmbeddings(
      ctx,
      context.siteId,
      `${context.title}\n\n${context.content}`
    );

    // Update the context with the embedding
    await ctx.runMutation(internal.context.updateContextEmbedding, {
      contextId: args.contextId,
      embeddings: embedding,
    });
  },
});

export const updateContextEmbedding = internalMutation({
  args: {
    contextId: v.id("contexts"),
    embeddings: v.array(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.contextId, {
      embeddings: args.embeddings,
      updatedAt: Date.now(),
    });
  },
});

export const getContextById = query({
  args: {
    contextId: v.id("contexts"),
  },
  handler: async (ctx, args) => {
    const context = await ctx.db.get(args.contextId);

    if (!context) {
      throw new Error("Context not found");
    }

    const site = await isSiteAdmin(ctx, context.siteId);
    if (!site) {
      throw new Error("You are not authorized to access this context");
    }

    return context;
  },
});

export const _getContextById = internalQuery({
  args: {
    contextId: v.id("contexts"),
  },
  handler: async (ctx: QueryCtx, args: { contextId: Id<"contexts"> }) => {
    return await ctx.db.get(args.contextId);
  },
});

export const getContextsBySiteIdAndType = query({
  args: {
    siteId: v.id("sites"),
    type: v.string(),
  },
  handler: async (
    ctx: QueryCtx,
    args: { siteId: Id<"sites">; type: string }
  ) => {
    const site = await isSiteAdmin(ctx, args.siteId);
    if (!site) {
      return [];
    }

    return await ctx.db
      .query("contexts")
      .withIndex("by_siteId", (q) => q.eq("siteId", args.siteId))
      .filter((q) => q.eq(q.field("type"), args.type))
      .order("desc")
      .collect();
  },
});

export const updateTextContext = mutation({
  args: {
    contextId: v.id("contexts"),
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const context = await ctx.db.get(args.contextId);
    if (!context) {
      throw new Error("Context not found");
    }

    const site = await isSiteAdmin(ctx, context.siteId);
    if (!site) {
      throw new Error("You are not authorized to edit this context");
    }

    await ctx.db.patch(args.contextId, {
      title: args.title,
      content: args.content,
      updatedAt: Date.now(),
    });

    // Schedule embedding generation
    await ctx.scheduler.runAfter(0, internal.context.generateContextEmbedding, {
      contextId: args.contextId,
    });

    return args.contextId;
  },
});

export const createTextContext = mutation({
  args: {
    siteId: v.id("sites"),
    title: v.string(),
    content: v.string(),
    type: v.union(v.literal("text"), v.literal("file"), v.literal("faq")),
  },
  handler: async (ctx, args) => {
    const site = await isSiteAdmin(ctx, args.siteId);
    if (!site) {
      throw new Error("You are not authorized to add context to this site");
    }

    const now = Date.now();
    const contextId = await ctx.db.insert("contexts", {
      siteId: args.siteId,
      type: args.type,
      title: args.title,
      content: args.content,
      embeddings: [],
      createdAt: now,
      updatedAt: now,
    });

    await ctx.scheduler.runAfter(0, internal.context.generateContextEmbedding, {
      contextId: contextId,
    });

    return contextId;
  },
});

export const getContextsBySiteId = query({
  args: {
    siteId: v.id("sites"),
  },
  handler: async (ctx, args) => {
    const site = await isSiteAdmin(ctx, args.siteId);
    if (!site) {
      return [];
    }

    return await ctx.db
      .query("contexts")
      .withIndex("by_siteId", (q) => q.eq("siteId", args.siteId))
      .collect();
  },
});

export const getRelevantContexts = internalAction({
  args: {
    siteId: v.id("sites"),
    query: v.array(v.float64()),
  },
  handler: async (ctx, args) => {
    const results = await ctx.vectorSearch("contexts", "embeddings", {
      vector: args.query,
      limit: MAX_RELEVANT_CONTEXT_RESULTS,
      filter: (q) => q.eq("siteId", args.siteId),
    });

    const contexts: Doc<"contexts">[] = await ctx.runQuery(
      internal.context._getContextsByIds,
      { ids: results.map((result) => result._id) }
    );

    return contexts;
  },
});

export const _getContextsByIds = internalQuery({
  args: {
    ids: v.array(v.id("contexts")),
  },
  handler: async (ctx, args) => {
    const contexts = await Promise.all(
      args.ids.map(async (id) => {
        return await ctx.db.get(id);
      })
    );
    return contexts.filter((context) => context !== null);
  },
});

export const deleteContext = mutation({
  args: {
    contextId: v.id("contexts"),
  },
  handler: async (ctx, args) => {
    const context = await ctx.db.get(args.contextId);
    if (!context) {
      throw new Error("Context not found");
    }

    const site = await isSiteAdmin(ctx, context.siteId);
    if (!site) {
      throw new Error("You are not authorized to delete this context");
    }

    const storageId = context.storageId;
    if (storageId) {
      await ctx.storage.delete(storageId);
    }

    await ctx.db.delete(args.contextId);
    return args.contextId;
  },
});

export const generateUploadUrl = mutation({
  args: {
    siteId: v.id("sites"),
  },
  handler: async (ctx, args) => {
    const site = await isSiteAdmin(ctx, args.siteId);
    if (!site) {
      throw new Error("You are not authorized to add context to this site");
    }
    return await ctx.storage.generateUploadUrl();
  },
});

export const saveFileContext = mutation({
  args: {
    siteId: v.id("sites"),
    title: v.string(),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const site = await isSiteAdmin(ctx, args.siteId);
    if (!site) {
      throw new Error("You are not authorized to add context to this site");
    }

    // Schedule the file content fetching and context creation
    await ctx.scheduler.runAfter(0, internal.context.processFileContent, {
      siteId: args.siteId,
      title: args.title,
      storageId: args.storageId,
    });
  },
});

export const processFileContent = internalAction({
  args: {
    siteId: v.id("sites"),
    title: v.string(),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args): Promise<Id<"contexts">> => {
    // Get the file content from storage
    const fileUrl = await ctx.storage.getUrl(args.storageId);
    if (!fileUrl) {
      throw new Error("File not found");
    }

    // Fetch and convert the file to text
    const response = await fetch(fileUrl);
    const content = await response.text();

    // Save the context
    const contextId = await ctx.runMutation(
      internal.context.createFileContext,
      {
        siteId: args.siteId,
        title: args.title,
        content,
        storageId: args.storageId,
      }
    );

    return contextId;
  },
});

export const createFileContext = internalMutation({
  args: {
    siteId: v.id("sites"),
    title: v.string(),
    content: v.string(),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args): Promise<Id<"contexts">> => {
    const now = Date.now();
    const contextId = await ctx.db.insert("contexts", {
      siteId: args.siteId,
      type: "file",
      title: args.title,
      content: args.content,
      embeddings: [],
      createdAt: now,
      updatedAt: now,
      storageId: args.storageId,
    });

    await ctx.scheduler.runAfter(0, internal.context.generateContextEmbedding, {
      contextId: contextId,
    });

    return contextId;
  },
});
