# StackPicks Connect — Phase 1 Setup (Your Part)

All the code is shipped. To flip Connect from "showing pretty UI" to "actually
working end-to-end with GitHub", you need to register 3 external accounts and
add 3 env vars to Railway. Total time: **~30 minutes**.

After this is done, anyone can log into stackpicks.dev, click Connect on
GitHub, OAuth in their browser, paste the StackPicks config into Claude, and
have Claude triage their GitHub issues. The other 5 live providers (Gmail,
Slack, Notion, Discord, Drive) follow the same recipe — register the OAuth
app in their portal, add it to Nango, flip the status. We do those after
GitHub end-to-end works.

---

## Step 1 — Sign up at Nango (5 min)

Nango is the OAuth broker. They hold the access + refresh tokens; we only
store a `nango_connection_id` per (user, provider). Free Hobby tier covers
up to 50 connections — plenty for MVP.

1. Go to https://www.nango.dev → **Sign up** with GitHub.
2. After login, you land on the dashboard. Copy two keys:
   - **Secret key** (`prod_…`) — server-side, NEVER commit this
   - **Public key** (`pk_…`) — safe in browser
3. Save them somewhere — you'll paste them into Railway in Step 4.

---

## Step 2 — Register a GitHub OAuth App (5 min)

1. Go to https://github.com/settings/applications/new
2. Fill in:
   - **Application name:** `StackPicks Connect`
   - **Homepage URL:** `https://stackpicks.dev`
   - **Authorization callback URL:** `https://api.nango.dev/oauth/callback`
   - (Yes — the callback points to Nango, not to us. Nango proxies the OAuth
     and forwards us a `connection_id` after.)
3. Click **Register application**.
4. On the next page:
   - Copy the **Client ID**
   - Click **Generate a new client secret** → copy the **Client secret**

---

## Step 3 — Add the GitHub provider to Nango (3 min)

1. In Nango dashboard → **Integrations** → **+ Configure New Integration**.
2. Pick **GitHub** from the list.
3. Set:
   - **Provider Config Key:** `github` (EXACTLY this — must match the
     slug in `connect-apps.ts`)
   - **Client ID:** paste from Step 2
   - **Client Secret:** paste from Step 2
   - **Scopes:** `repo, read:user, user:email` (covers all our GitHub tools)
4. Click **Save**.

That's GitHub wired up in Nango. We'll repeat this step for each of the other
5 providers once GitHub end-to-end works.

---

## Step 4 — Add env vars in Railway (3 min)

1. Go to https://railway.app → your StackPicks project → **Variables** tab.
2. Add:

```
NANGO_HOST=https://api.nango.dev
NANGO_SECRET_KEY=<paste your Nango secret key from Step 1>
NANGO_PUBLIC_KEY=<paste your Nango public key from Step 1>
```

3. Railway will auto-redeploy after you save. Wait ~90s for the build to
   finish.

---

## Step 5 — Register the @stackpicks npm organisation (2 min)

This is for publishing `@stackpicks/mcp` — the local MCP server users will
install via `npx -y @stackpicks/mcp`.

1. Go to https://www.npmjs.com/org/create
2. Org name: `stackpicks` (lowercase, no hyphens)
3. Pick the **Free** plan.
4. After creation, generate an automation token:
   - https://www.npmjs.com/settings/<your-username>/tokens/new
   - Type: **Granular Access Token**
   - Permissions: Read + write to `@stackpicks` org
   - Copy the token (starts with `npm_…`)
5. Save it somewhere — you'll use it once to publish the package.

---

## Step 6 — Publish @stackpicks/mcp v0.1 (2 min)

This is the moment of truth. After this, `npx -y @stackpicks/mcp` works for
anyone in the world.

```bash
cd packages/mcp
npm login              # paste the token from Step 5 when asked
pnpm build             # already done locally; CI also builds
npm publish --access public
```

You should see:
```
+ @stackpicks/mcp@0.1.0
```

---

## Step 7 — End-to-end smoke test (5 min)

1. Open https://stackpicks.dev/connect in your browser.
2. Click **Connect** on the GitHub card.
3. You should be redirected to Nango → GitHub OAuth → back to
   `/connect?connected=github`.
4. Refresh `/dashboard/connections` — GitHub should show as **Active** with
   your account label.
5. Open the **Connect to Claude** modal → click **Generate API key** → copy
   the `sp_live_…` key.
6. Paste this into your local Claude Desktop config
   (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "stackpicks": {
      "command": "npx",
      "args": ["-y", "@stackpicks/mcp"],
      "env": { "STACKPICKS_API_KEY": "sp_live_..." }
    }
  }
}
```

7. Restart Claude Desktop. Open a new chat. Ask:

   > List my last 5 GitHub repos.

   Claude should call `github_list_repos` through the StackPicks MCP and
   show you your repos.

8. Try a write:

   > Open an issue in jangirpiyush008-hash/stackpicks.dev titled "Connect
   > end-to-end test" with body "Working!"

   Verify the issue appears on GitHub.

If both work → **GitHub Connect is live**. Move to Step 8 to roll out the
other providers.

---

## Step 8 — Roll out the remaining 5 providers (~10 min each)

Repeat Steps 2-3 for each, using these OAuth registration pages:

| Provider | OAuth registration | Nango config key | Scopes |
|---|---|---|---|
| **Gmail** | https://console.cloud.google.com → OAuth 2.0 Client | `gmail` | `gmail.readonly gmail.modify` |
| **Google Drive** | Same Google Cloud project | `google-drive` | `drive.file drive.readonly` |
| **Slack** | https://api.slack.com/apps | `slack` | `chat:write channels:history users:read` |
| **Notion** | https://www.notion.so/my-integrations | `notion` | (auto) |
| **Discord** | https://discord.com/developers/applications | `discord` | `bot guilds messages.read` |

**Important about Google:**
- For `gmail.readonly` / `drive.readonly` only — instant approval.
- For `gmail.modify` (send email) or `drive.file` (write files) — requires
  CASA security assessment. **Plan 4-6 weeks.** Ship read-only first.

**Slack:** review takes 2-7 days for public distribution. You can use the
app immediately in your own workspace while waiting.

After each provider is in Nango, our `/connect` page automatically picks it
up — no redeploy needed. The DB just needs an `oauth_connections` row, which
the OAuth callback creates.

---

## Common gotchas

**"Provider not yet wired" message in Claude.**
Means `NANGO_SECRET_KEY` isn't set in Railway. Recheck Step 4.

**"GitHub 401" in audit log.**
The Nango integration scopes don't include what the tool needs. Update
scopes in Nango → reconnect from `/dashboard/connections`.

**npm publish 403 "you do not have permission".**
Token doesn't have write access to the `@stackpicks` org. Re-issue with
correct scope in Step 5.

**Connect popup loops back to GitHub login.**
The OAuth callback URL in Step 2 isn't exact. Must be
`https://api.nango.dev/oauth/callback` (no trailing slash).

---

## What's coming Phase 2

After Phase 1 GitHub works end-to-end I'll add the other 5 providers'
executors (`core/connect/executors/gmail.ts`, `slack.ts`, etc.) following
the same pattern as `github.ts`. Each is ~150 lines of code and 30 min of
work. We'll roll them out one at a time as each OAuth registration goes live.

If you get stuck on any step, tell me which step + the error and I'll
walk through it.
