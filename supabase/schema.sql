-- PostVias — Supabase schema
-- Run this in the Supabase SQL editor (Dashboard → SQL → New query).

-- 1) Posts table (one row per scheduled/published/draft post).
create table if not exists public.posts (
  id           text primary key,
  workspace    text not null default 'demo',
  status       text,
  scheduled_at text,
  created_at   timestamptz not null default now(),
  data         jsonb not null
);

create index if not exists posts_ws_created_idx
  on public.posts (workspace, created_at desc);

-- 2) Lock the table down. Only the Netlify Functions (service role) touch it,
--    and the service role bypasses RLS. With RLS enabled and NO policies,
--    the public anon key cannot read or write — which is what we want.
alter table public.posts enable row level security;

-- 3) Storage bucket for AI-generated images (public read so <img> can load them).
insert into storage.buckets (id, name, public)
values ('generated', 'generated', true)
on conflict (id) do nothing;

-- Allow public READ of objects in the 'generated' bucket (writes happen
-- server-side via the service role, which bypasses these policies).
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'Public read generated'
  ) then
    create policy "Public read generated"
      on storage.objects for select
      using (bucket_id = 'generated');
  end if;
end $$;
