# Read Me First (Claude Code)

> If you are Claude Code opening this project for the first time, follow this exact sequence.

## Step 1: Read these files in order

1. `CLAUDE.md` — Project rules, architecture, pitfalls. Don't skim, read end-to-end.
2. `PROJECT-CONTEXT.md` — Business case, monetization, launch plan.
3. `README.md` — Public-facing overview.

Total reading time: ~15 minutes. Don't skip — the pitfalls section will save you hours.

## Step 2: Verify the project is in a known-good state

```bash
pnpm install
pnpm typecheck
```

If typecheck fails, fix it before any feature work.

## Step 3: Check current state

```bash
git log --oneline -10              # See recent changes
git status                         # See uncommitted work
ls -la apps/web/.env.local 2>/dev/null && echo "env present" || echo "env missing"
```

## Step 4: Ask Piyush what to work on

Don't propose features unprompted. Piyush has a clear roadmap. Ask:

> "Read the project context. Ready when you are — what's the priority for this session?"

## Things you should NEVER do without explicit approval

1. Add a new top-level dependency (anything in `package.json` dependencies)
2. Add a new table to the database
3. Modify RLS policies
4. Touch Razorpay flow code
5. Push to `main` directly (always PR or explicit "push it")
6. Change the `core/` API surface (queries.ts, types.ts) — breaks future apps
7. Add emoji to code or commits
8. Add USD pricing or Stripe references

## Things you can do freely

1. Add a new repo to `scripts/seed-data.ts` (use `/add-repo` slash command)
2. Fix typos in curator takes
3. Improve component styling (within Tailwind tokens)
4. Add/improve docstrings and comments
5. Fix linting errors
6. Run `pnpm typecheck` and `pnpm build` to verify state
7. Read any file in the project to understand it

## Custom slash commands available

Located in `.claude/commands/`:

- `/add-repo <owner/name>` — Add a new repo to the directory with a curator take
- `/ship-check` — Pre-deployment safety check (RLS, secrets, typescript, India context)
- `/onboard-sponsor <details>` — Manual sponsor onboarding (until self-serve UI exists)
- `/write-collection <theme>` — Create a curated collection of repos

Use them. They encode the project's conventions.

## When Piyush asks you to do something

1. Read what he wants
2. Check `CLAUDE.md` rules — does this conflict with NEXUS rules?
3. If conflict, push back. Don't agree with everything.
4. If clear, plan first, code second. Show the plan.
5. After approval, implement
6. Run `pnpm typecheck` before saying done
7. Run `/ship-check` before any deploy

## Voice when reporting back to Piyush

- Direct, code-first
- No "Great question!" "I'd be happy to!" preambles
- Show diffs, not paragraphs
- Skip obvious explanations
- Push back when you disagree
- Hinglish is fine — he uses it casually
- No emoji unless he uses one first

## Brutal truths he's already heard (don't re-pitch)

- Directories take 6-12 months to rank
- Takes are the moat, not the code
- Sponsors won't pay until traffic exists
- Newsletter is the real product
- 80% of build was the boring 80% — that's normal
- Year 2 is when money shows up

Don't waste tokens re-explaining these.

---

Ready? Start with `cat CLAUDE.md`.
