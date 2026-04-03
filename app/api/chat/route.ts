/**
 * AI Chat Endpoint — Streaming with Tool Calling
 *
 * POST /api/chat
 * Body: { messages: Message[], conversationId?: string }
 *
 * Uses Vercel AI SDK for streaming + tool calling.
 * Persists conversations to DB for history.
 *
 * Based on TeachPaper's Chat Agent architecture.
 */

import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
// // import { chatTools } from "@/lib/ai/tools"; // Enable when adding tool calling // TODO: Add tools when needed
import { requireAuth } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { chatConversation, chatMessage } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

const SYSTEM_PROMPT = `You are a helpful AI assistant. Be concise and accurate.
When using tools, explain what you're doing briefly.
Format responses with markdown when helpful.`;

function getModel() {
  const provider = process.env.AI_PROVIDER || "openai";
  const modelName = process.env.AI_SMART_MODEL;

  switch (provider) {
    case "anthropic":
      return anthropic(modelName || "claude-sonnet-4-20250514");
    case "openai":
    default:
      return openai(modelName || "gpt-4o-mini");
  }
}

export async function POST(req: Request) {
  const session = await requireAuth();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages, conversationId } = (await req.json()) as {
    messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
    conversationId?: string;
  };

  // Get or create conversation
  let convId = conversationId;
  if (!convId) {
    convId = nanoid();
    await db.insert(chatConversation).values({
      id: convId,
      userId: session.user.id,
      title: null, // Auto-generated later
    });
  }

  // Save user message
  const lastUserMsg = messages[messages.length - 1];
  if (lastUserMsg?.role === "user") {
    await db.insert(chatMessage).values({
      id: nanoid(),
      conversationId: convId,
      role: "user",
      content:
        typeof lastUserMsg.content === "string"
          ? lastUserMsg.content
          : JSON.stringify(lastUserMsg.content),
    });
  }

  // Auto-title from first message
  if (!conversationId && lastUserMsg?.role === "user") {
    const titleText =
      typeof lastUserMsg.content === "string"
        ? lastUserMsg.content
        : "New chat";
    await db
      .update(chatConversation)
      .set({ title: titleText.slice(0, 100) })
      .where(eq(chatConversation.id, convId));
  }

  const result = streamText({
    model: getModel(),
    system: SYSTEM_PROMPT,
    messages,
    // tools: chatTools, // Uncomment when tools are configured
    onFinish: async ({ text }) => {
      // Save assistant response
      if (text) {
        await db.insert(chatMessage).values({
          id: nanoid(),
          conversationId: convId!,
          role: "assistant",
          content: text,
        });
      }
    },
  });

  return result.toTextStreamResponse({
    headers: {
      "X-Conversation-Id": convId,
    },
  });
}

/**
 * GET /api/chat — List conversations
 */
export async function GET() {
  const session = await requireAuth();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const conversations = await db
    .select()
    .from(chatConversation)
    .where(eq(chatConversation.userId, session.user.id))
    .orderBy(desc(chatConversation.updatedAt))
    .limit(50);

  return Response.json(conversations);
}
