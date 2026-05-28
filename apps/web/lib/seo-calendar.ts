/**
 * 90-day SEO + GEO ranking calendar.
 *
 * One primary task per day + a daily recurring checklist (~15 min). Total per
 * day target: ~60 minutes. The plan is opinionated and assumes the technical
 * SEO/GEO foundation is already shipped (it is, as of May 26, 2026).
 *
 * Phase 1 (Days 1-14):  Indexing + foundation directories
 * Phase 2 (Days 15-44): Backlink + outreach campaign
 * Phase 3 (Days 45-74): Content velocity
 * Phase 4 (Days 75-90): Data-driven double-down
 *
 * Completion state lives in supabase.seo_tasks (keyed by `day`). The plan
 * itself is static — single source of truth, easy to edit, no CMS needed.
 */

export type SeoCategory =
  | 'submission'   // directory/list submission
  | 'outreach'     // cold pitch / email
  | 'content'      // write a blog/comparison/page
  | 'backlink'     // get a link from somewhere
  | 'technical'   // schema, perf, indexing
  | 'measurement'; // GSC/Bing review

export interface SeoTask {
  day: number;                  // 1-90
  category: SeoCategory;
  title: string;                // imperative, short
  description: string;          // 2-3 sentences, exactly what to do
  url?: string;                 // target URL if any (submission form / pitch target)
  expected_time_min: number;    // realistic minutes
  expected_outcome: string;     // measurable result by EOD
}

export const SEO_DAILY_CHECKLIST: string[] = [
  'Open Google Search Console → Performance → note today\'s impressions + clicks',
  'Open Bing Webmaster → Site Explorer → check for new crawl errors',
  'Reply to any new dev newsletter editor / podcast host emails within 24h',
  'If you published anything new today → trigger IndexNow ping via /api/indexnow',
];

