-- Rollback-only fixtures: no Google messages, uploads, or persistent members.
begin;
do $$
declare
 u uuid:=gen_random_uuid(); existing_user uuid:=gen_random_uuid(); bad uuid:=gen_random_uuid();
 n text:='qr'||floor(random()*1000000000000)::bigint; en text:='qe'||floor(random()*1000000000000)::bigint;
 m uuid; existing_id uuid:=gen_random_uuid(); result uuid; denied boolean; invalid jsonb; original jsonb;
 profile jsonb:='{"first_name":" New ","last_name":"Member","major":" CS ","graduation_year":2028}';
begin
 insert into public.members(id,netid,first_name,last_name,role,position) values(existing_id,en,'Preserve','Me',array['eboard'],'Officer');
 insert into auth.users(id,email,email_confirmed_at,raw_app_meta_data) values
 (u,n||'@cornell.edu',now(),'{"provider":"google"}'),
 (existing_user,en||'@cornell.edu',now(),'{"provider":"google"}'),
 (bad,'qz999999999991@cornell.edu',now(),'{"provider":"google"}');
 insert into auth.identities(id,user_id,provider_id,provider,identity_data) values
 (gen_random_uuid(),u,u::text,'google',jsonb_build_object('email',n||'@cornell.edu','email_verified',true)),
 (gen_random_uuid(),existing_user,existing_user::text,'google',jsonb_build_object('email',en||'@cornell.edu','email_verified',true)),
 (gen_random_uuid(),bad,bad::text,'google','{"email":"qz999999999991@cornell.edu","email_verified":false}');
 select to_jsonb(t) into original from public.members t where id=existing_id;
 perform set_config('request.jwt.claims',jsonb_build_object('sub',existing_user,'role','authenticated')::text,true);
 execute 'set local role authenticated';
 if public.link_my_member()<>existing_id or public.register_my_membership(profile)<>existing_id then raise exception 'Existing member not preserved'; end if;
 execute 'reset role';
 if (select to_jsonb(t) from public.members t where id=existing_id)<>original then raise exception 'Existing profile overwritten'; end if;

 perform set_config('request.jwt.claims',jsonb_build_object('sub',u,'role','authenticated')::text,true);
 execute 'set local role authenticated';
 if public.link_my_member() is not null then raise exception 'Unexpected member before registration'; end if;
 m:=public.register_my_membership(profile);
 if m is null or private.current_member_id()<>m then raise exception 'Registration did not link caller'; end if;
 result:=public.register_my_membership(profile||'{"first_name":"Must not overwrite"}');
 if result<>m then raise exception 'Retry returned different member'; end if;
 if (select count(*) from public.members)<>1 then raise exception 'Own-row isolation failed'; end if;
 if (select first_name from public.members where id=m)<>'New' then raise exception 'Trim/retry preservation failed'; end if;
 perform public.update_my_profile('{"bio":"My new profile"}');
 if (select bio from public.members where id=m)<>'My new profile' then raise exception 'New member cannot edit own profile'; end if;
 denied:=false;
 begin insert into public.members(netid,first_name,last_name) values('qw999999999991','Forbidden','Insert'); exception when insufficient_privilege then denied:=true; end;
 if not denied then raise exception 'Direct insert allowed'; end if;
 for invalid in select x from jsonb_array_elements('[{"email":"spoof@cornell.edu"},{"netid":"ab123"},{"auth_user_id":null},{"role":["eboard"]},{"position":"President"},{"points":100},{"headshot_url":"https://example.test"},{"bio":"later"},{"id":null},{"profile_updated_at":null},{"first_name":" "},{"last_name":null},{"major":false},{"graduation_year":2028.5},{"graduation_year":9999},{"graduation_year":null}]') t(x) loop
   denied:=false;
   begin perform public.register_my_membership(profile||invalid); exception when invalid_parameter_value then denied:=true; end;
   if not denied then raise exception 'Invalid/protected field accepted: %',invalid; end if;
 end loop;
 for invalid in select x from jsonb_array_elements('[{},[],null,{"first_name":"Missing fields"}]') t(x) loop
   denied:=false;
   begin perform public.register_my_membership(invalid); exception when invalid_parameter_value then denied:=true; end;
   if not denied then raise exception 'Malformed profile accepted'; end if;
 end loop;
 execute 'reset role';
 if not exists(select 1 from public.members where id=m and netid=n and email=n||'@cornell.edu' and auth_user_id=u and role=array['member'] and position is null) then raise exception 'Incorrect identity/defaults'; end if;
 if exists(select 1 from public.points_tracking where member_id=m) then raise exception 'Registration awarded points'; end if;
 if (select count(*) from public.members where auth_user_id=u or netid=n)<>1 then raise exception 'Duplicate member'; end if;

 -- A different account owns this NetID: reject rather than taking it over.
 update public.members set auth_user_id=bad where id=m;
 execute 'set local role authenticated';
 denied:=false;
 begin perform public.register_my_membership(profile); exception when unique_violation then denied:=true; end;
 if not denied then raise exception 'Conflicting owner accepted'; end if;
 execute 'reset role';
 update public.members set auth_user_id=u,netid='qy999999999991' where id=m;
 execute 'set local role authenticated';
 denied:=false;
 begin perform public.register_my_membership(profile); exception when unique_violation then denied:=true; end;
 if not denied then raise exception 'Account linked to different NetID accepted'; end if;
 execute 'reset role';

 perform set_config('request.jwt.claims',jsonb_build_object('sub',bad,'role','authenticated')::text,true);
 execute 'set local role authenticated';
 denied:=false;
 begin perform public.register_my_membership(profile); exception when insufficient_privilege then denied:=true; end;
 if not denied then raise exception 'Unverified identity accepted'; end if;
 execute 'reset role';
 update auth.users set banned_until=now()+interval '1 hour' where id=u;
 perform set_config('request.jwt.claims',jsonb_build_object('sub',u,'role','authenticated')::text,true);
 execute 'set local role authenticated';
 denied:=false;
 begin perform public.register_my_membership(profile); exception when insufficient_privilege then denied:=true; end;
 if not denied then raise exception 'Banned identity accepted'; end if;
 execute 'reset role';
 execute 'set local role anon';
 denied:=false;
 begin perform public.register_my_membership(profile); exception when insufficient_privilege then denied:=true; end;
 if not denied then raise exception 'Anonymous registration allowed'; end if;
 execute 'reset role';
end;
$$;
rollback;
select 'PASS: registration, retries, existing-member preservation, identity derivation, protected fields, conflicts, own-row read/edit, bans and denied inserts; fixtures rolled back' as result;
