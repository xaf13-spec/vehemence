-- Vehemence RNG: Aura -> Crafting -> Gear -> Luck.
-- Run this after 20260913_rng.sql.

create table if not exists public.rng_gear_inventory (
  user_id uuid not null references public.profiles(id) on delete cascade,
  gear_id text not null,
  quantity integer not null default 0,
  equipped boolean not null default false,
  primary key (user_id, gear_id)
);

alter table public.rng_gear_inventory enable row level security;
revoke all on public.rng_gear_inventory from anon, authenticated;

create or replace function public.vehemence_rng_gear() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('id','basic_charm','name','Basic Luck Charm','tier','I','luck_bonus',0.05,'recipe',jsonb_build_object('common',5)),
    jsonb_build_object('id','rare_detector','name','Rare Detector','tier','II','luck_bonus',0.15,'recipe',jsonb_build_object('uncommon',10,'rare',3)),
    jsonb_build_object('id','legendary_core','name','Legendary Core','tier','III','luck_bonus',0.35,'recipe',jsonb_build_object('epic',5,'legendary',2)),
    jsonb_build_object('id','mythic_relic','name','Mythic Relic','tier','IV','luck_bonus',0.75,'recipe',jsonb_build_object('legendary',10,'mythic',1)),
    jsonb_build_object('id','vehemence_crown','name','Vehemence Crown','tier','V','luck_bonus',1.50,'recipe',jsonb_build_object('vehemence',1,'mythic',3))
  );
$$;

create or replace function public.vehemence_rng_state(p_token text) returns jsonb language plpgsql security definer set search_path=public as $$
declare uid uuid; p record; inv jsonb; gear jsonb; effective_luck numeric;
begin
  uid:=public.vehemence_user_id(p_token);
  if uid is null then return null; end if;
  insert into public.rng_players(user_id) values(uid) on conflict do nothing;
  select * into p from public.rng_players where user_id=uid;
  select coalesce(jsonb_agg(jsonb_build_object('id',i.aura_id,'name',a->>'name','rarity',a->>'rarity','one_in',(a->>'one_in')::int,'quantity',i.quantity,'favorite',i.favorite)),'[]'::jsonb)
    into inv from public.rng_inventory i cross join lateral jsonb_array_elements(public.vehemence_rng_auras()) a
    where i.user_id=uid and a->>'id'=i.aura_id;
  select coalesce(jsonb_agg(jsonb_build_object('id',g.gear_id,'name',d->>'name','tier',d->>'tier','luck_bonus',(d->>'luck_bonus')::numeric,'quantity',g.quantity,'equipped',g.equipped)),'[]'::jsonb)
    into gear from public.rng_gear_inventory g cross join lateral jsonb_array_elements(public.vehemence_rng_gear()) d
    where g.user_id=uid and d->>'id'=g.gear_id;
  select p.luck + coalesce(sum(case when g.equipped then (d->>'luck_bonus')::numeric else 0 end),0)
    into effective_luck from public.rng_gear_inventory g cross join lateral jsonb_array_elements(public.vehemence_rng_gear()) d
    where g.user_id=uid and d->>'id'=g.gear_id;
  return jsonb_build_object('rolls',p.rolls,'pity',p.pity,'luck',effective_luck,'base_luck',p.luck,'equipped',p.equipped_aura,'inventory',inv,'gear',gear,'auras',public.vehemence_rng_auras(),'gear_defs',public.vehemence_rng_gear());
end; $$;

