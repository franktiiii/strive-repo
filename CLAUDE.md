# CLAUDE.md — Strive (Budgeting App + Frankie T Coaching Platform)

## Project Identity
Strive is a budgeting app AND coaching platform for young professionals (22-35) who have never seriously budgeted before. The brand is Frankie T — the tone is encouraging, not lecturing. A friend who's good with money, not a financial advisor. Inspired by Larry June's "always strive and prosper" philosophy. Dark-themed with glass-morphism UI, gamification (goals, achievements, streaks).

The app has TWO audiences:
1. **Public users** — people who find the app through content and use it to budget on their own
2. **Coaching clients** — people who book 1-on-1 sessions with Frank and use the app as a coaching companion between sessions

## Current Phase
**Phase 2A: Coaching Landing Page (NO database needed)**
- Build /coaching public page — brand info, services, testimonials, FAQ, Calendly embed
- This is LAUNCH PRIORITY — needs to go live this week
- Does NOT require Supabase, auth, or any backend
- Static page with embedded Calendly booking widget

**Phase 2B: Supabase Integration (database setup)**
- Create Supabase project, configure env vars, build lib/supabase.ts client
- Set up auth (email/password + Google OAuth)
- Migrate demo data shapes to real Supabase tables
- Replace demo-data.ts imports with Supabase query hooks in lib/hooks/
- Document EVERYTHING in docs/schema.md as you build (see Global CLAUDE.md rules)

**Phase 2C: Coach Dashboard (AFTER Supabase is working)**
- Build /coach-dashboard — admin-only route behind auth (Frank only)
- Client list, intake form viewer, session notes, follow-up email generator
- Client tracker (replaces Google Sheet from launch plan)
- This phase depends on Phase 2B being complete

**DO NOT start Phase 2C until Phase 2B is fully working.**
**DO NOT add new UI features to the budgeting pages until Supabase is wired.**
**DO NOT start Plaid/bank sync — that's Phase 3.**

## Architecture

```
budgeting-app/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Dashboard (stats, charts, recent transactions, quote)
│   │   ├── budgets/              # Budget categories with spend vs. budgeted
│   │   ├── transactions/         # Transaction list with search/filter
│   │   ├── goals/                # Savings goals with progress bars
│   │   ├── achievements/         # Badges filtered by category
│   │   ├── settings/             # User preferences
│   │   ├── coaching/             # PUBLIC landing page — services, booking, testimonials
│   │   ├── coach-dashboard/      # ADMIN-ONLY — client management (Phase 2C)
│   │   │   ├── page.tsx          # Client list overview
│   │   │   ├── clients/[id]/     # Individual client view (intake, sessions, action items)
│   │   │   └── session-notes/    # Post-session follow-up generator
│   │   ├── layout.tsx            # Root layout with sidebar
│   │   └── globals.css           # Theme variables, glass-card class
│   ├── components/
│   │   ├── sidebar.tsx           # Nav — responsive drawer on mobile, fixed on desktop
│   │   ├── dashboard/            # 5 widgets: stat-cards, spending-chart, category-breakdown,
│   │   │                         #   recent-transactions, quote-banner
│   │   ├── coaching/             # Landing page components (hero, pricing cards, FAQ, testimonials)
│   │   ├── coach-dashboard/      # Admin components (client cards, session forms, email preview)
│   │   └── ui/                   # 12 shadcn primitives (button, card, dialog, sheet, etc.)
│   └── lib/
│       ├── supabase.ts           # Supabase client init (Phase 2B)
│       ├── hooks/                # Supabase query hooks — one per data type (Phase 2B)
│       ├── demo-data.ts          # Mock data — BEING REPLACED with Supabase queries
│       ├── quotes.ts             # Motivational quotes with daily rotation
│       └── utils.ts              # cn() helper (clsx + tailwind-merge)
├── docs/
│   ├── schema.md                 # Supabase tables, columns, types, RLS (KEEP UPDATED)
│   ├── queries.md                # All SQL queries with plain English explanations
│   └── env-vars.md               # Environment variable names and purposes (no values)
```

## Tech Stack
- Next.js 16 (App Router) + React 19 + TypeScript 5 (strict)
- Tailwind CSS 4 + tw-animate-css + class-variance-authority
- recharts 3 — BarChart (spending), PieChart (category donut)
- lucide-react — all icons
- @supabase/supabase-js 2 — installed, wiring in Phase 2B
- Calendly embed — for /coaching page booking widget (no package needed, just embed script)
- No testing framework yet

## Commands
```bash
cd budgeting-app
npm run dev -- -p 3001   # http://localhost:3001 (port 3001 — Creator Hub uses 3000)
npm run build            # production build
npm run lint             # ESLint
```

## Data Shapes

### Budgeting App (existing — to become Supabase tables)
```typescript
Transaction { id, description, amount, category, date, type: "income" | "expense" }
BudgetCategory { name, budgeted, spent, color, icon }
Goal { id, name, target, saved, color, icon, deadline }
Achievement { id, name, description, icon, earned: boolean, earnedDate, category, color }
```

