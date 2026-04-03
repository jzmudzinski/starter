/**
 * Conversation CRUD
 * GET /api/chat/[conversationId] — Get messages
 * DELETE /api/chat/[conversationId] — Delete conversation
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { chatConversation, chatMessage } from "@/lib/db/schema";
import { eq, and, asc } from "drizzle-orm";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const session = await requireAuth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { conversationId } = await params;

  // Verify ownership
  const conv = await db
    .select()
    .from(chatConversation)
    .where(
      and(
        eq(chatConversation.id, conversationId),
        eq(chatConversation.userId, session.user.id)
      )
    )
    .limit(1);

  if (!conv.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const messages = await db
    .select()
    .from(chatMessage)
    .where(eq(chatMessage.conversationId, conversationId))
    .orderBy(asc(chatMessage.createdAt));

  return NextResponse.json({
    conversation: conv[0],
    messages,
  });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const session = await requireAuth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { conversationId } = await params;

  // Verify ownership and delete (cascade deletes messages)
  await db
    .delete(chatConversation)
    .where(
      and(
        eq(chatConversation.id, conversationId),
        eq(chatConversation.userId, session.user.id)
      )
    );

  return NextResponse.json({ success: true });
}
