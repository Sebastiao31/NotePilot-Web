-- Helpful extension for UUID defaults (safe to run multiple times)
create extension if not exists pgcrypto;

-- ===== quizzes =====
create table public.flashcards (
  id         uuid primary key default gen_random_uuid(),
  note_id    uuid not null references public.notes(id) on delete cascade,
  content    jsonb not null,          -- full flashcard payload (front, back)
  status     varchar default 'generated',
  created_at timestamptz default now()
);

-- Index to speed lookups by note and time
create index if not exists flashcards_note_created_idx on public.flashcards (note_id, created_at);

-- ===== RLS (assumes jwt_sub() helper exists) =====
alter table public.flashcards enable row level security;

create policy flashcards_select_own
on public.flashcards for select to authenticated
using (exists (
  select 1 from public.notes n
  where n.id = flashcards.note_id and n.user_id = jwt_sub()
));

create policy flashcards_write_own
on public.flashcards for all to authenticated
using (exists (
  select 1 from public.notes n
  where n.id = flashcards.note_id and n.user_id = jwt_sub()
))
with check (exists (
  select 1 from public.notes n
  where n.id = flashcards.note_id and n.user_id = jwt_sub()
));