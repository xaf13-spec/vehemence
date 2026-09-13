"use server";

import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLISHABLE_KEY);

async function getToken() {
  const store = await cookies();
  return store.get("vehemence_session")?.value || null;
}

export async function getRngState() {
  const token = await getToken();
  if (!token) return { error: "You are not logged in." };
  const { data, error } = await supabase.rpc("vehemence_rng_state", { p_token: token });
  if (error) return { error: "Could not load RNG data." };
  return { state: data || null };
}

export async function rollRng() {
  const token = await getToken();
  if (!token) return { error: "You are not logged in." };
  const { data, error } = await supabase.rpc("vehemence_rng_roll", { p_token: token });
  if (error) return { error: error.message || "Roll failed." };
  return { result: data };
}

export async function setAuraFavorite(auraId, favorite) {
  const token = await getToken();
  if (!token) return { error: "You are not logged in." };
  const { data, error } = await supabase.rpc("vehemence_rng_favorite", { p_token: token, p_aura_id: auraId, p_favorite: favorite });
  if (error) return { error: error.message || "Could not update favorite." };
  return { result: data };
}

export async function equipAura(auraId) {
  const token = await getToken();
  if (!token) return { error: "You are not logged in." };
  const { data, error } = await supabase.rpc("vehemence_rng_equip", { p_token: token, p_aura_id: auraId });
  if (error) return { error: error.message || "Could not equip aura." };
  return { result: data };
}

export async function sacrificeAura(auraId, quantity) {
  const token = await getToken();
  if (!token) return { error: "You are not logged in." };
  const { data, error } = await supabase.rpc("vehemence_rng_sacrifice", { p_token: token, p_aura_id: auraId, p_quantity: quantity });
  if (error) return { error: error.message || "Could not sacrifice aura." };
  return { result: data };
}
