create or replace function public.vehemence_user_id(p_token text)
returns uuid
language sql
security definer
set search_path = public
as $$
  select s.user_id
  from public.sessions s
  where s.token = p_token
    and s.expires_at > now()
  limit 1;
$$;

create or replace function public.vehemence_search_users(p_token text, p_query text)
returns table(id uuid, username text, created_at timestamptz)
language sql
security definer
set search_path = public
as $$
  select p.id, p.username, p.created_at
  from public.profiles p
  where p.username ilike ('%' || trim(p_query) || '%')
    and p.id <> public.vehemence_user_id(p_token)
  order by p.username
  limit 20;
$$;

create or replace function public.vehemence_social_data(p_token text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_friends jsonb;
  v_incoming jsonb;
  v_outgoing jsonb;
begin
  v_user_id := public.vehemence_user_id(p_token);
  if v_user_id is null then
    raise exception 'not_logged_in';
  end if;

  select coalesce(jsonb_agg(x.obj order by x.created_at desc), '[]'::jsonb)
  into v_friends
  from (
    select f.created_at,
      jsonb_build_object(
        'id', f.id,
        'username', p.username,
        'created_at', p.created_at,
        'online', coalesce(a.last_seen_at > now() - interval '2 minutes', false),
        'last_game', a.last_game,
        'last_game_at', a.last_game_at
      ) as obj
    from public.friendships f
    join public.profiles p on p.id = case when f.requester_id = v_user_id then f.addressee_id else f.requester_id end
    left join public.user_activity a on a.user_id = p.id
    where f.status = 'accepted'
      and (f.requester_id = v_user_id or f.addressee_id = v_user_id)
  ) x;

  select coalesce(jsonb_agg(x.obj order by x.created_at desc), '[]'::jsonb)
  into v_incoming
  from (
    select f.created_at,
      jsonb_build_object(
        'id', f.id,
        'username', p.username,
        'created_at', p.created_at,
        'online', coalesce(a.last_seen_at > now() - interval '2 minutes', false),
        'last_game', a.last_game,
        'last_game_at', a.last_game_at
      ) as obj
    from public.friendships f
    join public.profiles p on p.id = f.requester_id
    left join public.user_activity a on a.user_id = p.id
    where f.status = 'pending' and f.addressee_id = v_user_id
  ) x;

  select coalesce(jsonb_agg(x.obj order by x.created_at desc), '[]'::jsonb)
  into v_outgoing
  from (
    select f.created_at,
      jsonb_build_object(
        'id', f.id,
        'username', p.username,
        'created_at', p.created_at,
        'online', coalesce(a.last_seen_at > now() - interval '2 minutes', false),
        'last_game', a.last_game,
        'last_game_at', a.last_game_at
      ) as obj
    from public.friendships f
    join public.profiles p on p.id = f.addressee_id
    left join public.user_activity a on a.user_id = p.id
    where f.status = 'pending' and f.requester_id = v_user_id
  ) x;

  return jsonb_build_object('friends', v_friends, 'incoming', v_incoming, 'outgoing', v_outgoing);
end;
$$;

create or replace function public.vehemence_send_friend_request(p_token text, p_username text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_target public.profiles;
  v_existing public.friendships;
  v_result jsonb;
begin
  v_user_id := public.vehemence_user_id(p_token);
  if v_user_id is null then
    raise exception 'not_logged_in';
  end if;

  select * into v_target
  from public.profiles
  where lower(username) = lower(trim(p_username))
  limit 1;

  if v_target.id is null then
    raise exception 'user_not_found';
  end if;

  if v_target.id = v_user_id then
    raise exception 'cannot_add_self';
  end if;

  select * into v_existing
  from public.friendships
  where (requester_id = v_user_id and addressee_id = v_target.id)
     or (requester_id = v_target.id and addressee_id = v_user_id)
  limit 1;

  if v_existing.id is not null then
    if v_existing.status = 'accepted' then
      raise exception 'already_friends';
    end if;

    if v_existing.requester_id = v_target.id and v_existing.addressee_id = v_user_id then
      update public.friendships set status = 'accepted' where id = v_existing.id;
      return jsonb_build_object('success', true, 'accepted', true);
    end if;

    raise exception 'request_exists';
  end if;

  insert into public.friendships(requester_id, addressee_id, status)
  values (v_user_id, v_target.id, 'pending');

  return jsonb_build_object('success', true);
end;
$$;

create or replace function public.vehemence_respond_friend_request(p_token text, p_friendship_id bigint, p_accept boolean)
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

  if p_accept then
    update public.friendships
    set status = 'accepted'
    where id = p_friendship_id and addressee_id = v_user_id and status = 'pending';
    if not found then raise exception 'request_not_found'; end if;
  else
    delete from public.friendships
    where id = p_friendship_id and addressee_id = v_user_id and status = 'pending';
    if not found then raise exception 'request_not_found'; end if;
  end if;

  return jsonb_build_object('success', true);
end;
$$;

create or replace function public.vehemence_remove_friend(p_token text, p_friendship_id bigint)
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

  delete from public.friendships
  where id = p_friendship_id
    and status = 'accepted'
    and (requester_id = v_user_id or addressee_id = v_user_id);

  if not found then raise exception 'friend_not_found'; end if;
  return jsonb_build_object('success', true);
end;
$$;

create or replace function public.vehemence_touch_presence(p_token text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
begin
  v_user_id := public.vehemence_user_id(p_token);
  if v_user_id is null then return jsonb_build_object('success', false); end if;
  insert into public.user_activity(user_id, last_seen_at)
  values (v_user_id, now())
  on conflict (user_id) do update set last_seen_at = now();
  return jsonb_build_object('success', true);
end;
$$;

create or replace function public.vehemence_record_game_activity(p_token text, p_game text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_now timestamptz;
begin
  v_user_id := public.vehemence_user_id(p_token);
  if v_user_id is null then return jsonb_build_object('success', false); end if;
  v_now := now();
  insert into public.user_activity(user_id, last_seen_at, last_game, last_game_at)
  values (v_user_id, v_now, left(coalesce(p_game, ''), 120), v_now)
  on conflict (user_id) do update set last_seen_at = v_now, last_game = excluded.last_game, last_game_at = v_now;
  return jsonb_build_object('success', true);
end;
$$;

grant execute on function public.vehemence_user_id(text) to anon, authenticated;
grant execute on function public.vehemence_search_users(text, text) to anon, authenticated;
grant execute on function public.vehemence_social_data(text) to anon, authenticated;
grant execute on function public.vehemence_send_friend_request(text, text) to anon, authenticated;
grant execute on function public.vehemence_respond_friend_request(text, bigint, boolean) to anon, authenticated;
grant execute on function public.vehemence_remove_friend(text, bigint) to anon, authenticated;
grant execute on function public.vehemence_touch_presence(text) to anon, authenticated;
grant execute on function public.vehemence_record_game_activity(text, text) to anon, authenticated;
