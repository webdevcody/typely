import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    console.log(userId);
    if (userId === null) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});