create or replace function public.vehemence_rng_roll(p_token text) returns jsonb language plpgsql security definer set search_path=public as $$
declare uid uuid; p record; aura jsonb; next_pity integer; roll_luck numeric; inv_qty integer;
begin
  uid:=public.vehemence_user_id(p_token); if uid is null then raise exception 'You are not logged in.'; end if;
  insert into public.rng_players(user_id) values(uid) on conflict do nothing;
  select * into p from public.rng_players where user_id=uid for update;
  next_pity:=p.pity+1;
  select p.luck + coalesce(sum(case when g.equipped then (d->>'luck_bonus')::numeric else 0 end),0)
    into roll_luck from public.rng_gear_inventory g cross join lateral jsonb_array_elements(public.vehemence_rng_gear()) d
    where g.user_id=uid and d->>'id'=g.gear_id;
  if next_pity>=10 then roll_luck:=roll_luck*2; next_pity:=0; end if;
  aura:=public.vehemence_rng_pick(roll_luck);
  insert into public.rng_inventory(user_id,aura_id,quantity) values(uid,aura->>'id',1)
    on conflict(user_id,aura_id) do update set quantity=public.rng_inventory.quantity+1;
  update public.rng_players set rolls=p.rolls+1,pity=next_pity,updated_at=now() where user_id=uid;
  select quantity into inv_qty from public.rng_inventory where user_id=uid and aura_id=aura->>'id';
  return jsonb_build_object('aura',aura,'quantity',inv_qty,'show_cutscene',coalesce((aura->>'one_in')::bigint,0)>=1000000,'state',public.vehemence_rng_state(p_token));
end; $$;

create or replace function public.vehemence_rng_craft(p_token text,p_gear_id text) returns jsonb language plpgsql security definer set search_path=public as $$
declare uid uuid; recipe jsonb; ingredient jsonb; aura_id text; need_qty integer; have_qty integer;
begin
  uid:=public.vehemence_user_id(p_token); if uid is null then raise exception 'You are not logged in.'; end if;
  select d->'recipe' into recipe from jsonb_array_elements(public.vehemence_rng_gear()) d where d->>'id'=p_gear_id;
  if recipe is null then raise exception 'Unknown gear.'; end if;
  for ingredient in select * from jsonb_each(recipe) loop
    aura_id:=ingredient.key; need_qty:=ingredient.value::text::int;
    select quantity into have_qty from public.rng_inventory where user_id=uid and aura_id=aura_id;
    if coalesce(have_qty,0)<need_qty then raise exception 'Not enough % to craft this gear.', aura_id; end if;
  end loop;
  for ingredient in select * from jsonb_each(recipe) loop
    aura_id:=ingredient.key; need_qty:=ingredient.value::text::int;
    update public.rng_inventory set quantity=quantity-need_qty where user_id=uid and aura_id=aura_id;
    delete from public.rng_inventory where user_id=uid and aura_id=aura_id and quantity<=0;
  end loop;
  insert into public.rng_gear_inventory(user_id,gear_id,quantity) values(uid,p_gear_id,1)
    on conflict(user_id,gear_id) do update set quantity=public.rng_gear_inventory.quantity+1;
  return jsonb_build_object('success',true,'gear_id',p_gear_id);
end; $$;

create or replace function public.vehemence_rng_equip_gear(p_token text,p_gear_id text) returns jsonb language plpgsql security definer set search_path=public as $$
declare uid uuid; q integer;
begin
  uid:=public.vehemence_user_id(p_token); if uid is null then raise exception 'You are not logged in.'; end if;
  select quantity into q from public.rng_gear_inventory where user_id=uid and gear_id=p_gear_id;
  if coalesce(q,0)<1 then raise exception 'You have not crafted that gear.'; end if;
  update public.rng_gear_inventory set equipped=false where user_id=uid;
  update public.rng_gear_inventory set equipped=true where user_id=uid and gear_id=p_gear_id;
  return jsonb_build_object('success',true,'gear_id',p_gear_id);
end; $$;

drop function if exists public.vehemence_rng_sacrifice(text,text,integer);
grant execute on function public.vehemence_rng_state(text) to anon, authenticated;
grant execute on function public.vehemence_rng_roll(text) to anon, authenticated;
grant execute on function public.vehemence_rng_craft(text,text) to anon, authenticated;
grant execute on function public.vehemence_rng_equip_gear(text,text) to anon, authenticated;
