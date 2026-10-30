"use server";

import { randomBytes } from "crypto";
import { createClient } from "@supabase/supabase-js";
import { getCurrentUser } from "../../lib/auth";

const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });

export async function getNotes() {
  const user = await getCurrentUser();
  if (!user) return { error: "Sign in to use notes." };
  const { data, error } = await db.from("notes").select("id,title,content,pinned,created_at,updated_at").eq("owner_id", user.id).order("updated_at", { ascending: false });
  if (error) return { error: "Could not load your notes." };
  return { notes: data || [] };
}

export async function createNote() {
  const user = await getCurrentUser();
  if (!user) return { error: "Sign in to use notes." };
  const { data, error } = await db.from("notes").insert({ owner_id: user.id, title: "untitled", content: "" }).select("id,title,content,pinned,created_at,updated_at").single();
  if (error) return { error: "Could not create a note." };
  return { note: data };
}

export async function updateNote(id, values) {
  const user = await getCurrentUser();
  if (!user) return { error: "Sign in to use notes." };
  if (typeof id !== "string" || !/^[0-9a-f-]{36}$/i.test(id)) return { error: "Invalid note." };
  const title = String(values?.title ?? "untitled").slice(0, 160);
  const content = String(values?.content ?? "").slice(0, 100000);
  const { data, error } = await db.from("notes").update({ title, content, updated_at: new Date().toISOString() }).eq("id", id).eq("owner_id", user.id).select("id").maybeSingle();
  if (error || !data) return { error: "Could not save this note." };
  return { success: true };
}

export async function toggleNotePin(id, pinned) {
  const user = await getCurrentUser();
  if (!user) return { error: "Sign in to use notes." };
  const { data, error } = await db.from("notes").update({ pinned: Boolean(pinned), updated_at: new Date().toISOString() }).eq("id", id).eq("owner_id", user.id).select("id").maybeSingle();
  return error || !data ? { error: "Could not update this note." } : { success: true };
}

export async function deleteNote(id) {
  const user = await getCurrentUser();
  if (!user) return { error: "Sign in to use notes." };
  const { error } = await db.from("notes").delete().eq("id", id).eq("owner_id", user.id);
  return error ? { error: "Could not delete this note." } : { success: true };
}

export async function createNoteShare(id) {
  const user = await getCurrentUser();
  if (!user) return { error: "Sign in to share notes." };
  const { data: note } = await db.from("notes").select("id").eq("id", id).eq("owner_id", user.id).maybeSingle();
  if (!note) return { error: "Note not found." };
  const token = randomBytes(24).toString("hex");
  const { error } = await db.from("note_shares").upsert({ note_id: id, owner_id: user.id, share_token: token }, { onConflict: "note_id" });
  if (error) return { error: "Could not create a share link." };
  return { url: `/shared/${token}` };
}

export async function revokeNoteShare(id) {
  const user = await getCurrentUser();
  if (!user) return { error: "Sign in to manage shared notes." };
  const { error } = await db.from("note_shares").delete().eq("note_id", id).eq("owner_id", user.id);
  return error ? { error: "Could not turn off sharing." } : { success: true };
}
