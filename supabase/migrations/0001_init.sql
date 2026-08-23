-- Voice Command Shopping Assistant — initial schema.
-- Requires anonymous sign-ins enabled (Auth -> Providers -> Anonymous).
-- Run via `supabase db push` or the SQL editor.

create table public.list_items (
  id uuid primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  category text not null default 'other',
  quantity integer not null default 1,
  unit text not null default 'item',
  checked boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.list_items enable row level security;

create policy "users manage their own list items"
  on public.list_items
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table public.purchase_history (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  category text not null default 'other',
  purchased_at timestamptz not null default now()
);

alter table public.purchase_history enable row level security;

create policy "users manage their own history"
  on public.purchase_history
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
