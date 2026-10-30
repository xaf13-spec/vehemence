import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getCurrentUser } from "../../../../lib/auth";

export const runtime = "nodejs";
export const maxDuration = 60;

const modeInstructions = {
  math: `You are Vehemence AI's math solver. Understand natural language math, not only formal symbols. Interpret phrases such as "to the power of", "raised to", "squared", "cubed", "times", "multiplied by", "divided by", "over", "square root of", "percent of", "plus", "minus", and "equals". Understand mixed words and symbols, informal typing, and common spelling mistakes when the meaning is clear. Translate the user's wording into the intended mathematical expression internally before solving. If there is more than one reasonable interpretation, ask one short clarifying question instead of guessing. For a clear problem, solve accurately and show concise step-by-step working, with the final answer clearly marked. For simple arithmetic, give just the answer unless working is requested. Never claim to have used a calculator or tool you did not use.`,
  writing: `You are Vehemence AI's writing assistant. Help create, revise, expand, shorten, proofread, and improve essays, paragraphs, sentences, introductions, conclusions, and other everyday writing. Follow the user's requested topic, length, tone, and reading level. If they provide text, preserve their intended meaning while improving clarity and flow. If key requirements are missing, make sensible defaults rather than asking unnecessary questions. Write naturally and avoid generic filler, fake quotations, or invented sources. Return the writing itself first, with a brief note only when useful.`
};

export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in to use Vehemence AI." }, { status: 401 });
  if (!process.env.GEMINI_API_KEY) return NextResponse.json({ error: "Gemini API key is missing from Vercel." }, { status: 503 });
  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const conversationId = String(body?.conversationId || "");
  const prompt = String(body?.message || "").trim();
  const mode = body?.mode === "writing" ? "writing" : "math";
  if (!/^[0-9a-f-]{36}$/i.test(conversationId) || !prompt || prompt.length > 12000) return NextResponse.json({ error: "Enter a message under 12,000 characters." }, { status: 400 });

  const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: conversation, error: conversationError } = await db.from("ai_conversations").select("id,title").eq("id", conversationId).eq("owner_id", user.id).maybeSingle();
  if (conversationError || !conversation) return NextResponse.json({ error: "Task not found. Start a new task and try again." }, { status: 404 });
  const { data: history, error: historyError } = await db.from("ai_messages").select("role,content").eq("conversation_id", conversationId).eq("owner_id", user.id).order("created_at", { ascending: false }).limit(12);
  if (historyError) return NextResponse.json({ error: "Could not load task history." }, { status: 500 });
  const { error: saveError } = await db.from("ai_messages").insert({ conversation_id: conversationId, owner_id: user.id, role: "user", content: prompt });
  if (saveError) return NextResponse.json({ error: "Could not save your request." }, { status: 500 });
  await db.from("ai_conversations").update({ title: conversation.title === "new chat" ? prompt.slice(0, 52) : conversation.title, updated_at: new Date().toISOString() }).eq("id", conversationId).eq("owner_id", user.id);

  const contents = [...(history || []).reverse(), { role: "user", content: prompt }].map(m => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }));
  let upstream;
  try {
    upstream = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:streamGenerateContent?alt=sse", {
      method: "POST",
      headers: { "x-goog-api-key": process.env.GEMINI_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ systemInstruction: { parts: [{ text: modeInstructions[mode] }] }, contents, generationConfig: { maxOutputTokens: mode === "writing" ? 1400 : 900, thinkingConfig: { thinkingLevel: "LOW" } } }),
      signal: AbortSignal.timeout(50000)
    });
  } catch (error) {
    console.error("Gemini connection failed:", error);
    return NextResponse.json({ error: "The AI took too long to connect. Please try again." }, { status: 504 });
  }
  if (!upstream.ok) {
    const payload = await upstream.json().catch(() => ({}));
    console.error("Gemini API error:", upstream.status, JSON.stringify(payload).slice(0, 600));
    const message = upstream.status === 429 ? "The AI usage limit has been reached. Try again later." : upstream.status === 400 || upstream.status === 403 ? "The AI provider rejected the API key or request. Check the key in Vercel." : "The AI could not complete that request.";
    return NextResponse.json({ error: message }, { status: upstream.status === 429 ? 429 : 502 });
  }

  const output = new ReadableStream({
    async start(controller) {
      const reader = upstream.body.getReader();
      const decoder = new TextDecoder();
      const encoder = new TextEncoder();
      let buffer = "";
      let answer = "";
      const consume = line => {
        if (!line.startsWith("data:")) return;
        const data = line.slice(5).trim();
        if (!data || data === "[DONE]") return;
        try {
          const event = JSON.parse(data);
          const chunk = (event.candidates?.[0]?.content?.parts || []).map(part => part.text || "").join("");
          if (chunk) { answer += chunk; controller.enqueue(encoder.encode(chunk)); }
        } catch (error) { console.error("Gemini stream event parse failed:", error); }
      };
      try {
        while (true) {
          const { value, done } = await reader.read();
          buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
          const lines = buffer.split(/\r?\n/);
          buffer = lines.pop() || "";
          for (const line of lines) consume(line.trim());
          if (done) break;
        }
        if (buffer.trim()) consume(buffer.trim());
        if (answer) {
          const { error } = await db.from("ai_messages").insert({ conversation_id: conversationId, owner_id: user.id, role: "assistant", content: answer });
          if (error) console.error("Could not save AI response:", error);
        } else controller.enqueue(encoder.encode("The AI returned an empty response. Please try again."));
        controller.close();
      } catch (error) {
        console.error("Gemini stream failed:", error);
        controller.enqueue(encoder.encode(answer ? "\n[response interrupted]" : "The AI could not finish that response. Please try again."));
        controller.close();
      } finally { reader.releaseLock(); }
    }
  });
  return new Response(output, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store, no-transform", "X-Accel-Buffering": "no" } });
}
