# ADR-004: Load references selectively and accept complete dossier vote evidence

## Status

Accepted

## Date

2026-11-02

## Context

The shared skill instructed assistants to read the complete schema catalog and worked sequences before using tools. Those references include substantial material unrelated to many tasks, while live host schemas already supply tool parameters. The Codex benchmark also found a bill brief that used dossier vote evidence but missed a checklist requiring a redundant get_rollcalls call.

The companion server's bills.ts and bill-rollcalls.ts implementations use the same bill-scoped roll-call service for get_bill_dossier and get_rollcalls. A dossier includes the first page, completeness metadata, counts, and warnings. Failed floor-vote retrieval can produce an empty list with has_more=false and a warning; reaching the vote-linked scan cap can also leave incomplete evidence despite has_more=false.

## Decision

Keep essential scope, evidence, identity and pagination constraints in the shared skill. Route to only relevant reference sections. Use live host definitions for parameters; consult the snapshot only for the needed tool when the live definition is missing or unclear. Keep references available for detailed procedures and fallback, and report missing tools instead of calling a nonexistent tool from a snapshot.

Accept the dossier's roll calls without duplicate retrieval when rollcalls.has_more is false, count and total both match items.length, and no warning indicates failed or incomplete floor-vote retrieval. Unrelated sponsor or document warnings do not invalidate complete floor-vote evidence.

When more pages exist, continue get_rollcalls with the same bill_id and returned next_offset. Start at offset 0 when completeness metadata is missing/inconsistent, floor-vote retrieval failed, or the assistant used get_bill instead of a dossier. Preserve applicable warnings and disclose remaining incomplete coverage even after has_more=false. A completed pagination sequence cannot erase a scan-cap warning.

The bill-brief review metadata lists the dossier-path tools as required and specifies get_rollcalls conditionally in expected_behavior. Skill instructions and written review cases use the same rule. Preserve old benchmark criteria and outcomes as historical evidence.

## Alternatives Considered

- Always require get_rollcalls: simple checklist but duplicates complete evidence and penalizes a valid dossier path.
- Accept any dossier with has_more=false: mistakes failed or capped retrieval for completeness.
- Remove reference files to improve a static score: loses useful fallback documentation without proving lower runtime cost.

## Consequences

Reference inventory estimates can remain high even with selective loading. Measure actual reads and whole-run usage separately; do not claim savings from instruction changes alone. Validate both complete-dossier and continuation/recovery paths. Native ChatGPT behavior remains a separate verification gate.

See [bill procedure](../../skills/get-legislation/references/bill-brief-researcher.md), [review cases](../review-cases.md), and [readiness](../readiness.md). This decision refines ADR-002's direct research procedures without replacing its host-independent scope and evidence rules.
