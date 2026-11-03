---
name: voting-record
description: Use when a user asks how a U.S. state legislator voted, requests their latest recorded votes or voting history, or wants a roll call's member and party breakdown.
---
# Report recorded votes

Start with [get-legislation](../get-legislation/SKILL.md) and its scope, defaults, evidence, identity, schema, pagination, and error rules. No local settings file or subagent is required. Present the response in a Cicada Guide card. Use show_status for clarification, unsupported requests, or recoverable errors. After the card succeeds, leave the assistant message empty.

1. Ask for name and state when absent; an address or "my representative" cannot be resolved. Apply the [identity procedure](../get-legislation/references/legislator-disambiguator.md). Page search_people, verify jurisdiction through returned seat or vote context, and ask when identity remains ambiguous. Never assign a vote to a matching surname alone.
2. For history use get_person_votes with people_id and the requested filters. Follow next_cursor; no offset is accepted. State temporal coverage and incomplete pages. For latest votes use the returned chronology and identify same-date ties; do not manufacture intra-day order.
3. For a specific bill resolve its state/session, retrieve floor roll calls, and obtain recorded positions with the appropriate bill/person filters. Batch unresolved member IDs through search_people. For a chamber split use get_rollcall_breakdown and disclose partial output.
4. Report recorded date, bill and session, description, position, own roll-call tallies, and returned sources. Missing rows mean no recorded vote in this dataset, not absence or opposition. Do not infer pass/fail from tallies, ideology from positions, or future votes.
5. Call show_person_record with the resolved id and only supported filters for a person's record. get_rollcall_breakdown provides the roll-call card. Use show_status for requested evidence or limitations the result card cannot display.