export const SEO_TASKS: SeoTask[] = [
  // ─────────────────────────────────────────────────────────────────────
  // PHASE 1 — FOUNDATION + INDEXING  (Days 1-14)
  // ─────────────────────────────────────────────────────────────────────
  {
    day: 1, category: 'submission',
    title: 'Create Wikidata entry for StackPicks',
    description: 'Create a new Wikidata item with label "StackPicks", instance-of website (Q35127), official website https://stackpicks.dev, founded by Piyush Jangir. This feeds Google Knowledge Graph + ChatGPT entity index. Highest-leverage submission you will do all quarter.',
    url: 'https://www.wikidata.org/wiki/Special:NewItem',
    expected_time_min: 40,
    expected_outcome: 'Wikidata Q-number assigned, item visible publicly. Also add a Piyush Jangir person item linked as founder.',
  },
  {
    day: 2, category: 'submission',
    title: 'Submit to BetaList',
    description: 'Free product launch directory. Fill the form: company name, tagline, URL, screenshot, founder name. Approval takes 5-7 days but listings often get 100-500 visits + 1-2 backlinks.',
    url: 'https://betalist.com/submit',
    expected_time_min: 25,
    expected_outcome: 'Submission confirmation email received.',
  },
  {
    day: 3, category: 'submission',
    title: 'Create Indie Hackers product page',
    description: 'Sign up if you haven\'t. Add stackpicks.dev as a product. Fill: description, pricing, founders, tech stack. Indie Hackers product pages rank surprisingly well in Google for branded queries.',
    url: 'https://www.indiehackers.com/products/new',
    expected_time_min: 30,
    expected_outcome: 'Product page live + linked from your IH profile.',
  },
  {
    day: 4, category: 'submission',
    title: 'Submit to SaaSHub',
    description: 'SaaSHub indexes ~20k SaaS tools, DR ~70, free do-follow backlink. Fill all tabs: Details, Pricing, Competitors (Composio, Pipedream, Zapier), Categories (Developer Tools + AI Tools), Images, Features, Q&A. The "alternative to" relationships are the SEO payoff. (Swapped in for AlternativeTo, whose submission form rejects new entries.)',
    url: 'https://www.saashub.com/submit-software',
    expected_time_min: 30,
    expected_outcome: 'Listing live with 3+ alternative relationships + do-follow link.',
  },
  {
    day: 5, category: 'submission',
    title: 'Submit to StackShare + OpenAlternative.co',
    description: 'StackShare (DR ~75) — add StackPicks under Developer Tools, optionally post your stack (Next.js, Supabase, Razorpay) as a decision. OpenAlternative.co — thematic bullseye since StackPicks is an open-source directory. Both free.',
    url: 'https://stackshare.io/tools/new',
    expected_time_min: 30,
    expected_outcome: 'Both submitted; 2 more do-follow backlinks.',
  },
  {
    day: 6, category: 'submission',
    title: 'Submit to LaunchingNext + StartupBase',
    description: 'Two more free startup directories. LaunchingNext gives a launch day boost. StartupBase has consistent organic traffic for "new startups" queries.',
    url: 'https://www.launchingnext.com/submit/',
    expected_time_min: 25,
    expected_outcome: 'Both submitted.',
  },
  {
    day: 7, category: 'measurement',
    title: 'Week 1 review — indexing status check',
    description: 'In GSC → Coverage → note how many of the 360 sitemap URLs are indexed. In Bing Webmaster → Pages → same count. Identify the 5 URLs that are "Discovered, not indexed" and request manual indexing.',
    expected_time_min: 30,
    expected_outcome: 'Coverage delta documented. Manual indexing requests submitted.',
  },
  {
    day: 8, category: 'backlink',
    title: 'Open PR: add stackpicks.dev to awesome-nextjs',
    description: 'Fork github.com/unicodeveloper/awesome-nextjs. Add an entry under "Tutorials" or "Resources" linking to /build/ship-a-saas. Keep the PR description short and explain why it fits.',
    url: 'https://github.com/unicodeveloper/awesome-nextjs',
    expected_time_min: 30,
    expected_outcome: 'PR opened. Track in a spreadsheet.',
  },
  {
    day: 9, category: 'backlink',
    title: 'Open PRs: awesome-react + awesome-self-hosted',
    description: 'Same playbook: fork, add stackpicks.dev under the right section, open PR. For awesome-self-hosted link to /self-hosted. For awesome-react link to /skills/frontend or /preview.',
    expected_time_min: 45,
    expected_outcome: '2 PRs opened.',
  },
  {
    day: 10, category: 'submission',
    title: 'Submit to TheresAnAIForThat (TAAFT)',
    description: 'TAAFT is the largest AI tools directory and ranks #1 for many "AI tools for X" queries. Submit stackpicks.dev with focus on the /tools page and /mcp directory.',
    url: 'https://theresanaiforthat.com/submit-ai/',
    expected_time_min: 25,
    expected_outcome: 'Submission queued.',
  },
  {
    day: 11, category: 'submission',
    title: 'Submit to Toolify.ai + FuturePedia',
    description: 'Two more AI tool directories. Both have DR 60+. Use the /tools page as the canonical link and /mcp as a secondary.',
    expected_time_min: 30,
    expected_outcome: 'Both submitted.',
  },
  {
    day: 12, category: 'content',
    title: 'Create Dev.to account + cross-post mcp-explained',
    description: 'Sign up on dev.to. Cross-post the MCP blog post WITH a canonical URL pointing back to stackpicks.dev/blog/mcp-explained. Add 4-5 tags. Dev.to has DR 86 — one well-placed post can drive real traffic + a permanent backlink.',
    url: 'https://dev.to/new',
    expected_time_min: 40,
    expected_outcome: 'Post published with canonical_url set correctly.',
  },
  {
    day: 13, category: 'backlink',
    title: 'Reddit r/SideProject launch post',
    description: 'Write a 200-word post: "I shipped a curated OSS dev directory in 30 days — here\'s the story + the link." Be honest, no buzzwords. Link to stackpicks.dev. Reply to every comment within 6 hours.',
    url: 'https://reddit.com/r/SideProject/submit',
    expected_time_min: 45,
    expected_outcome: 'Post live + at least 5 comments responded to.',
  },
  {
    day: 14, category: 'measurement',
    title: 'Week 2 review — first-2-weeks scorecard',
    description: 'Tally: how many of the 360 URLs got indexed by Google? By Bing? Any backlinks showing up in Bing Webmaster\'s Backlinks tab? Note baseline metrics in a Notion / Google Sheet — you\'ll compare against day 90.',
    expected_time_min: 45,
    expected_outcome: 'Baseline scorecard documented.',
  },

  // ─────────────────────────────────────────────────────────────────────
  // PHASE 2 — BACKLINK + OUTREACH CAMPAIGN  (Days 15-44)
  // ─────────────────────────────────────────────────────────────────────
  {
    day: 15, category: 'outreach',
    title: 'Pitch TLDR newsletter',
    description: 'Email dan@tldrnewsletter.com. Subject: "Curator-led OSS directory for builders". Body: 3 sentences max. What it is. Why their audience cares. The link. No attachments.',
    url: 'mailto:dan@tldrnewsletter.com',
    expected_time_min: 30,
    expected_outcome: 'Email sent + logged in your outreach spreadsheet.',
  },
  {
    day: 16, category: 'outreach',
    title: 'Pitch Hacker Newsletter (Kale)',
    description: 'Submit via https://hackernewsletter.com/submit/. Same 3-sentence pitch. Highlight what\'s DIFFERENT about your directory (opinionated takes, not star sorting).',
    url: 'https://hackernewsletter.com/submit/',
    expected_time_min: 25,
    expected_outcome: 'Submission sent.',
  },
  {
    day: 17, category: 'outreach',
    title: 'Pitch Bytes.dev newsletter',
    description: 'Bytes is a JS/React-focused newsletter, ~250k subscribers. Pitch via their contact form. Lead with /skills/frontend or your shadcn comparison page.',
    expected_time_min: 25,
    expected_outcome: 'Pitch submitted.',
  },
  {
    day: 18, category: 'outreach',
    title: 'Pitch Console.dev newsletter',
    description: 'Console covers "tools for developers" specifically. STRONGEST fit you have. Email contact@console.dev with a paragraph + 3 best links from your directory.',
    url: 'https://console.dev',
    expected_time_min: 30,
    expected_outcome: 'Email sent with 3 specific tool links from your site.',
  },
  {
    day: 19, category: 'outreach',
    title: 'Pitch Pointer.io + Frontend Focus',
    description: 'Two more dev newsletters. Same template you\'re refining now. By the 5th pitch your conversion rate should be improving.',
    expected_time_min: 30,
    expected_outcome: 'Both pitched.',
  },
  {
    day: 20, category: 'outreach',
    title: 'Pitch JavaScript Weekly + Node Weekly',
    description: 'Both run by Cooper Press (Peter Cooper). One pitch can land in either or both. peter@cooperpress.com — keep it crisp.',
    expected_time_min: 30,
    expected_outcome: 'Email to Cooper Press sent.',
  },
  {
    day: 21, category: 'measurement',
    title: 'Week 3 review — outreach reply audit',
    description: 'Of the 6 newsletter pitches sent: who replied? Who ignored? Reply to the responsive ones with the exact info they need. Iterate the pitch template for week 4.',
    expected_time_min: 30,
    expected_outcome: 'Outreach spreadsheet updated. Pitch template v2 drafted.',
  },
  {
    day: 22, category: 'outreach',
    title: 'Cold email Theo (t3.gg) — feature request',
    description: 'Email theo@t3.gg or DM on X. Don\'t pitch a feature — just send "saw your video on X, here\'s a tool we curate that fits". Builds relationship without asking.',
    expected_time_min: 30,
    expected_outcome: 'Message sent.',
  },
  {
    day: 23, category: 'outreach',
    title: 'Cold email Kent C. Dodds + Web Dev Simplified',
    description: 'Same playbook — soft mention, not a pitch. Kent loves tools; Kyle (WDS) does deep tool reviews. Either could mention you in a future video.',
    expected_time_min: 30,
    expected_outcome: 'Both contacted.',
  },
  {
    day: 24, category: 'submission',
    title: 'Show HN: StackPicks — Tuesday 10am IST sweet spot',
    description: 'ONE shot only. Submit https://stackpicks.dev to Hacker News with title "Show HN: StackPicks — curated open-source dev tools with honest takes". Tuesday morning IST = Monday evening PT = peak HN traffic window. Reply to every comment in the first 4 hours.',
    url: 'https://news.ycombinator.com/submit',
    expected_time_min: 60,
    expected_outcome: 'Submitted + actively responding to comments.',
  },
  {
    day: 25, category: 'backlink',
    title: 'Reddit r/webdev "I built a thing" post',
    description: 'Title: "Built a curated OSS dev directory. Looking for honest feedback." Be vulnerable. No marketing copy. Reddit punishes promotional tone but rewards genuine engagement.',
    url: 'https://reddit.com/r/webdev/submit',
    expected_time_min: 40,
    expected_outcome: 'Post live + engaging in comments.',
  },
  {
    day: 26, category: 'backlink',
    title: 'Reddit r/selfhosted post linking to /self-hosted',
    description: 'r/selfhosted has 400k subs and ranks aggressively in Google for "self-hosted X" queries. Share your /self-hosted/email or /self-hosted/notion page specifically — provide value, not promotion.',
    expected_time_min: 30,
    expected_outcome: 'Post live + min 10 upvotes.',
  },
  {
    day: 27, category: 'backlink',
    title: 'Reddit r/programming + Lobste.rs',
    description: 'Submit a SPECIFIC blog post URL (not the homepage) to r/programming and lobste.rs. They\'re strict about promo — link to the post and let it speak for itself.',
    expected_time_min: 30,
    expected_outcome: 'Both submitted.',
  },
  {
    day: 28, category: 'measurement',
    title: 'Week 4 review — HN + Reddit results',
    description: 'How many points did Show HN get? Front page or not? Total Reddit upvotes across 3 subs? Backlink count change in Bing Webmaster? Document the traffic spike for case-study material.',
    expected_time_min: 45,
    expected_outcome: 'Week 4 metrics documented.',
  },
  {
    day: 29, category: 'content',
    title: 'Cross-post shadcn-vs-mantine to Hashnode',
    description: 'Same playbook as Dev.to. Canonical URL points back to stackpicks.dev. Hashnode is React/JS heavy and has DR 86.',
    expected_time_min: 35,
    expected_outcome: 'Post live with canonical set.',
  },
  {
    day: 30, category: 'content',
    title: 'Cross-post building-saas to Medium',
    description: 'Medium has DR 95 but treats canonical URLs poorly. Use rel="canonical" anyway. Tag with #saas #indiehackers #opensource for max distribution.',
    expected_time_min: 35,
    expected_outcome: 'Post live.',
  },
  {
    day: 31, category: 'backlink',
    title: 'Submit to sindresorhus/awesome master list',
    description: 'Your awesome-stackpicks repo should now have 30+ days of activity (per task #78). Open a PR on github.com/sindresorhus/awesome adding awesome-stackpicks under the right category. Read his rules carefully.',
    url: 'https://github.com/sindresorhus/awesome',
    expected_time_min: 45,
    expected_outcome: 'PR opened (acceptance is multi-week but the PR itself is a backlink).',
  },
  {
    day: 32, category: 'outreach',
    title: 'Pitch Smashing Magazine guest post',
    description: 'Email editorial@smashingmagazine.com. Topic: "Open-source vs commercial dev tools: how to actually choose in 2026". Pitch a 2000-word piece. They link generously to author sites.',
    expected_time_min: 40,
    expected_outcome: 'Pitch sent.',
  },
  {
    day: 33, category: 'outreach',
    title: 'Pitch CSS-Tricks guest post',
    description: 'Same idea, different angle. "The honest case for opinionated dev tool directories" — meta-take with stackpicks as a case study.',
    expected_time_min: 40,
    expected_outcome: 'Pitch sent.',
  },
  {
    day: 34, category: 'outreach',
    title: 'Pitch Syntax.fm podcast',
    description: 'Email wes@syntax.fm. Subject: "Curator-built OSS directory — interesting episode angle?" Mention the technical stack (Next.js + Supabase + Razorpay) — Wes loves discussing stacks.',
    expected_time_min: 35,
    expected_outcome: 'Pitch sent.',
  },
  {
    day: 35, category: 'measurement',
    title: 'Week 5 review — outreach conversion',
    description: 'Of 13 pitches sent to date: how many replies? How many backlinks? Identify which pitch template variants work. Kill what doesn\'t.',
    expected_time_min: 30,
    expected_outcome: 'Outreach v3 template based on data.',
  },
  {
    day: 36, category: 'outreach',
    title: 'Pitch JS Party podcast (Changelog)',
    description: 'Email kball@changelog.com. They run dev-focused podcast network. Mention you\'re Indian, building solo — interesting angle for the show.',
    expected_time_min: 30,
    expected_outcome: 'Pitched.',
  },
  {
    day: 37, category: 'outreach',
    title: 'Pitch The Changelog podcast (Adam + Jerod)',
    description: 'Different show, same network. adam@changelog.com. Curator-led directory + India tech scene angle.',
    expected_time_min: 30,
    expected_outcome: 'Pitched.',
  },
  {
    day: 38, category: 'outreach',
    title: 'Pitch Software Engineering Daily',
    description: 'jeff@softwareengineeringdaily.com. Daily podcast = high frequency = easier to get on. Lead with technical angles (DB design, RLS, monetization).',
    expected_time_min: 30,
    expected_outcome: 'Pitched.',
  },
  {
    day: 39, category: 'content',
    title: 'Write blog: "How I shipped a directory in 30 days"',
    description: 'Personal narrative + technical breakdown. Publish on stackpicks.dev/blog/ first, then cross-post. Strong link-bait for indie hacker / solo founder audiences.',
    expected_time_min: 90,
    expected_outcome: 'Post published. IndexNow pinged.',
  },
  {
    day: 40, category: 'outreach',
    title: 'Pitch Indian dev podcasts',
    description: 'Three target podcasts: Geekle (Bangalore), CodeMon (Goa), Tech 4 Tea. Same pitch, India-localized.',
    expected_time_min: 45,
    expected_outcome: 'Three Indian podcasts pitched.',
  },
  {
    day: 41, category: 'backlink',
    title: 'Identify + comment on 5 high-DR tool roundup articles',
    description: 'Google: "best open source dev tools 2026 site:medium.com OR site:dev.to". Find 5 recent roundups. Leave a substantive comment mentioning a specific repo from your directory + your URL. Do NOT spam — provide real value.',
    expected_time_min: 60,
    expected_outcome: '5 thoughtful comments left with links.',
  },
  {
    day: 42, category: 'measurement',
    title: 'Week 6 review',
    description: 'Look at GSC Performance for the first time with meaningful data. What queries got impressions? Which pages have the highest CTR? Document.',
    expected_time_min: 40,
    expected_outcome: 'GSC performance baseline noted.',
  },
  {
    day: 43, category: 'outreach',
    title: 'Cold email 5 Indian dev influencers',
    description: 'Hitesh Choudhary, Tanay Pratap, Kunal Kushwaha, Akshay Saini, Anuj Bhaiya. India-specific angle: "Made in India OSS directory". Each could DM-share to ~50k+ Indian devs.',
    expected_time_min: 60,
    expected_outcome: 'All 5 emailed.',
  },
  {
    day: 44, category: 'outreach',
    title: 'Pitch ChangeLog newsletter editor + others',
    description: 'Round out the outreach: ChangeLog News, Tabnews, Hacker News digest curators. Wrap up Phase 2.',
    expected_time_min: 40,
    expected_outcome: 'Final pitches sent.',
  },

  // ─────────────────────────────────────────────────────────────────────
  // PHASE 3 — CONTENT VELOCITY  (Days 45-74)
  // ─────────────────────────────────────────────────────────────────────
  {
    day: 45, category: 'content',
    title: 'Write blog: Top 10 self-hosted Notion alternatives (2026)',
    description: 'High-intent keyword. 1800+ words. Use the /alternatives/notion picks as the structure, expand each with screenshots + install steps + tradeoffs.',
    expected_time_min: 90,
    expected_outcome: 'Post published. IndexNow pinged.',
  },
  {
    day: 46, category: 'technical',
    title: 'IndexNow + GSC + Bing push for new posts',
    description: 'For yesterday\'s post: trigger IndexNow ping. Request indexing in GSC. Resubmit in Bing URL Submission. Update sitemap if needed.',
    expected_time_min: 20,
    expected_outcome: 'Three indexing systems pinged for the new post.',
  },
  {
    day: 47, category: 'content',
    title: 'Add comparison: Stripe vs Razorpay for Indian SaaS',
    description: 'Highly-targeted Indian keyword. Add a new /compare/stripe-vs-razorpay slug. ~1200 words, include code samples, signature verification differences.',
    expected_time_min: 90,
    expected_outcome: 'New compare page live + sitemap updated.',
  },
  {
    day: 48, category: 'content',
    title: 'Add 5 new repos to seed-data',
    description: 'Find 5 recently-popular OSS tools from GitHub trending May-2026. Write proper curator takes (80-160 words each). Push + IndexNow ping the new /repo URLs.',
    expected_time_min: 75,
    expected_outcome: '5 new repos in DB + IndexNow notified.',
  },
  {
    day: 49, category: 'content',
    title: 'Write blog: AI agent integration — Cursor vs Claude Code in 2026',
    description: 'Very searched comparison. 1500+ words. Real workflow examples. Honest verdict.',
    expected_time_min: 90,
    expected_outcome: 'Post live.',
  },
  {
    day: 50, category: 'content',
    title: 'Add /alternatives/calendly page',
    description: 'High-volume keyword ("calendly alternatives" gets ~14k/mo searches). Add a new entry in saas-alternatives.ts. List 5 self-hostable scheduling tools with honest takes.',
    expected_time_min: 60,
    expected_outcome: 'New alternatives page live.',
  },
  {
    day: 51, category: 'measurement',
    title: 'Week 7 review',
    description: 'Compare GSC impressions vs week 6. Any new ranking queries? Which content additions are getting traction? Adjust content focus accordingly.',
    expected_time_min: 30,
    expected_outcome: 'Week 7 metrics + content direction decision.',
  },
  {
    day: 52, category: 'content',
    title: 'Update /tools page with new 2026 AI tool entries',
    description: 'Sora 2 just had a pricing change. Veo 3.5 is rolling out. Update the realistic pricing tables in tools-by-use-case.ts. Bump the "updated" date so it shows fresh.',
    expected_time_min: 60,
    expected_outcome: '/tools page refreshed with current pricing.',
  },
  {
    day: 53, category: 'content',
    title: 'Deep comparison: shadcn/ui vs Mantine v8',
    description: 'Add to /compare. ~2000 words. Performance benchmarks, DX comparison, when-to-pick-each. This is the kind of long-form content that ranks for years.',
    expected_time_min: 100,
    expected_outcome: 'Comparison live + sitemap updated.',
  },
  {
    day: 54, category: 'content',
    title: 'Add /self-hosted/email page',
    description: 'High-traffic vertical. List Mailcow, Mail-in-a-Box, Stalwart, Postal. Each with honest tradeoffs.',
    expected_time_min: 60,
    expected_outcome: 'New self-hosted page live.',
  },
  {
    day: 55, category: 'content',
    title: 'Add /best/automation-tools-2026',
    description: 'List n8n, Activepieces, Trigger.dev, Inngest, Restate. Strong evergreen page that captures "automation tools 2026" queries.',
    expected_time_min: 75,
    expected_outcome: 'New best-of page live.',
  },
  {
    day: 56, category: 'content',
    title: 'Add /awesome/ai-coding-assistants',
    description: 'Aider, Cline, Cursor (mentioned), Windsurf, Continue, Codeium. Each with one-liner + GitHub link. Pure listicle = AI-engine catnip.',
    expected_time_min: 60,
    expected_outcome: 'Awesome list page live.',
  },
  {
    day: 57, category: 'measurement',
    title: 'Week 8 review',
    description: 'Halfway through content phase. Which posts are driving the most traffic? Most backlinks? Decide whether to keep going broad or focus deeper on winners.',
    expected_time_min: 30,
    expected_outcome: 'Content strategy adjustment.',
  },
  {
    day: 58, category: 'content',
    title: 'Write blog: "How I built stackpicks.dev solo in 30 days"',
    description: 'Technical breakdown — Next.js, Supabase RLS, Razorpay, the whole stack. Strong indie-hacker bait. Submit to HN as Show HN follow-up.',
    expected_time_min: 100,
    expected_outcome: 'Post live + submitted to HN.',
  },
  {
    day: 59, category: 'content',
    title: 'Add 5 more MCP servers to /mcp',
    description: 'MCP ecosystem grew in May 2026. Find 5 new official/community servers. Add to mcp-connectors.ts. Update the /llms.txt + /llms-full.txt automatically refresh.',
    expected_time_min: 60,
    expected_outcome: 'MCP directory at 94+ servers.',
  },
  {
    day: 60, category: 'content',
    title: 'Write blog: "Honest economics of a directory site"',
    description: '₹14k → ₹70k MRR journey. Real numbers. Conversion rate. Cost breakdown. Indie hackers eat this up — guaranteed to share if numbers are honest.',
    expected_time_min: 90,
    expected_outcome: 'Post live + shared on Twitter/LinkedIn.',
  },
  {
    day: 61, category: 'content',
    title: 'Add comparison: Supabase vs Firebase 2026',
    description: 'Massive search volume. Add to /compare. Be fair to both. Honest on India-specific differences (Supabase Mumbai region vs Firebase asia-south1).',
    expected_time_min: 90,
    expected_outcome: 'Comparison live.',
  },
  {
    day: 62, category: 'content',
    title: 'Add comparison: Next.js vs Remix vs Astro 2026',
    description: '3-way comparison. Sub-page each pair-wise comparison. Strong long-tail ranking potential.',
    expected_time_min: 100,
    expected_outcome: 'Comparison live.',
  },
  {
    day: 63, category: 'content',
    title: 'Write blog: "Why Razorpay over Stripe — Indian builder POV"',
    description: 'India-specific angle that no global blog covers honestly. INR-localized. Will rank for "razorpay vs stripe india" instantly given low competition.',
    expected_time_min: 75,
    expected_outcome: 'Post live.',
  },
  {
    day: 64, category: 'measurement',
    title: 'Week 9 review',
    description: 'Backlink growth check. Bing Webmaster Backlinks tab. Any high-DR sites now linking to you? Document. Email to thank the linkers (relationship building).',
    expected_time_min: 30,
    expected_outcome: 'Backlink delta noted. Thank-you emails sent.',
  },
  {
    day: 65, category: 'content',
    title: 'Add 10 more repos to seed-data',
    description: 'Push directory to 175+. Find lesser-known but high-quality picks. Each curator take should be original.',
    expected_time_min: 120,
    expected_outcome: 'Directory at 175+ repos.',
  },
  {
    day: 66, category: 'content',
    title: 'Add /alternatives/segment (CDP)',
    description: 'Twilio Segment costs $120k+/year — searches for alternatives are high-intent. List Rudderstack, PostHog, Jitsu.',
    expected_time_min: 60,
    expected_outcome: 'New alternatives page live.',
  },
  {
    day: 67, category: 'content',
    title: 'Add /alternatives/zapier',
    description: 'Massive keyword. List n8n, Activepieces, Trigger.dev, Make.com (closest commercial). Honest takes on each.',
    expected_time_min: 60,
    expected_outcome: 'New alternatives page live.',
  },
  {
    day: 68, category: 'content',
    title: 'Add /best/email-marketing-oss',
    description: 'Listmonk, Mailtrain, Postal. India-targeted angle since Indian SaaS often needs cheap email at scale.',
    expected_time_min: 60,
    expected_outcome: 'Best-of page live.',
  },
  {
    day: 69, category: 'content',
    title: 'Write blog: 5 underrated OSS tools shipped this month',
    description: 'Monthly newsletter-style post. Strong cadence signal to AI engines that you\'re actively curating. Repeat monthly going forward.',
    expected_time_min: 60,
    expected_outcome: 'Post live.',
  },
  {
    day: 70, category: 'measurement',
    title: 'Week 10 review',
    description: 'Mid-quarter checkpoint. GSC + Bing + PostHog. Identify the 5 top-ranking pages and decide which to expand further.',
    expected_time_min: 45,
    expected_outcome: 'Top 5 pages identified for double-down.',
  },
  {
    day: 71, category: 'content',
    title: 'Freshness pass — update older blog posts',
    description: 'Pick the 5 oldest blog posts. Update one fact each, change the dateModified. Google rewards freshness more than people realize.',
    expected_time_min: 75,
    expected_outcome: '5 posts refreshed with updated_at bumped.',
  },
  {
    day: 72, category: 'technical',
    title: 'Internal linking audit — top 10 pages',
    description: 'For each of your top 10 traffic pages: ensure 3-5 contextual internal links to related pages. Use keyword-rich anchors. This is the cheapest SEO move that compounds.',
    expected_time_min: 60,
    expected_outcome: 'Top 10 pages internally cross-linked.',
  },
  {
    day: 73, category: 'content',
    title: 'Add 5 more comparison pages from data',
    description: 'GSC Performance → "Queries" tab → filter for "vs" — see what comparisons people search that you don\'t have. Add 5.',
    expected_time_min: 100,
    expected_outcome: '5 new compare pages live based on real query data.',
  },
  {
    day: 74, category: 'measurement',
    title: 'End of Phase 3 review',
    description: 'Content velocity output: how many posts shipped? Pages added? Compare against the plan. Plan the final 16 days.',
    expected_time_min: 45,
    expected_outcome: 'Content phase scorecard.',
  },

  // ─────────────────────────────────────────────────────────────────────
  // PHASE 4 — DATA-DRIVEN DOUBLE-DOWN  (Days 75-90)
  // ─────────────────────────────────────────────────────────────────────
  {
    day: 75, category: 'measurement',
    title: 'GSC deep dive — top 20 ranking queries',
    description: 'Export GSC Performance for last 28 days. Sort by impressions. List top 20 queries you\'re showing up for. For each, note current position. These are your easy-win targets.',
    expected_time_min: 60,
    expected_outcome: 'Top 20 queries spreadsheet with current rank.',
  },
  {
    day: 76, category: 'content',
    title: 'Refresh quick-answer blocks to match actual queries',
    description: 'For each of yesterday\'s top 20 queries, ensure the relevant page has a quick-answer block that DIRECTLY answers the query in 40-60 words. AI Overviews lift these verbatim.',
    expected_time_min: 90,
    expected_outcome: 'Quick-answers tuned to real search queries.',
  },
  {
    day: 77, category: 'content',
    title: 'Build sub-pages for top-performing pages',
    description: 'Pick your top-performing index page (e.g. /tools or /alternatives). Add 3 sub-topic pages that go deeper. Inherits some ranking authority from the parent.',
    expected_time_min: 100,
    expected_outcome: '3 new sub-pages live.',
  },
  {
    day: 78, category: 'outreach',
    title: 'Thank-you outreach to past 90 days\' linkers',
    description: 'For every site that has linked to you (Bing Webmaster Backlinks): send a personal thank-you. Builds future relationship — 30% of them become repeat linkers.',
    expected_time_min: 60,
    expected_outcome: 'Thank-you emails sent.',
  },
  {
    day: 79, category: 'content',
    title: 'Add testimonial/case study from 5 paying members',
    description: 'Email your top 5 paying members. Ask: "what stackpicks helped you ship?" 1-2 sentences. Display on /pricing + /about. Real social proof = conversion rate boost.',
    expected_time_min: 60,
    expected_outcome: 'Testimonials collected + displayed on /pricing.',
  },
  {
    day: 80, category: 'content',
    title: 'Milestone blog: "90 days of SEO — real numbers"',
    description: 'Publish actual day-1 vs day-90 metrics. Traffic, backlinks, conversion rate, MRR. Indie hackers will share this aggressively.',
    expected_time_min: 90,
    expected_outcome: 'Post live + shared.',
  },
  {
    day: 81, category: 'content',
    title: 'Blog post targeting top high-impression low-position query #1',
    description: 'From day 75 data: pick the query with highest impressions where you rank 11-30. Write a focused page or update an existing one to climb into top 10.',
    expected_time_min: 90,
    expected_outcome: 'New/updated page targeting specific query.',
  },
  {
    day: 82, category: 'content',
    title: 'Blog post targeting top high-impression low-position query #2',
    description: 'Same playbook, second query from the list. The 11-30 → top-10 jump is the highest ROI move in SEO.',
    expected_time_min: 90,
    expected_outcome: 'Second targeted page live.',
  },
  {
    day: 83, category: 'outreach',
    title: 'Reach out for content partnership',
    description: 'Find 2-3 adjacent newsletters/sites (not competitors). Propose a content swap or co-promotion. Example: cohort with a dev newsletter, swap recommendations.',
    expected_time_min: 60,
    expected_outcome: 'Partnership conversations started.',
  },
  {
    day: 84, category: 'measurement',
    title: 'Week 12 review — final stretch metrics',
    description: 'Final scorecard before the wrap. All KPIs: indexed pages, backlinks, top-10 rankings, monthly traffic, conversion rate, MRR.',
    expected_time_min: 45,
    expected_outcome: 'Penultimate scorecard.',
  },
  {
    day: 85, category: 'content',
    title: 'Build a free tool — link bait',
    description: 'Add a free calculator or generator to the site. Examples: "Razorpay fee calculator", "SaaS pricing tier generator", "open-source license picker". Free tools are the strongest link bait in dev SEO.',
    expected_time_min: 120,
    expected_outcome: 'New free tool live + indexed.',
  },
  {
    day: 86, category: 'submission',
    title: 'Submit new free tool to relevant directories',
    description: 'Yesterday\'s tool deserves its own promo round: r/SideProject, r/webdev, ProductHunt, IndieHackers, HN.',
    expected_time_min: 60,
    expected_outcome: 'Tool submitted to 5 channels.',
  },
  {
    day: 87, category: 'outreach',
    title: 'Re-pitch CSS-Tricks + Smashing Magazine',
    description: 'If first pitch went silent: re-pitch with a fresh angle 60 days later. Editorial calendars rotate.',
    expected_time_min: 45,
    expected_outcome: 'Both re-pitched.',
  },
  {
    day: 88, category: 'technical',
    title: 'Final sitemap + IndexNow refresh',
    description: 'Resubmit sitemap to GSC + Bing. Run the IndexNow bulk push for all URLs again. Ensure the freshness signal is strong before the quarterly snapshot.',
    expected_time_min: 30,
    expected_outcome: 'All search engines re-pinged.',
  },
  {
    day: 89, category: 'measurement',
    title: 'Quarterly retrospective writeup',
    description: 'Long writeup: what worked, what didn\'t, biggest wins, biggest waste. Save as docs/SEO-Q1-2026.md and prep for blog publication day 90.',
    expected_time_min: 90,
    expected_outcome: 'Retrospective doc complete.',
  },
  {
    day: 90, category: 'content',
    title: 'Publish 90-day retro + plan next 90 days',
    description: 'Publish the retrospective on stackpicks.dev/blog. Then plan the next 90 days — but lighter, since you now know what works. Start over.',
    expected_time_min: 75,
    expected_outcome: 'Q1 retro published + Q2 plan drafted.',
  },
];

/**
 * Today's task picker — call from the admin page with today's relative day
 * number (days since launch). Returns the matching task or null if out of range.
 */
export function getTodayTask(dayNumber: number): SeoTask | null {
  return SEO_TASKS.find((t) => t.day === dayNumber) ?? null;
}

/** Get the next N upcoming tasks starting from a given day. */
export function getUpcomingTasks(dayNumber: number, count = 7): SeoTask[] {
  return SEO_TASKS.filter((t) => t.day >= dayNumber).slice(0, count);
}

/** Pretty label for a category — used in admin UI. */
export const CATEGORY_META: Record<SeoCategory, { label: string; color: string }> = {
  submission:  { label: 'Submission',  color: 'text-blue-300 bg-blue-500/10 border-blue-500/30' },
  outreach:    { label: 'Outreach',    color: 'text-fuchsia-300 bg-fuchsia-500/10 border-fuchsia-500/30' },
  content:     { label: 'Content',     color: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30' },
  backlink:    { label: 'Backlink',    color: 'text-amber-300 bg-amber-500/10 border-amber-500/30' },
  technical:   { label: 'Technical',   color: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30' },
  measurement: { label: 'Measurement', color: 'text-rose-300 bg-rose-500/10 border-rose-500/30' },
};
