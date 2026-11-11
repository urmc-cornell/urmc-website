-- Events hosted in a semester, for the member portal's attendance card. There is no
-- reliable events list yet, so this counts distinct attendance reasons across all
-- members. Only returns a total, never ledger entries or member data.
create function public.get_semester_event_count(p_semester text)
returns bigint
language sql stable security definer set search_path = '' as $$
  select count(distinct lower(btrim(p.reason)))
  from public.points_tracking p
  where p.semester = p_semester
    and p_semester ~ '^(sp|su|fa)[0-9]{2}$'
    and lower(btrim(p.reason)) like 'event attendance%';
$$;
revoke all on function public.get_semester_event_count(text) from public, anon, authenticated;
grant execute on function public.get_semester_event_count(text) to authenticated, service_role;
comment on function public.get_semester_event_count(text) is 'Signed-in semester event total for the attendance card; no ledger or member data returned.';
notify pgrst, 'reload schema';
