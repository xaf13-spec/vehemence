```js
"use server";

import { createClient } from "@supabase/supabase-js";

export async function signup(formData) {
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

  const supabaseUrl = process.env.SUPABASE_URL?.trim();
  const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!supabaseUrl || !supabaseKey) {
    return { error: "Supabase configuration is missing." };
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    const email = username.toLowerCase() + "@vehemence.local";

    const { data, error } = await supabase.auth.signUp({
      email,
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
  } catch (error) {
    console.error("Signup error:", error);

    return {
      error: error instanceof Error
        ? error.message
        : "Something went wrong while creating your account."
    };
  }
}
```
