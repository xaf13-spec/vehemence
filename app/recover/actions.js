"use server";

import { createHash, timingSafeEqual } from "crypto";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL?.replace(/\/rest\/v1\/?$/, "");
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const db = url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;

export async function recoverAccount(formData) {
  if (!db) return { error: "Account recovery is not configured right now." };
  const username = formData.get("username")?.toString().trim();
  const code = formData.get("recoveryCode")?.toString().trim().replaceAll("-", "").toUpperCase();
  const password = formData.get("newPassword")?.toString();
  const confirm = formData.get("confirmPassword")?.toString();
  if (!username || !code || !password || !confirm) return { error: "Please fill in every field." };
  if (!/^[A-F0-9]{32}$/.test(code)) return { error: "The username or recovery code is incorrect." };
  if (password.length < 8) return { error: "Your new password must be at least 8 characters." };
  if (password !== confirm) return { error: "New passwords do not match." };

  const { data: profile, error } = await db.from("profiles").select("id, recovery_code_hash").eq("username", username).maybeSingle();
  if (error || !profile?.recovery_code_hash) return { error: "The username or recovery code is incorrect." };
  const supplied = Buffer.from(createHash("sha256").update(code).digest("hex"), "hex");
  const stored = Buffer.from(profile.recovery_code_hash, "hex");
  if (stored.length !== supplied.length || !timingSafeEqual(stored, supplied)) return { error: "The username or recovery code is incorrect." };

  const passwordHash = createHash("sha256").update(password).digest("hex");
  const { error: updateError } = await db.from("profiles").update({ password_hash: passwordHash, recovery_code_hash: null }).eq("id", profile.id);
  if (updateError) return { error: "Could not reset your password. Please try again." };
  await db.from("sessions").delete().eq("user_id", profile.id);
  return { success: true };
}