### Coaching Platform (new — Phase 2C Supabase tables)
```typescript
CoachingClient { id, name, email, phone, intake_date, status: "active" | "completed" | "paused", package_type: "single" | "commitment", payment_status }
IntakeForm { id, client_id, monthly_income, fixed_expenses, total_debt, savings, investments, top_spending_categories, financial_goal, goal_timeline, current_tools, habit_to_fix, credit_score_range, submitted_at }
CoachingSession { id, client_id, session_number, date, granola_notes, key_discussion_points, action_items: string[], next_session_date }
FollowUpEmail { id, session_id, client_id, email_body, sent: boolean, sent_at }
```
When Supabase tables are created, update docs/schema.md with exact table names, column types, RLS policies, and relationships. TypeScript types must match Supabase row types exactly.

## Key Patterns
- All pages are "use client" — local state via useState, no global store (may migrate to server components during Supabase phase)
- Demo data imported from lib/demo-data.ts — replace each import with a Supabase query hook in lib/hooks/
- Icon mapping: components use Record<string, LucideIcon> to pick icons by category name
- Glass-morphism: semi-transparent cards with backdrop blur via .glass-card CSS class
- Path alias: @/* maps to ./src/*
- /coaching route is PUBLIC — no auth required, visible to anyone
- /coach-dashboard route is ADMIN-ONLY — requires auth, only Frank can access
- Coaching page sidebar should NOT show budgeting nav — it's a separate public-facing experience

## Color System (Do Not Change)
- Primary green: #00D632
- Dark background: #0A0A0F
- Card background: #12121A
- Each category/goal/achievement has its own accent color defined in demo-data.ts
- Coaching landing page uses the same color system for brand consistency

## Style Conventions
- PascalCase components, camelCase utils, lowercase page slugs
- 2-space indent, double quotes, semicolons
- Tailwind: rounded-2xl cards, gap-4 spacing, mobile-first (sm:, lg:)
- Section comments in JSX: {/* Header */}
- Animations: transition-all duration-300, gradient effects

## Do NOT
- Change the color system or theme without explicit approval
- Install new UI component libraries — we use shadcn/ui only
- Install new charting libraries — we use recharts only
- Refactor existing working components while building new features
- Add pages or routes not in the current phase plan
- Use localStorage for any sensitive, financial, or client data
- Hardcode API keys or Supabase credentials
- Create API routes without error handling
- Skip TypeScript types — everything must be typed
- Store actual client financial data without RLS policies in place
- Build coach-dashboard features before Supabase auth is working
- Make the coaching page dependent on any backend/database — it must work as a static page
- Give coaching clients access to other clients' data (RLS must enforce isolation)

## Decision Log
- recharts over Chart.js — better React integration, less config needed
- shadcn/ui over Material UI — lighter, more customizable, fits dark theme
- Glass-morphism over flat design — matches premium finance app feel
- Demo data first, Supabase second — validate UI/UX before wiring backend
- No global state manager yet — useState is sufficient until complexity demands it
- Supabase over Firebase — relational SQL database needed for financial data with complex joins; predictable pricing; no vendor lock-in; open source
- Coaching pages inside Strive (not separate project) — the coaching validates the app, the app extends the coaching; single codebase, shared design system
- Calendly embed over custom booking — zero cost, proven UX, handles scheduling complexity we don't need to build
- Coach dashboard admin-only — client data is sensitive, only Frank should see it
- Venmo/Zelle/PayPal for payments at launch — zero fees, no Stripe integration needed yet

## Coaching Business Context
- Financial COACHING only — NOT financial advising (no investment advice, no account management)
- Required disclaimer on all coaching-related pages: "Frankie T Budget Coaching provides financial coaching services for educational and informational purposes. This is not licensed financial advice, investment advice, or tax advice."
- Pricing: $100/session (single), $250/3-session package (launch), raising to $150/$400 after 10+ clients
- Session framework: Diagnose (15 min) → Solve (30 min) → Commit (15 min)
- Post-session workflow: Granola AI transcript → Claude generates follow-up email → Frank reviews and sends

## What's Not Done Yet
- [ ] Coaching landing page (/coaching) — Phase 2A, CURRENT PRIORITY
- [ ] Supabase project setup + env vars — Phase 2B
- [ ] Auth (login/signup) — Phase 2B
- [ ] Replace demo data with Supabase queries — Phase 2B
- [ ] Coach dashboard (/coach-dashboard) — Phase 2C
- [ ] Client intake form viewer — Phase 2C
- [ ] Post-session follow-up email generator — Phase 2C
- [ ] Client tracker/CRM — Phase 2C
- [ ] API routes — Phase 2B/2C
- [ ] Testing framework
- [ ] Deployment (Vercel)
- [ ] Plaid bank sync — Phase 3
- [ ] Strive app for coaching clients — Phase 3

## Related
- Blueprint: docs/Strive_App_Blueprint.docx
- Coaching Business Plan: docs/Frankie_T_Coaching_Business_Launch_Plan.docx
- Repo: franktiiii/strive-repo
