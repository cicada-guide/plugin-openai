# Live OpenAI tool reference

Snapshot checked on 2026-11-02T14:50:34.034Z. The endpoint is unversioned; live host definitions take precedence. Analytics fields may appear only when instrumentation is enabled. Send only advertised parameters.

## search_bills

Search legislative bills in the cicada-guide database by bill number, words in the title or document text, subject, status, session, state or sponsor.

It matches bills, not votes: a legislator's voting record comes from search_people (the legislator's id), then get_person_votes or show_person_record.

When NOT to use: If you already have a bill UUID, use get_bill (full details) or get_latest_bill_document (bill text) instead.

Returns:
  A page of bills, each with its state and session names.
  Pages are trimmed to stay under 25,000 characters; follow next_offset while has_more is true.

Examples:
  - Look up a specific bill → bill="HB 314"
  - Find education bills → query="education"
  - Bills in a specific state → division_id="<uuid from list_states>"
  - Bills whose recorded status mentions introduction → status="Introduced"
  - Bills from 2025 sessions in one state → session_name="2025", division_id="<uuid from list_states>"
  - Bills by a specific sponsor → sponsor_id="<uuid from search_people>"

Input schema:

```json
{
  "type": "object",
  "properties": {
    "bill": {
      "description": "Bill number with its chamber prefix, e.g. 'HB 1' or 'SB314' \u2014 exact match, ignoring case, spaces and dots, so a named bill is found here rather than by query. 'HB 314' never matches HB 3140, and a number without a prefix ('314') matches nothing",
      "type": "string",
      "maxLength": 50
    },
    "query": {
      "description": "Words matched separately (OR'ed, substring) in the title, plus full-text search of document text. One distinctive word is most precise",
      "type": "string",
      "maxLength": 500
    },
    "subject": {
      "description": "Exact, case-sensitive subject; copy a value from a result's subjects",
      "type": "string",
      "maxLength": 200
    },
    "status": {
      "description": "Free-text recorded status, partial case-insensitive match; 'Passed' also matches committee or single-chamber passage, so each bill's status is reported as recorded",
      "type": "string",
      "maxLength": 100
    },
    "session_id": {
      "description": "Filter by session UUID, from list_sessions",
      "type": "string",
      "format": "uuid"
    },
    "session_name": {
      "description": "Filter by session name or year, partial match (e.g. '2025', '2025 Regular Session'), when the session is known by name rather than UUID",
      "type": "string",
      "maxLength": 200
    },
    "division_id": {
      "description": "Filter by division/state UUID, from list_states",
      "type": "string",
      "format": "uuid"
    },
    "sponsor_id": {
      "description": "Filter by sponsor person UUID, from search_people",
      "type": "string",
      "format": "uuid"
    },
    "limit": {
      "default": 20,
      "description": "Max results per page (1-100, default 20)",
      "type": "integer",
      "minimum": 1,
      "maximum": 100
    },
    "offset": {
      "default": 0,
      "description": "Pagination offset (0-10000, default 0)",
      "type": "integer",
      "minimum": 0,
      "maximum": 10000
    },
    "response_format": {
      "default": "markdown",
      "description": "markdown (readable text) or json (structured data)",
      "type": "string",
      "enum": [
        "markdown",
        "json"
      ]
    }
  },
  "additionalProperties": false
}
```

## get_bill

Retrieve full details for a single bill by its UUID. Returns metadata, sponsors, and source data — but NOT the full document text.

When NOT to use: If you need the bill's full text, use get_latest_bill_document instead. For sponsor names, documents and floor votes in one call use get_bill_dossier; to display a card use show_bill. Sponsors are UUIDs — resolve them with search_people ids.

Returns:
  The full bill record, with sponsors as people UUIDs and the openstates source data.

Examples:
  - Full details for a known bill → id="<uuid from search_bills>"
  - Raw JSON for programmatic use → id="<uuid>", response_format="json"

