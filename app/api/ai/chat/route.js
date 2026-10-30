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

  let upstream;
  try {
    upstream = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:streamGenerateContent?alt=sse", {
      method: "POST",
      headers: { "x-goog-api-key": process.env.GEMINI_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: "You are Vehemence AI. Be direct, natural, and concise. Answer the exact question first. For simple questions or calculations, give only the answer. Avoid unnecessary introductions, repeated wording, and excessive detail." }] },
        contents,
        generationConfig: { maxOutputTokens: 512, thinkingConfig: { thinkingLevel: "LOW" } }
      }),
      signal: AbortSignal.timeout(50000)
    });
  } catch (error) {
    console.error("Gemini connection failed:", error);
    return NextResponse.json({ error: "Gemini could not connect in time. Please try again." }, { status: 504 });
  }

  if (!upstream.ok) {
    const payload = await upstream.json().catch(() => ({}));
    console.error("Gemini API error:", upstream.status, JSON.stringify(payload).slice(0, 600));
    const message = upstream.status === 429
      ? "Gemini's free usage limit has been reached. Try again later."
      : upstream.status === 400 || upstream.status === 403
        ? "Gemini rejected the API key or request. Check the key in Vercel."
        : "Gemini could not complete that request.";
    return NextResponse.json({ error: message }, { status: upstream.status === 429 ? 429 : 502 });
  }

  const output = new ReadableStream({
    async start(controller) {
      const reader = upstream.body.getReader();
      const decoder = new TextDecoder();
      const encoder = new TextEncoder();
      let buffer = "";
      let answer = "";
      const consume = (line) => {
        if (!line.startsWith("data:")) return;
        const data = line.slice(5).trim();
        if (!data || data === "[DONE]") return;
        try {
          const event = JSON.parse(data);
          const chunk = (event.candidates?.[0]?.content?.parts || []).map(part => part.text || "").join("");
          if (chunk) {
            answer += chunk;
            controller.enqueue(encoder.encode(chunk));
          }
        } catch (error) {
          console.error("Gemini stream event parse failed:", error);
        }
      };
      try {
        while (true) {
          const { value, done } = await reader.read();
          buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
          const lines = buffer.split(/\\r?\\n/);
          buffer = lines.pop() || "";
          for (const line of lines) consume(line.trim());
          if (done) break;
        }
        if (buffer.trim()) consume(buffer.trim());
        if (answer) {
          const { error } = await db.from("ai_messages").insert({
            conversation_id: conversationId, owner_id: user.id, role: "assistant", content: answer
          });
          if (error) console.error("Could not save Gemini response:", error);
        } else {
          controller.enqueue(encoder.encode("Gemini returned an empty response. Please try again."));
        }
        controller.close();
      } catch (error) {
        console.error("Gemini stream failed:", error);
        controller.enqueue(encoder.encode(answer ? "\\n[response interrupted]" : "Gemini could not finish that response. Please try again."));
        controller.close();
      } finally {
        reader.releaseLock();
      }
    }
  });

  return new Response(output, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store, no-transform", "X-Accel-Buffering": "no" }
  });
}
