```js
"use server";

import { createHash } from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PUBLISHABLE_KEY
);

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

  const passwordHash = createHash("sha256")
    .update(password)
    .digest("hex");

  const { error } = await supabase
    .from("profiles")
    .insert({
      username,
      password_hash: passwordHash
    });

  if (error) {
    if (error.code === "23505") {
      return { error: "That username is already taken." };
    }

    return { error: error.message };
  }

  return { success: true };
}
```
