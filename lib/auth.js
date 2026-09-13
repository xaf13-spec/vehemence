"use server";

import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PUBLISHABLE_KEY
);

const admin = process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )
  : null;

const db = () => admin || supabase;

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("vehemence_session")?.value;

  if (!token) {
    return null;
  }

  const client = db();

  const { data: session } = await client
    .from("sessions")
    .select("user_id, expires_at")
    .eq("token", token)
    .single();

  if (!session) {
    return null;
  }

  if (new Date(session.expires_at) <= new Date()) {
    await client
      .from("sessions")
      .delete()
      .eq("token", token);

    cookieStore.delete("vehemence_session");
    return null;
  }

  const { data: profile } = await client
    .from("profiles")
    .select("id, username, rules_accepted, created_at")
    .eq("id", session.user_id)
    .single();

  return profile || null;
}
