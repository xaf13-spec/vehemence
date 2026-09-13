"use server";

import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLISHABLE_KEY);

async function token() {
  const cookieStore = await cookies();
  return cookieStore.get("vehemence_session")?.value || null;
}

export async function getListings() {
  const p_token = await token();
  if (!p_token) return { error: "You are not logged in." };
  const { data, error } = await supabase.rpc("vehemence_listings", { p_token });
  return error ? { error: "Could not load Marketplace." } : { listings: data || [] };
}

export async function createListing(input) {
  const p_token = await token();
  if (!p_token) return { error: "You are not logged in." };
  const { data, error } = await supabase.rpc("vehemence_create_listing", {
    p_token,
    p_name: input.name,
    p_description: input.description,
    p_price: input.price,
    p_image_url: input.image_url || null
  });
  if (error) return { error: error.message || "Could not create listing." };
  return { listing: data };
}

export async function deleteListing(id) {
  const p_token = await token();
  if (!p_token) return { error: "You are not logged in." };
  const { data, error } = await supabase.rpc("vehemence_delete_listing", {
    p_token,
    p_listing_id: id
  });
  if (error) return { error: error.message || "Could not delete listing." };
  return data || { success: true };
}
