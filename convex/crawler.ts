import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { EMBEDDING_MODEL, openai, workflow } from ".";
import { convertToMarkdown } from "./converters";
import { createEmbeddings } from "./agent";

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
    } catch (error) {
      await step.runMutation(internal.sites.updateSiteCrawlStatus, {
        siteId: args.siteId,
        crawlStatus: "failed",
      });
      throw error;
    }

    await step.runMutation(internal.sites.updateSiteCrawlStatus, {
      siteId: args.siteId,
      crawlStatus: "completed",
    });

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

      const embeddings = await createEmbeddings(markdown);

      // save embedding
      await ctx.runMutation(internal.pages.updatePage, {
        pageId: pageId,
        embeddings: embeddings,
        crawlStatus: "completed",
        html: html,
        markdown: markdown,
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
