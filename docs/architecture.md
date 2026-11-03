# Architecture

Cicada Guide is a portable instruction package connected to an independently hosted MCP service. It has no application server or database in this repository.

## Responsibilities

| Component | Owns | Does not establish |
| --- | --- | --- |
| Manifest and MCP configuration | Package identity, listing/review metadata, anonymous endpoint declaration | Installed connection or publisher verification |
| Setup, four research skills and references | Research procedure, identity/scope checks, defaults, evidence rules, card selection | Data freshness or model compliance before evaluation |
| Companion OpenAI server | Tool schemas, legislative retrieval, card resources, rate limits, optional telemetry | Correct execution of packaged skills |
| Host | Tool selection, skill execution, card rendering, conversation context | Submission approval |
| Contributor tooling | Source checks, contract snapshots, icon rendering, archive integrity | Live ChatGPT rendering or a recorded demo |

## Request flow

The user names a legislative task. The skill resolves scope and identities using discovered tools, gathers the returned evidence, and writes an answer with limitations. It then requests the appropriate hosted card. A card may initiate further tool calls or send a follow-up into the conversation; its content remains untrusted until relevant records are verified.

Defaults come from the conversation or available project instructions. No local settings file is read. Live schemas govern parameters: for example, voting history uses `people_id` and cursor pagination. Analytics arguments are sent only when advertised; their presence can change with server instrumentation.

## Package boundary

`scripts/package.mjs` includes only manifests, licensing, skills/references, and assets under `cicada-guide/`. It reopens the ZIP, compares entry names and bytes, and writes the checksum report. Preparation documents and development dependencies remain outside the upload. Documentation-only changes outside that allowlist do not require a new ZIP.

The MCP base schema and documented OpenAI extension are validated separately. See [ADR-003](decisions/003-explicit-anonymous-auth-validation.md) for the rationale and limits.

## Verification boundaries

Local validation, live protocol evidence, packaged-skill evaluation, host rendering, a playable demo, and portal review are distinct states. The authoritative preparation status is [readiness](readiness.md), with supporting [validation](validation.md). Do not promote an unrun case to Passed based on a lower-level check.

Decisions are recorded in [ADR-001](decisions/001-portable-package-existing-server.md), [ADR-002](decisions/002-host-independent-research-workflows.md), [ADR-003](decisions/003-explicit-anonymous-auth-validation.md), and [ADR-004](decisions/004-selective-references-and-dossier-evidence.md). Keep old ADRs when decisions change; add a successor and mark the old decision superseded.
