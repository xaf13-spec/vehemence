"use server";

import { createClient } from "@supabase/supabase-js";
import { getCurrentUser } from "../../lib/auth";

const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });

export async function getAIConversations() {
  const user = await getCurrentUser();
  if (!user) return { error: "Sign in to use Vehemence AI." };
  const { data, error } = await db.from("ai_conversations").select("id,title,created_at,updated_at").eq("owner_id", user.id).order("updated_at", { ascending: false });
  return error ? { error: "Could not load chat history." } : { conversations: data || [] };
}

export async function createAIConversation() {
  const user = await getCurrentUser();
  if (!user) return { error: "Sign in to use Vehemence AI." };
  const { data, error } = await db.from("ai_conversations").insert({ owner_id: user.id, title: "new chat" }).select("id,title,created_at,updated_at").single();
  return error ? { error: "Could not create a chat." } : { conversation: data };
}

export async function getAIMessages(conversationId) {
  const user = await getCurrentUser();
  if (!user) return { error: "Sign in to use Vehemence AI." };
  const { data: chat } = await db.from("ai_conversations").select("id").eq("id", conversationId).eq("owner_id", user.id).maybeSingle();
  if (!chat) return { error: "Chat not found." };
  const { data, error } = await db.from("ai_messages").select("id,role,content,created_at").eq("conversation_id", conversationId).eq("owner_id", user.id).order("created_at", { ascending: true });
  return error ? { error: "Could not load messages." } : { messages: data || [] };
}

export async function deleteAIConversation(id) {
  const user = await getCurrentUser();
  if (!user) return { error: "Sign in to use Vehemence AI." };
  const { error } = await db.from("ai_conversations").delete().eq("id", id).eq("owner_id", user.id);
  return error ? { error: "Could not delete this chat." } : { success: true };
}
