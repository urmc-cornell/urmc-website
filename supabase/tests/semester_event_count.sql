-- Run as postgres. Rollback-only; uses the unused fa99 semester so real data is untouched.
begin;
do $$
declare m1 uuid; m2 uuid; n bigint; denied boolean;
begin
  select id into m1 from public.members order by id limit 1;
  select id into m2 from public.members order by id offset 1 limit 1;
  if m2 is null then raise exception 'Needs at least two members'; end if;
  insert into public.points_tracking(member_id,points,semester,reason) values
    (m1,3,'fa99','Event Attendance - GBody #1'),
    (m2,3,'fa99','event attendance - gbody #1 '),
    (m1,1,'fa99','Event Attendance - Study Jam'),
    (m2,1,'fa99','Event Attendance - Workshop'),
    (m1,5,'fa99','Merch raffle'),
    (m1,5,'fa99',null),
    (m1,1,'sp99','Event Attendance - Other Semester');

  execute 'set local role authenticated';
  select public.get_semester_event_count('fa99') into n;
  if n<>3 then raise exception 'Expected 3 events across members, got %', n; end if;
  select public.get_semester_event_count('invalid-semester') into n;
  if n<>0 then raise exception 'Invalid semester accepted'; end if;
  execute 'reset role';

  execute 'set local role anon';
  denied:=false;
  begin perform public.get_semester_event_count('fa99'); exception when insufficient_privilege then denied:=true; end;
  if not denied then raise exception 'Anonymous users can call the event count'; end if;
  execute 'reset role';
end $$;
rollback;
select 'PASS: distinct events across members, other points ignored, signed-in only' result;
