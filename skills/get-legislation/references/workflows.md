# Worked sequences

## Find bills and research topics

Resolve division and session IDs. For a numbered bill, use search_bills with bill and the resolved scope. If scope is ambiguous, ask or page through candidates before choosing. For a topic, use a distinctive scoped query or a verified subject. Title terms broaden matches with OR, and search has caps. Describe coverage and avoid claiming exhaustiveness. search_bills provides the results card.

## Bill text, sponsorship, and votes

Use the [bill brief procedure](bill-brief-researcher.md) for dossier completeness, sponsorship, and document text. Follow every next_text_offset before summarizing full text. read_pdf_bytes returns PDF bytes. Disclose unreadable or partial text and provide the returned document URL.

Use get_rollcalls for bill floor votes when dossier evidence is insufficient. Use get_rollcall_breakdown for a specific roll call. For a person's vote on a bill, resolve both identities and use the advertised get_votes filters. get_votes needs at least one of rollcall_id, bill_id or people_id. For a person's votes by subject, resolve relevant bills in scope and match their IDs to the person's recorded votes. State gaps. Never combine tallies across roll calls or infer passage from one vote.

## Legislator votes and contacts

Follow the [identity procedure](legislator-disambiguator.md). search_people has no jurisdiction filter. Verify returned seat context before stating district or chamber. Use get_person_votes for voting history and get_person for contact details. Request show_person_record after voting research or show_official after contact lookup. Batch search_people IDs in nonempty groups of at most 100.

## Cards and follow-ups

After bill research, call show_bill with the verified id, a plain-language headline of 1–120 characters, and a sourced summary. Put any requested evidence or limitations that the workspace cannot otherwise display into the summary. End the turn after the card succeeds. When a card supplies a bill ID, verify it with a data tool and read the text as the request requires. If only part is readable, state which part supports the summary.

A selection update can identify what the user is viewing. For research, map its name, bill number, date and description to verified prior results. For vote details, page get_rollcalls and match date and description before calling get_rollcall_breakdown. If the match is absent or ambiguous, ask which vote they mean.

## Pagination and recovery

- Use next_offset for offset lists and next_cursor for get_votes and get_person_votes. Continue while has_more is true even on short pages. For bill text use next_text_offset.
- Treat isError, Error: text, and validation failures as errors. Correct rejected arguments using the live schema. Narrow a timed-out search. Honor Retry-After on HTTP 429.
- Supply context, llm_model, or conversation_id only when advertised. Use a short third-person purpose without names or private details, the known model or unknown, and only a returned conversation identifier.
