import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getCurrentUser } from "../../../../lib/auth";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in to use Vehemence AI." }, { status: 401 });
  if (!process.env.GEMINI_API_KEY) return NextResponse.json({ error: "Gemini API key is missing from Vercel." }, { status: 503 });

  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const conversationId = String(body?.conversationId || "");
  const prompt = String(body?.message || "").trim();
  if (!/^[0-9a-f-]{36}$/i.test(conversationId) || !prompt || prompt.length > 12000) {
    return NextResponse.json({ error: "Enter a message under 12,000 characters." }, { status: 400 });
  }

  const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  const { data: conversation, error: conversationError } = await db.from("ai_conversations")
    .select("id,title").eq("id", conversationId).eq("owner_id", user.id).maybeSingle();
  if (conversationError || !conversation) return NextResponse.json({ error: "Chat not found. Start a new chat and try again." }, { status: 404 });

  const { data: history, error: historyError } = await db.from("ai_messages")
    .select("role,content").eq("conversation_id", conversationId).eq("owner_id", user.id)
    .order("created_at", { ascending: false }).limit(20);
  if (historyError) return NextResponse.json({ error: "Could not load chat history." }, { status: 500 });

  const { error: saveError } = await db.from("ai_messages").insert({
    conversation_id: conversationId, owner_id: user.id, role: "user", content: prompt
  });
  if (saveError) return NextResponse.json({ error: "Could not save your message." }, { status: 500 });

  await db.from("ai_conversations").update({
    title: conversation.title === "new chat" ? prompt.slice(0, 52) : conversation.title,
    updated_at: new Date().toISOString()
  }).eq("id", conversationId).eq("owner_id", user.id);

  const contents = [...(history || []).reverse(), { role: "user", content: prompt }].map(m => ({
    role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }]
  }));

  let response;
  try {
    response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent", {
      method: "POST",
      headers: { "x-goog-api-key": process.env.GEMINI_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: "You are Vehemence AI. Be direct, natural, and concise. Answer the exact question first. For simple questions or calculations, give only the answer and at most one short explanation. Do not invent alternate interpretations unless the wording is genuinely ambiguous. Avoid unnecessary introductions, repeated wording, numbered lists for simple answers, and excessive detail. Use clean readable Markdown only when it helps." }] },
        contents,
        generationConfig: { maxOutputTokens: 512, thinkingConfig: { thinkingLevel: "LOW" } }
      }),
      signal: AbortSignal.timeout(45000)
    });
  } catch (error) {
    console.error("Gemini request failed:", error);
    return NextResponse.json({ error: "Gemini took too long to respond. Please try again." }, { status: 504 });
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error("Gemini API error:", response.status, JSON.stringify(payload).slice(0, 600));
    const message = response.status === 429
      ? "Gemini's free usage limit has been reached. Try again later."
      : response.status === 400 || response.status === 403
        ? "Gemini rejected the API key or request. Check the key in Vercel."
        : "Gemini could not complete that request.";
    return NextResponse.json({ error: message }, { status: response.status === 429 ? 429 : 502 });
  }

  const answer = (payload.candidates?.[0]?.content?.parts || []).map(p => p.text || "").join("").trim();
  if (!answer) return NextResponse.json({ error: "Gemini returned an empty response. Please try again." }, { status: 502 });

  const { error: assistantSaveError } = await db.from("ai_messages").insert({
    conversation_id: conversationId, owner_id: user.id, role: "assistant", content: answer
  });
  if (assistantSaveError) console.error("Could not save Gemini response:", assistantSaveError);

  return new Response(answer, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" }
  });
}
