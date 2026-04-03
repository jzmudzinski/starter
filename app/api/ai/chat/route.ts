import { NextRequest, NextResponse } from "next/server";
import { ai } from "@/lib/ai";
import { requireAuth } from "@/lib/auth/session";
import { checkRateLimit } from "@/lib/rate-limit";

/**
 * Example AI chat endpoint.
 * Demonstrates multi-provider AI integration with rate limiting.
 *
 * POST /api/ai/chat
 * Body: { message: string, operation?: string }
 */
export async function POST(request: NextRequest) {
  const session = await requireAuth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit
  const rl = await checkRateLimit(session.user.id, "api:default");
  if (!rl.success) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please wait." },
      { status: 429 }
    );
  }

  try {
    const { message, operation = "chat" } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const response = await ai.chat(
      {
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant. Be concise.",
          },
          { role: "user", content: message },
        ],
      },
      { userId: session.user.id, operation: operation as "chat" }
    );

    return NextResponse.json({
      content: response.content,
      model: response.model,
    });
  } catch (error) {
    console.error("AI chat error:", error);
    return NextResponse.json(
      { error: "AI service temporarily unavailable" },
      { status: 503 }
    );
  }
}
