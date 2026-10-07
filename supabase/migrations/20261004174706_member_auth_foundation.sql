-- Staging first. Do not promote until public website reads use the published APIs.
-- Existing member IDs, points and profile values are preserved.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated, service_role;

alter table public.members add column auth_user_id uuid
  unique references auth.users(id) on delete set null;
-- Refuse ambiguous normalized identities without rewriting existing NetIDs.
create unique index members_canonical_netid_key
  on public.members (lower(btrim(netid)))
  where lower(btrim(netid)) ~ '^[a-z]{2,3}[0-9]+$';
create index if not exists points_tracking_member_semester_idx
  on public.points_tracking(member_id, semester);

-- Read provider-owned identity_data, never editable raw_user_meta_data/JWT metadata.
-- A verified Cornell mailbox establishes identity, not current student status.
create function private.verified_cornell_netid(p_user_id uuid) returns text
language sql stable security definer set search_path = '' as $$
  select split_part(lower(i.identity_data->>'email'), '@', 1)
  from auth.users u join auth.identities i on i.user_id = u.id
  where u.id = p_user_id and i.provider = 'google'
    and i.identity_data->>'email_verified' = 'true'
    and lower(i.identity_data->>'email') ~ '^[a-z]{2,3}[0-9]+@cornell[.]edu$'
    and lower(u.email) = lower(i.identity_data->>'email')
    and u.email_confirmed_at is not null
    and u.deleted_at is null and not coalesce(u.is_anonymous, false)
    and (u.banned_until is null or u.banned_until <= now())
  order by i.id limit 1;
$$;
revoke all on function private.verified_cornell_netid(uuid) from public, anon, authenticated;

create function private.link_member_for_auth_user(p_user_id uuid) returns uuid
language plpgsql security definer set search_path = '' as $$
declare v_netid text; v_member_id uuid; v_owner uuid;
begin
  -- Serialize attempts for the same account; the member lock also prevents claims
  -- from different accounts from racing. Unmatched accounts get no private data.
  perform 1 from auth.users where id = p_user_id for update;
  v_netid := private.verified_cornell_netid(p_user_id);
  if v_netid is null then return null; end if;
  select id, auth_user_id into v_member_id, v_owner from public.members
    where lower(btrim(netid)) = v_netid
      and lower(btrim(netid)) ~ '^[a-z]{2,3}[0-9]+$' for update;
  if v_member_id is null then return null; end if;
  if v_owner is not null and v_owner <> p_user_id then
    raise exception 'This member identity requires administrator review.' using errcode = '23505';
  end if;
  if exists (select 1 from public.members where auth_user_id = p_user_id and id <> v_member_id) then
    raise exception 'This account is already linked to a member.' using errcode = '23505';
  end if;
  if v_owner is null then
    update public.members set auth_user_id = p_user_id where id = v_member_id;
  end if;
  return v_member_id;
end;
$$;
revoke all on function private.link_member_for_auth_user(uuid) from public, anon, authenticated;

create function private.link_member_after_identity() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.provider = 'google' then
    perform private.link_member_for_auth_user(new.user_id);
  end if;
  return new;
end;
$$;
create function private.link_member_after_confirmation() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.email_confirmed_at is not null then
    perform private.link_member_for_auth_user(new.id);
  end if;
  return new;
end;
$$;
revoke all on function private.link_member_after_identity() from public, anon, authenticated;
revoke all on function private.link_member_after_confirmation() from public, anon, authenticated;
create trigger urmc_link_google_identity after insert or update of identity_data
  on auth.identities for each row execute function private.link_member_after_identity();
create trigger urmc_link_confirmed_user after update of email_confirmed_at
  on auth.users for each row execute function private.link_member_after_confirmation();

-- Optional retry after the future callback code exchange. No caller-chosen IDs.
create function public.link_my_member() returns uuid
language plpgsql security definer set search_path = '' as $$
declare v_uid uuid := auth.uid();
begin
  if v_uid is null then raise exception 'Authentication required.' using errcode = '42501'; end if;
  return private.link_member_for_auth_user(v_uid);
end;
$$;
revoke all on function public.link_my_member() from public, anon, authenticated;
grant execute on function public.link_my_member() to authenticated;

create function private.current_member_id() returns uuid
language sql stable security definer set search_path = '' as $$
  select m.id from public.members m
  where auth.uid() is not null and m.auth_user_id = auth.uid()
    and lower(btrim(m.netid)) = private.verified_cornell_netid(auth.uid());
$$;
revoke all on function private.current_member_id() from public, anon, authenticated;
grant execute on function private.current_member_id() to authenticated;

