# ADR-003: Declare anonymous authentication and validate OpenAI extensions separately

## Status

Accepted

## Date

2026-11-02

## Context

The selected server accepts anonymous requests. The downloaded portable MCP schema does not model server `extensions`, but the official OpenAI packaging documentation explicitly places authentication at `mcpServers.<name>.extensions.com.openai.auth`. Validating the full declaration solely against the portable base schema therefore rejects a documented OpenAI configuration.

## Decision

Declare `auth.type: "none"` explicitly in `mcp.json`, with no credentials or authentication headers. Preserve the downloaded base schema unchanged.

Validate the server extension against a separate, project-specific schema that permits only this plugin's anonymous declaration. Then remove the validated extension from an in-memory transport projection and validate that projection against the portable base schema. Keep all other fields subject to base validation. Reject missing authentication declarations, alternative authentication types, credential fields, and unknown extension fields.

The local extension schema is a project constraint, not an official or complete OpenAI schema. Its documentation source and date are recorded in the schema comment.

## Alternatives Considered

- **Omit authentication to satisfy the base schema:** initially implemented during preparation, then corrected after checking official OpenAI documentation. Anonymous server behavior alone does not replace the documented manifest declaration.
- **Modify the downloaded schema:** would hide the distinction between upstream validation and local OpenAI-specific constraints.
- **Skip extension validation:** could silently admit unsupported fields or credentials into a public package.
- **Add OAuth or API-key handling:** contradicts the selected service's anonymous access and introduces unnecessary credentials and connection steps.

## Consequences

The checker documents and tests the format boundary rather than claiming the upstream schema covers OpenAI extensions. Portal ingestion remains unverified. If another authentication mode is later needed, update the local schema, tests, documentation, and authorization scope together; do not simply bypass validation.

See [official authentication guidance](https://developers.openai.com/plugins/build/plugins#configure-mcp-authentication), the [local extension schema](../../schemas/openai-mcp-extension.schema.json), and [validation status](../validation.md).
