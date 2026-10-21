"use server";

import { createHash, randomBytes, createCipheriv, createDecipheriv } from "crypto";
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
  const passwordMethod = formData.get("passwordMethod")?.toString() === "recovery" ? "recovery" : "current";
  const currentPassword = formData.get("currentPassword")?.toString();
  const recoveryCode = formData.get("recoveryCode")?.toString().trim().replaceAll("-", "").toUpperCase();
  const newPassword = formData.get("newPassword")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();
  if ((passwordMethod === "current" && !currentPassword) || (passwordMethod === "recovery" && !recoveryCode) || !newPassword || !confirmPassword) return { error: "Please fill in every field." };
  if (passwordMethod === "recovery" && !/^[A-F0-9]{32}$/.test(recoveryCode)) return { error: "That recovery code is incorrect." };
  if (newPassword !== confirmPassword) return { error: "New passwords do not match." };
  if (newPassword.length < 8) return { error: "Your new password must be at least 8 characters." };
  const current = await getSession();
  if (current.error) return { error: current.error };
  const { data: profile } = await supabase.from("profiles").select("password_hash, recovery_code_hash").eq("id", current.session.user_id).single();
  if (!profile) return { error: "Account not found." };
  if (passwordMethod === "current") {
    const currentPasswordHash = createHash("sha256").update(currentPassword).digest("hex");
    if (currentPasswordHash !== profile.password_hash) return { error: "Your current password is incorrect." };
  } else {
    const suppliedRecoveryHash = createHash("sha256").update(recoveryCode).digest("hex");
    if (!profile.recovery_code_hash || suppliedRecoveryHash !== profile.recovery_code_hash) return { error: "That recovery code is incorrect or has already been used." };
  }
  const newPasswordHash = createHash("sha256").update(newPassword).digest("hex");
  const updates = passwordMethod === "recovery"
    ? { password_hash: newPasswordHash, recovery_code_hash: null, recovery_code_encrypted: null }
    : { password_hash: newPasswordHash };
  const { error } = await supabase.from("profiles").update(updates).eq("id", current.session.user_id);
  return error ? { error: "Could not change your password." } : { success: true };
}

export async function deleteAccount() {
  const current = await getSession();
  if (current.error) return { error: current.error };
  const { error } = await supabase.rpc("vehemence_delete_account", { p_token: current.token });
  if (error) return { error: error.message || "Could not delete your account." };
  current.cookieStore.delete("vehemence_session");
  return { success: true };
}


function recoveryEncryptionKey() {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) throw new Error("Recovery encryption is not configured.");
  return createHash("sha256").update(secret).digest();
}

function encryptRecoveryCode(code) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", recoveryEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(code, "utf8"), cipher.final()]);
  return [iv.toString("base64url"), cipher.getAuthTag().toString("base64url"), encrypted.toString("base64url")].join(".");
}

function decryptRecoveryCode(value) {
  const [iv, tag, encrypted] = value.split(".");
  const decipher = createDecipheriv("aes-256-gcm", recoveryEncryptionKey(), Buffer.from(iv, "base64url"));
  decipher.setAuthTag(Buffer.from(tag, "base64url"));
  return Buffer.concat([decipher.update(Buffer.from(encrypted, "base64url")), decipher.final()]).toString("utf8");
}

export async function getRecoveryCodeStatus() {
  const current = await getSession();
  if (current.error) return { error: current.error };
  const { data: profile, error } = await supabase.from("profiles").select("recovery_code_hash, recovery_code_encrypted").eq("id", current.session.user_id).single();
  if (error || !profile) return { error: "Could not load recovery code settings." };
  let recoveryCode = null;
  if (profile.recovery_code_encrypted) {
    try { recoveryCode = decryptRecoveryCode(profile.recovery_code_encrypted); }
    catch { return { error: "Could not read your saved recovery code. Generate a new one." }; }
  }
  return { hasRecoveryCode: Boolean(profile.recovery_code_hash), recoveryCode };
}

export async function generateRecoveryCode() {
  const current = await getSession();
  if (current.error) return { error: current.error };
  const { data: profile } = await supabase.from("profiles").select("id").eq("id", current.session.user_id).single();
  if (!profile) return { error: "Account not found." };
  const raw = randomBytes(16).toString("hex").toUpperCase();
  const recoveryCode = raw.match(/.{1,8}/g).join("-");
  const recoveryCodeHash = createHash("sha256").update(raw).digest("hex");
  let recoveryCodeEncrypted;
  try { recoveryCodeEncrypted = encryptRecoveryCode(recoveryCode); }
  catch { return { error: "Recovery code storage is not configured. Please try again later." }; }
  const { error } = await supabase.from("profiles").update({ recovery_code_hash: recoveryCodeHash, recovery_code_encrypted: recoveryCodeEncrypted }).eq("id", current.session.user_id);
  if (error) return { error: "Could not save your recovery code." };
  return { success: true, recoveryCode };
}
