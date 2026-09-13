-- Marketplace + account deletion for Vehemence's custom session system.

alter table if exists public.listings enable row level security;

-- Listings belong to Vehemence profiles, not Supabase Auth users.
-- This is safe for the existing listings table created during Marketplace setup.
do $$
begin
  if to_regclass('public.listings') is not null then
    alter table public.listings drop constraint if exists listings_seller_id_fkey;
    alter table public.listings
      add constraint listings_seller_id_fkey
      foreign key (seller_id) references public.profiles(id) on delete cascade;
  end if;
exception when duplicate_object then
  null;
end $$;

revoke all on public.listings from anon, authenticated;

drop policy if exists "Anyone can view listings" on public.listings;
drop policy if exists "Users can create their own listings" on public.listings;
drop policy if exists "Users can delete their own listings" on public.listings;
drop policy if exists "Users can update their own listings" on public.listings;

create or replace function public.vehemence_listings(p_token text)
returns table(
  id uuid,
  seller_id uuid,
  seller_username text,
  name text,
  description text,
  price numeric,
  image_url text,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.vehemence_user_id(p_token) is null then
    raise exception 'not_logged_in';
  end if;

  return query
  select l.id, l.seller_id, l.seller_username, l.name, l.description,
         l.price, l.image_url, l.created_at
  from public.listings l
  order by l.created_at desc;
end;
$$;

create or replace function public.vehemence_create_listing(
  p_token text,
  p_name text,
  p_description text,
  p_price numeric,
  p_image_url text default null
)
returns public.listings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_username text;
  v_listing public.listings;
begin
  v_user_id := public.vehemence_user_id(p_token);
  if v_user_id is null then raise exception 'not_logged_in'; end if;
  if trim(coalesce(p_name, '')) = '' then raise exception 'name_required'; end if;
  if trim(coalesce(p_description, '')) = '' then raise exception 'description_required'; end if;
  if p_price is null or p_price < 0 then raise exception 'invalid_price'; end if;

  select username into v_username from public.profiles where id = v_user_id;
  if v_username is null then raise exception 'account_not_found'; end if;

  insert into public.listings(seller_id, seller_username, name, description, price, image_url)
  values (v_user_id, v_username, trim(p_name), trim(p_description), p_price, nullif(trim(coalesce(p_image_url, '')), ''))
  returning * into v_listing;

  return v_listing;
end;
$$;

create or replace function public.vehemence_delete_listing(p_token text, p_listing_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
begin
  v_user_id := public.vehemence_user_id(p_token);
  if v_user_id is null then raise exception 'not_logged_in'; end if;

  delete from public.listings
  where id = p_listing_id and seller_id = v_user_id;

  if not found then raise exception 'listing_not_found'; end if;
  return jsonb_build_object('success', true);
end;
$$;

create or replace function public.vehemence_delete_account(p_token text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
begin
  v_user_id := public.vehemence_user_id(p_token);
  if v_user_id is null then raise exception 'not_logged_in'; end if;

  delete from public.sessions where user_id = v_user_id;
  delete from public.profiles where id = v_user_id;

  if not found then raise exception 'account_not_found'; end if;
  return jsonb_build_object('success', true);
end;
$$;

grant execute on function public.vehemence_listings(text) to anon, authenticated;
grant execute on function public.vehemence_create_listing(text, text, text, numeric, text) to anon, authenticated;
grant execute on function public.vehemence_delete_listing(text, uuid) to anon, authenticated;
grant execute on function public.vehemence_delete_account(text) to anon, authenticated;
