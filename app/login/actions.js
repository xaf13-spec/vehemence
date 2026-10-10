"use server";

import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL?.replace(/\\/rest\\/v1\\/?$/, "");
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false, autoRefreshToken: false } })
  : null;

export async function login(formData) {
  try {
    if (!supabase) {
      return { error: "Database connection is not configured. Add SUPABASE_SERVICE_ROLE_KEY as a private environment variable in Vercel, and check SUPABASE_URL." };
    }

    const username = formData.get("username")?.toString().trim();
    const password = formData.get("password")?.toString();
    if (!username || !password) return { error: "Please enter your username and password." };

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, username, password_hash")
      .eq("username", username)
      .single();

    if (error || !profile) return { error: "Invalid username or password." };

    const passwordHash = createHash("sha256").update(password).digest("hex");
    if (passwordHash !== profile.password_hash) return { error: "Invalid username or password." };

    const token = randomBytes(32).toString("hex");
    const { error: sessionError } = await supabase.from("sessions").insert({
      user_id: profile.id,
      token,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });

    if (sessionError) {
      console.error("Login session insert failed:", sessionError);
      return { error: "Could not create your session. Check the sessions table schema." };
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
    console.error("Login failed:", error);
    return { error: "Login hit a server/database error. Check the Vercel function logs for the exact cause." };
  }
}
