---
name: research-legislation
description: Use when the user requests a sourced brief on a U.S. state bill, its text, status, sponsors, and recorded floor votes.
---
# Research one state bill

Start with [get-legislation](../get-legislation/SKILL.md) and its scope, defaults, evidence, identity, schema, pagination, and error rules. No local settings file or subagent is required. If tools are unavailable, explain that the connection needs attention; do not substitute general knowledge.

1. Resolve state and session with list_states/list_sessions. Search an exact bill using bill, division_id, and session_id. If state/session is unresolved or several bills match, ask; never pick the first match. For a topic, show scoped candidates and let the user choose.
2. Follow the [bill research procedure](../get-legislation/references/bill-brief-researcher.md). Get get_bill_dossier for record, sponsors, document metadata, and initial floor votes, or use get_bill and supporting tools. Batch unresolved sponsors through search_people ids. Read get_latest_bill_document through every next_text_offset; a null text_source means unreadable, not empty text. Provide the returned document URL and reason instead of inventing a summary. List older versions with get_documents when needed.
3. Page get_rollcalls completely when claiming full history. Use each roll call's returned counts. Only call get_rollcall_breakdown when names or party splits are requested. Mark partial breakdowns and distinguish no recorded votes from 0–0. Report passage only when the recorded status or description supports it.
4. Write identification, dated recorded status, a short text-grounded explanation, sponsors, relevant floor votes, source URLs, and limitations. Separate enrolled-document labels from enactment evidence. General governor deadlines never establish this bill's outcome.
5. Call show_bill with id, a plain headline of 1–120 characters, and summary based only on data read. When text is unreadable, use the official title for the headline and state that limitation in the summary. Keep the written brief useful without the card.
