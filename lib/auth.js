"use server";

import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/rest\/v1\/?$/, "");
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false, autoRefreshToken: false } })
  : null;

export async function getCurrentUser() {
  if (!supabase) return null;

  const cookieStore = await cookies();
  const token = cookieStore.get("vehemence_session")?.value;
  if (!token) return null;

  const { data: session } = await supabase
    .from("sessions")
    .select("user_id, expires_at")
    .eq("token", token)
    .single();

  if (!session) return null;

  if (new Date(session.expires_at) <= new Date()) {
    await supabase.from("sessions").delete().eq("token", token);
    cookieStore.delete("vehemence_session");
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, rules_accepted, created_at")
    .eq("id", session.user_id)
    .single();

  return profile || null;
}
