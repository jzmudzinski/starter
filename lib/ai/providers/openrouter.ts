import { OpenAIProvider } from "./openai";

/**
 * OpenRouter provider — access 200+ models via a single API.
 * Uses OpenAI-compatible endpoint, so extends OpenAIProvider.
 *
 * Models: deepseek/deepseek-chat, anthropic/claude-3.5-haiku, google/gemini-flash, etc.
 * Docs: https://openrouter.ai/docs
 */
export class OpenRouterProvider extends OpenAIProvider {
  constructor(apiKey?: string) {
    const key = apiKey || process.env.OPENROUTER_API_KEY;
    if (!key) {
      throw new Error("OPENROUTER_API_KEY is not configured.");
    }
    super({
      apiKey: key,
      baseURL: "https://openrouter.ai/api/v1",
    });
  }
}
