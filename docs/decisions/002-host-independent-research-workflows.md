# ADR-002: Keep research workflows independent of local files and subagents

## Status

Accepted. [ADR-007](007-card-only-responses.md) supersedes the written-answer requirement.

## Date

2026-11-02

## Context

The source plugin uses host-specific commands, agent definitions, namespaces, and a local project-settings file. ChatGPT cannot be assumed to expose the same local filesystem or delegation mechanisms. Full workflow parity means preserving research behavior and safeguards rather than copying those host integrations.

## Decision

Provide four skills: legislation lookup, bill research, voting records, and legislator contacts. Convert identity-resolution and bill-gathering agents into reference procedures performed within the main conversation. Use tool names without hardcoded host namespace prefixes.

Apply state/session defaults from explicit conversation context or available project instructions. The explicit current request wins. Resolve default names to returned identifiers, disclose applied defaults, and ask when identity remains ambiguous. Do not read a local settings file.

Preserve evidence rules: returned records support factual claims; missing text and partial coverage are disclosed; enrolled labels do not establish enactment; votes are attributed only after identity verification. Refuse unsupported rankings and predictions. Request the relevant card after research, while keeping the written answer complete.

## Alternatives Considered

- **Copy source skills unchanged:** retains local-path and agent assumptions that the target host may not support.
- **Require subagents for parity:** couples correctness to an optional host feature. The procedures can run directly and ask the user for clarification.
- **Always ask for state/session:** avoids persistent defaults but adds repeated questions even when the user already supplied usable context.
- **Rely only on server descriptions:** simplifies packaging but loses the requested multi-step workflows and shared research constraints.

## Consequences

No settings synchronization or local executor is needed. Conversation context is not durable configuration; the assistant must ask when it is unavailable or ambiguous. Direct procedures may expose more intermediate interaction than delegated research. Skill evaluations must check identity, scope, missing-data handling, defaults, and unsupported requests, separately from successful raw tool calls.

See the [shared skill](../../skills/get-legislation/SKILL.md), [review cases](../review-cases.md), and [demo procedure](../demo.md).
