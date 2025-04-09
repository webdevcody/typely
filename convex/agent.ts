import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { openai } from ".";
import { Doc, Id } from "./_generated/dataModel";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface Page extends Doc<"pages"> {
  embeddings: number[];
}

// Function to calculate cosine similarity between two vectors
function cosineSimilarity(a: number[], b: number[]) {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
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

    // Get all pages for the site
    const pages = await ctx.runQuery(internal.pages._getPagesBySiteId, {
      siteId: chatSession.siteId,
    });

    // Find the most relevant pages using cosine similarity
    const pagesWithSimilarity = pages
      .filter((page: Page) => page.embeddings && page.embeddings.length > 0)
      .map((page: Page) => ({
        page,
        similarity: cosineSimilarity(questionEmbedding, page.embeddings),
      }))
      .sort(
        (a: { similarity: number }, b: { similarity: number }) =>
          b.similarity - a.similarity
      )
      .slice(0, 3); // Get top 3 most relevant pages

    // Prepare context from relevant pages
    const relevantContext = pagesWithSimilarity
      .map((item: { page: Page }) => item.page.markdown)
      .join("\n\n");

    // Prepare conversation history
    const conversationHistory = messages.map((msg: ChatMessage) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Generate response using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a helpful AI assistant for a website. Use the following context from the website's pages to help answer the user's questions. If you don't find relevant information in the context, you can provide a general response based on your knowledge.

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

async function createEmbeddings(text: string) {
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });
  return response.data[0].embedding;
}
