"use node";

import { v } from "convex/values";
import TurndownService from "turndown";
import { internalAction } from "./_generated/server";

export const convertToMarkdown = internalAction({
  args: {
    html: v.string(),
  },
  handler: async (ctx, args) => {
    const turndownService = new TurndownService();

    // Remove script tags and their contents
    turndownService.remove(["script"]);

    // Optionally, also remove onclick and other JavaScript attributes
    turndownService.addRule("stripJsAttributes", {
      filter: function (node) {
        return (
          node.attributes &&
          (node.hasAttribute("onclick") ||
            node.hasAttribute("onload") ||
            node.hasAttribute("onerror") ||
            node.hasAttribute("src"))
        );
      },
      replacement: function (content) {
        return content;
      },
    });

    return turndownService.turndown(args.html);
  },
});
