-- Run as postgres. Read-only checks against the staging data, with API-role checks.
begin;
do $$
declare n bigint; expected bigint; sample_netid text; denied boolean;
begin
  select count(*) into expected from public.members where role && array['eboard','advisor','ta'];
  select count(*) into n from public.member_directory;
  if n<>expected then raise exception 'Directory membership changed'; end if;
  if exists(select 1 from public.member_directory d join public.members m using(id)
    where m.role && array['eboard','advisor'] and d.public_email is distinct from
      coalesce(nullif(btrim(m.email),''),case when m.netid like '%@%' then btrim(m.netid) else btrim(m.netid)||'@cornell.edu' end))
  then raise exception 'Leadership contact changed'; end if;
  if exists(select 1 from public.member_directory where not(role && array['eboard','advisor']) and public_email is not null)
  then raise exception 'Non-leadership email exposed'; end if;
  if exists(
    (select m.first_name,m.last_name,m.netid,p.semester,sum(p.points)::bigint from public.members m
      join public.points_tracking p on p.member_id=m.id group by m.id,m.first_name,m.last_name,m.netid,p.semester
      except select * from public.member_leaderboard)
    union all
    (select * from public.member_leaderboard except
      select m.first_name,m.last_name,m.netid,p.semester,sum(p.points)::bigint from public.members m
      join public.points_tracking p on p.member_id=m.id group by m.id,m.first_name,m.last_name,m.netid,p.semester)
  ) then raise exception 'Leaderboard totals changed'; end if;
  select netid into sample_netid from public.members where netid ~ '^[a-z]{2,3}[0-9]+$' limit 1;
  select count(*) into expected from public.member_directory;
  execute 'set local role anon';
  select count(*) into n from public.member_directory;
  if n<>expected then raise exception 'Anonymous directory unavailable'; end if;
  select total_points into n from public.get_public_member_points(upper(sample_netid)||' ', 'fa99');
  if n is distinct from 0::bigint then raise exception 'Known zero-point member lookup failed'; end if;
  select count(*) into n from public.get_public_member_points('definitely-not-a-member', 'fa99');
  if n<>0 then raise exception 'Unknown NetID returned a result'; end if;
  select count(*) into n from public.get_public_member_points(sample_netid, 'invalid-semester');
  if n<>0 then raise exception 'Invalid semester accepted'; end if;
  denied:=false;
  begin perform 1 from public.members limit 1; exception when insufficient_privilege then denied:=true; end;
  if not denied then raise exception 'Anonymous private profile access'; end if;
  denied:=false;
  begin perform 1 from public.points_tracking limit 1; exception when insufficient_privilege then denied:=true; end;
  if not denied then raise exception 'Anonymous ledger access'; end if;
  if has_column_privilege('urmc_public_reader','public.members','auth_user_id','SELECT') then raise exception 'Public view owner can read auth links'; end if;
  if has_table_privilege('anon','public.member_directory','UPDATE') then raise exception 'Directory writable'; end if;
  execute 'reset role';
end $$;
rollback;
select 'PASS: public directory/contact parity, semester totals, zero/unknown lookup, and private table isolation' result;
