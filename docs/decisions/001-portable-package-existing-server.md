# ADR-001: Package workflows around the existing OpenAI MCP server

## Status

Accepted

## Date

2026-11-02

## Context

The target is a ChatGPT plugin with the research capabilities of the existing Anthropic plugin. A separate OpenAI MCP deployment already provides the legislative tools and four card resources. Rebuilding the service would duplicate hosting, data access, and UI responsibilities. The current delivery authorizes local source and public-submission preparation, with no server changes, upload, submission, or publication.

## Decision

Use a portable Agent Plugins 1.0 package: root `plugin.json`, root `mcp.json`, four skills, supporting references, and assets. Connect `guide-public` to the existing OpenAI endpoint specified in `mcp.json`. Keep server logic and card implementations in the companion server repository.

Build a single enclosing `cicada-guide/` directory in the ZIP using an explicit file allowlist. Exclude account app bindings, compatibility manifests, dependencies, credentials, and preparation documents. Keep review metadata in the manifest and supporting evidence in this repository.

## Alternatives Considered

- **New Sites-hosted service:** useful for a new app, but unnecessary here and would duplicate the existing server and ownership.
- **Reuse the Anthropic endpoint:** preserves the old configuration but does not establish ChatGPT compatibility; the OpenAI deployment is the selected integration.
- **Reference an existing account plugin/app:** could reuse a private installation, but public submission requires a portable endpoint declaration. A plugin with the same display name is not proof of matching source or hosting.
- **Connection-only package:** simpler, but omits the four research workflows requested for parity.

## Consequences

The package has no local server, database, deployment command, or runtime secrets. Tool discovery and references can drift independently of the package and must be checked against the selected endpoint. A valid archive proves package integrity, not live service behavior or ChatGPT rendering. Any later online action needs authorization under the then-current task scope; package preparation does not imply publication.

See [architecture](../architecture.md), [readiness](../readiness.md), and the [official packaging guide](https://developers.openai.com/plugins/build/plugins).
