"use server";

import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLISHABLE_KEY);
const admin = process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { autoRefreshToken: false, persistSession: false } })
  : null;

async function getCurrentUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("vehemence_session")?.value;
  if (!token) return null;
  const client = admin || supabase;
  const { data: session } = await client.from("sessions").select("user_id, expires_at").eq("token", token).single();
  if (!session || new Date(session.expires_at) <= new Date()) return null;
  return session.user_id;
}

function db() {
  return admin || supabase;
}

export async function searchUsers(query) {
  const userId = await getCurrentUserId();
  if (!userId) return { error: "You are not logged in." };
  const value = query?.trim();
  if (!value) return { users: [] };
  const { data, error } = await db().from("profiles").select("id, username, created_at").ilike("username", `%${value}%`).neq("id", userId).order("username").limit(20);
  if (error) return { error: "Could not search users." };
  return { users: data || [] };
}

export async function getSocialData() {
  const userId = await getCurrentUserId();
  if (!userId) return { error: "You are not logged in." };
  const client = db();
  const { data: rows, error } = await client.from("friendships").select("id, requester_id, addressee_id, status, created_at").or(`requester_id.eq.${userId},addressee_id.eq.${userId}`).order("created_at", { ascending: false });
  if (error) return { error: "Could not load your friends." };

  const relatedIds = [...new Set((rows || []).flatMap((row) => [row.requester_id, row.addressee_id]).filter((id) => id !== userId))];
  if (!relatedIds.length) return { friends: [], incoming: [], outgoing: [] };

  const [{ data: profiles }, { data: activityRows }] = await Promise.all([
    client.from("profiles").select("id, username, created_at").in("id", relatedIds),
    client.from("user_activity").select("user_id, last_seen_at, last_game, last_game_at").in("user_id", relatedIds),
  ]);

  const profileMap = new Map((profiles || []).map((profile) => [profile.id, profile]));
  const activityMap = new Map((activityRows || []).map((activity) => [activity.user_id, activity]));
  const decorate = (row, otherId) => {
    const profile = profileMap.get(otherId);
    const activity = activityMap.get(otherId);
    const online = Boolean(activity?.last_seen_at && Date.now() - new Date(activity.last_seen_at).getTime() < 120000);
    return { id: row.id, username: profile?.username || "Unknown user", created_at: profile?.created_at || row.created_at, online, last_game: activity?.last_game || null, last_game_at: activity?.last_game_at || null };
  };

  const friends = [];
  const incoming = [];
  const outgoing = [];
  for (const row of rows || []) {
    const otherId = row.requester_id === userId ? row.addressee_id : row.requester_id;
    if (row.status === "accepted") friends.push(decorate(row, otherId));
    else if (row.addressee_id === userId) incoming.push(decorate(row, row.requester_id));
    else outgoing.push(decorate(row, row.addressee_id));
  }
  return { friends, incoming, outgoing };
}

export async function sendFriendRequest(username) {
  const userId = await getCurrentUserId();
  if (!userId) return { error: "You are not logged in." };
  const targetName = username?.trim();
  if (!targetName) return { error: "Enter a username." };
  const client = db();
  const { data: target } = await client.from("profiles").select("id, username").ilike("username", targetName).maybeSingle();
  if (!target) return { error: "User not found." };
  if (target.id === userId) return { error: "You cannot add yourself." };

  const { data: existing } = await client.from("friendships").select("id, requester_id, addressee_id, status").or(`and(requester_id.eq.${userId},addressee_id.eq.${target.id}),and(requester_id.eq.${target.id},addressee_id.eq.${userId})`).maybeSingle();
  if (existing?.status === "accepted") return { error: "You are already friends." };
  if (existing?.requester_id === target.id && existing?.addressee_id === userId && existing?.status === "pending") {
    const { error } = await client.from("friendships").update({ status: "accepted" }).eq("id", existing.id);
    return error ? { error: "Could not accept the request." } : { success: true, accepted: true };
  }
  if (existing) return { error: "Friend request already sent." };

  const { error } = await client.from("friendships").insert({ requester_id: userId, addressee_id: target.id });
  return error ? { error: "Could not send the friend request." } : { success: true };
}

export async function respondToFriendRequest(friendshipId, accept) {
  const userId = await getCurrentUserId();
  if (!userId) return { error: "You are not logged in." };
  const client = db();
  const { data: row } = await client.from("friendships").select("id").eq("id", friendshipId).eq("addressee_id", userId).eq("status", "pending").maybeSingle();
  if (!row) return { error: "Friend request no longer exists." };
  if (accept) {
    const { error } = await client.from("friendships").update({ status: "accepted" }).eq("id", friendshipId);
    return error ? { error: "Could not accept the request." } : { success: true };
  }
  const { error } = await client.from("friendships").delete().eq("id", friendshipId).eq("addressee_id", userId).eq("status", "pending");
  return error ? { error: "Could not decline the request." } : { success: true };
}

export async function removeFriend(friendshipId) {
  const userId = await getCurrentUserId();
  if (!userId) return { error: "You are not logged in." };
  const { error } = await db().from("friendships").delete().eq("id", friendshipId).eq("status", "accepted").or(`requester_id.eq.${userId},addressee_id.eq.${userId}`);
  return error ? { error: "Could not remove this friend." } : { success: true };
}

export async function touchPresence() {
  const userId = await getCurrentUserId();
  if (!userId || !admin) return { success: false };
  const { error } = await admin.from("user_activity").upsert({ user_id: userId, last_seen_at: new Date().toISOString() });
  return error ? { error: "Could not update presence." } : { success: true };
}

export async function recordGameActivity(gameName) {
  const userId = await getCurrentUserId();
  if (!userId || !admin) return { success: false };
  const now = new Date().toISOString();
  const { error } = await admin.from("user_activity").upsert({ user_id: userId, last_seen_at: now, last_game: String(gameName || "").slice(0, 120), last_game_at: now });
  return error ? { error: "Could not update activity." } : { success: true };
}
