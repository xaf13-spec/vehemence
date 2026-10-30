import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getCurrentUser } from "../../../../lib/auth";

export const runtime = "nodejs";

const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });

export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in to use Vehemence AI." }, { status: 401 });
  if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: "Vehemence AI needs an OpenAI API key. Add OPENAI_API_KEY as a private Vercel environment variable." }, { status: 503 });

  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const conversationId = String(body?.conversationId || "");
  const prompt = String(body?.message || "").trim();
  if (!/^[0-9a-f-]{36}$/i.test(conversationId) || !prompt || prompt.length > 12000) return NextResponse.json({ error: "Enter a message under 12,000 characters." }, { status: 400 });

  const { data: conversation } = await db.from("ai_conversations").select("id,title").eq("id", conversationId).eq("owner_id", user.id).maybeSingle();
  if (!conversation) return NextResponse.json({ error: "Chat not found." }, { status: 404 });

  const { data: history, error: historyError } = await db.from("ai_messages").select("role,content").eq("conversation_id", conversationId).eq("owner_id", user.id).order("created_at", { ascending: true }).limit(30);
  if (historyError) return NextResponse.json({ error: "Could not load chat history." }, { status: 500 });

  const { error: saveUserError } = await db.from("ai_messages").insert({ conversation_id: conversationId, owner_id: user.id, role: "user", content: prompt });
  if (saveUserError) return NextResponse.json({ error: "Could not save your message." }, { status: 500 });

  if (conversation.title === "new chat") {
    await db.from("ai_conversations").update({ title: prompt.slice(0, 52), updated_at: new Date().toISOString() }).eq("id", conversationId).eq("owner_id", user.id);
  } else {
    await db.from("ai_conversations").update({ updated_at: new Date().toISOString() }).eq("id", conversationId).eq("owner_id", user.id);
  }

  const messages = [...(history || []), { role: "user", content: prompt }];
  let upstream;
  try {
    upstream = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "gpt-4o-mini", messages: [{ role: "system", content: "You are Vehemence AI, a helpful general-purpose assistant. Be clear, accurate, and conversational." }, ...messages], stream: true }),
      signal: AbortSignal.timeout(60000)
    });
  } catch {
    return NextResponse.json({ error: "Could not reach the AI service. Please try again." }, { status: 502 });
  }
  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    console.error("OpenAI request failed:", upstream.status, detail.slice(0, 500));
    return NextResponse.json({ error: upstream.status === 429 ? "AI is busy or the API quota is exhausted. Try again later." : "The AI service could not complete that request." }, { status: upstream.status === 429 ? 429 : 502 });
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  let full = "";
  const stream = new ReadableStream({
    async start(controller) {
      const reader = upstream.body.getReader();
      let buffer = "";
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const raw = line.slice(6).trim();
            if (raw === "[DONE]") continue;
            try {
              const payload = JSON.parse(raw);
              const part = payload.choices?.[0]?.delta?.content || "";
              if (part) { full += part; controller.enqueue(encoder.encode(part)); }
            } catch {}
          }
        }
        if (full) await db.from("ai_messages").insert({ conversation_id: conversationId, owner_id: user.id, role: "assistant", content: full });
      } catch (error) {
        console.error("AI stream failed:", error);
      } finally {
        controller.close();
      }
    }
  });
  return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache, no-transform", "X-Content-Type-Options": "nosniff" } });
}
