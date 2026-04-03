import type { AIProvider, ChatParams, ChatResponse } from "../provider";

/**
 * Anthropic provider (Claude).
 * Uses raw fetch — no SDK dependency needed.
 */
export class AnthropicProvider implements AIProvider {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.ANTHROPIC_API_KEY || "";
    if (!this.apiKey) {
      throw new Error("ANTHROPIC_API_KEY is not configured.");
    }
  }

  async chat(params: ChatParams): Promise<ChatResponse> {
    const systemMessage = params.messages.find((m) => m.role === "system");
    const nonSystemMessages = params.messages.filter((m) => m.role !== "system");

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: params.model || "claude-sonnet-4-20250514",
        max_tokens: params.maxTokens || 4096,
        temperature: params.temperature,
        ...(systemMessage ? { system: systemMessage.content } : {}),
        messages: nonSystemMessages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Anthropic API error: ${response.status} ${error}`);
    }

    const data = (await response.json()) as {
      content: { type: string; text: string }[];
      usage: { input_tokens: number; output_tokens: number };
      model: string;
    };

    return {
      content: data.content
        .filter((c) => c.type === "text")
        .map((c) => c.text)
        .join(""),
      usage: {
        inputTokens: data.usage?.input_tokens ?? 0,
        outputTokens: data.usage?.output_tokens ?? 0,
      },
      model: data.model,
    };
  }
}
