/**
 * AI Chat Tools — Define tools the chat agent can use.
 *
 * Add your app-specific tools here. The agent will decide when to call them.
 *
 * Uses Vercel AI SDK tool format.
 */

import { z } from "zod";

// Define tools as plain objects for AI SDK v6 compatibility
export const chatTools = {
  get_current_time: {
    description: "Get the current date and time",
    parameters: z.object({}),
    execute: async () => ({
      datetime: new Date().toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }),
  },

  calculate: {
    description:
      "Perform a mathematical calculation. Supports basic operations.",
    parameters: z.object({
      expression: z
        .string()
        .describe("Math expression to evaluate, e.g. '2 + 2 * 3'"),
    }),
    execute: async ({ expression }: { expression: string }) => {
      try {
        const sanitized = expression.replace(/[^0-9+\-*/().%\s]/g, "");
        const result = new Function(`return ${sanitized}`)();
        return { expression, result: Number(result) };
      } catch {
        return { expression, error: "Invalid expression" };
      }
    },
  },
};
