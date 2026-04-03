/**
 * AI Chat Tools — Define tools the chat agent can use.
 *
 * Uses Vercel AI SDK tool format (v6).
 * Add your app-specific tools here.
 */

import { z } from "zod";

// Define tools as plain objects for streamText
export const chatTools: Record<string, {
  description: string;
  parameters: z.ZodTypeAny;
  execute: (args: Record<string, unknown>) => Promise<unknown>;
}> = {
  get_current_time: {
    description: "Get the current date and time",
    parameters: z.object({}),
    execute: async () => ({
      datetime: new Date().toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }),
  },

  calculate: {
    description: "Perform a mathematical calculation",
    parameters: z.object({
      expression: z.string().describe("Math expression, e.g. '2 + 2 * 3'"),
    }),
    execute: async (args) => {
      try {
        const expression = (args as { expression: string }).expression;
        const sanitized = expression.replace(/[^0-9+\-*/().%\s]/g, "");
        const result = new Function(`return ${sanitized}`)();
        return { expression, result: Number(result) };
      } catch {
        return { error: "Invalid expression" };
      }
    },
  },
};
