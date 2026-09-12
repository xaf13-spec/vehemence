import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PUBLISHABLE_KEY
);

async function getUserFromSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("vehemence_session")?.value;

  if (!token) return null;

  const { data: session } = await supabase
    .from("sessions")
    .select("user_id, expires_at")
    .eq("token", token)
    .single();

  if (!session || new Date(session.expires_at) <= new Date()) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username")
    .eq("id", session.user_id)
    .single();

  return profile || null;
}

export async function GET() {
  const user = await getUserFromSession();

  if (!user) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("chat_messages")
    .select("id, user_id, message, created_at, profiles(username)")
    .order("created_at", { ascending: true })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: "Could not load chat messages." }, { status: 500 });
  }

  const messages = (data || []).map((item) => ({
    id: item.id,
    userId: item.user_id,
    username: item.profiles?.username || "Unknown",
    message: item.message,
    createdAt: item.created_at
  }));

  return NextResponse.json({ messages, currentUserId: user.id });
}

export async function POST(request) {
  const user = await getUserFromSession();

  if (!user) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const message = body?.message?.toString().trim();

  if (!message) {
    return NextResponse.json({ error: "Message cannot be empty." }, { status: 400 });
  }

  if (message.length > 500) {
    return NextResponse.json({ error: "Message is too long." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("chat_messages")
    .insert({
      user_id: user.id,
      message
    })
    .select("id, user_id, message, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: "Could not send your message." }, { status: 500 });
  }

  return NextResponse.json({
    message: {
      id: data.id,
      userId: data.user_id,
      username: user.username,
      message: data.message,
      createdAt: data.created_at
    }
  });
}
