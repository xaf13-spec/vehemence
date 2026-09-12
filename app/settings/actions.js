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
