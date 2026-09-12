"use server";

import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
process.env.SUPABASE_URL,
process.env.SUPABASE_PUBLISHABLE_KEY
);

export async function getCurrentUser() {
const cookieStore = await cookies();
const token = cookieStore.get("vehemence_session")?.value;

if (!token) {
return null;
}

const { data: session } = await supabase
.from("sessions")
.select("user_id, expires_at")
.eq("token", token)
.single();

if (!session) {
return null;
}

if (new Date(session.expires_at) <= new Date()) {
await supabase
.from("sessions")
.delete()
.eq("token", token);

cookieStore.delete("vehemence_session");
return null;

}

const { data: profile } = await supabase
.from("profiles")
.select("id, username, rules_accepted")
.eq("id", session.user_id)
.single();

return profile || null;
}
