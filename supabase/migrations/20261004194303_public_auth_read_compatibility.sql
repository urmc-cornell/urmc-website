-- Preserve existing public contact links without exposing email for ordinary members.
grant select (email) on public.members to urmc_public_reader;
create or replace view public.member_directory with (security_barrier = true) as
  select id, netid, first_name, last_name, role, position, major, graduation_year,
    bio, headshot_url, secondary_headshot_url, linkedin_url, instagram_url, ask_about,
    course, office_hours, review_sessions, ta_semester,
    case when role && array['eboard','advisor']::text[]
      then coalesce(nullif(btrim(email), ''),
        case when netid like '%@%' then btrim(netid) else btrim(netid)||'@cornell.edu' end)
      else null end as public_email
  from public.members where role && array['eboard','advisor','ta']::text[];

-- A lookup must distinguish a known member with zero points from an unknown NetID.
-- Only returns a public semester total, never ledger entries or private profile fields.
create function public.get_public_member_points(p_netid text, p_semester text)
returns table (netid text, total_points bigint)
language sql stable security definer set search_path = '' as $$
  select m.netid, coalesce(sum(p.points), 0)::bigint
  from public.members m left join public.points_tracking p
    on p.member_id=m.id and p.semester=p_semester
  where m.netid=lower(btrim(p_netid)) and p_semester ~ '^(sp|su|fa)[0-9]{2}$'
  group by m.id, m.netid;
$$;
grant create on schema public to urmc_public_reader;
alter function public.get_public_member_points(text,text) owner to urmc_public_reader;
revoke create on schema public from urmc_public_reader;
revoke all on function public.get_public_member_points(text,text) from public, anon, authenticated;
grant execute on function public.get_public_member_points(text,text) to anon, authenticated, service_role;
comment on view public.member_directory is 'Public directory; public_email preserves existing leadership contacts only. No auth links or private member contact data.';
comment on function public.get_public_member_points(text,text) is 'Intentional anonymous semester-total lookup; restricted non-login owner, no detailed ledger access.';
notify pgrst, 'reload schema';
