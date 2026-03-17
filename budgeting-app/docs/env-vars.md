# Strive — Environment Variables
# Updated by Claude Code when new env vars are added (see Global CLAUDE.md rules)
# NEVER put actual values in this file — names and purposes ONLY
# Last updated: 2026-03-16

## Required for Development

| Variable | Purpose | Where to Get It |
|----------|---------|-----------------|
| NEXT_PUBLIC_SUPABASE_URL | Supabase project API URL (https://xxx.supabase.co) | Supabase Dashboard → Settings → API |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase publishable key for client-side queries | Supabase Dashboard → Settings → API Keys → Publishable |

## Required for Production (Future)
<!-- Add as needed: Plaid keys, Vercel config, etc. -->

## Setup Instructions
1. Create `.env.local` in the `budgeting-app/` directory
2. Add both variables with values from Supabase dashboard
3. Never commit `.env.local` to git (already in .gitignore)
