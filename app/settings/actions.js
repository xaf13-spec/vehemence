"use server";

import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
process.env.SUPABASE_URL,
process.env.SUPABASE_PUBLISHABLE_KEY
);

export async function logout() {
const cookieStore = await cookies();
const token = cookieStore.get("vehemence_session")?.value;

if (token) {
await supabase
.from("sessions")
.delete()
.eq("token", token);
}

cookieStore.delete("vehemence_session");

return { success: true };
}

export async function changeUsername(formData) {
const newUsername = formData.get("username")?.toString().trim();

if (!newUsername) {
return { error: "Please enter a username." };
}

if (newUsername.length < 3) {
return { error: "Username must be at least 3 characters." };
}

if (newUsername.length > 20) {
return { error: "Username must be 20 characters or less." };
}

const cookieStore = await cookies();
const token = cookieStore.get("vehemence_session")?.value;

if (!token) {
return { error: "You are not logged in." };
}

const { data: session } = await supabase
.from("sessions")
.select("user_id, expires_at")
.eq("token", token)
.single();

if (!session || new Date(session.expires_at) <= new Date()) {
return { error: "Your session has expired." };
}

const { data: profile } = await supabase
.from("profiles")
.select("username, last_username_change")
.eq("id", session.user_id)
.single();

if (!profile) {
return { error: "Account not found." };
}

if (profile.username === newUsername) {
return { error: "That is already your username." };
}

if (profile.last_username_change) {
const lastChange = new Date(profile.last_username_change);
const nextChange = new Date(
lastChange.getTime() + 24 * 60 * 60 * 1000
);

if (new Date() < nextChange) {
  const hoursLeft = Math.ceil(
    (nextChange.getTime() - Date.now()) / (60 * 60 * 1000)
  );

  return {
    error: `You can change your username again in about ${hoursLeft} hour${hoursLeft === 1 ? "" : "s"}.`
  };
}

}

const { data: existingUser } = await supabase
.from("profiles")
.select("id")
.eq("username", newUsername)
.maybeSingle();

if (existingUser) {
return { error: "That username is already taken." };
}

const { error } = await supabase
.from("profiles")
.update({
username: newUsername,
last_username_change: new Date().toISOString()
})
.eq("id", session.user_id);

if (error) {
return { error: "Could not change your username." };
}

return { success: true };
}
