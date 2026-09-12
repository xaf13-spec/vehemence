"use server";

import { createHash } from "crypto";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLISHABLE_KEY);

async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("vehemence_session")?.value;
  if (!token) return { error: "You are not logged in." };
  const { data: session } = await supabase.from("sessions").select("user_id, expires_at").eq("token", token).single();
  if (!session || new Date(session.expires_at) <= new Date()) return { error: "Your session has expired." };
  return { cookieStore, token, session };
}

export async function logout() {
  const current = await getSession();
  if (current.error) return { error: current.error };
  await supabase.from("sessions").delete().eq("token", current.token);
  current.cookieStore.delete("vehemence_session");
  return { success: true };
}

export async function logoutEverywhere() {
  const current = await getSession();
  if (current.error) return { error: current.error };
  const { error } = await supabase.from("sessions").delete().eq("user_id", current.session.user_id);
  if (error) return { error: "Could not sign out of all sessions." };
  current.cookieStore.delete("vehemence_session");
  return { success: true };
}

export async function changeUsername(formData) {
  const newUsername = formData.get("username")?.toString().trim();
  if (!newUsername) return { error: "Please enter a username." };
  if (newUsername.length < 3) return { error: "Username must be at least 3 characters." };
  if (newUsername.length > 20) return { error: "Username must be 20 characters or less." };
  const current = await getSession();
  if (current.error) return { error: current.error };
  const { data: profile } = await supabase.from("profiles").select("username, last_username_change").eq("id", current.session.user_id).single();
  if (!profile) return { error: "Account not found." };
  if (profile.username === newUsername) return { error: "That is already your username." };
  if (profile.last_username_change) {
    const nextChange = new Date(new Date(profile.last_username_change).getTime() + 86400000);
    if (new Date() < nextChange) {
      const hoursLeft = Math.ceil((nextChange.getTime() - Date.now()) / 3600000);
      return { error: `You can change your username again in about ${hoursLeft} hour${hoursLeft === 1 ? "" : "s"}.` };
    }
  }
  const { data: existingUser } = await supabase.from("profiles").select("id").eq("username", newUsername).maybeSingle();
  if (existingUser) return { error: "That username is already taken." };
  const { error } = await supabase.from("profiles").update({ username: newUsername, last_username_change: new Date().toISOString() }).eq("id", current.session.user_id);
  return error ? { error: "Could not change your username." } : { success: true };
}

export async function changePassword(formData) {
  const currentPassword = formData.get("currentPassword")?.toString();
  const newPassword = formData.get("newPassword")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();
  if (!currentPassword || !newPassword || !confirmPassword) return { error: "Please fill in every field." };
  if (newPassword !== confirmPassword) return { error: "New passwords do not match." };
  if (newPassword.length < 8) return { error: "Your new password must be at least 8 characters." };
  const current = await getSession();
  if (current.error) return { error: current.error };
  const { data: profile } = await supabase.from("profiles").select("password_hash").eq("id", current.session.user_id).single();
  if (!profile) return { error: "Account not found." };
  const currentPasswordHash = createHash("sha256").update(currentPassword).digest("hex");
  if (currentPasswordHash !== profile.password_hash) return { error: "Your current password is incorrect." };
  const newPasswordHash = createHash("sha256").update(newPassword).digest("hex");
  const { error } = await supabase.from("profiles").update({ password_hash: newPasswordHash }).eq("id", current.session.user_id);
  return error ? { error: "Could not change your password." } : { success: true };
}
