"use client";

import { useChatSimple } from "@/lib/ai/use-chat";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, Plus, Trash2, Bot, User, Loader2 } from "lucide-react";

interface Conversation {
  id: string;
  title: string | null;
  createdAt: string;
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    sendMessage,
    isLoading,
    clearMessages,
    setMessages,
    conversationId,
    setConversationId,
  } = useChatSimple({
    api: "/api/chat",
    onFinish: () => loadConversations(),
  });

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  async function loadConversations() {
    try {
      const res = await fetch("/api/chat");
      if (res.ok) setConversations(await res.json());
    } catch {}
  }

  async function loadConversation(convId: string) {
    try {
      const res = await fetch(`/api/chat/${convId}`);
      if (res.ok) {
        const data = await res.json();
        setConversationId(convId);
        setMessages(
          data.messages
            .filter((m: { role: string }) => m.role === "user" || m.role === "assistant")
            .map((m: { id: string; role: string; content: string }) => ({
              id: m.id,
              role: m.role as "user" | "assistant",
              content: m.content || "",
            }))
        );
      }
    } catch {}
  }

  async function deleteConversation(convId: string) {
    await fetch(`/api/chat/${convId}`, { method: "DELETE" });
    if (conversationId === convId) {
      clearMessages();
    }
    loadConversations();
  }

  function newChat() {
    clearMessages();
    setInputValue("");
  }

  function handleSend() {
    if (!inputValue.trim() || isLoading) return;
    const msg = inputValue;
    setInputValue("");
    sendMessage(msg);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4 p-4">
      {/* Sidebar */}
      <div className="hidden w-64 shrink-0 flex-col gap-2 md:flex">
        <Button onClick={newChat} className="w-full gap-2" variant="outline">
          <Plus className="h-4 w-4" /> New Chat
        </Button>
        <div className="flex-1 overflow-y-auto space-y-1">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`group flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted ${
                conversationId === conv.id ? "bg-muted font-medium" : ""
              }`}
              onClick={() => loadConversation(conv.id)}
            >
              <span className="flex-1 truncate">{conv.title || "Untitled"}</span>
              <button
                className="hidden shrink-0 text-muted-foreground hover:text-destructive group-hover:block"
                onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id); }}
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="flex flex-1 flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 pb-4">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <Bot className="mb-4 h-12 w-12 text-muted-foreground" />
              <h2 className="text-xl font-semibold">How can I help?</h2>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Ask me anything. I can help with calculations, answer questions,
                and use tools to assist you.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {["What can you do?", "Help me brainstorm", "What time is it?"].map(
                  (s) => (
                    <Badge
                      key={s}
                      variant="secondary"
                      className="cursor-pointer px-3 py-1.5 hover:bg-muted"
                      onClick={() => setInputValue(s)}
                    >
                      {s}
                    </Badge>
                  )
                )}
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                {msg.role === "assistant" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <Card className={`max-w-[80%] ${msg.role === "user" ? "bg-primary text-primary-foreground" : ""}`}>
                  <CardContent className="px-4 py-3">
                    <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
                  </CardContent>
                </Card>
                {msg.role === "user" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))
          )}
          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <Card>
                <CardContent className="px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </CardContent>
              </Card>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (⌘↵ to send)"
            className="min-h-[48px] max-h-[200px] resize-none"
            rows={1}
          />
          <Button onClick={handleSend} disabled={isLoading || !inputValue.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