Input schema:

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid",
      "description": "Bill UUID, from search_bills"
    },
    "response_format": {
      "default": "markdown",
      "description": "markdown (readable text) or json (structured data)",
      "type": "string",
      "enum": [
        "markdown",
        "json"
      ]
    }
  },
  "required": [
    "id"
  ],
  "additionalProperties": false
}
```

## get_latest_bill_document

Retrieve the single most recent document attached to a bill.

Use this when the caller wants the current bill text or newest amendment/version without paging through all documents.

Returns:
  The newest version of the bill, chosen by document date descending (a document with no date is placed by stage: Introduced, Engrossed, Enrolled), plus the total number of attached documents.
  Also returns document text, preferring clean_text, then raw_text, then best-effort text fetched from the document URL when neither stored field is available.
  Text is returned in parts that fit the 25,000-character response limit: text_total_chars is the full length, and next_text_offset is where the next part starts (null when the text is complete).
  When text is null, text_unavailable.reason says why: refused (the state's site blocks automated requests), not_text (often a PDF), no_url, too_large or fetch_failed; the document's url still opens it.
  If you need the full document list instead, use get_documents.

Examples:
  - Read the current text of a bill → bill_id="<uuid from search_bills>"
  - Continue reading a long bill → bill_id="<uuid>", text_offset=<next_text_offset from previous response>
  - Get document metadata as JSON → bill_id="<uuid>", response_format="json"

Input schema:

```json
{
  "type": "object",
  "properties": {
    "bill_id": {
      "type": "string",
      "format": "uuid",
      "description": "Bill UUID, from search_bills or get_bill"
    },
    "text_offset": {
      "default": 0,
      "description": "Character offset into the document text (default 0); next_text_offset from the previous response continues it",
      "type": "integer",
      "minimum": 0,
      "maximum": 5000000
    },
    "response_format": {
      "default": "markdown",
      "description": "markdown (readable text) or json (structured data)",
      "type": "string",
      "enum": [
        "markdown",
        "json"
      ]
    }
  },
  "required": [
    "bill_id"
  ],
  "additionalProperties": false
}
```

## get_documents

Retrieve documents attached to a specific bill (bill text versions, amendments, etc.).

Returns:
  Document metadata with download URLs — not the documents' text.
  Pages are trimmed to stay under 25,000 characters; follow next_offset while has_more is true.
  For the newest document with full text, use get_latest_bill_document instead.

Examples:
  - All documents for a bill → bill_id="<uuid from search_bills>"
  - Page through documents → bill_id="<uuid>", offset=20
  - Get PDF URLs to hand to a PDF viewer → bill_id="<uuid>", response_format="json"

Input schema:

```json
{
  "type": "object",
  "properties": {
    "bill_id": {
      "type": "string",
      "format": "uuid",
      "description": "Bill UUID, from search_bills or get_bill"
    },
    "limit": {
      "default": 20,
      "description": "Max results per page (1-100, default 20)",
      "type": "integer",
      "minimum": 1,
      "maximum": 100
    },
    "offset": {
      "default": 0,
      "description": "Pagination offset (0-10000, default 0)",
      "type": "integer",
      "minimum": 0,
      "maximum": 10000
    },
    "response_format": {
      "default": "markdown",
      "description": "markdown (readable text) or json (structured data)",
      "type": "string",
      "enum": [
        "markdown",
        "json"
      ]
    }
  },
  "required": [
    "bill_id"
  ],
  "additionalProperties": false
}
```

## get_bill_dossier

Retrieve a normalized, UI-ready dossier for one bill: bill metadata, jurisdiction, session, resolved sponsors, document metadata, and the first page of floor votes.

Use instead of get_bill when you also need sponsor names and floor votes. It intentionally omits source blobs, contact details, and full document text. Use get_latest_bill_document for the current text and get_rollcalls with offset=100 when more floor votes are available.

Returns:
  The bill with its state, session, sponsors (name, party), documents, the first page of roll calls with vote counts ("not recorded" when no individual votes exist), governor_action (the state's general rule for the governor's deadline, the result of no action, and the effective date; null outside the 50 states), and partial-data warnings. governor_action is a general rule, not a prediction: never compute a date from it.

Examples:
  - Summarize a bill with its sponsors and floor votes → bill_id="<uuid from search_bills>"
  - The same dossier as structured data → bill_id="<uuid>", response_format="json"

Input schema:

```json
{
  "type": "object",
  "properties": {
    "bill_id": {
      "type": "string",
      "format": "uuid",
      "description": "Bill UUID from search_bills or get_bill"
    },
    "response_format": {
      "default": "markdown",
      "description": "markdown (readable text) or json (structured data)",
      "type": "string",
      "enum": [
        "markdown",
        "json"
      ]
    }
  },
  "required": [
    "bill_id"
  ],
  "additionalProperties": false
}
```

## show_bill

Display a bill as an interactive card in hosts that support MCP Apps.

Use this instead of get_bill when the caller wants to look at a bill rather than have its
contents read back to them — "show me HB 314", "pull up that bill". Hosts without UI support
still get the same summary as text, so it is always safe to call.

The card shows headline and summary exactly as passed. They should reflect the bill's text
(get_latest_bill_document); the card does not fetch or check them.

Returns:
  An interactive card with the bill number, your headline (tap for the official title), status, the summary,
  floor votes with party splits, and the bill's documents, plus a plain-text summary for hosts
  that cannot render it.

Examples:
  - Show a bill card → id="<uuid from search_bills>", headline="<your headline>", summary="<your summary>"

Input schema:

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid",
      "description": "Bill UUID, from search_bills"
    },
    "headline": {
      "type": "string",
      "minLength": 1,
      "maxLength": 120,
      "description": "Your short plain-language headline for a voter, e.g. 'Bans buying soda and candy with SNAP benefits'. Shown first on the card; tapping it shows the official title. Plain text that claims no passage or outcome"
    },
    "summary": {
      "type": "string",
      "minLength": 1,
      "description": "Your plain-language summary of the bill for a voter, shown on the card as written by the assistant: what it does, who it affects, and where it stands as recorded. Based on the bill's text, never inferring passage; when the text could not be read, the summary says so"
    }
  },
  "required": [
    "id",
    "headline",
    "summary"
  ],
  "additionalProperties": false
}
```

