---
description: Create a sponsored slot manually (admin task, no UI yet)
---

Help me onboard a new sponsor manually until the sponsor self-serve UI is built.

I'll give you: company name, contact email, slot type, duration, and either a tracked repo_id OR external_name + external_url + external_logo.

Run this exact sequence:

### Step 1: Insert sponsor record (if new)

Generate a Supabase SQL Editor query:

```sql
insert into public.sponsors (
  user_id, company_name, contact_email, contact_phone, website, gstin
) values (
  null, -- user_id null until they create an account
  '$COMPANY_NAME',
  '$CONTACT_EMAIL',
  '$CONTACT_PHONE_OR_NULL',
  '$WEBSITE_OR_NULL',
  '$GSTIN_OR_NULL'
)
returning id;
```

Tell me to run this and paste back the returned `id` as `$SPONSOR_ID`.

### Step 2: Insert sponsored slot

Once I have `$SPONSOR_ID`:

```sql
insert into public.sponsored_slots (
  sponsor_id, placement, category_id, repo_id,
  external_name, external_url, external_logo,
  starts_at, ends_at, amount_inr, status
) values (
  '$SPONSOR_ID',
  '$PLACEMENT',  -- 'category_top' | 'homepage_featured' | 'newsletter'
  '$CATEGORY_ID_OR_NULL',
  '$REPO_ID_OR_NULL',
  '$EXTERNAL_NAME_OR_NULL',
  '$EXTERNAL_URL_OR_NULL',
  '$EXTERNAL_LOGO_OR_NULL',
  now(),
  now() + interval '$MONTHS months',
  $AMOUNT_PAISE,  -- in paise (₹2,500/mo = 250000)
  'active'  -- skip pending state for manual onboarding
);
```

### Step 3: Verify

Tell me to:
1. Visit the relevant page (`/category/[slug]` for category_top, `/` for homepage_featured)
2. Confirm the sponsored card is rendering
3. Click it and confirm `/go/sponsored/[id]` redirects to the right URL

### Step 4: Send the spec confirmation email

Generate a short confirmation email to send the sponsor:

> Subject: StackPicks sponsorship live — [Company name]
>
> Hi [Name],
>
> Your sponsorship is live as of today. Placement: [details]. Duration: [N] months. Total: ₹[X].
>
> You can view it here: [URL]
>
> I'll send a monthly impressions + clicks report on the 1st of each month. If you need to update copy or logo, reply to this email.
>
> — Piyush

Pricing reference (paise):
- category_top: 250000 (₹2,500/mo)
- homepage_featured: 1000000 (₹10,000/mo)
- newsletter: 500000 (₹5,000/send)

Sponsor details: $ARGUMENTS
