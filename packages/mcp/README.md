# @stackpicks/mcp

One MCP server. All your apps. Connect GitHub, Gmail, Slack, Notion + 800 more to Claude / Cursor / OpenAI agents through StackPicks.

## Install

In Claude Desktop / Cursor / Cline config:

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

Get a key at https://stackpicks.dev/connect (free to browse, login to issue a key).

## How it works

This package is a thin stdio proxy. Your AI client speaks MCP to it, and it
forwards every tool list / tool call to the StackPicks gateway, authenticated
by your API key. The gateway holds OAuth tokens for every app you've
connected — they never touch your machine.

## Env

| Variable | Required | Default | Notes |
|---|---|---|---|
| `STACKPICKS_API_KEY` | yes | — | `sp_live_…` from `/connect/export` |
| `STACKPICKS_API_URL` | no | `https://stackpicks.dev` | Override for self-hosting |
| `STACKPICKS_DEBUG` | no | unset | `1` to log requests to stderr |

## License

MIT — © StackPicks. The gateway service itself is hosted by StackPicks.
