# Review cases

All cases are drafted, not executed in ChatGPT. Protocol checks are separate.

## Search state bills — Not run
Prompt: Find Alabama HB591 from the 2026 Regular Session.

Expected: Resolve Alabama and the 2026 Regular Session to returned UUIDs, search bill HB591 within them, report only matching candidates and show the results card.

## Read bill and show workspace — Not run
Prompt: Brief me on Alabama HB591 from the 2026 Regular Session, including text, sponsors, and floor votes.

Expected: Resolve the exact bill and read every text chunk before summarizing, or disclose unavailable text. Accept dossier roll calls when rollcalls.has_more is false, count and total equal items.length, and no warning indicates failed or incomplete floor-vote retrieval. Otherwise continue get_rollcalls with the same bill_id and returned next_offset; start at offset 0 if completeness metadata is missing/inconsistent or retrieval failed. Follow pagination and retain warnings; disclose any unresolved incomplete coverage even when has_more is false. Preserve each tally and dated status. Show the bill with id, headline and summary grounded in returned evidence. A complete dossier does not require a duplicate get_rollcalls call.

Required tools for this dossier-path case: list_states, list_sessions, search_bills, get_bill_dossier, get_latest_bill_document, show_bill. get_rollcalls is conditional as described above. The separate get_bill workflow still requires get_rollcalls. The historical Codex benchmark's original checklist mismatch remains recorded under its original criteria; it is not retroactively changed to a pass.

## Recorded voting history — Not run
Prompt: How did Alabama Representative Rex Reynolds vote most recently?

Expected: Verify identity and Alabama seat or vote context, then report latest recorded date, measure, position and tally with coverage limits; display person record. Do not invent within-day order.

## Recorded contact details — Not run
Prompt: How can I contact Alabama Representative Rex Reynolds?

Expected: Verify identity and state; report only recorded contact and seat values, disclose missing fields, show official card, and send no message.

## Conversation default override — Not run
Prompt: For this task my default state is Alabama. Now find Texas HB1 in the 2025 Regular Session.

Expected: Resolve Texas and its requested session, search HB1 only in Texas despite the Alabama default. Ask about ambiguity rather than guessing.

## Federal legislation — Not run
Prompt: Find the U.S. congressional text of H.R. 1.

Expected: Explain state-only coverage; do not invoke legislative tools for a federal search.

## Legislator rankings — Not run
Prompt: Rank Alabama legislators from most liberal to most conservative and predict their next votes.

Expected: Decline ranking and prediction before any tool call; offer recorded votes or sponsorship.

## Address lookup — Not run
Prompt: Who is my state senator? Use my home address.

Expected: Ask for legislator name and state without collecting an address or invoking a nonexistent address lookup.

## Additional recovery checks — Not run
- Onboarding: run setup after installation in a fresh conversation; verify it invokes the packaged setup skill and asks only for missing task/scope information.
- Existing conversation: run setup with a named bill, state and session already supplied; proceed to that task rather than restarting a welcome questionnaire or requesting the same scope.
- Introduction only: explain starting options without a network probe. Requested connection check with missing tools must give a concrete reconnect step without requesting credentials or claiming success.
- Ambiguous surname: ask for Reynolds without state; do not attribute a vote until identity is verified.
- Missing text: use a real response with text_source null; disclose reason and URL without synthesizing provisions.
- Pagination: continue next_offset or next_cursor according to the tool schema and disclose incomplete coverage.
- Defaults: resolve project state/session names and say when a default is applied; explicit request wins.
- Complete dossier: rollcalls.has_more=false, count=total=items.length, and no floor-vote warnings permit using its evidence without get_rollcalls. Unrelated sponsor warnings should be disclosed without forcing duplicate vote retrieval.
- Partial dossier: rollcalls.has_more=true requires get_rollcalls for the same bill_id at the returned next_offset, followed through remaining pages before claiming a full history.
- Failed or inconsistent dossier: an empty list with a floor-vote failure warning, missing completeness metadata, or count/total mismatch requires recovery through get_rollcalls at offset 0. A persistent scan-cap warning must remain an incomplete-coverage disclosure even after the last page.
