import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getCurrentUser } from "../../../lib/auth";

const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/rest\/v1\/?$/, "");
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = supabaseUrl && serviceRoleKey
  ? createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } })
  : null;

function unavailable() {
  return NextResponse.json({ error: "Chat is temporarily unavailable. Please try again later." }, { status: 503 });
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  if (!supabase) return unavailable();

  const { data, error } = await supabase
    .from("chat_messages")
    .select("id, user_id, message, created_at, profiles(username, custom_status)")
    .order("created_at", { ascending: true })
    .limit(100);

  if (error) {
    console.error("Online chat load failed:", error);
    return NextResponse.json({ error: "Could not load chat messages." }, { status: 500 });
  }

  const { data: blockRows, error: blockError } = await supabase
    .from("user_blocks")
    .select("blocked_id")
    .eq("blocker_id", user.id);

  if (blockError) {
    console.error("Online chat block lookup failed:", blockError);
    return NextResponse.json({ error: "Could not load chat messages." }, { status: 500 });
  }

  const blockedIds = new Set((blockRows || []).map((row) => row.blocked_id));
  const messages = (data || [])
    .filter((item) => !blockedIds.has(item.user_id))
    .map((item) => ({
      id: item.id,
      userId: item.user_id,
      username: item.profiles?.username || "Unknown",
      customStatus: item.profiles?.custom_status || "",
      message: item.message,
      createdAt: item.created_at
    }));

  return NextResponse.json({ messages, currentUserId: user.id, blockedUserIds: [...blockedIds] });
}

export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  if (!supabase) return unavailable();

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const message = body?.message?.toString().trim();
  if (!message) return NextResponse.json({ error: "Message cannot be empty." }, { status: 400 });
  if (message.length > 500) return NextResponse.json({ error: "Message is too long." }, { status: 400 });

  const { data, error } = await supabase
    .from("chat_messages")
    .insert({ user_id: user.id, message })
    .select("id, user_id, message, created_at")
    .single();

  if (error) {
    console.error("Online chat send failed:", error);
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
