"use server";

import { createHash, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL?.replace(/\/rest\/v1\/?$/, "");
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const db = url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;

export async function verifyEmailLink(formData) {
  if (!db) return { error: "Database connection is not configured." };
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const token = formData.get("token")?.toString();
  const mode = formData.get("mode")?.toString() === "login" ? "login" : "verify";
  if (!email || !token || !/^[a-f0-9]{64}$/.test(token)) return { error: "This link is invalid or incomplete." };

  const tokenHash = createHash("sha256").update(token).digest("hex");
  const tokenColumn = mode === "login" ? "password_reset_token_hash" : "email_verification_token_hash";
  const expiryColumn = mode === "login" ? "password_reset_expires_at" : "email_verification_expires_at";
  const { data: profile, error } = await db.from("profiles")
    .select("id, email, email_verified, password_reset_token_hash, password_reset_expires_at, email_verification_token_hash, email_verification_expires_at")
    .ilike("email", email).maybeSingle();
  if (error || !profile) return { error: "This link is invalid or expired. Request a new one." };

  const storedHash = profile[tokenColumn];
  const expiresAt = profile[expiryColumn];
  if (!storedHash || !expiresAt || new Date(expiresAt).getTime() < Date.now()) return { error: "This link is invalid or expired. Request a new one." };
  const supplied = Buffer.from(tokenHash, "hex");
  const stored = Buffer.from(storedHash, "hex");
  if (supplied.length !== stored.length || !timingSafeEqual(supplied, stored)) return { error: "This link is invalid or expired. Request a new one." };

  const updates = mode === "login"
    ? { password_reset_token_hash: null, password_reset_expires_at: null }
    : { email_verified: true, email_verification_token_hash: null, email_verification_expires_at: null };
  const { error: updateError } = await db.from("profiles").update(updates).eq("id", profile.id);
  if (updateError) return { error: "Couldn't finish verifying this account. Please request a new link." };

  const tokenForSession = randomBytes(32).toString("hex");
  const { error: sessionError } = await db.from("sessions").insert({
    user_id: profile.id,
    token: tokenForSession,
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  });
  if (sessionError) {
    console.error("Email login session insert failed:", sessionError);
    return { error: "Your email was verified, but we couldn't start a session. Please log in again." };
  }
  const cookieStore = await cookies();
  cookieStore.set("vehemence_session", tokenForSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60
  });
  return { success: true };
}