## search_people

Search legislators and elected officials in the cicada-guide people table. Also resolves batches of people_id UUIDs from get_votes into names.

When NOT to use: If you need full contact details or source data for a single legislator and already have their UUID, use get_person instead.

Returns:
  A page of people with their names and party.
  Results carry no state, chamber, or district, and there is no jurisdiction filter. To tell same-name legislators apart, call get_person_votes on each and read bill.division_id.
  Pages are trimmed to stay under 25,000 characters; follow next_offset while has_more is true.
  Use the returned id with get_person_votes to read a legislator's voting record.

Examples:
  - Search by last name → name="Smith"
  - All Republican legislators → party="R"
  - Name the legislators from a rollcall → ids=["<people_id from get_votes>", ...]
  - Which of those voted NAY were Republicans → ids=[...], party="R"

Input schema:

```json
{
  "type": "object",
  "properties": {
    "ids": {
      "description": "Person UUIDs to resolve in one call \u2014 pass people_id values from get_votes",
      "minItems": 1,
      "maxItems": 100,
      "type": "array",
      "items": {
        "type": "string",
        "format": "uuid"
      }
    },
    "name": {
      "description": "Partial name match on full, first or last name",
      "type": "string",
      "maxLength": 200
    },
    "query": {
      "description": "Alias for name. If you set both, name wins.",
      "type": "string",
      "maxLength": 200
    },
    "party": {
      "description": "Party filter (D, R, Democratic, Republican)",
      "type": "string",
      "maxLength": 100
    },
    "limit": {
      "default": 20,
      "description": "Max results per page (1-100, default 20)",
      "type": "integer",
      "minimum": 1,
      "maximum": 100
    },
    "offset": {
      "default": 0,
      "description": "Pagination offset (0-10000, default 0)",
      "type": "integer",
      "minimum": 0,
      "maximum": 10000
    },
    "response_format": {
      "default": "markdown",
      "description": "markdown (readable text) or json (structured data)",
      "type": "string",
      "enum": [
        "markdown",
        "json"
      ]
    }
  },
  "additionalProperties": false
}
```

