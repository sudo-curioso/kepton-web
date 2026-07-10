-- Enable Supabase Realtime for the Kepton web dashboard.
-- Run in Supabase SQL Editor if live updates do not appear.
--
-- SECURITY: Also run supabase/rls-policies.sql for OWASP A01 row-level access control.
-- A02: All Supabase traffic must use HTTPS. Service role key is server-only (Vercel env).
-- A03: Use Supabase client parameterized queries only — never concatenate user input into SQL.

alter publication supabase_realtime add table tasks;
alter publication supabase_realtime add table forest_trees;
alter publication supabase_realtime add table user_streaks;
alter publication supabase_realtime add table focus_sessions;

-- Optional: auto-create users row on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, plan, trial_ends_at)
  values (new.id, 'free', now() + interval '14 days')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
