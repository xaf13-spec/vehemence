"use server";

import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLISHABLE_KEY);

async function getSessionToken() {
  const cookieStore = await cookies();
  return cookieStore.get("vehemence_session")?.value || null;
}

function rpcError(error) {
  const code = error?.message || "";
  if (code.includes("not_logged_in")) return "You are not logged in.";
  if (code.includes("user_not_found")) return "User not found.";
  if (code.includes("cannot_add_self")) return "You cannot add yourself.";
  if (code.includes("already_friends")) return "You are already friends.";
  if (code.includes("request_exists")) return "Friend request already sent.";
  if (code.includes("request_not_found")) return "Friend request no longer exists.";
  if (code.includes("friend_not_found")) return "Friend no longer exists.";
  return null;
}

export async function searchUsers(query) {
  const token = await getSessionToken();
  if (!token) return { error: "You are not logged in." };

  const value = query?.trim();
  if (!value) return { users: [] };

  const { data, error } = await supabase.rpc("vehemence_search_users", {
    p_token: token,
    p_query: value
  });

  if (error) return { error: "Could not search users." };
  return { users: data || [] };
}

export async function getSocialData() {
  const token = await getSessionToken();
  if (!token) return { error: "You are not logged in." };

  const { data, error } = await supabase.rpc("vehemence_social_data", {
    p_token: token
  });

  if (error) {
    return { error: rpcError(error) || "Could not load your friends." };
  }

  return data || { friends: [], incoming: [], outgoing: [] };
}

export async function sendFriendRequest(username) {
  const token = await getSessionToken();
  if (!token) return { error: "You are not logged in." };

  const targetName = username?.trim();
  if (!targetName) return { error: "Enter a username." };

  const { data, error } = await supabase.rpc("vehemence_send_friend_request", {
    p_token: token,
    p_username: targetName
  });

  if (error) return { error: rpcError(error) || "Could not send the friend request." };
  return data || { success: true };
}

export async function respondToFriendRequest(friendshipId, accept) {
  const token = await getSessionToken();
  if (!token) return { error: "You are not logged in." };

  const { data, error } = await supabase.rpc("vehemence_respond_friend_request", {
    p_token: token,
    p_friendship_id: friendshipId,
    p_accept: Boolean(accept)
  });

  if (error) return { error: rpcError(error) || "Could not update the friend request." };
  return data || { success: true };
}

export async function removeFriend(friendshipId) {
  const token = await getSessionToken();
  if (!token) return { error: "You are not logged in." };

  const { data, error } = await supabase.rpc("vehemence_remove_friend", {
    p_token: token,
    p_friendship_id: friendshipId
  });

  if (error) return { error: rpcError(error) || "Could not remove this friend." };
  return data || { success: true };
}

export async function touchPresence() {
  const token = await getSessionToken();
  if (!token) return { success: false };

  const { data, error } = await supabase.rpc("vehemence_touch_presence", {
    p_token: token
  });

  return error ? { success: false } : (data || { success: true });
}

export async function recordGameActivity(gameName) {
  const token = await getSessionToken();
  if (!token) return { success: false };

  const { data, error } = await supabase.rpc("vehemence_record_game_activity", {
    p_token: token,
    p_game: String(gameName || "").slice(0, 120)
  });

  return error ? { success: false } : (data || { success: true });
}
