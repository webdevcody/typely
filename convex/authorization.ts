import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";
import { MutationCtx, QueryCtx } from "./_generated/server";

export async function isSiteAdmin(
  ctx: QueryCtx | MutationCtx,
  siteId: Id<"sites">
) {
  const userId = await getAuthUserId(ctx);

  if (!userId) {
    return undefined;
  }
  const site = await ctx.db.get(siteId);
  if (!site) {
    return undefined;
  }

  if (site.userId !== userId) {
    return undefined;
  }

  return { site };
}
