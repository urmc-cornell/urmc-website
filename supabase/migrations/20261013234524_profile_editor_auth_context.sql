-- Managed auth schema does not delegate USAGE grants from postgres to custom roles.
-- Read only the PostgREST-verified request claims, never user_metadata. The trusted
-- current_member_id() still independently verifies Google identity and account status.
create function private.profile_actor_id() returns uuid
language sql stable security invoker set search_path='' as $$
  select (nullif(current_setting('request.jwt.claims',true),'')::jsonb->>'sub')::uuid;
$$;
revoke all on function private.profile_actor_id() from public,anon;
grant execute on function private.profile_actor_id() to authenticated,urmc_profile_editor;
drop policy member_headshots_boundary on storage.objects;
drop policy member_headshots_no_anon on storage.objects;
drop policy member_headshots_read_own on storage.objects;
drop policy member_headshots_insert_own on storage.objects;
drop policy member_headshots_delete_own on storage.objects;
drop policy member_headshots_no_overwrite on storage.objects;
create or replace function private.owns_headshot_path(p_name text) returns boolean
language sql stable security invoker set search_path='' as $$
  select private.profile_actor_id() is not null and private.current_member_id() is not null
    and p_name ~ ('^'||private.current_member_id()::text||'/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}[.](jpg|jpeg|png|webp)$');
$$;
revoke all on function private.owns_headshot_path(text) from public,anon;
grant execute on function private.owns_headshot_path(text) to authenticated,urmc_profile_editor;

-- Restrictive guard prevents any existing broad storage policy from bypassing
-- ownership in this new bucket. It does not change other buckets' access.
create policy member_headshots_boundary on storage.objects as restrictive for all to authenticated,urmc_profile_editor
  using (bucket_id<>'member-headshots' or
    (owner_id=(select private.profile_actor_id())::text and private.owns_headshot_path(name)))
  with check (bucket_id<>'member-headshots' or
    (owner_id=(select private.profile_actor_id())::text and private.owns_headshot_path(name)));
create policy member_headshots_no_anon on storage.objects as restrictive for all to anon
  using (bucket_id<>'member-headshots') with check (bucket_id<>'member-headshots');
create policy member_headshots_read_own on storage.objects for select to authenticated,urmc_profile_editor
  using (bucket_id='member-headshots' and owner_id=(select private.profile_actor_id())::text and private.owns_headshot_path(name));
create policy member_headshots_insert_own on storage.objects for insert to authenticated
  with check (bucket_id='member-headshots' and owner_id=(select private.profile_actor_id())::text and private.owns_headshot_path(name));
create policy member_headshots_delete_own on storage.objects for delete to authenticated
  using (bucket_id='member-headshots' and owner_id=(select private.profile_actor_id())::text and private.owns_headshot_path(name));
-- Immutable object names: replacements upload a new UUID, then update the profile.
create policy member_headshots_no_overwrite on storage.objects as restrictive for update to public
  using (bucket_id<>'member-headshots') with check (bucket_id<>'member-headshots');
create or replace function private.update_my_profile(p_patch jsonb) returns jsonb
language plpgsql security definer set search_path='' as $$
declare
  mid uuid; k text; v jsonb; txt text; profile jsonb;
  patch jsonb := p_patch; headshot text; issuer text;
  allowed constant text[] := array['first_name','last_name','major','graduation_year','bio','ask_about','linkedin_url','instagram_url','headshot_path'];
