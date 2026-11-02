# Cicada Guide for ChatGPT

Research U.S. state bills, text, sponsors, recorded votes, and legislator contacts using four packaged skills and a hosted MCP service. Version **0.1.0**, intended publisher **Forrest Satterfield**, distribution **United States**, no payments or purchases.

**Prepared but not submission-ready.** See [readiness](docs/readiness.md) for host verification, recording, and publisher requirements. This repository does not host a server or duplicate its cards.

## Structure

- `plugin.json`: Agent Plugins 1.0 identity, listing, review cases, and publication metadata.
- `mcp.json`: anonymous Streamable HTTP connection named `guide-public`.
- `skills/`: four workflows and supporting references.
- `assets/`: creator-supplied PNG artwork and square 512px PNGs for both themes.
- `scripts/`, `tests/`, `schemas/`: validation tools, excluded from the upload.
- `docs/`: submission materials and dated evidence, excluded from the upload.

The endpoint is `https://cicada-guide-mcp-openai.cicada-bot.workers.dev/mcp-openai`. Select **No authentication** when connecting. No API key, account, OAuth or authentication headers are needed. Portable configuration explicitly declares `extensions.com.openai.auth.type: "none"`, following the official OpenAI documentation. Live discovery found 17 tools and four card resources on November 2, 2026.

## Research workflows

Try these prompts:

- “Brief me on Alabama HB591 from the 2026 Regular Session.”
- “How did Alabama Representative Rex Reynolds vote most recently?”
- “How can I contact Alabama Representative Rex Reynolds?”

Bill numbers repeat across states and sessions. Provide these details or establish defaults in conversation/project instructions. Explicit requests override defaults; no local settings file is read.

The server supplies bill results, bill workspace, legislator record, and official contact cards. Written answers remain complete without cards. Claims come from returned records, with missing text and coverage limits disclosed. The plugin cannot research Congress, identify representatives by address, rank legislators, predict votes, or contact officials.

## Quick start and commands

Use Node 22+ and npm:

```powershell
npm ci
npm run check
npm test
npm run check:live
node scripts/check-pages.mjs
node scripts/render-icons.mjs
npm run package
```

`check` validates schemas, skills, links, assets, and listing limits. `test` exercises malformed-package rejection. `check:live` makes read-only public-record requests and writes dated evidence. Page checks inspect published content; icon rendering changes local assets only. `package` creates and reopens `dist/cicada-guide-0.1.0.zip`, checks inventory/bytes, and writes a SHA-256 report. It never uploads or installs anything. `node scripts/check.mjs --submission` also fails for missing required URLs, but manual readiness gates remain separate.

## Architecture and contributing

The package owns research instructions and portable configuration; the existing OpenAI server owns legislative retrieval and cards. No local executor or settings file is required. See the [architecture overview](docs/architecture.md) and [decision records](docs/README.md#decisions) for the rationale, authentication/schema boundary, and trade-offs.

Read [Contributing](CONTRIBUTING.md) for the change workflow and [AGENTS.md](AGENTS.md) for repository conventions. The [documentation index](docs/README.md) links submission materials, evidence, and the [unreleased changelog](CHANGELOG.md).

## Privacy and provenance

Requests go to the OpenAI MCP endpoint, which can fetch public legislative documents. Optional PostHog instrumentation can collect tool arguments and purpose notes when configured; Cloudflare handles requests and IP-based limits. Read the [connector privacy policy](https://cicada-guide-mcp-openai.cicada-bot.workers.dev/privacy). Keep secrets and unrelated personal information out of requests.

See [support](https://cicadaguide.featurebase.app/help) and [terms](https://cicada.guide/terms-and-conditions). Records may lag official sources. Adapted code and artwork retain their attribution in [LICENSE](LICENSE) and [NOTICE](NOTICE). Neither server is modified by this package.
