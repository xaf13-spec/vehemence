"use server";

import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/rest\/v1\/?$/, "");
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function signup(formData) {
try {
if (!supabase) return { error: "Database connection is not configured. Check SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY in Vercel." };
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

const { data: profile, error } = await supabase
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

return { error: error.message || "Could not reach the database. Check the Supabase project URL and key in Vercel." };

}

const token = randomBytes(32).toString("hex");

const { error: sessionError } = await supabase
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
} catch (error) {
  console.error("Signup failed:", error);
  return { error: "Could not reach the database. In Vercel, check that SUPABASE_URL is the project URL (not ending in /rest/v1) and SUPABASE_PUBLISHABLE_KEY is correct." };
}
