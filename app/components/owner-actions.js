"use server";

import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/rest\/v1\/?$/, "");
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false, autoRefreshToken: false } })
  : null;

async function getVerifiedOwner() {
  if (!supabase) return { error: "Server database is not configured. Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY." };
  const ownerUsername = process.env.VEHEMENCE_OWNER_USERNAME?.trim().toLowerCase();
  if (!ownerUsername) return { error: "Set VEHEMENCE_OWNER_USERNAME in Vercel to the exact owner account username." };

  const cookieStore = await cookies();
  const token = cookieStore.get("vehemence_session")?.value;
  if (!token) return { error: "Log in to the owner account first." };

  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .select("user_id, expires_at")
    .eq("token", token)
    .maybeSingle();
  if (sessionError || !session || !session.expires_at || new Date(session.expires_at).getTime() <= Date.now()) {
    return { error: "Your session is invalid or expired. Log in again." };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", session.user_id)
    .maybeSingle();
  if (profileError || !profile || profile.username?.trim().toLowerCase() !== ownerUsername) {
    return { error: "This action is only available to the configured owner account." };
  }
  return { ownerId: session.user_id };
}

export async function isOwnerAccount() {
  const owner = await getVerifiedOwner();
  return { isOwner: !owner.error };
}

export async function ownerDeleteListing(id) {
  const owner = await getVerifiedOwner();
  if (owner.error) return { error: owner.error };

  const listingId = String(id || "").trim();
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidPattern.test(listingId)) return { error: "That listing ID is not valid. Select a listing from the list." };

  const { data, error } = await supabase
    .from("listings")
    .delete()
    .eq("id", listingId)
    .select("id")
    .maybeSingle();

  if (error) return { error: "Could not delete listing. Check the listings table permissions and server logs." };
  if (!data) return { error: "Listing not found. Refresh the list and select it again." };
  return { success: true };
}
