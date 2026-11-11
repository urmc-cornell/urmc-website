-- Staging only. Synthetic DB/Storage metadata fixtures roll back; no files uploaded.
begin;
do $$
declare
  u1 uuid:=gen_random_uuid(); u2 uuid:=gen_random_uuid(); u3 uuid:=gen_random_uuid();
  m1 uuid:=gen_random_uuid(); m2 uuid:=gen_random_uuid();
  n1 text:='qa'||floor(random()*1000000000000)::bigint::text;
  n2 text:='qb'||floor(random()*1000000000000)::bigint::text;
  own_path text:=m1::text||'/'||gen_random_uuid()::text||'.png';
  other_path text:=m2::text||'/'||gen_random_uuid()::text||'.png';
  fake_path text:=m1::text||'/'||gen_random_uuid()::text||'.png';
  invalid jsonb; result jsonb; denied boolean; n bigint; rev bigint; original jsonb;
begin
  insert into public.members(id,netid,first_name,last_name,email,role,position,major,secondary_headshot_url)
    values(m1,n1,'Test','One','unchanged@example.test',array['eboard'],'Officer','Original','https://example.test/admin.png'),
          (m2,n2,'Test','Two',null,array['member'],null,null,null);
  insert into auth.users(id,email,email_confirmed_at,raw_app_meta_data) values
    (u1,n1||'@cornell.edu',now(),'{"provider":"google"}'),
    (u2,n2||'@cornell.edu',now(),'{"provider":"google"}'),
    (u3,'qz999999999999@cornell.edu',now(),'{"provider":"google"}');
  insert into auth.identities(id,user_id,provider_id,provider,identity_data) values
    (gen_random_uuid(),u1,u1::text,'google',jsonb_build_object('email',n1||'@cornell.edu','email_verified',true)),
    (gen_random_uuid(),u2,u2::text,'google',jsonb_build_object('email',n2||'@cornell.edu','email_verified',true));
  select to_jsonb(m) into original from public.members m where id=m1;
  select revision into rev from public.notion_member_sync where member_id=m1;
  insert into storage.objects(bucket_id,name,owner_id,metadata) values
    ('member-headshots',other_path,u2::text,'{"size":100,"mimetype":"image/png"}');
  execute 'set local role anon';
  denied:=false;
  begin perform public.update_my_profile('{"bio":"unauthorized"}'); exception when insufficient_privilege then denied:=true; end;
  if not denied then raise exception 'Anonymous edit allowed'; end if;
  execute 'reset role';

  perform set_config('request.jwt.claims',jsonb_build_object('sub',u1,'role','authenticated','iss','https://yijqxdltqsxruxjtunps.supabase.co/auth/v1')::text,true);
  execute 'set local role authenticated';
  result:=public.update_my_profile('{"first_name":" New Name ","last_name":"Last","major":"CS","graduation_year":2028,"bio":"New bio","ask_about":[" Coding "],"linkedin_url":"https://www.linkedin.com/in/test-user","instagram_url":"https://instagram.com/test_user"}');
  if result->>'first_name'<>'New Name' or result->>'graduation_year'<>'2028' or result->'ask_about'<>'["Coding"]' then raise exception 'Editable fields failed'; end if;
  if result->>'profile_updated_at' is null then raise exception 'Missing edit marker'; end if;
  result:=public.update_my_profile('{"bio":null}');
  if result->'bio'<>'null' or result->>'major'<>'CS' then raise exception 'Patch semantics failed'; end if;
  for invalid in select x from jsonb_array_elements('[
    {"email":"attacker@example.test"},{"netid":"ab123"},{"auth_user_id":null},
    {"id":null},{"role":["admin"]},{"position":"President"},{"points":999},{"profile_updated_at":null},
    {"course":["CS 1110"]},{"secondary_headshot_url":null},{"headshot_url":"https://evil.test/x.png"},
    {"first_name":""},{"last_name":null},{"major":5},{"graduation_year":2028.5},
    {"graduation_year":9999},{"ask_about":[null]},{"ask_about":"x"},
    {"linkedin_url":"javascript:alert(1)"},{"linkedin_url":"https://linkedin.com.evil.test/in/x"},
    {"instagram_url":"https://instagram.com@evil.test/test"},[],null
  ]'::jsonb) t(x) loop
    denied:=false;
    begin perform public.update_my_profile(invalid); exception when invalid_parameter_value then denied:=true; end;
    if not denied then raise exception 'Invalid patch accepted: %',invalid; end if;
  end loop;
  denied:=false;
  begin perform public.update_my_profile(jsonb_build_object('bio',repeat('x',2001))); exception when invalid_parameter_value then denied:=true; end;
  if not denied then raise exception 'Overlong bio accepted'; end if;
  denied:=false;
  begin perform public.update_my_profile('{"first_name":"Should roll back","role":["admin"]}'); exception when invalid_parameter_value then denied:=true; end;
  if not denied then raise exception 'Mixed patch accepted'; end if;
  if (select first_name from public.members where id=m1)<>'New Name' then raise exception 'Partial update escaped validation'; end if;
  denied:=false;
  begin update public.members set first_name='Direct'; exception when insufficient_privilege then denied:=true; end;
  if not denied then raise exception 'Direct update allowed'; end if;
  if pg_has_role('authenticated','urmc_profile_editor','MEMBER') then raise exception 'API can assume writer role'; end if;

  insert into storage.objects(bucket_id,name,owner_id,metadata)
    values('member-headshots',own_path,u1::text,'{"size":100,"mimetype":"image/png"}');
  result:=public.update_my_profile(jsonb_build_object('headshot_path',own_path));
  if result->>'headshot_url'<>'https://yijqxdltqsxruxjtunps.supabase.co/storage/v1/object/public/member-headshots/'||own_path then raise exception 'Wrong headshot URL'; end if;
  denied:=false;
  begin perform public.update_my_profile(jsonb_build_object('headshot_path',other_path)); exception when invalid_parameter_value then denied:=true; end;
  if not denied then raise exception 'Other member headshot assigned'; end if;
  denied:=false;
  begin perform public.update_my_profile(jsonb_build_object('headshot_path',fake_path)); exception when invalid_parameter_value then denied:=true; end;
  if not denied then raise exception 'Missing headshot assigned'; end if;
  denied:=false;
  begin insert into storage.objects(bucket_id,name,owner_id) values('member-headshots',m2::text||'/'||gen_random_uuid()||'.png',u1::text); exception when insufficient_privilege then denied:=true; end;
  if not denied then raise exception 'Cross-member upload allowed'; end if;
  denied:=false;
  begin insert into storage.objects(bucket_id,name,owner_id) values('member-headshots',fake_path,u2::text); exception when insufficient_privilege then denied:=true; end;
  if not denied then raise exception 'Spoofed owner accepted'; end if;
  select count(*) into n from storage.objects where bucket_id='member-headshots';
  if n<>1 then raise exception 'Storage listing leaked other owners'; end if;
  update storage.objects set name=fake_path where bucket_id='member-headshots' and name=own_path;
  get diagnostics n=row_count;
  if n<>0 then raise exception 'Headshot overwrite allowed'; end if;
  result:=public.update_my_profile('{"headshot_path":null,"ask_about":null}');
  if result->'headshot_url'<>'null' or result->'ask_about'<>'[]' then raise exception 'Clearing optional fields failed'; end if;
  execute 'reset role';

  if (select revision from public.notion_member_sync where member_id=m1)<=rev then raise exception 'Notion sync not queued'; end if;
  if (select payload->>'first_name' from public.notion_member_sync where member_id=m1)<>'New Name' then raise exception 'Notion payload stale'; end if;
  if (select to_jsonb(m)-array['first_name','last_name','major','graduation_year','bio','ask_about','linkedin_url','instagram_url','headshot_url','profile_updated_at'] from public.members m where id=m1)
      is distinct from original-array['first_name','last_name','major','graduation_year','bio','ask_about','linkedin_url','instagram_url','headshot_url','profile_updated_at'] then raise exception 'Protected fields changed'; end if;
  if (select first_name from public.members where id=m2)<>'Test' then raise exception 'Other member changed'; end if;
  if (select first_name from public.member_directory where id=m1)<>'New Name' then raise exception 'Public projection stale'; end if;
  if (select file_size_limit from storage.buckets where id='member-headshots')<>5242880 then raise exception 'Bucket size limit missing'; end if;
  if (select allowed_mime_types from storage.buckets where id='member-headshots')<>array['image/jpeg','image/png','image/webp'] then raise exception 'Bucket MIME limits missing'; end if;

  -- Linked-but-banned and unlinked accounts cannot edit or upload.
  update auth.users set banned_until=now()+interval '1 hour' where id=u1;
  execute 'set local role authenticated';
  denied:=false;
  begin perform public.update_my_profile('{"bio":"banned"}'); exception when insufficient_privilege then denied:=true; end;
  if not denied then raise exception 'Banned edit allowed'; end if;
  denied:=false;
  begin insert into storage.objects(bucket_id,name,owner_id) values('member-headshots',fake_path,u1::text); exception when insufficient_privilege then denied:=true; end;
  if not denied then raise exception 'Banned upload allowed'; end if;
  execute 'reset role';
  perform set_config('request.jwt.claims',jsonb_build_object('sub',u3,'role','authenticated')::text,true);
  execute 'set local role authenticated';
  denied:=false;
  begin perform public.update_my_profile('{"bio":"unlinked"}'); exception when insufficient_privilege then denied:=true; end;
  if not denied then raise exception 'Unlinked edit allowed'; end if;
  execute 'reset role';
end $$;
rollback;
select 'PASS: profile patch validation, immutable identity/admin fields, owner isolation, headshot ownership, upload policy, Notion queue and public projection; fixtures rolled back' result;
