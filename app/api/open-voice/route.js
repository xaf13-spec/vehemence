import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getCurrentUser } from "../../../lib/auth";

const url = process.env.SUPABASE_URL?.replace(/\/rest\/v1\/?$/, "");
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const db = url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
const ROOM_ID = "online-chat";
const STALE_AFTER_SECONDS = 25;

function fail(message, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

async function requireUser() {
  if (!db) return { error: fail("Voice chat is not configured on the server.", 503) };
  const user = await getCurrentUser();
  if (!user) return { error: fail("Log in to join voice chat.", 401) };
  return { user };
}

export async function GET(request) {
  const auth = await requireUser();
  if (auth.error) return auth.error;
  const { user } = auth;
  const sinceRaw = new URL(request.url).searchParams.get("since");
  const since = Math.max(0, Number.parseInt(sinceRaw || "0", 10) || 0);
  const cutoff = new Date(Date.now() - STALE_AFTER_SECONDS * 1000).toISOString();

  await db.from("open_voice_participants").delete().eq("room_id", ROOM_ID).lt("last_seen_at", cutoff);
  await db.from("open_voice_signals").delete().lt("created_at", new Date(Date.now() - 10 * 60 * 1000).toISOString());

  const [{ data: participants, error: participantsError }, { data: signals, error: signalsError }] = await Promise.all([
    db.from("open_voice_participants").select("user_id, username, custom_status, joined_at, last_seen_at").eq("room_id", ROOM_ID).order("joined_at", { ascending: true }),
    db.from("open_voice_signals").select("id, from_user, to_user, kind, payload, created_at").eq("room_id", ROOM_ID).eq("to_user", user.id).gt("id", since).order("id", { ascending: true }).limit(100)
  ]);

  if (participantsError || signalsError) return fail("Could not load the voice room.", 500);
  return NextResponse.json({
    roomId: ROOM_ID,
    currentUserId: user.id,
    participants: participants || [],
    signals: (signals || []).map((item) => ({ id: item.id, fromUser: item.from_user, kind: item.kind, payload: item.payload })),
    latestSignalId: signals?.length ? signals[signals.length - 1].id : since
  });
}

export async function POST(request) {
  const auth = await requireUser();
  if (auth.error) return auth.error;
  const { user } = auth;
  let body;
  try { body = await request.json(); } catch { return fail("Invalid request."); }
  const action = body?.action;

  if (action === "join" || action === "heartbeat") {
    const { error } = await db.from("open_voice_participants").upsert({
      room_id: ROOM_ID,
      user_id: user.id,
      username: user.username,
      last_seen_at: new Date().toISOString()
    }, { onConflict: "room_id,user_id" });
    if (error) return fail("Could not join the voice room.", 500);
    return NextResponse.json({ success: true, roomId: ROOM_ID });
  }

  if (action === "leave") {
    await db.from("open_voice_participants").delete().eq("room_id", ROOM_ID).eq("user_id", user.id);
    await db.from("open_voice_signals").delete().eq("room_id", ROOM_ID).or(`from_user.eq.${user.id},to_user.eq.${user.id}`);
    return NextResponse.json({ success: true });
  }

  if (action === "signal") {
    const toUser = typeof body?.toUser === "string" ? body.toUser : "";
    const kind = body?.kind;
    const payload = body?.payload;
    if (!toUser || toUser === user.id || !["offer", "answer", "candidate"].includes(kind) || !payload || JSON.stringify(payload).length > 12000) {
      return fail("Invalid voice signal.");
    }
    const [{ data: sender }, { data: recipient }] = await Promise.all([
      db.from("open_voice_participants").select("user_id").eq("room_id", ROOM_ID).eq("user_id", user.id).maybeSingle(),
      db.from("open_voice_participants").select("user_id").eq("room_id", ROOM_ID).eq("user_id", toUser).maybeSingle()
    ]);
    if (!sender || !recipient) return fail("Both users must be in the voice room.", 409);
    const { error } = await db.from("open_voice_signals").insert({
      room_id: ROOM_ID,
      from_user: user.id,
      to_user: toUser,
      kind,
      payload
    });
    if (error) return fail("Could not send voice signal.", 500);
    return NextResponse.json({ success: true });
  }

  return fail("Unknown voice-room action.");
}
