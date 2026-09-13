"use server";

import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PUBLISHABLE_KEY
);

const admin = process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )
  : null;

const db = () => admin || supabase;

export async function signup(formData) {
  const username = formData.get("username")?.toString().trim();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();

  if (!username || !password || !confirmPassword) {
    return { error: "Please fill in every field." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  if (username.length < 3) {
    return { error: "Username must be at least 3 characters." };
  }

  if (username.length > 20) {
    return { error: "Username must be 20 characters or less." };
  }

  const passwordHash = createHash("sha256")
    .update(password)
    .digest("hex");

  const { data: profile, error } = await db()
    .from("profiles")
    .insert({
      username,
      password_hash: passwordHash,
      rules_accepted: true
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { error: "That username is already taken." };
    }

    return { error: error.message };
  }

  const token = randomBytes(32).toString("hex");

  const { error: sessionError } = await db()
    .from("sessions")
    .insert({
      user_id: profile.id,
      token,
      expires_at: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString()
    });

  if (sessionError) {
    return { error: "Account created, but the session could not be created." };
  }

  const cookieStore = await cookies();

  cookieStore.set("vehemence_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60
  });

  return { success: true };
}
