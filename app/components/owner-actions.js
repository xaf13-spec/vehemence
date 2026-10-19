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

export async function ownerDeleteAccount(username) {
  const owner = await getVerifiedOwner();
  if (owner.error) return { error: owner.error };

  const targetUsername = String(username || "").trim();
  if (!targetUsername) return { error: "Enter the exact username first." };
  if (targetUsername.toLowerCase() === process.env.VEHEMENCE_OWNER_USERNAME?.trim().toLowerCase()) {
    return { error: "The owner account cannot be deleted from the owner panel." };
  }

  const { data: target, error: lookupError } = await supabase
    .from("profiles")
    .select("id, username")
    .ilike("username", targetUsername)
    .limit(2);

  if (lookupError) {
    console.error("Owner account lookup failed:", { code: lookupError.code, message: lookupError.message });
    return { error: "Could not find that account due to a database error." };
  }
  if (!target || target.length === 0) return { error: "Account not found. Check the username and try again." };
  if (target.length > 1) return { error: "More than one matching username was found. Use the exact username." };

  const account = target[0];
  if (account.id === owner.ownerId) return { error: "You cannot delete your own owner account." };

  // Invalidate all sessions first so the account cannot continue using an existing login.
  const { error: sessionsError } = await supabase.from("sessions").delete().eq("user_id", account.id);
  if (sessionsError) {
    console.error("Owner account session revocation failed:", { code: sessionsError.code, message: sessionsError.message });
    return { error: "Could not revoke the account's sessions. No account was deleted." };
  }

  const { data: deleted, error: deleteError } = await supabase
    .from("profiles")
    .delete()
    .eq("id", account.id)
    .select("id")
    .maybeSingle();

  if (deleteError) {
    console.error("Owner account deletion failed:", { code: deleteError.code, message: deleteError.message, details: deleteError.details });
    return { error: `Could not delete account: ${deleteError.message || "Unknown database error"}${deleteError.code ? ` (code ${deleteError.code})` : ""}. Its sessions were revoked.` };
  }
  if (!deleted) return { error: "Account was not deleted. Refresh and try again." };
  return { success: true, username: account.username };
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

  if (error) {
    console.error("Owner listing deletion failed:", { code: error.code, message: error.message, details: error.details, hint: error.hint });
    return { error: `Could not delete listing: ${error.message || "Unknown database error"}${error.code ? ` (code ${error.code})` : ""}` };
  }
  if (!data) return { error: "Listing not found. Refresh the list and select it again." };
  return { success: true };
}
