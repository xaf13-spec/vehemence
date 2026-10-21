import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getCurrentUser } from "../../../lib/auth";

const url = process.env.SUPABASE_URL?.replace(/\/rest\/v1\/?$/, "");
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const db = url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Log in first." }, { status: 401 });
  if (!db) return NextResponse.json({ error: "Status settings are unavailable." }, { status: 503 });
  const { data, error } = await db.from("profiles").select("custom_status").eq("id", user.id).maybeSingle();
  if (error) return NextResponse.json({ error: "Could not load your status." }, { status: 500 });
  return NextResponse.json({ status: data?.custom_status || "" });
}

export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Log in first." }, { status: 401 });
  if (!db) return NextResponse.json({ error: "Status settings are unavailable." }, { status: 503 });
  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const status = typeof body?.status === "string" ? body.status.trim().slice(0, 80) : "";
  const { error } = await db.from("profiles").update({ custom_status: status }).eq("id", user.id);
  if (error) return NextResponse.json({ error: "Could not save your status." }, { status: 500 });
  return NextResponse.json({ success: true, status });
}