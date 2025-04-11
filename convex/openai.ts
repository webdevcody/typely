import { ActionCtx } from "./_generated/server";
import { createEmbeddings } from "./agent";

export async function generateEmbeddingWithRetry(
  ctx: ActionCtx,
  text: string,
  maxRetries = 3
): Promise<number[]> {
  let lastError: Error | undefined;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await createEmbeddings(text);
    } catch (error) {
      lastError = error as Error;
      // Wait for a bit before retrying (exponential backoff)
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    }
  }

  throw lastError || new Error("Failed to generate embedding after retries");
}