## show_person_record

Display one resolved state legislator and their recorded-vote history in an interactive workspace. Use an id returned by search_people after resolving any ambiguity.

Returns:
  An interactive record card: the legislator's current seat, their enriched vote history (loaded through get_person_votes, filterable by session, vote and subject), and the bills they sponsored. Hosts without MCP Apps support receive the resolved person and seat as text.
  The model receives only the person's identity and seat; call get_person_votes to read or summarize votes.

Examples:
  - Show a resolved legislator → id="<uuid from search_people>"

Input schema:

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid",
      "description": "Person UUID from search_people"
    }
  },
  "required": [
    "id"
  ],
  "additionalProperties": false
}
```

## show_official

Display one elected official as a contact card: their office, state chamber and district, party, and buttons to email, visit their website, or call. Use an id returned by search_people after resolving any ambiguity.

Use this when the caller wants to know who someone is or how to reach them ("how do I contact my state representative", "show me Senator X"). For how they voted, use show_person_record or get_person_votes instead.

Returns:
  An interactive contact card, plus the same facts as text for hosts that cannot render it: office title, chamber, state, district, term dates and the election that filled the seat when recorded, party, and whichever of email, phone and website are on record. Contact details and term dates are missing for most officials; say so rather than guessing them.
  A person who has held more than one seat shows the current one, with the others listed as also held.

Examples:
  - Contact card for a resolved legislator → id="<uuid from search_people>"

Input schema:

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid",
      "description": "Person UUID from search_people"
    }
  },
  "required": [
    "id"
  ],
  "additionalProperties": false
}
```

## get_person

Retrieve full details for a single legislator or official by UUID.

Returns:
  The person's full record, including party and contact_details.

Examples:
  - Full profile for a known legislator → id="<uuid from search_people>"
  - Get contact details as structured data → id="<uuid>", response_format="json"

