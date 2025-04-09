"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import Sitemapper from "sitemapper";

export const downloadSitemap = internalAction({
  args: {
    url: v.string(),
  },
  handler: async (ctx, args) => {
    const mapper = new Sitemapper({
      url: args.url,
      timeout: 5000,
    });

    const { sites } = await mapper.fetch();
    return sites;
  },
});
