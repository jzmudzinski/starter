/**
 * AI Model Configuration
 *
 * Define model tiers and map operations to appropriate models.
 * Cheap tier = fast, affordable (summaries, extraction, simple tasks)
 * Smart tier = powerful, expensive (complex reasoning, evaluation)
 *
 * Customize these for your app's specific needs.
 */

export type ModelTier = "cheap" | "smart";

// Define your app's AI operations here
export type Operation =
  | "chat"
  | "summarize"
  | "extract"
  | "generate"
  | "evaluate"
  | "classify";

/**
 * Map each operation to a model tier.
 * Cheap = fast & affordable, Smart = powerful & expensive.
 */
const OPERATION_TIERS: Record<Operation, ModelTier> = {
  chat: "cheap",
  summarize: "cheap",
  extract: "cheap",
  generate: "smart",
  evaluate: "smart",
  classify: "cheap",
};

/**
 * Default models per tier per provider.
 * Override via AI_CHEAP_MODEL / AI_SMART_MODEL env vars.
 */
const DEFAULT_MODELS: Record<string, Record<ModelTier, string>> = {
  openai: {
    cheap: "gpt-4o-mini",
    smart: "gpt-4o",
  },
  anthropic: {
    cheap: "claude-haiku-4-5-20251001",
    smart: "claude-sonnet-4-20250514",
  },
  openrouter: {
    cheap: "deepseek/deepseek-chat",
    smart: "anthropic/claude-sonnet-4",
  },
  comet: {
    cheap: "gpt-4o-mini",
    smart: "claude-sonnet-4-20250514",
  },
};

export function getModelTier(operation: Operation): ModelTier {
  return OPERATION_TIERS[operation];
}

export function getModelForOperation(
  operation: Operation,
  provider: string = process.env.AI_PROVIDER || "openai"
): string {
  const tier = getModelTier(operation);

  // Allow env var override
  if (tier === "cheap" && process.env.AI_CHEAP_MODEL) {
    return process.env.AI_CHEAP_MODEL;
  }
  if (tier === "smart" && process.env.AI_SMART_MODEL) {
    return process.env.AI_SMART_MODEL;
  }

  return DEFAULT_MODELS[provider]?.[tier] || DEFAULT_MODELS.openai[tier];
}
