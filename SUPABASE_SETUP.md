# Supabase Setup Guide for NeuroIQ

## Step 1 — Create a Supabase Project

1. Go to **https://supabase.com** and sign up (free)
2. Click **"New Project"**
3. Name it `neuroiq`, choose a region close to you
4. Wait ~2 minutes for it to spin up

## Step 2 — Run the SQL Schema

1. In your Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Copy the contents of `supabase-schema.sql` and paste it
4. Click **"Run"** — you should see "Success"

## Step 3 — Get your API keys

1. Go to **Settings → API** in your Supabase dashboard
2. Copy your **Project URL** (looks like `https://xxxx.supabase.co`)
3. Copy your **anon public** key

## Step 4 — Add keys to .env

Edit the `.env` file in your project root:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 5 — Enable Google OAuth (optional)

1. In Supabase → **Authentication → Providers**
2. Enable **Google** → paste your Google OAuth client ID + secret
3. Get credentials from: https://console.cloud.google.com → APIs & Services → Credentials
4. Add `https://your-project.supabase.co/auth/v1/callback` as an authorized redirect URI

## Step 6 — Enable GitHub OAuth (optional)

1. In Supabase → **Authentication → Providers**
2. Enable **GitHub** → paste your GitHub OAuth app credentials
3. Get credentials from: https://github.com/settings/developers → OAuth Apps → New
4. Set callback URL to: `https://your-project.supabase.co/auth/v1/callback`

## Step 7 — Run the app

```bash
npm run dev
```

## What's stored in Supabase

| Table         | What it stores                                    |
|---------------|---------------------------------------------------|
| `profiles`    | IQ score, XP, skills, achievements, high scores   |
| `game_results`| Every game played — score, XP, IQ gain, timestamp |

All data is protected by Row Level Security — users can only access their own data.
