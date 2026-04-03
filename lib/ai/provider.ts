/**
 * AI Provider Interface
 *
 * Unified interface for multi-provider AI support.
 * Supports OpenAI, Anthropic, OpenRouter, and any OpenAI-compatible API.
 *
 * Based on TeachPaper's battle-tested architecture.
 */

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatParams {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  responseFormat?: "json" | "text";
  maxTokens?: number;
}

export interface ChatResponse {
  content: string;
  usage: { inputTokens: number; outputTokens: number };
  model: string;
}

export interface AIProvider {
  chat(params: ChatParams): Promise<ChatResponse>;
}
