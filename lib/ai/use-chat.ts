"use client";

import { useState, useCallback } from "react";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface UseChatOptions {
  api?: string;
  onFinish?: () => void;
}

/**
 * Simple chat hook with streaming support.
 * Works with any Next.js streaming API route using Vercel AI SDK's streamText().
 *
 * Unlike useChat from @ai-sdk/react (v6+), this has a stable, simple API.
 */
export function useChatSimple({ api = "/api/chat", onFinish }: UseChatOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<"ready" | "streaming">("ready");
  const [conversationId, setConversationId] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || status === "streaming") return;

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content,
      };

      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      setStatus("streaming");

      try {
        const response = await fetch(api, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: newMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            conversationId,
          }),
        });

        // Capture conversation ID from response
        const convId = response.headers.get("X-Conversation-Id");
        if (convId) setConversationId(convId);

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        // Parse SSE/data stream from Vercel AI SDK
        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let assistantContent = "";
        const assistantId = crypto.randomUUID();

        // Add empty assistant message
        setMessages((prev) => [
          ...prev,
          { id: assistantId, role: "assistant", content: "" },
        ]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          // Parse Vercel AI SDK data stream format
          for (const line of chunk.split("\n")) {
            if (!line.trim()) continue;
            // Text chunks: "0:text" format
            if (line.startsWith("0:")) {
              try {
                const text = JSON.parse(line.slice(2));
                assistantContent += text;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? { ...m, content: assistantContent }
                      : m
                  )
                );
              } catch {}
            }
          }
        }

        onFinish?.();
      } catch (error) {
        console.error("Chat error:", error);
        // Add error message
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "Sorry, something went wrong. Please try again.",
          },
        ]);
      } finally {
        setStatus("ready");
      }
    },
    [api, messages, conversationId, status, onFinish]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setConversationId(null);
  }, []);

  return {
    messages,
    setMessages,
    sendMessage,
    clearMessages,
    status,
    isLoading: status === "streaming",
    conversationId,
    setConversationId,
  };
}
