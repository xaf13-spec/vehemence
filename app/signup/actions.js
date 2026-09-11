"use server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PUBLISHABLE_KEY
);

export async function signup(formData) {
  const username = formData.get("username");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  if (!username || !password || !confirmPassword) {
    return { error: "Please fill in every field." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  if (username.length < 3) {
    return { error: "Username must be at least 3 characters." };
  }

  const { data, error } = await supabase.auth.signUp({
    email: `${username.toLowerCase()}@vehemence.local`,
    password
  });

  if (error) {
    return { error: error.message };
  }

  if (!data.user) {
    return { error: "Could not create your account." };
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .insert({
      id: data.user.id,
      username
    });

  if (profileError) {
    return { error: profileError.message };
  }

  return { success: true };
}
