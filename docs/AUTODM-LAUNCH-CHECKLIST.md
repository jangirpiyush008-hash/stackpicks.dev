# StackPicks AutoDM — Launch Checklist

> Single source of truth for "what does Piyush need to do to take AutoDM live."
> Code is done. This is the one-time external setup.

---

## 1. Meta App (Instagram Graph API)

Go to https://developers.facebook.com/apps → your AutoDM app.

- [ ] **Permissions & Features** → request advanced access for:
  - `instagram_business_basic`
  - `instagram_business_manage_messages`
  - `instagram_business_manage_comments`
- [ ] **Use cases** → Messaging on Instagram → add use case → submit screencast (60-90 sec showing comment → DM)
- [ ] **Facebook Login for Business** → Settings → **Valid OAuth Redirect URIs** → add EXACTLY:
  ```
  https://autodm.stackpicks.dev/api/autodm/oauth/callback
  ```
- [ ] **Webhooks** → Instagram → Edit subscription → Callback URL:
  ```
  https://autodm.stackpicks.dev/api/autodm/webhook
  ```
  Verify token: paste the same value as `AUTODM_META_VERIFY_TOKEN` in Railway.
  Subscribe to: `comments`, `live_comments`, `messages`, `mentions`.
  (`live_comments` is what powers the "comment on my Live → instant DM"
  flow — it is a separate field from `comments` and must be ticked.)
- [ ] **App Review** → submit. Expect 5-14 day review.

---

## 2. Razorpay

Go to https://dashboard.razorpay.com/app/subscriptions/plans.

- [ ] Create **3 monthly plans**:
  - Creator — ₹499/month
  - Pro — ₹1,499/month
  - Agency — ₹4,999/month
- [ ] Copy the 3 plan IDs (start with `plan_`). They go in Railway env (next section).
- [ ] **Webhooks** → Add endpoint:
  ```
  https://autodm.stackpicks.dev/api/autodm/billing/webhook
  ```
  Subscribe to: `subscription.authenticated`, `subscription.activated`, `subscription.charged`, `subscription.cancelled`, `subscription.completed`, `subscription.paused`, `subscription.expired`.
  Use the same `RAZORPAY_WEBHOOK_SECRET` already in Railway.

---

## 3. Resend (email)

Go to https://resend.com/domains.

- [ ] Verify `stackpicks.dev` as a sending domain (or whatever domain you want for `AUTODM_DIGEST_FROM`).
- [ ] (Optional) Create a separate "AutoDM" audience if you want to segment newsletter signups from product emails.

---

## 4. Railway env vars

Paste these into Railway → project → Variables. Restart the deployment after.

```bash
# AutoDM origin (canonical) — every product URL routes through here
AUTODM_ORIGIN=https://autodm.stackpicks.dev

# Meta App (the AutoDM-dedicated one)
AUTODM_META_APP_ID=...
AUTODM_META_APP_SECRET=...
AUTODM_META_VERIFY_TOKEN=<random string, same one paste into Meta webhook config>

# Token encryption (32-byte key)
AUTODM_ENC_KEY=$(openssl rand -base64 32)

# Razorpay plan IDs from step 2
RAZORPAY_AUTODM_PLAN_CREATOR=plan_xxx
RAZORPAY_AUTODM_PLAN_PRO=plan_xxx
RAZORPAY_AUTODM_PLAN_AGENCY=plan_xxx

# Anthropic (AI onboarding + voice-cloned followups)
ANTHROPIC_API_KEY=sk-ant-...

# Email (Resend) — only if you want a non-default sender
AUTODM_DIGEST_FROM=StackPicks AutoDM <hello@stackpicks.dev>
```

`CRON_SECRET`, `RAZORPAY_KEY_ID`/`SECRET`/`WEBHOOK_SECRET`, `NEXT_PUBLIC_SUPABASE_*`, and `SUPABASE_SERVICE_ROLE_KEY` are already in Railway.

---

## 5. cron-job.org (3 jobs)

Go to https://cron-job.org/en/members/jobs/. Add all 3.

Each one needs a single header: `Authorization: Bearer <your CRON_SECRET>`.

| Job name | URL | Schedule |
|---|---|---|
| **AutoDM Followup** | `https://autodm.stackpicks.dev/api/autodm/followup-tick` | every 30 min |
| **AutoDM Digest** | `https://autodm.stackpicks.dev/api/autodm/digest-tick` | weekly · Mon 03:30 UTC (09:00 IST) |
| **AutoDM Health** | `https://autodm.stackpicks.dev/api/autodm/webhook-health-tick` | every 30 min |

Timeouts: 120 seconds on all three.

---

## 6. First-run smoke test (after Meta review clears)

- [ ] Sign in to https://autodm.stackpicks.dev/login with your own account.
- [ ] Go to `/connect`. Connect a test IG (your own or @stackpicksdev).
- [ ] Wait ~60 sec → refresh the dashboard. You should see 5 starter rules drafted.
- [ ] Activate one rule. Pick a recent post of the connected account.
- [ ] Drop a test comment using the rule's keyword from another IG account.
- [ ] Verify:
  - Public reply appears under the comment (within 5 sec)
  - DM arrives in the test commenter's inbox (within 30 sec)
  - Dashboard "Recent activity" shows the send
  - Click the DM's CTA button. Confirm the URL is `autodm.stackpicks.dev/c/<id>`, redirects correctly, and the Analytics page shows 1 click within a minute.

If any step fails, the **Webhook Health Banner** will tell you the cause within 24h. For instant debug, hit:
```
curl -H "Authorization: Bearer $CRON_SECRET" \
  https://autodm.stackpicks.dev/api/autodm/webhook-health-tick
```
The JSON response will tell you which tenant has gone silent.

---

## 6b. If you connected Instagram BEFORE the Live-comments feature

Your test account was connected before `live_comments` subscriptions
existed. To enable Live without a full reconnect: open the dashboard and
click **"Re-sync connection"** (in the header, and in the webhook-health
banner). It re-asserts all webhook fields including `live_comments`.
New signups get this automatically on first connect — this is only for
already-connected accounts.

---

## 7. Optional polish (do AFTER first 5 users)

- StackShare + OpenAlternative submission (task #112)
- Google OAuth verification kickoff (task #114)
- 4 more OAuth apps for Connect (task #116)
- Carousels #3-#6 for IG (tasks #118, #119)

---

End of checklist. If anything blocks, the **most likely culprit is step 1 (Meta review)** — keep that submission moving while you do the rest.
