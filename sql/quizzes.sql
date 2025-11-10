-- Helpful extension for UUID defaults (safe to run multiple times)
create extension if not exists pgcrypto;

-- ===== quizzes =====
create table public.quizzes (
  id         uuid primary key default gen_random_uuid(),
  note_id    uuid not null references public.notes(id) on delete cascade,
  content    jsonb not null,          -- full quiz payload (questions, answers, tips, etc.)
  status     varchar default 'generated',
  created_at timestamptz default now()
);

-- Index to speed lookups by note and time
create index if not exists quizzes_note_created_idx on public.quizzes (note_id, created_at);

-- ===== RLS (assumes jwt_sub() helper exists) =====
alter table public.quizzes enable row level security;

create policy quizzes_select_own
on public.quizzes for select to authenticated
using (exists (
  select 1 from public.notes n
  where n.id = quizzes.note_id and n.user_id = jwt_sub()
));

create policy quizzes_write_own
on public.quizzes for all to authenticated
using (exists (
  select 1 from public.notes n
  where n.id = quizzes.note_id and n.user_id = jwt_sub()
))
with check (exists (
  select 1 from public.notes n
  where n.id = quizzes.note_id and n.user_id = jwt_sub()
));