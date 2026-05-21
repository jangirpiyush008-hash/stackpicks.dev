---
description: Pre-deployment safety check before pushing to production
---

Run the StackPicks pre-ship safety check per NEXUS rules. Execute these steps in order and report PASS/FAIL for each:

### 1. Environment & secrets
- Verify `.env.local` is in `.gitignore` (grep .gitignore)
- Verify no `.env*` files are staged for commit (`git status`)
- Check no secrets in source code: grep for `RAZORPAY_KEY_SECRET`, `SUPABASE_SERVICE_ROLE_KEY` in TS/TSX files (should only appear inside `process.env.*` references)

### 2. RLS coverage
- Read `supabase/migrations/20260521000001_init.sql`
- For every `create table public.*` statement, verify there's a matching `alter table ... enable row level security`
- Report any tables that have a `create table` but missing the enable-RLS line

### 3. TypeScript
- Run `pnpm typecheck` (or `pnpm --filter web typecheck`)
- Report any errors found
- If 0 errors: PASS

### 4. Razorpay security
- Grep `apps/web/app/api/webhook/razorpay/route.ts` for `verifyWebhookSignature` — must be called before processing
- Grep `apps/web/app/api/checkout/sponsor/route.ts` (and any future checkout routes) — orders must use `createOrder` from `core/razorpay`

### 5. Cron security
- Verify `apps/web/app/api/cron/scrape-github/route.ts` checks `Authorization: Bearer ${CRON_SECRET}` before doing work

### 6. Build
- Run `pnpm build`
- Report any errors

### 7. India context
- Grep for `"$"` or `USD` in source files — flag any USD pricing (should all be INR)
- Grep for `Stripe` or `stripe` — flag any Stripe references (Razorpay only per NEXUS rules)

### 8. Emoji check
- Grep TS/TSX files for emoji characters in code (not UI strings, just code/comments)
- Report any found

### Output format

Print a table:

| Check | Status | Notes |
|---|---|---|
| Env secrets | PASS/FAIL | ... |
| RLS coverage | PASS/FAIL | ... |
| TypeScript | PASS/FAIL | ... |
| Razorpay security | PASS/FAIL | ... |
| Cron security | PASS/FAIL | ... |
| Build | PASS/FAIL | ... |
| India context | PASS/FAIL | ... |
| Emoji in code | PASS/FAIL | ... |

If any check fails, do NOT proceed with deploy. Fix the failure first.

If all pass, give the green light: "Ready to ship. Next: `git push origin main` to trigger Vercel deploy."