Input schema:

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid",
      "description": "Person UUID, from search_people"
    },
    "response_format": {
      "default": "markdown",
      "description": "markdown (readable text) or json (structured data)",
      "type": "string",
      "enum": [
        "markdown",
        "json"
      ]
    }
  },
  "required": [
    "id"
  ],
  "additionalProperties": false
}
```

## read_pdf_bytes

Read PDF data in paginated byte chunks using HTTP Range requests. A source that ignores Range is read from the start instead, for files up to 20 MB.

Returns raw PDF bytes (base64), not text — do not use this to read or summarize a bill; use get_latest_bill_document for text.

Source: the PDF is fetched directly from the state legislature's own public document server (for example alison.legislature.state.al.us or leginfo.legislature.ca.gov); only hosts on this server's allowlist of legislative document sources are accepted. Those sites publish files, not an API. Each call is one HTTPS GET with a "Range: bytes=start-end" header, per HTTP range requests (RFC 9110, section 14: https://www.rfc-editor.org/rfc/rfc9110#section-14); totalBytes comes from the Content-Range header of a 206 Partial Content reply.

This tool is designed for app/viewer integrations where large PDFs must be streamed
across multiple tool calls due to payload size limits. Get document URLs from get_documents or get_latest_bill_document first.

Returns:
  One chunk of the PDF. bytes (base64) is present only with response_format='json'; hasMore says whether another chunk follows.

Examples:
  - Read first chunk of a PDF → url="<url from get_documents or get_latest_bill_document>"
  - Read next chunk → url="<same>", offset=750000
  - Smaller chunks for constrained hosts → url="<same>", chunk_size=500000

Input schema:

```json
{
  "type": "object",
  "properties": {
    "url": {
      "type": "string",
      "format": "uri",
      "description": "HTTPS URL to a PDF on an allowed legislative document host (from get_documents or get_latest_bill_document)"
    },
    "offset": {
      "default": 0,
      "description": "Starting byte offset (default 0)",
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991
    },
    "chunk_size": {
      "default": 750000,
      "description": "Max bytes to return in this call (default 750000, max 2000000)",
      "type": "integer",
      "minimum": 1,
      "maximum": 2000000
    },
    "response_format": {
      "default": "markdown",
      "description": "markdown (readable text) or json (structured data)",
      "type": "string",
      "enum": [
        "markdown",
        "json"
      ]
    }
  },
  "required": [
    "url"
  ],
  "additionalProperties": false
}
```

## get_rollcalls

Retrieve floor-vote summaries (rollcalls) for a specific bill, with yea/nay/absent/not-voting counts for each.

Includes roll calls linked to the bill only through their recorded votes, where the roll call row itself carries no bill link. Each item's linked_via says which ("bill" or "votes"), so no reconciliation through get_votes is needed.

When NOT to use: If you need individual legislator votes (who voted what), use get_rollcall_breakdown or get_votes with a rollcall_id from this tool's output.

Lists every floor vote on a bill; a rollcall id from this response is what get_rollcall_breakdown takes to name how each legislator voted.

Returns:
  Roll calls, each with counts tallied from the recorded individual votes.
  bill_id is null on items with linked_via "votes": the stored roll call has no bill link.
  counts is null when no individual votes are recorded for a rollcall (true of many older or voice votes) — that means "not recorded", not a 0-0 vote.
  warnings lists anything that makes the list possibly incomplete; it is normally empty.

Examples:
  - Floor votes for a specific bill → bill_id="<uuid from search_bills>"
  - Compare yea and nay on each vote → bill_id="<uuid>", response_format="json"

Input schema:

```json
{
  "type": "object",
  "properties": {
    "bill_id": {
      "type": "string",
      "format": "uuid",
      "description": "Bill UUID, from search_bills or get_bill"
    },
    "limit": {
      "default": 20,
      "description": "Max results per page (1-100, default 20)",
      "type": "integer",
      "minimum": 1,
      "maximum": 100
    },
    "offset": {
      "default": 0,
      "description": "Pagination offset (0-10000, default 0)",
      "type": "integer",
      "minimum": 0,
      "maximum": 10000
    },
    "response_format": {
      "default": "markdown",
      "description": "markdown (readable text) or json (structured data)",
      "type": "string",
      "enum": [
        "markdown",
        "json"
      ]
    }
  },
  "required": [
    "bill_id"
  ],
  "additionalProperties": false
}
```

## get_rollcall_breakdown

Retrieve a complete, named vote breakdown for one rollcall: aggregate counts, a per-party tally (by_party), and every member's name, party, and vote (members). The same member rows are also placed in _meta.members for the bill workspace UI.

Use a rollcall UUID from get_rollcalls or get_bill_dossier. The result is capped at 500 vote rows and reports partial=true if the cap is reached; by_party then covers only the rows returned.

Returns:
  Rollcall metadata; counts { YEA, NAY, ABSENT, NV, total }; by_party [{ party, YEA, NAY, ABSENT, NV, total }], where party null means no party is recorded; members [{ vote_id, people_id, name, party, category }]. Keys are upper-case, unlike get_rollcalls' counts.

Examples:
  - See who voted for final passage → rollcall_id="<uuid from get_rollcalls>"
  - How the chamber split by party → rollcall_id="<uuid from get_rollcalls>"

Input schema:

```json
{
  "type": "object",
  "properties": {
    "rollcall_id": {
      "type": "string",
      "format": "uuid",
      "description": "Rollcall UUID, from get_rollcalls or get_bill_dossier"
    }
  },
  "required": [
    "rollcall_id"
  ],
  "additionalProperties": false
}
```

## get_votes

Retrieve individual legislator votes cast in a rollcall.

This tool returns one row per legislator per vote. For aggregate yea/nay/absent totals, use get_rollcalls instead. The votes table has ~5.6M rows, so at least one of rollcall_id, bill_id, or people_id is required. Omitting all three returns an error message instead of results — category alone does not satisfy this.

Pagination: uses cursor-based pagination, not offset. To get subsequent pages, pass next_cursor from the previous response as cursor. Do not use offset — it is not supported by this tool.

Which tool: for a named per-rollcall breakdown (names, parties, per-party tally) use get_rollcall_breakdown; for one legislator's history with bill and rollcall context use get_person_votes. For how one legislator voted on one bill, pass bill_id and people_id together — all filters combine with AND.

Returns:
  A page of votes, each a category (YEA, NAY, ABSENT or NV) with its people_id and rollcall_id.
  Pages are trimmed to stay under 25,000 characters; follow next_cursor while has_more is true.

Examples:
  - All votes in a rollcall → rollcall_id="<uuid from get_rollcalls>"
  - Who voted NAY → rollcall_id="<uuid>", category="NAY"
  - One legislator's voting record → people_id="<uuid from search_people>"
  - How one legislator voted on one bill → bill_id="<uuid>", people_id="<uuid>"
  - Next page → cursor="<next_cursor from previous response>"

Input schema:

```json
{
  "type": "object",
  "properties": {
    "rollcall_id": {
      "description": "Rollcall UUID, from get_rollcalls \u2014 votes for one floor vote (preferred)",
      "type": "string",
      "format": "uuid"
    },
    "bill_id": {
      "description": "Bill UUID \u2014 get votes across all rollcalls for a bill",
      "type": "string",
      "format": "uuid"
    },
    "category": {
      "description": "Vote category: YEA, NAY, ABSENT, or NV",
      "type": "string",
      "enum": [
        "YEA",
        "NAY",
        "ABSENT",
        "NV"
      ]
    },
    "people_id": {
      "description": "Person UUID \u2014 filter to one legislator's votes",
      "type": "string",
      "format": "uuid"
    },
    "limit": {
      "default": 20,
      "description": "Max results per page (1-100, default 20)",
      "type": "integer",
      "minimum": 1,
      "maximum": 100
    },
    "cursor": {
      "description": "Keyset pagination cursor \u2014 pass next_cursor from previous response",
      "type": "string",
      "format": "uuid"
    },
    "response_format": {
      "default": "markdown",
      "description": "markdown (readable text) or json (structured data)",
      "type": "string",
      "enum": [
        "markdown",
        "json"
      ]
    }
  },
  "additionalProperties": false
}
```

## get_person_votes

Retrieve a legislator's voting history in reverse legislative chronology with enriched Bill and Rollcall context.

Use this tool to answer questions about how a specific legislator voted on bills, their recent voting activity, or their single latest recorded vote.
The legislator is identified by people_id; search_people finds it from a name. Bill searches (search_bills) do not return votes.

Features:
- Reverse legislative chronology (sorted by rollcall date descending, with rollcall id and vote id as deterministic tiebreakers).
- Enriched context (includes bill title, bill number, status, subjects, session, rollcall date, description, the rollcall's vote counts, and source URL). outcome is null when the rollcall has no recorded individual votes. bill is null for a vote with no linked bill; a session_id filter excludes such votes.
- Filtering by category (YEA, NAY, ABSENT, NV), session, and date range (start_date, end_date).
- Latest mode (latest: true returns one vote from the newest rollcall date; several votes can share that date and the tie is broken by id, not time).
- Keyset cursor pagination (pass next_cursor to fetch subsequent pages). No offset parameter — page with cursor. Pages are trimmed to stay under 25,000 characters; follow next_cursor while has_more is true.

Returns:
  Enriched vote history with person, vote, rollcall, and bill details, pagination state, and active filters.

Examples:
  - Legislator's latest vote → people_id="<uuid>", latest=true
  - All YEA votes for a legislator → people_id="<uuid>", category="YEA"
  - Votes during a specific session → people_id="<uuid>", session_id="<session uuid>"
  - Votes in a date range → people_id="<uuid>", start_date="2024-01-01", end_date="2024-12-31"

Input schema:

```json
{
  "type": "object",
  "properties": {
    "people_id": {
      "type": "string",
      "format": "uuid",
      "description": "Legislator's person UUID, from search_people"
    },
    "category": {
      "description": "Filter by vote category: YEA, NAY, ABSENT, or NV",
      "type": "string",
      "enum": [
        "YEA",
        "NAY",
        "ABSENT",
        "NV"
      ]
    },
    "session_id": {
      "description": "Legislative session UUID from list_sessions",
      "type": "string",
      "format": "uuid"
    },
    "start_date": {
      "description": "Filter votes on or after this date (inclusive, YYYY-MM-DD)",
      "type": "string",
      "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
    },
    "end_date": {
      "description": "Filter votes on or before this date (inclusive, YYYY-MM-DD)",
      "type": "string",
      "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
    },
    "latest": {
      "default": false,
      "description": "Return one vote from the newest rollcall date; several votes can share that date and the tie is broken by id, not time",
      "type": "boolean"
    },
    "include_totals": {
      "default": false,
      "description": "Also return the legislator's total recorded votes per category across all sessions (totals); null when category, session or date filters are set",
      "type": "boolean"
    },
    "include_sessions": {
      "default": false,
      "description": "Also return every session the legislator has a recorded vote in, newest first (sessions); null under the same filters as totals",
      "type": "boolean"
    },
    "limit": {
      "default": 20,
      "description": "Max results per page (1-100, default 20)",
      "type": "integer",
      "minimum": 1,
      "maximum": 100
    },
    "cursor": {
      "description": "Keyset pagination cursor \u2014 pass next_cursor from previous response",
      "type": "string",
      "maxLength": 512
    },
    "response_format": {
      "default": "markdown",
      "description": "markdown (readable text) or json (structured data)",
      "type": "string",
      "enum": [
        "markdown",
        "json"
      ]
    }
  },
  "required": [
    "people_id"
  ],
  "additionalProperties": false
}
```

## list_states

List all US states (divisions) with their UUIDs. Use the returned id as division_id when filtering bills in search_bills or sessions in list_sessions.

Returns:
  All 51 state divisions; geoidfq is the Census identifier.

Examples:
  - All states → (no params needed)
  - Find Texas → name="Texas"
  - States starting with 'New' → name="New"

Input schema:

```json
{
  "type": "object",
  "properties": {
    "name": {
      "description": "Partial state name filter, e.g. 'Alabama' or 'New'",
      "type": "string",
      "maxLength": 200
    },
    "response_format": {
      "default": "markdown",
      "description": "markdown (readable text) or json (structured data)",
      "type": "string",
      "enum": [
        "markdown",
        "json"
      ]
    }
  },
  "additionalProperties": false
}
```

## list_sessions

List legislative sessions. Use the returned id as session_id when filtering bills in search_bills.

Returns:
  A page of sessions with their convene and adjourn dates.

Examples:
  - Sessions for a specific state → division_id="<uuid from list_states>"
  - Find 2026 sessions → name="2026"
  - Current sessions for Alabama → division_id="<uuid>", name="2026"

Input schema:

```json
{
  "type": "object",
  "properties": {
    "division_id": {
      "description": "State/division UUID, from list_states",
      "type": "string",
      "format": "uuid"
    },
    "name": {
      "description": "Partial session name filter, e.g. '2025' or 'Regular Session'",
      "type": "string",
      "maxLength": 200
    },
    "limit": {
      "default": 20,
      "description": "Max results per page (1-100, default 20)",
      "type": "integer",
      "minimum": 1,
      "maximum": 100
    },
    "offset": {
      "default": 0,
      "description": "Pagination offset (0-10000, default 0)",
      "type": "integer",
      "minimum": 0,
      "maximum": 10000
    },
    "response_format": {
      "default": "markdown",
      "description": "markdown (readable text) or json (structured data)",
      "type": "string",
      "enum": [
        "markdown",
        "json"
      ]
    }
  },
  "additionalProperties": false
}
```
