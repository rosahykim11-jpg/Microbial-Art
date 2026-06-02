-- Run this in your Supabase SQL editor

-- Articles table
create table if not exists articles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  author text not null,
  title text not null,
  body text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now()
);

-- Enable Row Level Security
alter table articles enable row level security;

-- Anyone (authenticated) can read all articles
create policy "Anyone can read articles"
  on articles for select
  using (auth.role() = 'authenticated');

-- Users can insert their own articles
create policy "Users can insert own articles"
  on articles for insert
  with check (auth.uid() = user_id);

-- Users can update their own articles
create policy "Users can update own articles"
  on articles for update
  using (auth.uid() = user_id);

-- Users can delete their own articles
create policy "Users can delete own articles"
  on articles for delete
  using (auth.uid() = user_id);
