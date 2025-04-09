import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { auth } from "./auth";
import { corsRouter } from "convex-helpers/server/cors";

const http = httpRouter();
const cors = corsRouter(http);
auth.addHttpRoutes(http);

cors.route({
  path: "/chatSessions",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();
    const { siteId } = body;

    if (!siteId) {
      return new Response("Missing siteId", {
        status: 400,
      });
    }

    try {
      const { sessionId } = await ctx.runMutation(
        internal.chatSessions.createChatSession,
        {
          siteId,
        }
      );

      return new Response(JSON.stringify({ sessionId }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Failed to create chat session" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }),
});

// // Send a message in a chat session
cors.route({
  path: "/chatMessages",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();
    const { chatSessionId, content } = body;

    if (!chatSessionId || !content) {
      return new Response("Missing required fields", {
        status: 400,
      });
    }

    try {
      // Create user message
      const messageId = await ctx.runMutation(
        internal.chatMessages.createChatMessage,
        {
          chatSessionId,
          role: "user",
          content,
        }
      );

      await ctx.scheduler.runAfter(0, internal.agent.respondToChatSession, {
        chatSessionId,
      });

      return new Response(JSON.stringify({ messageId }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Failed to create message" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }),
});

// Get all messages in a chat session
cors.route({
  path: "/getChatSessions",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const { chatSessionId, createdAfter } = await request.json();
    if (!chatSessionId) {
      return new Response("Missing sessionId", {
        status: 400,
      });
    }

    try {
      const messages = await ctx.runQuery(internal.chatMessages.listMessages, {
        chatSessionId,
        createdAfter: createdAfter ? Number(createdAfter) : undefined,
      });

      return new Response(JSON.stringify({ messages }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch messages" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }),
});

export default http;
