"use server";

import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL?.replace(/\/rest\/v1\/?$/, "");
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const db = url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;

async function currentAccount() {
  if (!db) return { error: "The game platform database is not configured." };
  const jar = await cookies();
  const token = jar.get("vehemence_session")?.value;
  if (!token) return { error: "Sign in to use party rooms and challenges." };
  const { data: session, error: sessionError } = await db.from("sessions").select("user_id,expires_at").eq("token", token).maybeSingle();
  if (sessionError || !session || !session.expires_at || new Date(session.expires_at).getTime() <= Date.now()) return { error: "Your session expired. Sign in again." };
  const { data: profile, error } = await db.from("profiles").select("id,username").eq("id", session.user_id).maybeSingle();
  if (error || !profile) return { error: "Could not verify your account." };
  return { profile };
}

function cleanText(value, max = 80) {
  return String(value || "").trim().replace(/[<>]/g, "").slice(0, max);
}
function makeCode() {
  return randomBytes(5).toString("hex").toUpperCase().slice(0, 8);
}

export async function createPartyRoom(gameId, gameName) {
  const auth = await currentAccount();
  if (auth.error) return { error: auth.error };
  const id = cleanText(gameId, 80);
  const name = cleanText(gameName, 80);
  if (!id || !name) return { error: "Choose a game first." };
  for (let attempt = 0; attempt < 3; attempt++) {
    const code = makeCode();
    const { data: room, error } = await db.from("party_rooms").insert({ code, owner_id: auth.profile.id, game_id: id, game_name: name }).select("id,code,owner_id,game_id,game_name,status,created_at,expires_at").maybeSingle();
    if (error?.code === "23505") continue;
    if (error || !room) return { error: "Could not create a party room. Try again." };
    const { error: memberError } = await db.from("party_room_members").insert({ room_id: room.id, user_id: auth.profile.id });
    if (memberError) {
      await db.from("party_rooms").delete().eq("id", room.id);
      return { error: "The room was created but membership could not be saved. Try again." };
    }
    return { room };
  }
  return { error: "Could not generate a unique room code. Try again." };
}

export async function listPartyRooms() {
  const auth = await currentAccount();
  if (auth.error) return { error: auth.error };
  const now = new Date().toISOString();
  const { data, error } = await db.from("party_rooms").select("id,code,owner_id,game_id,game_name,status,created_at,expires_at,owner:profiles!party_rooms_owner_id_fkey(username),members:party_room_members(user_id,profile:profiles(username))").eq("status", "open").gt("expires_at", now).order("created_at", { ascending: false }).limit(20);
  if (error) return { error: "Could not load party rooms." };
  return { rooms: data || [], userId: auth.profile.id };
}

export async function joinPartyRoom(codeValue) {
  const auth = await currentAccount();
  if (auth.error) return { error: auth.error };
  const code = cleanText(codeValue, 12).toUpperCase();
  if (!/^[A-F0-9]{8}$/.test(code)) return { error: "Enter the 8-character room code." };
  const { data: room, error } = await db.from("party_rooms").select("id,code,owner_id,game_id,game_name,status,expires_at").eq("code", code).eq("status", "open").gt("expires_at", new Date().toISOString()).maybeSingle();
  if (error || !room) return { error: "That room does not exist or has expired." };
  const { error: joinError } = await db.from("party_room_members").upsert({ room_id: room.id, user_id: auth.profile.id }, { onConflict: "room_id,user_id", ignoreDuplicates: true });
  if (joinError) return { error: "Could not join that room." };
  return { room };
}

export async function closePartyRoom(roomId) {
  const auth = await currentAccount();
  if (auth.error) return { error: auth.error };
  const id = cleanText(roomId, 60);
  const { data, error } = await db.from("party_rooms").update({ status: "closed" }).eq("id", id).eq("owner_id", auth.profile.id).select("id").maybeSingle();
  if (error || !data) return { error: "Only the room owner can close this room." };
  return { success: true };
}

export async function challengeUser(usernameValue, gameIdValue, gameNameValue) {
  const auth = await currentAccount();
  if (auth.error) return { error: auth.error };
  const username = cleanText(usernameValue, 20);
  const gameId = cleanText(gameIdValue, 80);
  const gameName = cleanText(gameNameValue, 80);
  if (!username || !gameId || !gameName) return { error: "Enter a username and choose a game." };
  const { data: target, error: lookupError } = await db.from("profiles").select("id,username").ilike("username", username).limit(2);
  if (lookupError || !target?.length) return { error: "That user could not be found." };
  if (target.length > 1) return { error: "More than one matching username was found. Enter the exact username." };
  if (target[0].id === auth.profile.id) return { error: "You cannot challenge yourself." };
  const { data: challenge, error } = await db.from("game_challenges").insert({ challenger_id: auth.profile.id, challenged_id: target[0].id, game_id: gameId, game_name: gameName }).select("id,challenger_id,challenged_id,game_id,game_name,status,created_at").maybeSingle();
  if (error || !challenge) return { error: "Could not send the challenge." };
  return { challenge, username: target[0].username };
}

export async function listChallenges() {
  const auth = await currentAccount();
  if (auth.error) return { error: auth.error };
  const { data, error } = await db.from("game_challenges").select("id,challenger_id,challenged_id,game_id,game_name,status,challenger_score,challenged_score,created_at,challenger:profiles!game_challenges_challenger_id_fkey(username),challenged:profiles!game_challenges_challenged_id_fkey(username)").or(`challenger_id.eq.${auth.profile.id},challenged_id.eq.${auth.profile.id}`).order("created_at", { ascending: false }).limit(20);
  if (error) return { error: "Could not load challenges." };
  return { challenges: data || [], userId: auth.profile.id };
}

export async function respondToChallenge(challengeId, accept) {
  const auth = await currentAccount();
  if (auth.error) return { error: auth.error };
  const id = cleanText(challengeId, 60);
  const { data, error } = await db.from("game_challenges").update({ status: accept ? "accepted" : "declined", updated_at: new Date().toISOString() }).eq("id", id).eq("challenged_id", auth.profile.id).eq("status", "pending").select("id,status").maybeSingle();
  if (error || !data) return { error: "That challenge is no longer pending or is not addressed to you." };
  return { success: true, status: data.status };
}
