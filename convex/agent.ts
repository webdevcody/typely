import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { EMBEDDING_MODEL, openai } from ".";
import { Doc, Id } from "./_generated/dataModel";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface Page extends Doc<"pages"> {
  embeddings: number[];
}

export const respondToChatSession = internalAction({
  args: {
    chatSessionId: v.id("chatSessions"),
  },
  handler: async (ctx, args) => {
    const { chatSessionId } = args;

    // Get all messages in the chat session
    const messages = await ctx.runQuery(internal.chatMessages.listMessages, {
      chatSessionId,
    });

    // Get the chat session to find the associated site
    const chatSession = await ctx.runQuery(
      internal.chatSessions.getChatSession,
      {
        chatSessionId,
      }
    );

    if (!chatSession) {
      throw new Error("Chat session not found");
    }

    // Get the last user message
    const lastUserMessage = messages
      .filter((m: ChatMessage) => m.role === "user")
      .slice(-1)[0];

    if (!lastUserMessage) {
      throw new Error("No user message found");
    }

    // Get embeddings for the user's question
    const questionEmbedding = await createEmbeddings(lastUserMessage.content);

    const relevantPages = await ctx.runAction(internal.pages.getRelevantPages, {
      siteId: chatSession.siteId,
      query: questionEmbedding,
    });

    const relevantContexts = await ctx.runAction(
      internal.context.getRelevantContexts,
      {
        siteId: chatSession.siteId,
        query: questionEmbedding,
      }
    );

    // Prepare context from relevant pages
    const relevantContext = [
      ...relevantPages.map((page) => page.markdown),
      ...relevantContexts.map((context) => context.content),
    ].join("\n\n");

    console.log(relevantContext);

    // Prepare conversation history
    const conversationHistory = messages.map((msg: ChatMessage) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Generate response using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a helpful AI assistant for a website. Use the following context from the website's pages to help answer the user's questions. If you don't find relevant information in the context, you can provide a general response based on your knowledge.  Please keep your responses short and plain text.  Any links should be in new lines.

Context from relevant pages:
${relevantContext}`,
        },
        ...conversationHistory,
      ],
    });

    const assistantResponse = completion.choices[0].message.content;

    if (!assistantResponse) {
      throw new Error("No response from OpenAI");
    }

    // Save the assistant's response
    await ctx.runMutation(internal.chatMessages.addMessage, {
      chatSessionId,
      role: "assistant",
      content: assistantResponse,
    });
  },
});

export async function createEmbeddings(text: string) {
  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
  });
  return response.data[0].embedding;
}
