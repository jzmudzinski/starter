import type { AIProvider, ChatParams, ChatResponse } from "../provider";

/**
 * OpenAI provider.
 * Also works as base for any OpenAI-compatible API (CometAPI, Together, etc.)
 */
export class OpenAIProvider implements AIProvider {
  private apiKey: string;
  private baseURL: string;

  constructor(config?: { apiKey?: string; baseURL?: string }) {
    this.apiKey = config?.apiKey || process.env.OPENAI_API_KEY || "";
    this.baseURL = config?.baseURL || process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";

    if (!this.apiKey) {
      throw new Error("OPENAI_API_KEY is not configured. Set it in .env.local");
    }
  }

  async chat(params: ChatParams): Promise<ChatResponse> {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: params.model || "gpt-4o-mini",
        messages: params.messages,
        temperature: params.temperature,
        max_tokens: params.maxTokens,
        ...(params.responseFormat === "json"
          ? { response_format: { type: "json_object" } }
          : {}),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} ${error}`);
    }

    const data = (await response.json()) as {
      choices: { message: { content: string } }[];
      usage?: { prompt_tokens: number; completion_tokens: number };
      model: string;
    };

    return {
      content: data.choices[0]?.message?.content ?? "",
      usage: {
        inputTokens: data.usage?.prompt_tokens ?? 0,
        outputTokens: data.usage?.completion_tokens ?? 0,
      },
      model: data.model,
    };
  }
}
