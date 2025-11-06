-- Helpful extension for UUID defaults (safe to run multiple times)
create extension if not exists pgcrypto;

-- ===== folders =====
create table public.folders (
  id          uuid primary key default gen_random_uuid(),
  note_id     uuid references public.notes(id) on delete set null,
  name        varchar not null,
  color       varchar,
  created_at  timestamptz default now(),
  user_id     varchar not null default jwt_sub()
);

-- Index to speed lookups by note and time
create index if not exists folders_note_created_idx on public.folders (note_id, created_at);
create index if not exists folders_user_created_idx on public.folders (user_id, created_at);

-- ===== RLS (assumes jwt_sub() exists as in your schema) =====
alter table public.folders enable row level security;

-- Owner-only access
drop policy if exists folders_select_own on public.folders;
drop policy if exists folders_write_own on public.folders;

create policy folders_select_own
on public.folders for select to authenticated
using (user_id = jwt_sub());

create policy folders_write_own
on public.folders for all to authenticated
using (user_id = jwt_sub())
with check (user_id = jwt_sub());