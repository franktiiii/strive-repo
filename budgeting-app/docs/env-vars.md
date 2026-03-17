# Strive — Environment Variables
# Updated by Claude Code when new env vars are added (see Global CLAUDE.md rules)
# NEVER put actual values in this file — names and purposes ONLY
# Last updated: [DATE]

## Required for Development

| Variable | Purpose | Where to Get It |
|----------|---------|-----------------|
| NEXT_PUBLIC_SUPABASE_URL | Supabase project API URL | Supabase Dashboard → Settings → API |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase public/anon key for client-side queries | Supabase Dashboard → Settings → API |

## Required for Production (Future)
<!-- Add as needed: Plaid keys, Vercel config, etc. -->

## Setup Instructions
1. Copy `.env.example` to `.env.local`
2. Fill in values from the sources listed above
3. Never commit `.env.local` to git
