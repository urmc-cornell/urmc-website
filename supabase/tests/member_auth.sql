-- Run as postgres in staging. All synthetic users, members and points roll back.
begin;
do $$
declare
  u1 uuid := gen_random_uuid(); u2 uuid := gen_random_uuid();
  ubad uuid := gen_random_uuid(); uunverified uuid := gen_random_uuid();
  uemail uuid := gen_random_uuid(); uunknown uuid := gen_random_uuid();
  uconflict uuid := gen_random_uuid(); udelayed uuid := gen_random_uuid();
  m1 uuid := gen_random_uuid(); m2 uuid := gen_random_uuid(); m3 uuid := gen_random_uuid();
  n1 text := 'qa' || floor(random()*1000000000000)::bigint::text;
  n2 text := 'qb' || floor(random()*1000000000000)::bigint::text;
  n3 text := 'qc' || floor(random()*1000000000000)::bigint::text;
  got uuid; n bigint; rejected boolean; reply jsonb;
begin
  insert into public.members(id,netid,first_name,last_name,email,role)
    values (m1,n1,'Auth Test','One','private-one@example.test',array['member']),
           (m2,n2,'Auth Test','Two','private-two@example.test',array['member']),
           (m3,n3,'Auth Test','Delayed',null,array['member']);
  insert into public.points_tracking(member_id,points,semester,reason)
    values(m1,7,'auth-test','Private reason one'),(m2,11,'auth-test','Private reason two');
  insert into auth.users(id,email,email_confirmed_at,raw_app_meta_data,raw_user_meta_data)
    values(u1,n1||'@cornell.edu',now(),'{"provider":"google"}','{}'),
          (u2,n2||'@cornell.edu',now(),'{"provider":"google"}','{}'),
          (ubad,'qa999@gmail.com',now(),'{"provider":"google"}',jsonb_build_object('email',n1||'@cornell.edu','email_verified',true)),
          (uunverified,'qu999@cornell.edu',now(),'{"provider":"google"}','{}'),
          (uemail,'qe999@cornell.edu',now(),'{"provider":"email"}','{}'),
          (uunknown,'qz99999999999999@cornell.edu',now(),'{"provider":"google"}','{}'),
          (uconflict,'qf999999999999@cornell.edu',now(),'{"provider":"google"}','{}'),
          (udelayed,n3||'@cornell.edu',null,'{"provider":"google"}','{}');
  insert into auth.identities(id,user_id,provider_id,provider,identity_data)
    values(gen_random_uuid(),u1,u1::text,'google',jsonb_build_object('sub',u1,'email',n1||'@cornell.edu','email_verified',true)),
          (gen_random_uuid(),u2,u2::text,'google',jsonb_build_object('sub',u2,'email',n2||'@cornell.edu','email_verified',true)),
          (gen_random_uuid(),ubad,ubad::text,'google','{"email":"qa999@gmail.com","email_verified":true}'),
          (gen_random_uuid(),uunverified,uunverified::text,'google','{"email":"qu999@cornell.edu","email_verified":false}'),
          (gen_random_uuid(),uemail,uemail::text,'email','{"email":"qe999@cornell.edu","email_verified":true}'),
          (gen_random_uuid(),uunknown,uunknown::text,'google','{"email":"qz99999999999999@cornell.edu","email_verified":true}'),
          (gen_random_uuid(),udelayed,udelayed::text,'google',jsonb_build_object('email',n3||'@cornell.edu','email_verified',true));
  if (select auth_user_id from public.members where id=m1) is distinct from u1 then raise exception 'first identity did not link'; end if;
  if (select auth_user_id from public.members where id=m2) is distinct from u2 then raise exception 'second identity did not link'; end if;
  if (select auth_user_id from public.members where id=m3) is not null then raise exception 'unconfirmed user linked'; end if;
  update auth.users set email_confirmed_at=now() where id=udelayed;
  if (select auth_user_id from public.members where id=m3) is distinct from udelayed then raise exception 'confirmation did not link'; end if;
  if private.verified_cornell_netid(ubad) is not null or private.verified_cornell_netid(uunverified) is not null
    or private.verified_cornell_netid(uemail) is not null then raise exception 'invalid identity accepted'; end if;
  if exists(select 1 from public.members where auth_user_id=uunknown) then raise exception 'unmatched user linked'; end if;
  update public.members set auth_user_id=uconflict where id=m1;
  rejected := false;
  begin
    update auth.identities set identity_data=identity_data where user_id=u1;
  exception when unique_violation then rejected := true; end;
  if not rejected then raise exception 'conflicting account stole member'; end if;
  update public.members set auth_user_id=u1 where id=m1;

  execute 'set local role anon';
  rejected := false;
  begin perform 1 from public.members limit 1; exception when insufficient_privilege then rejected:=true; end;
  if not rejected then raise exception 'anon read private members'; end if;
  rejected := false;
  begin perform 1 from public.points_tracking limit 1; exception when insufficient_privilege then rejected:=true; end;
  if not rejected then raise exception 'anon read points ledger'; end if;
  rejected := false;
  begin perform public.link_my_member(); exception when insufficient_privilege then rejected:=true; end;
  if not rejected then raise exception 'anon called linking function'; end if;
  perform 1 from public.events limit 1;
  perform 1 from public.member_directory limit 1;
  select count(*) into n from public.member_directory where netid in (n1,n2);
  if n<>0 then raise exception 'ordinary members exposed in directory'; end if;
  select count(*) into n from public.member_leaderboard where semester='auth-test' and total_points in (7,11);
  if n<>2 then raise exception 'public aggregates unavailable'; end if;
  if has_table_privilege('anon','public.member_directory','UPDATE')
     or has_table_privilege('anon','public.events','INSERT') then raise exception 'anon write grants remain'; end if;
  execute 'reset role';

  perform set_config('request.jwt.claims',jsonb_build_object('sub',u1,'role','authenticated')::text,true);
  execute 'set local role authenticated';
  select public.link_my_member() into got;
  if got is distinct from m1 then raise exception 'repeated linking failed'; end if;
  select count(*) into n from public.members;
  if n<>1 then raise exception 'member could read another profile'; end if;
  select id into got from public.members;
  if got is distinct from m1 then raise exception 'wrong profile visible'; end if;
  select sum(points) into n from public.points_tracking;
  if n<>7 then raise exception 'wrong ledger visible'; end if;
  rejected:=false;
  begin update public.members set role=array['admin'] where id=m1; exception when insufficient_privilege then rejected:=true; end;
  if not rejected then raise exception 'role elevation allowed'; end if;
  rejected:=false;
  begin update public.members set auth_user_id=u2 where id=m1; exception when insufficient_privilege then rejected:=true; end;
  if not rejected then raise exception 'identity reassignment allowed'; end if;
  rejected:=false;
  begin insert into public.points_tracking(member_id,points,semester) values(m1,999,'auth-test'); exception when insufficient_privilege then rejected:=true; end;
  if not rejected then raise exception 'points forgery allowed'; end if;
  rejected:=false;
  begin perform private.link_member_for_auth_user(u2); exception when insufficient_privilege then rejected:=true; end;
  if not rejected then raise exception 'arbitrary user linking callable'; end if;
  execute 'reset role';

  perform set_config('request.jwt.claims',jsonb_build_object('sub',u2,'role','authenticated')::text,true);
  execute 'set local role authenticated';
  select id into got from public.members;
  if got is distinct from m2 then raise exception 'second member isolation failed'; end if;
  select sum(points) into n from public.points_tracking;
  if n<>11 then raise exception 'second ledger isolation failed'; end if;
  execute 'reset role';

  perform set_config('request.jwt.claims',jsonb_build_object('sub',uunknown,'role','authenticated','user_metadata',jsonb_build_object('netid',n1,'email',n1||'@cornell.edu'))::text,true);
  execute 'set local role authenticated';
  if public.link_my_member() is not null then raise exception 'unmatched account linked via forged metadata'; end if;
  select count(*) into n from public.members;
  if n<>0 then raise exception 'unmatched account has private access'; end if;
  execute 'reset role';

  -- Even an existing JWT loses access when its trusted identity is no longer valid.
  update auth.users set banned_until=now()+interval '1 hour' where id=u1;
  perform set_config('request.jwt.claims',jsonb_build_object('sub',u1,'role','authenticated')::text,true);
  execute 'set local role authenticated';
  select count(*) into n from public.members;
  if n<>0 then raise exception 'banned account still has access'; end if;
  execute 'reset role';
  delete from auth.users where id=u1;
  if (select auth_user_id from public.members where id=m1) is not null then raise exception 'deleted account link not cleared'; end if;
  if (select sum(points) from public.points_tracking where member_id=m1)<>7 then raise exception 'account deletion damaged member points'; end if;

  if not has_function_privilege('supabase_auth_admin','public.before_user_created_cornell(jsonb)','EXECUTE') then raise exception 'Auth service cannot execute hook'; end if;
  reply := public.before_user_created_cornell('{"user":{"email":"ab123@cornell.edu","app_metadata":{"provider":"google"}}}');
  if reply <> '{}'::jsonb then raise exception 'Cornell Google signup rejected'; end if;
  reply := public.before_user_created_cornell('{"user":{"email":"ab123@gmail.com","app_metadata":{"provider":"google"}}}');
  if not reply ? 'error' then raise exception 'Gmail signup accepted'; end if;
  reply := public.before_user_created_cornell('{"user":{"email":"ab123@cornell.edu.attacker.test","app_metadata":{"provider":"google"}}}');
  if not reply ? 'error' then raise exception 'spoofed domain accepted'; end if;
  reply := public.before_user_created_cornell('{"user":{"email":"ab123@cornell.edu","app_metadata":{"provider":"email"},"user_metadata":{"provider":"google"}}}');
  if not reply ? 'error' then raise exception 'password signup accepted'; end if;
  reply := public.before_user_created_cornell('{}');
  if not reply ? 'error' then raise exception 'missing identity accepted'; end if;
  execute 'reset role';
end $$;
rollback;
select 'PASS: identity linking, conflict rejection, domain hook, own-row RLS, public projections, denied writes, bans, account deletion; all fixtures rolled back' result;
