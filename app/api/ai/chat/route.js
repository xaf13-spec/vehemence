import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getCurrentUser } from "../../../../lib/auth";

export const runtime = "nodejs";

const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});

export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in to use Vehemence AI." }, { status: 401 });
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "Vehemence AI needs a Gemini API key. Add GEMINI_API_KEY as a private Vercel environment variable." }, { status: 503 });
  }

  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }

  const conversationId = String(body?.conversationId || "");
  const prompt = String(body?.message || "").trim();
  if (!/^[0-9a-f-]{36}$/i.test(conversationId) || !prompt || prompt.length > 12000) {
    return NextResponse.json({ error: "Enter a message under 12,000 characters." }, { status: 400 });
  }

  const { data: conversation, error: conversationError } = await db
    .from("ai_conversations")
    .select("id,title")
    .eq("id", conversationId)
    .eq("owner_id", user.id)
    .maybeSingle();
  if (conversationError || !conversation) return NextResponse.json({ error: "Chat not found." }, { status: 404 });

  const { data: recentHistory, error: historyError } = await db
    .from("ai_messages")
    .select("role,content")
    .eq("conversation_id", conversationId)
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })
    .limit(30);
  if (historyError) return NextResponse.json({ error: "Could not load chat history." }, { status: 500 });

  const { error: saveUserError } = await db.from("ai_messages").insert({
    conversation_id: conversationId,
    owner_id: user.id,
    role: "user",
    content: prompt
  });
  if (saveUserError) return NextResponse.json({ error: "Could not save your message." }, { status: 500 });

  await db.from("ai_conversations")
    .update({
      title: conversation.title === "new chat" ? prompt.slice(0, 52) : conversation.title,
      updated_at: new Date().toISOString()
    })
    .eq("id", conversationId)
    .eq("owner_id", user.id);

  const contents = [...(recentHistory || []).reverse(), { role: "user", content: prompt }].map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [{ text: message.content }]
  }));

  let upstream;
  try {
    upstream = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:streamGenerateContent?alt=sse", {
      method: "POST",
      headers: {
        "x-goog-api-key": process.env.GEMINI_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: "You are Vehemence AI, a helpful general-purpose assistant. Be clear, accurate, and conversational." }]
        },
        contents,
        generationConfig: { temperature: 0.7 }
      }),
      signal: AbortSignal.timeout(60000)
    });
  } catch (error) {
    console.error("Gemini connection failed:", error);
    return NextResponse.json({ error: "Could not reach Gemini. Please try again." }, { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    console.error("Gemini request failed:", upstream.status, detail.slice(0, 500));
    const message = upstream.status === 429
      ? "Gemini's free usage limit has been reached for now. Try again later."
      : upstream.status === 400 || upstream.status === 403
        ? "Gemini rejected the request or API key. Check that the key is valid and enabled for the Gemini API."
        : "Gemini could not complete that request.";
    return NextResponse.json({ error: message }, { status: upstream.status === 429 ? 429 : 502 });
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  let full = "";
  const stream = new ReadableStream({
    async start(controller) {
      const reader = upstream.body.getReader();
      let buffer = "";

      async function processLine(line) {
        if (!line.startsWith("data:")) return;
        const raw = line.slice(5).trim();
        if (!raw || raw === "[DONE]") return;
        try {
          const payload = JSON.parse(raw);
          const text = (payload.candidates?.[0]?.content?.parts || [])
            .map((part) => part.text || "")
            .join("");
          if (text) {
            full += text;
            controller.enqueue(encoder.encode(text));
          }
        } catch (error) {
          console.error("Could not parse Gemini stream event:", error);
        }
      }

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          for (const line of lines) await processLine(line.trimEnd());
        }
        buffer += decoder.decode();
        if (buffer.trim()) await processLine(buffer.trimEnd());

        if (full) {
          const { error } = await db.from("ai_messages").insert({
            conversation_id: conversationId,
            owner_id: user.id,
            role: "assistant",
            content: full
          });
          if (error) console.error("Could not save Gemini response:", error);
        }
      } catch (error) {
        console.error("Gemini stream failed:", error);
      } finally {
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Content-Type-Options": "nosniff"
    }
  });
}
