import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getCurrentUser } from "../../../lib/auth";

const url = process.env.SUPABASE_URL?.replace(/\/rest\/v1\/?$/, "");
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const db = url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Log in first." }, { status: 401 });
  if (!db) return NextResponse.json({ error: "Block settings are unavailable." }, { status: 503 });
  const { data, error } = await db.from("user_blocks").select("blocked_id").eq("blocker_id", user.id).order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: "Could not load blocked users." }, { status: 500 });
  const ids = (data || []).map((item) => item.blocked_id);
  const { data: profiles, error: profilesError } = ids.length ? await db.from("profiles").select("id, username").in("id", ids) : { data: [], error: null };
  if (profilesError) return NextResponse.json({ error: "Could not load blocked users." }, { status: 500 });
  const usernames = new Map((profiles || []).map((profile) => [profile.id, profile.username]));
  return NextResponse.json({ blocks: ids.map((userId) => ({ userId, username: usernames.get(userId) || "Unknown" })) });
}

export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Log in first." }, { status: 401 });
  if (!db) return NextResponse.json({ error: "Block settings are unavailable." }, { status: 503 });
  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const targetId = typeof body?.userId === "string" ? body.userId : "";
  const action = body?.action;
  if (!targetId || targetId === user.id || !["block", "unblock"].includes(action)) {
    return NextResponse.json({ error: "Invalid block request." }, { status: 400 });
  }
  if (action === "block") {
    const { error } = await db.from("user_blocks").upsert({ blocker_id: user.id, blocked_id: targetId }, { onConflict: "blocker_id,blocked_id" });
    if (error) return NextResponse.json({ error: "Could not block that user." }, { status: 500 });
  } else {
    const { error } = await db.from("user_blocks").delete().eq("blocker_id", user.id).eq("blocked_id", targetId);
    if (error) return NextResponse.json({ error: "Could not unblock that user." }, { status: 500 });
  }
  return NextResponse.json({ success: true, action, userId: targetId });
}