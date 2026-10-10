"use server";

import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL?.replace(/\\/rest\\/v1\\/?$/, "");
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false, autoRefreshToken: false } })
  : null;

export async function signup(formData) {
  try {
    if (!supabase) {
      return { error: "Database connection is not configured. Add SUPABASE_SERVICE_ROLE_KEY as a private environment variable in Vercel, and check SUPABASE_URL." };
    }

    const username = formData.get("username")?.toString().trim();
    const password = formData.get("password")?.toString();
    const confirmPassword = formData.get("confirmPassword")?.toString();

    if (!username || !password || !confirmPassword) return { error: "Please fill in every field." };
    if (password !== confirmPassword) return { error: "Passwords do not match." };
    if (username.length < 3) return { error: "Username must be at least 3 characters." };
    if (username.length > 20) return { error: "Username must be 20 characters or less." };

    const passwordHash = createHash("sha256").update(password).digest("hex");

    const { data: profile, error } = await supabase
      .from("profiles")
      .insert({ username, password_hash: passwordHash, rules_accepted: true })
      .select("id")
      .single();

    if (error) {
      if (error.code === "23505") return { error: "That username is already taken." };
      console.error("Signup profile insert failed:", error);
      return { error: "Could not create account in the database. Check that the profiles table has the expected columns." };
    }

    const token = randomBytes(32).toString("hex");
    const { error: sessionError } = await supabase.from("sessions").insert({
      user_id: profile.id,
      token,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });

    if (sessionError) {
      console.error("Signup session insert failed:", sessionError);
      return { error: "Your account was created, but the sessions table could not create a login session. Check the sessions table schema." };
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
  } catch (error) {
    console.error("Signup failed:", error);
    return { error: "Signup hit a server/database error. Check the Vercel function logs for the exact cause." };
  }
}
