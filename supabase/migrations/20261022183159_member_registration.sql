-- Requires the existing Cornell identity/linking foundation. No table grants
-- change: clients register only through this narrow, authenticated RPC.
create function private.register_my_membership(p_profile jsonb) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  uid uuid := auth.uid(); netid_value text; member_id uuid;
  key text; value jsonb; field text;
begin
  if uid is null then
    raise exception 'Sign in with your Cornell Google account first.' using errcode='42501';
  end if;
  -- Same lock order as the existing linker; repeated calls for an account queue.
  perform 1 from auth.users where id=uid for update;
  netid_value := private.verified_cornell_netid(uid);
  if netid_value is null then
    raise exception 'A verified Cornell Google account is required.' using errcode='42501';
  end if;
  if p_profile is null or jsonb_typeof(p_profile)<>'object' or octet_length(p_profile::text)>4096 then
    raise exception 'Registration must contain a profile object of at most 4 KiB.' using errcode='22023';
  end if;
  if not (p_profile ?& array['first_name','last_name','major','graduation_year']) then
    raise exception 'First name, last name, major, and graduation year are required.' using errcode='22023';
  end if;
  for key,value in select * from jsonb_each(p_profile) loop
    if key not in ('first_name','last_name','major','graduation_year') then
      raise exception 'Field % is not accepted during registration.',key using errcode='22023';
    end if;
    if key='graduation_year' then
      if jsonb_typeof(value)<>'number' or value::text !~ '^[0-9]{4}$' then
        raise exception 'Graduation year must be a four-digit integer.' using errcode='22023';
      end if;
      if value::text::integer not between 1900 and extract(year from current_date)::integer+15 then
        raise exception 'Graduation year is out of range.' using errcode='22023';
      end if;
    else
      field := btrim(value#>>'{}');
      if jsonb_typeof(value)<>'string' or field is null or length(field)<1
        or length(field)>(case when key='major' then 200 else 100 end)
        or field ~ '[[:cntrl:]]' then
        raise exception 'Provide a valid %, up to % characters.',key,(case when key='major' then 200 else 100 end) using errcode='22023';
      end if;
    end if;
  end loop;

  member_id := private.link_member_for_auth_user(uid);
  if member_id is not null then return member_id; end if;
  if exists(select 1 from public.members where auth_user_id=uid) then
    raise exception 'This account link requires administrator review.' using errcode='23505';
  end if;

  -- The verified identity is a canonical NetID@cornell.edu address. Neither
  -- identity nor privileged fields are copied from form data or user_metadata.
  insert into public.members(netid,email,auth_user_id,first_name,last_name,major,graduation_year,role,position,profile_updated_at)
  values(netid_value,netid_value||'@cornell.edu',uid,
    btrim(p_profile->>'first_name'),btrim(p_profile->>'last_name'),btrim(p_profile->>'major'),
    (p_profile->>'graduation_year')::integer,array['member']::text[],null,clock_timestamp())
  on conflict do nothing returning id into member_id;

  -- A concurrent import or another account may have claimed the canonical
  -- NetID. Reuse the linker to preserve the row or reject a conflicting owner.
  if member_id is null then member_id := private.link_member_for_auth_user(uid); end if;
  if member_id is null then
    raise exception 'Registration conflicted with another update. Please retry or contact URMC.' using errcode='23505';
  end if;
  return member_id;
end;
$$;
revoke all on function private.register_my_membership(jsonb) from public,anon,authenticated;
grant execute on function private.register_my_membership(jsonb) to authenticated;

create function public.register_my_membership(p_profile jsonb) returns uuid
language sql security invoker set search_path = '' as $$
  select private.register_my_membership(p_profile);
$$;
revoke all on function public.register_my_membership(jsonb) from public,anon,authenticated;
grant execute on function public.register_my_membership(jsonb) to authenticated;
comment on function public.register_my_membership(jsonb) is 'Register the verified Cornell caller, or return their existing member unchanged. Only first_name, last_name, major and graduation_year are accepted.';
notify pgrst, 'reload schema';