begin
  mid := private.current_member_id();
  if private.profile_actor_id() is null or mid is null then
    raise exception 'A verified, linked Cornell account is required.' using errcode='42501';
  end if;
  if patch is null or jsonb_typeof(patch)<>'object' or octet_length(patch::text)>16384 then
    raise exception 'Profile patch must be an object of at most 16 KiB.' using errcode='22023';
  end if;
  for k,v in select * from jsonb_each(patch) loop
    if not k=any(allowed) then raise exception 'Field % is not editable.',k using errcode='22023'; end if;
    if k='graduation_year' then
      if v<>'null'::jsonb and (jsonb_typeof(v)<>'number' or v::text !~ '^[0-9]{4}$') then
        raise exception 'Graduation year must be a four-digit integer or null.' using errcode='22023';
      end if;
      if v<>'null'::jsonb and (v::text::integer<1900 or v::text::integer>extract(year from current_date)::integer+15) then
        raise exception 'Graduation year is out of range.' using errcode='22023';
      end if;
    elsif k='ask_about' then
      if v='null'::jsonb then patch:=jsonb_set(patch,array[k],'[]');
      else
        if jsonb_typeof(v)<>'array' then raise exception 'Topics must be an array.' using errcode='22023'; end if;
        if jsonb_array_length(v)>10 then raise exception 'At most 10 topics are allowed.' using errcode='22023'; end if;
        if exists(select 1 from jsonb_array_elements(v) t(x) where jsonb_typeof(x)<>'string'
          or length(btrim(x#>>'{}')) not between 1 and 100 or (x#>>'{}') ~ '[[:cntrl:]]') then
          raise exception 'Each topic must be text of 1–100 characters.' using errcode='22023';
        end if;
        patch:=jsonb_set(patch,array[k],coalesce((select jsonb_agg(btrim(x#>>'{}')) from jsonb_array_elements(v) t(x)),'[]'));
      end if;
    else
      if v='null'::jsonb then txt:=null;
      elsif jsonb_typeof(v)='string' then txt:=nullif(btrim(v#>>'{}'),'');
      else raise exception 'Field % must be text or null.',k using errcode='22023'; end if;
      if k in ('first_name','last_name') and (txt is null or length(txt)>100) then
        raise exception 'Names must contain 1–100 characters.' using errcode='22023';
      end if;
      if (k='major' and length(txt)>200) or (k='bio' and length(txt)>2000)
        or (k in ('linkedin_url','instagram_url') and length(txt)>500) then
        raise exception 'Field % is too long.',k using errcode='22023';
      end if;
      if k<>'bio' and txt ~ '[[:cntrl:]]' then raise exception 'Control characters are not allowed.' using errcode='22023'; end if;
      if k='linkedin_url' and txt is not null and txt !~ '^https://(www[.])?linkedin[.]com/in/[A-Za-z0-9_%~-]+/?$' then
        raise exception 'Use an HTTPS linkedin.com/in/ profile URL.' using errcode='22023';
      end if;
      if k='instagram_url' and txt is not null and txt !~ '^https://(www[.])?instagram[.]com/[A-Za-z0-9_.]+/?$' then
        raise exception 'Use an HTTPS instagram.com profile URL.' using errcode='22023';
      end if;
      if k='headshot_path' and txt is not null then
        if not private.owns_headshot_path(txt) then raise exception 'Headshot must use your own member folder and a UUID filename.' using errcode='22023'; end if;
        if not exists(select 1 from storage.objects o where o.bucket_id='member-headshots'
          and o.name=txt and o.owner_id=private.profile_actor_id()::text
          and o.metadata->>'mimetype' in ('image/jpeg','image/png','image/webp')
          and (o.metadata->>'size')::bigint between 1 and 5242880) then
          raise exception 'Upload a valid headshot before assigning it.' using errcode='22023';
        end if;
        -- iss is verified by Supabase's API JWT validation, not user_metadata.
        issuer:=(nullif(current_setting('request.jwt.claims',true),'')::jsonb)->>'iss';
        if issuer is null or issuer !~ '^https://[a-z0-9]{20}[.]supabase[.]co/auth/v1$' then
          raise exception 'Unsupported Auth issuer for headshot URL.' using errcode='22023';
        end if;
        headshot:=left(issuer,length(issuer)-8)||'/storage/v1/object/public/member-headshots/'||txt;
      end if;
      patch:=jsonb_set(patch,array[k],coalesce(to_jsonb(txt),'null'::jsonb));
    end if;
  end loop;
  if patch<>'{}'::jsonb then
    update public.members m set
      first_name=case when patch?'first_name' then patch->>'first_name' else m.first_name end,
      last_name=case when patch?'last_name' then patch->>'last_name' else m.last_name end,
      major=case when patch?'major' then patch->>'major' else m.major end,
      graduation_year=case when patch?'graduation_year' then (patch->>'graduation_year')::integer else m.graduation_year end,
      bio=case when patch?'bio' then patch->>'bio' else m.bio end,
      ask_about=case when patch?'ask_about' then array(select jsonb_array_elements_text(patch->'ask_about')) else m.ask_about end,
      linkedin_url=case when patch?'linkedin_url' then patch->>'linkedin_url' else m.linkedin_url end,
      instagram_url=case when patch?'instagram_url' then patch->>'instagram_url' else m.instagram_url end,
      headshot_url=case when patch?'headshot_path' then headshot else m.headshot_url end,
      profile_updated_at=clock_timestamp()
    where m.id=mid;
    if not found then raise exception 'Member is no longer editable.' using errcode='42501'; end if;
  end if;
  select jsonb_build_object('id',m.id,'first_name',m.first_name,'last_name',m.last_name,
    'major',m.major,'graduation_year',m.graduation_year,'bio',m.bio,'ask_about',m.ask_about,
    'linkedin_url',m.linkedin_url,'instagram_url',m.instagram_url,'headshot_url',m.headshot_url,
    'profile_updated_at',m.profile_updated_at) into profile from public.members m where m.id=mid;
  return profile;
end;
$$;

notify pgrst, 'reload schema';
