-- NeuroIQ Supabase Schema
-- Run this in your Supabase SQL Editor: https://supabase.com → SQL Editor

-- ─── Enable RLS ──────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── PROFILES table ──────────────────────────────────────────────────────────
create table if not exists profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  username            text not null default 'Brain Trainee',
  avatar              text not null default '🧠',
  iq_score            integer not null default 100,
  total_xp            integer not null default 0,
  day_streak          integer not null default 0,
  last_played_date    text not null default '',
  games_played        integer not null default 0,
  brain_level         text not null default 'Bronze',
  skills              jsonb not null default '{}',
  weekly_xp           jsonb not null default '[0,0,0,0,0,0,0]',
  high_scores         jsonb not null default '{}',
  game_play_count     jsonb not null default '{}',
  favorites           jsonb not null default '[]',
  adaptive_difficulty jsonb not null default '{}',
  achievements        jsonb not null default '[]',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ─── GAME RESULTS table ──────────────────────────────────────────────────────
create table if not exists game_results (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references profiles(id) on delete cascade,
  game_id     text not null,
  score       integer not null default 0,
  xp_earned   integer not null default 0,
  iq_gain     integer not null default 0,
  level       integer,
  played_at   timestamptz not null default now()
);

-- ─── Row Level Security ───────────────────────────────────────────────────────
alter table profiles     enable row level security;
alter table game_results enable row level security;

-- Profiles: users can only read/write their own row
create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- Leaderboard: everyone can read all profiles (for leaderboard)
create policy "Anyone can view profiles for leaderboard"
  on profiles for select using (true);

-- Game results: own only
create policy "Users can insert own results"
  on game_results for insert with check (auth.uid() = user_id);

create policy "Users can view own results"
  on game_results for select using (auth.uid() = user_id);

-- ─── Auto-update updated_at ───────────────────────────────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at();

-- ─── Indexes ─────────────────────────────────────────────────────────────────
create index if not exists profiles_total_xp_idx  on profiles(total_xp desc);
create index if not exists profiles_iq_score_idx  on profiles(iq_score desc);
create index if not exists game_results_user_idx  on game_results(user_id, played_at desc);
