# Review cases

All cases are drafted, not executed in ChatGPT. Protocol checks are separate.

## Search state bills — Not run
Prompt: Find Alabama HB591 from the 2026 Regular Session.

Expected: Resolve Alabama and the 2026 Regular Session to returned UUIDs, search bill HB591 within them, report only matching candidates and show the results card.

## Read bill and show workspace — Not run
Prompt: Brief me on Alabama HB591 from the 2026 Regular Session, including text, sponsors, and floor votes.

Expected: Resolve exact bill; read all text chunks before summarizing, or disclose unavailable text. Preserve roll-call tallies and dated status. Show bill with id, headline and summary grounded in returned evidence.

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
- Ambiguous surname: ask for Reynolds without state; do not attribute a vote until identity is verified.
- Missing text: use a real response with text_source null; disclose reason and URL without synthesizing provisions.
- Pagination: continue next_offset or next_cursor according to the tool schema and disclose incomplete coverage.
- Defaults: resolve project state/session names and say when a default is applied; explicit request wins.
