"use server";

import { createClient } from "@supabase/supabase-js";

export async function signup(formData) {
  const username = formData.get("username")?.toString().trim();
  const password = formData.get("password")?.toString();
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

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_PUBLISHABLE_KEY
  );

  const email = username.toLowerCase() + "@vehemence.local";

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password
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
      username: username
    });

  if (profileError) {
    return { error: profileError.message };
  }

  return { success: true };
}
