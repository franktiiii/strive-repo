# Strive — Database Schema
# Updated by Claude Code after every database change (see Global CLAUDE.md rules)
# Last updated: 2026-03-16

## Tables

### transactions
| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | NO | gen_random_uuid() | Primary key |
| user_id | uuid | NO | — | References auth.users(id), cascade delete |
| description | text | NO | — | e.g. "Whole Foods Market" |
| amount | numeric(10,2) | NO | — | Negative for expenses, positive for income |
| category | text | NO | — | e.g. "Food & Dining", "Income" |
| date | date | NO | current_date | Transaction date |
| type | text | NO | — | Check constraint: 'income' or 'expense' |
| created_at | timestamptz | YES | now() | Row creation timestamp |

**Relationships:**
- belongs_to: auth.users(id) via user_id

**RLS Policies:**
- "Users can view own transactions": SELECT where auth.uid() = user_id
- "Users can insert own transactions": INSERT where auth.uid() = user_id
- "Users can update own transactions": UPDATE where auth.uid() = user_id
- "Users can delete own transactions": DELETE where auth.uid() = user_id

---

### budget_categories
| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | NO | gen_random_uuid() | Primary key |
| user_id | uuid | NO | — | References auth.users(id), cascade delete |
| name | text | NO | — | e.g. "Housing", "Food & Dining" |
| budgeted | numeric(10,2) | NO | 0 | Monthly budget amount |
| color | text | NO | '#00D632' | Hex color for UI |
| icon | text | NO | 'Wallet' | Lucide icon name |
| created_at | timestamptz | YES | now() | Row creation timestamp |

**Relationships:**
- belongs_to: auth.users(id) via user_id

**RLS Policies:**
- "Users can view own budget categories": SELECT where auth.uid() = user_id
- "Users can insert own budget categories": INSERT where auth.uid() = user_id
- "Users can update own budget categories": UPDATE where auth.uid() = user_id
- "Users can delete own budget categories": DELETE where auth.uid() = user_id

**Note:** `spent` is NOT stored — it's calculated by summing transactions for that category in the current month.

---

### goals
| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | NO | gen_random_uuid() | Primary key |
| user_id | uuid | NO | — | References auth.users(id), cascade delete |
| name | text | NO | — | e.g. "Emergency Fund" |
| target | numeric(10,2) | NO | — | Goal target amount |
| saved | numeric(10,2) | NO | 0 | Amount saved so far |
| color | text | NO | '#00D632' | Hex color for UI |
| icon | text | NO | 'Target' | Lucide icon name |
| deadline | date | YES | — | Optional goal deadline |
| created_at | timestamptz | YES | now() | Row creation timestamp |

**Relationships:**
- belongs_to: auth.users(id) via user_id

**RLS Policies:**
- "Users can view own goals": SELECT where auth.uid() = user_id
- "Users can insert own goals": INSERT where auth.uid() = user_id
- "Users can update own goals": UPDATE where auth.uid() = user_id
- "Users can delete own goals": DELETE where auth.uid() = user_id

---

### achievements
| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | NO | gen_random_uuid() | Primary key |
| user_id | uuid | NO | — | References auth.users(id), cascade delete |
| name | text | NO | — | e.g. "First Steps" |
| description | text | NO | — | e.g. "Create your first budget" |
| icon | text | NO | — | Lucide icon name |
| earned | boolean | NO | false | Whether the achievement is unlocked |
| earned_date | date | YES | — | Date the achievement was earned |
| category | text | NO | — | Check constraint: 'savings', 'spending', 'streak', 'milestone' |
| color | text | NO | '#00D632' | Hex color for UI |
| created_at | timestamptz | YES | now() | Row creation timestamp |

**Relationships:**
- belongs_to: auth.users(id) via user_id

**RLS Policies:**
- "Users can view own achievements": SELECT where auth.uid() = user_id
- "Users can insert own achievements": INSERT where auth.uid() = user_id
- "Users can update own achievements": UPDATE where auth.uid() = user_id
- "Users can delete own achievements": DELETE where auth.uid() = user_id

## Enums
No custom enums — using check constraints instead:
- `transactions.type`: 'income' | 'expense'
- `achievements.category`: 'savings' | 'spending' | 'streak' | 'milestone'

## Edge Functions
<!-- None yet -->

## Migrations Log
| Date | Change | Why |
|------|--------|-----|
| 2026-03-16 | Created transactions, budget_categories, goals, achievements tables with RLS | Phase 2B — initial Supabase setup |
