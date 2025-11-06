-- ===== Reset (drop in dependency order) =====
drop table if exists public.messages cascade;
drop table if exists public.chats cascade;
drop table if exists public.notes cascade;

-- Helpful extension for UUID defaults
create extension if not exists pgcrypto;

-- ===== Tables (same columns as your screenshot) =====

-- notes
create table public.notes (
  id          uuid primary key default gen_random_uuid(),
  title       varchar,
  transcript  varchar,
  summary     varchar,
  type        varchar,
  status      varchar,
  "like"        boolean,
  "dislike"     boolean,
  feedback    varchar,
  created_at  timestamptz default now(),
  user_id     varchar not null
);

-- chats
create table public.chats (
  id           uuid primary key default gen_random_uuid(),
  note_id      uuid not null references public.notes(id) on delete cascade,
  suggestions  json,
  created_at   timestamptz default now()
);

-- messages
create table public.messages (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz default now(),
  chat_id     uuid not null references public.chats(id) on delete cascade,
  role        varchar,
  content     varchar,
  "like"        boolean,
  "dislike"     boolean
);

-- ===== Indexes =====
create index if not exists notes_user_created_idx     on public.notes (user_id, created_at);
create index if not exists chats_note_created_idx     on public.chats (note_id, created_at);
create index if not exists messages_chat_created_idx  on public.messages (chat_id, created_at);

-- ===== RLS (Clerk) =====
alter table public.notes     enable row level security;
alter table public.chats     enable row level security;
alter table public.messages  enable row level security;


-- Helper: pull Clerk user id from JWT (subject claim)
create or replace function jwt_sub() returns text
language sql stable as $$
  select coalesce((current_setting('request.jwt.claims', true)::jsonb ->> 'sub'), '')
$$;

-- notes: owner-only
create policy notes_select_own
on public.notes for select to authenticated
using (user_id = jwt_sub());

create policy notes_insert_own
on public.notes for insert to authenticated
with check (user_id = jwt_sub());

create policy notes_update_own
on public.notes for update to authenticated
using (user_id = jwt_sub())
with check (user_id = jwt_sub());

create policy notes_delete_own
on public.notes for delete to authenticated
using (user_id = jwt_sub());

-- chats: allowed if parent note belongs to current Clerk user
create policy chats_select_own
on public.chats for select to authenticated
using (exists (
  select 1 from public.notes n
  where n.id = chats.note_id and n.user_id = jwt_sub()
));

create policy chats_write_own
on public.chats for all to authenticated
using (exists (
  select 1 from public.notes n
  where n.id = chats.note_id and n.user_id = jwt_sub()
))
with check (exists (
  select 1 from public.notes n
  where n.id = chats.note_id and n.user_id = jwt_sub()
));

-- messages: allowed if parent note (via chat) belongs to current Clerk user
create policy messages_select_own
on public.messages for select to authenticated
using (exists (
  select 1
  from public.chats c
  join public.notes n on n.id = c.note_id
  where c.id = messages.chat_id and n.user_id = jwt_sub()
));

create policy messages_write_own
on public.messages for all to authenticated
using (exists (
  select 1
  from public.chats c
  join public.notes n on n.id = c.note_id
  where c.id = messages.chat_id and n.user_id = jwt_sub()
))
with check (exists (
  select 1
  from public.chats c
  join public.notes n on n.id = c.note_id
  where c.id = messages.chat_id and n.user_id = jwt_sub()
));