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

export async function login(formData) {
  const username = formData.get("username")?.toString().trim();
  const password = formData.get("password")?.toString();

  if (!username || !password) {
    return { error: "Please enter your username and password." };
  }

  const { data: profile, error } = await db()
    .from("profiles")
    .select("id, username, password_hash")
    .eq("username", username)
    .single();

  if (error || !profile) {
    return { error: "Invalid username or password." };
  }

  const passwordHash = createHash("sha256")
    .update(password)
    .digest("hex");

  if (passwordHash !== profile.password_hash) {
    return { error: "Invalid username or password." };
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
    return { error: "Could not create your session." };
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
