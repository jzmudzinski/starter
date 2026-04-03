/**
 * AI Service — Multi-provider AI with usage metering
 *
 * Usage:
 *   import { ai } from '@/lib/ai';
 *
 *   // Simple chat
 *   const response = await ai.chat({
 *     messages: [{ role: 'user', content: 'Hello' }],
 *   });
 *
 *   // With operation-based model selection
 *   const summary = await ai.chat({
 *     messages: [{ role: 'user', content: 'Summarize this...' }],
 *   }, { userId: user.id, operation: 'summarize' });
 *
 *   // With explicit model
 *   const result = await ai.chat({
 *     messages: [...],
 *     model: 'claude-sonnet-4-20250514',
 *   });
 *
 * Configuration via env vars:
 *   AI_PROVIDER=openai|anthropic|openrouter|comet  (default: openai)
 *   AI_CHEAP_MODEL=gpt-4o-mini                     (override cheap tier)
 *   AI_SMART_MODEL=gpt-4o                          (override smart tier)
 *   OPENAI_API_KEY=sk-...
 *   ANTHROPIC_API_KEY=sk-ant-...
 *   OPENROUTER_API_KEY=sk-or-...
 *   COMET_API_KEY=sk-...
 *
 * Based on TeachPaper's multi-provider architecture.
 */

import type { AIProvider, ChatParams, ChatResponse } from "./provider";
import { OpenAIProvider } from "./providers/openai";
import { AnthropicProvider } from "./providers/anthropic";
import { OpenRouterProvider } from "./providers/openrouter";
import { CometProvider } from "./providers/comet";
import { getModelForOperation, type Operation } from "./models";

export type { AIProvider, ChatParams, ChatResponse, ChatMessage } from "./provider";
export { getModelForOperation, getModelTier, type Operation, type ModelTier } from "./models";

interface MeteringContext {
  userId: string;
  operation?: Operation;
}

function createProvider(name?: string): AIProvider {
  const providerName = name || process.env.AI_PROVIDER || "openai";

  switch (providerName) {
    case "anthropic":
      return new AnthropicProvider();
    case "openrouter":
      return new OpenRouterProvider();
    case "comet":
      return new CometProvider();
    case "openai":
    default:
      return new OpenAIProvider();
  }
}

class AIService {
  private provider: AIProvider | null = null;

  private getProvider(): AIProvider {
    if (!this.provider) {
      this.provider = createProvider();
    }
    return this.provider;
  }

  /**
   * Reset provider (useful if env vars change at runtime)
   */
  resetProvider(): void {
    this.provider = null;
  }

  /**
   * Send a chat completion request.
   *
   * If metering context includes an operation, the model will be
   * auto-selected based on tier (cheap/smart) unless explicitly set.
   */
  async chat(
    params: ChatParams,
    metering?: MeteringContext
  ): Promise<ChatResponse> {
    // Auto-select model from operation tier if not explicitly set
    if (!params.model && metering?.operation) {
      params = {
        ...params,
        model: getModelForOperation(metering.operation),
      };
    }

    const response = await this.getProvider().chat(params);

    // TODO: Add your usage logging here
    // Example: await logUsage({ userId: metering?.userId, model: response.model, ...response.usage })

    return response;
  }
}

/** Singleton AI service instance */
export const ai = new AIService();
