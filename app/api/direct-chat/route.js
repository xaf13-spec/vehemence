import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PUBLISHABLE_KEY
);

async function getSessionToken() {
  const cookieStore = await cookies();
  return cookieStore.get("vehemence_session")?.value || null;
}

function mapError(error) {
  const message = error?.message || "";
  if (message.includes("not_logged_in")) return ["Not logged in.", 401];
  if (message.includes("user_not_found")) return ["User not found.", 404];
  if (message.includes("not_friends")) return ["You can only chat with your friends.", 403];
  if (message.includes("empty_message")) return ["Message cannot be empty.", 400];
  if (message.includes("message_too_long")) return ["Message is too long.", 400];
  if (message.includes("cannot_message_self")) return ["You cannot message yourself.", 400];
  return ["Could not process the chat request.", 500];
}

export async function GET(request) {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }

  const username = new URL(request.url).searchParams.get("username")?.trim();
  if (!username) {
    return NextResponse.json({ error: "Username is required." }, { status: 400 });
  }

  const { data, error } = await supabase.rpc("vehemence_direct_chat", {
    p_token: token,
    p_username: username
  });

  if (error) {
    const [message, status] = mapError(error);
    return NextResponse.json({ error: message }, { status });
  }

  return NextResponse.json({ messages: (data || []).map((item) => ({
    id: item.id,
    senderId: item.sender_id,
    recipientId: item.recipient_id,
    senderUsername: item.sender_username,
    message: item.message,
    createdAt: item.created_at
  })) });
}

export async function POST(request) {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const username = body?.username?.toString().trim();
  const message = body?.message?.toString().trim();

  if (!username) {
    return NextResponse.json({ error: "Username is required." }, { status: 400 });
  }

  if (!message) {
    return NextResponse.json({ error: "Message cannot be empty." }, { status: 400 });
  }

  if (message.length > 500) {
    return NextResponse.json({ error: "Message is too long." }, { status: 400 });
  }

  const { data, error } = await supabase.rpc("vehemence_send_direct_message", {
    p_token: token,
    p_username: username,
    p_message: message
  });

  if (error) {
    const [errorMessage, status] = mapError(error);
    return NextResponse.json({ error: errorMessage }, { status });
  }

  const item = data?.[0];
  if (!item) {
    return NextResponse.json({ error: "Could not send the message." }, { status: 500 });
  }

  return NextResponse.json({
    message: {
      id: item.id,
      senderId: item.sender_id,
      recipientId: item.recipient_id,
      senderUsername: item.sender_username,
      message: item.message,
      createdAt: item.created_at
    }
  });
}
