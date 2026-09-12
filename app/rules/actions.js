"use server";

import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
process.env.SUPABASE_URL,
process.env.SUPABASE_PUBLISHABLE_KEY
);

export async function acceptRules() {
const cookieStore = await cookies();
const token = cookieStore.get("vehemence_session")?.value;

if (!token) {
return { error: "You need to be logged in." };
}

const { data: session } = await supabase
.from("sessions")
.select("user_id, expires_at")
.eq("token", token)
.single();

if (!session || new Date(session.expires_at) <= new Date()) {
return { error: "Your session has expired." };
}

const { error } = await supabase
.from("profiles")
.update({ rules_accepted: true })
.eq("id", session.user_id);

if (error) {
return { error: "Could not save your rules acceptance." };
}

return { success: true };
}
