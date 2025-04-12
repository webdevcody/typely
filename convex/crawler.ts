import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { EMBEDDING_MODEL, openai, workflow } from ".";

export const crawlSiteWorkflow = workflow.define({
  args: { siteId: v.id("sites"), userId: v.id("users") },
  handler: async (step, args): Promise<string[]> => {
    const site = await step.runQuery(internal.sites._getSite, {
      siteId: args.siteId,
    });

    if (!site) {
      throw new Error("Site not found");
    }

    await step.runMutation(internal.sites.updateSiteCrawlStatus, {
      siteId: args.siteId,
      crawlStatus: "crawling",
    });

    const sites = await step.runAction(internal.siteMapper.downloadSitemap, {
      url: site.url,
    });

    try {
      await Promise.all(
        sites.map((siteUrl: string) =>
          step.runAction(internal.crawler.indexPage, {
            url: siteUrl,
            siteId: args.siteId,
          })
        )
      );

      await step.runMutation(internal.sites.updateSiteCrawlStatus, {
        siteId: args.siteId,
        crawlStatus: "completed",
      });
    } catch (error) {
      await step.runMutation(internal.sites.updateSiteCrawlStatus, {
        siteId: args.siteId,
        crawlStatus: "failed",
      });
      throw error;
    }

    return sites;
  },
});

export const indexPage = internalAction({
  args: {
    url: v.string(),
    siteId: v.id("sites"),
  },
  handler: async (ctx, args): Promise<void> => {
    const existingPage = await ctx.runQuery(internal.pages.getPageByUrl, {
      url: args.url,
      siteId: args.siteId,
    });

    let pageId = existingPage?._id;

    if (!pageId) {
      pageId = await ctx.runMutation(internal.pages.createPage, {
        url: args.url,
        siteId: args.siteId,
      });
    }

    await ctx.runMutation(internal.pages.updatePage, {
      pageId: pageId,
      crawlStatus: "crawling",
    });

    try {
      const pageResponse = await fetch(args.url);
      const html = await pageResponse.text();

      const markdown = await ctx.runAction(
        internal.converters.convertToMarkdown,
        {
          html: html,
        }
      );

      // Create embeddings and track usage
      const response = await openai.embeddings.create({
        model: EMBEDDING_MODEL,
        input: markdown,
      });

      // Track embedding usage
      await ctx.runMutation(internal.usage.trackUsage, {
        siteId: args.siteId,
        tokens: response.usage.total_tokens,
        cost: (response.usage.total_tokens / 1000) * 0.00002, // Ada embedding rate: $0.02 per 1M tokens
      });

      const embeddings = response.data[0].embedding;

      // Update page status
      await ctx.runMutation(internal.pages.updatePage, {
        pageId: pageId,
        crawlStatus: "completed",
      });

      // Store content in pagesContent table
      await ctx.runMutation(internal.pages.updatePageContent, {
        pageId: pageId,
        html: html,
        markdown: markdown,
        embeddings: embeddings,
      });
    } catch (err) {
      console.error(err);
      await ctx.runMutation(internal.pages.updatePage, {
        pageId: pageId,
        crawlStatus: "failed",
      });
    }
  },
});
