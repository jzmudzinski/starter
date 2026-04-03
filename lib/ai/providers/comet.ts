import { OpenAIProvider } from "./openai";

/**
 * CometAPI provider — AI model aggregator.
 * OpenAI-compatible endpoint with 640+ models including Grok, Claude, GPT, etc.
 *
 * Features:
 * - Video generation (Grok Imagine, Kling, Sora, Runway)
 * - Image generation
 * - Chat completions (all major models)
 *
 * Docs: https://docs.cometapi.com
 */
export class CometProvider extends OpenAIProvider {
  constructor(apiKey?: string) {
    const key = apiKey || process.env.COMET_API_KEY;
    if (!key) {
      throw new Error("COMET_API_KEY is not configured.");
    }
    super({
      apiKey: key,
      baseURL: "https://api.cometapi.com/v1",
    });
  }
}
