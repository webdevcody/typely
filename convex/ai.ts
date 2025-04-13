import { CHAT_MODEL, EMBEDDING_MODEL, openai } from ".";

export async function createEmbeddings(text: string) {
  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
  });

  return response.data[0].embedding;
}

export async function createChatCompletion(messages: any[]) {
  const response = await openai.chat.completions.create({
    model: CHAT_MODEL,
    messages,
  });

  return response.choices[0].message.content;
}