-- Signup filter: Supabase passes trusted app_metadata. Verification for ownership
-- happens separately against auth.identities after the provider response is stored.
create function public.before_user_created_cornell(event jsonb) returns jsonb
language plpgsql set search_path = '' as $$
begin
  if coalesce(event->'user'->'app_metadata'->>'provider', '') <> 'google'
     or coalesce(lower(event->'user'->>'email'), '') !~ '^[a-z]{2,3}[0-9]+@cornell[.]edu$'
     or coalesce(event->'user'->>'is_anonymous', 'false') <> 'false' then
    return jsonb_build_object('error', jsonb_build_object('http_code', 403,
      'message', 'Please sign in with your Cornell NetID Google account.'));
  end if;
  return '{}'::jsonb;
end;
$$;
revoke all on function public.before_user_created_cornell(jsonb) from public, anon, authenticated;
grant usage on schema public to supabase_auth_admin;
grant execute on function public.before_user_created_cornell(jsonb) to supabase_auth_admin;

-- Replace, rather than combine with, permissive legacy policies.
do $$ declare p record; begin
  for p in select tablename, policyname from pg_policies
    where schemaname = 'public' and tablename in ('members','points_tracking','events')
  loop execute format('drop policy %I on public.%I', p.policyname, p.tablename); end loop;
end $$;
alter table public.members enable row level security;
alter table public.points_tracking enable row level security;
alter table public.events enable row level security;
revoke all on public.members, public.points_tracking, public.events from public, anon, authenticated;
-- Revoke any legacy column grants as well as table grants.
do $$ declare c record; begin
  for c in select table_name, column_name from information_schema.columns
    where table_schema='public' and table_name in ('members','points_tracking','events')
  loop
    execute format('revoke select (%I), insert (%I), update (%I), references (%I) on public.%I from public, anon, authenticated',
      c.column_name,c.column_name,c.column_name,c.column_name,c.table_name);
  end loop;
end $$;
grant select on public.members, public.points_tracking to authenticated;
grant select on public.events to anon, authenticated;
grant all on public.members, public.points_tracking, public.events to service_role;
create policy members_read_own on public.members for select to authenticated
  using (id = (select private.current_member_id()));
create policy points_read_own on public.points_tracking for select to authenticated
  using (member_id = (select private.current_member_id()));
create policy events_public_read on public.events for select to anon, authenticated using (true);

-- Explicit publication boundary. A non-login, non-BYPASSRLS view owner gets only
-- the columns needed by these public projections. It is NOT granted to API roles.
create role urmc_public_reader nologin nosuperuser nocreatedb nocreaterole noinherit nobypassrls;
grant urmc_public_reader to postgres;
grant usage on schema public to urmc_public_reader;
grant select (id, netid, first_name, last_name, role, position, major, graduation_year,
  bio, headshot_url, secondary_headshot_url, linkedin_url, instagram_url, ask_about,
  course, office_hours, review_sessions, ta_semester) on public.members to urmc_public_reader;
grant select (member_id, points, semester) on public.points_tracking to urmc_public_reader;
create policy members_public_projection on public.members for select to urmc_public_reader using (true);
create policy points_public_projection on public.points_tracking for select to urmc_public_reader using (true);

-- Definer views are intentional here: private tables remain inaccessible to anon.
-- Never SELECT * or add private contact/auth columns to these projections.
create view public.member_directory with (security_barrier = true) as
  select id, netid, first_name, last_name, role, position, major, graduation_year,
    bio, headshot_url, secondary_headshot_url, linkedin_url, instagram_url, ask_about,
    course, office_hours, review_sessions, ta_semester
  from public.members where role && array['eboard','advisor','ta']::text[];
create view public.member_leaderboard with (security_barrier = true) as
  select m.first_name, m.last_name, m.netid, p.semester, sum(p.points)::bigint total_points
  from public.members m join public.points_tracking p on p.member_id = m.id
  group by m.id, m.first_name, m.last_name, m.netid, p.semester;
-- Ownership transfer requires CREATE temporarily, then it is removed.
grant create on schema public to urmc_public_reader;
alter view public.member_directory owner to urmc_public_reader;
alter view public.member_leaderboard owner to urmc_public_reader;
revoke create on schema public from urmc_public_reader;
revoke all on public.member_directory, public.member_leaderboard from public, anon, authenticated;
grant select on public.member_directory, public.member_leaderboard to anon, authenticated, service_role;
comment on view public.member_directory is 'Intentional public directory projection; restricted non-login owner, no private contact or auth fields.';
comment on view public.member_leaderboard is 'Intentional public semester totals only; restricted non-login owner, no points ledger details.';

do $$ begin
  if to_regclass('public.summed_points') is not null then
    execute 'revoke all on public.summed_points from public, anon, authenticated';
  end if;
end $$;
notify pgrst, 'reload schema';
