"use server";

import { createHash, randomBytes } from "crypto";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL?.replace(/\/rest\/v1\/?$/, "");
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const db = url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;

async function sendEmail(to, subject, html) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || "Vehemence <onboarding@resend.dev>";
  if (!apiKey) return { error: "Email sending isn't configured yet. Add RESEND_API_KEY in Vercel's private environment variables." };
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject, html })
  });
  if (!response.ok) {
    console.error("Resend email failed:", response.status, await response.text());
    return { error: "The email couldn't be sent. Check Resend's sender/domain setup and Vercel logs." };
  }
  return { success: true };
}

export async function signupEmail(formData) {
  if (!db) return { error: "Database connection is not configured." };
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const rulesAccepted = formData.get("rulesAccepted")?.toString() === "accepted";
  if (!rulesAccepted) return { error: "You must accept the Vehemence rules first." };
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return { error: "Enter a valid email address." };

  const { data: existing, error: lookupError } = await db.from("profiles").select("id").ilike("email", email).maybeSingle();
  if (lookupError) return { error: "Couldn't check that email right now. Please try again." };
  if (existing) return { error: "That email is already linked to an account. Try logging in by email." };

  const token = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const username = `email_${randomBytes(6).toString("hex")}`;
  const { data: profile, error } = await db.from("profiles").insert({
    username,
    password_hash: createHash("sha256").update(randomBytes(48).toString("hex")).digest("hex"),
    rules_accepted: true,
    email,
    email_verified: false,
    email_verification_token_hash: tokenHash,
    email_verification_expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString()
  }).select("id").single();

  if (error || !profile) {
    console.error("Email signup profile insert failed:", error);
    if (error?.code === "23505") return { error: "That email or generated account identifier is already in use. Try again." };
    return { error: "Couldn't create the email account. Please try again." };
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://vehemenceunb.vercel.app";
  const verifyUrl = `${origin}/email/verify?token=${token}&email=${encodeURIComponent(email)}`;
  const sent = await sendEmail(email, "Verify your Vehemence email", `<div style="font-family:Arial,sans-serif;line-height:1.6"><h2>verify your email</h2><p>Click below to verify your Vehemence account. This link expires in 30 minutes.</p><p><a href="${verifyUrl}">verify email</a></p><p>If you didn't request this, you can ignore this email.</p></div>`);
  if (sent.error) {
    await db.from("profiles").delete().eq("id", profile.id);
    return sent;
  }
  return { success: true };
}

export async function requestEmailLogin(formData) {
  if (!db) return { error: "Database connection is not configured." };
  const email = formData.get("email")?.toString().trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return { error: "Enter a valid email address." };
  const { data: profile, error } = await db.from("profiles").select("id, email_verified").ilike("email", email).maybeSingle();
  // Keep the response generic to avoid revealing which emails have accounts.
  if (error) return { error: "Couldn't process that request right now. Please try again." };
  if (profile?.email_verified) {
    const token = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const { error: updateError } = await db.from("profiles").update({
      password_reset_token_hash: tokenHash,
      password_reset_expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString()
    }).eq("id", profile.id);
    if (updateError) return { error: "Couldn't prepare the sign-in link. Please try again." };
    const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://vehemenceunb.vercel.app";
    const loginUrl = `${origin}/email/verify?token=${token}&email=${encodeURIComponent(email)}&mode=login`;
    const sent = await sendEmail(email, "Your Vehemence sign-in link", `<div style="font-family:Arial,sans-serif;line-height:1.6"><h2>sign in to vehemence</h2><p>This link expires in 15 minutes and can only be used once.</p><p><a href="${loginUrl}">sign in</a></p><p>If you didn't request this, you can ignore this email.</p></div>`);
    if (sent.error) return sent;
  }
  return { success: true };
}
