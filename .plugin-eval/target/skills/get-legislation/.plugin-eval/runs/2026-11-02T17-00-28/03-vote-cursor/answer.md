# Rex Reynolds’s latest recorded votes

Cicada Guide identifies Rex Reynolds as Alabama’s State Representative for House District 21. His most recent recorded vote date in the returned dataset is **May 8, 2026**, with **one vote** on that date.

| Date | Bill and session | Recorded description | Reynolds’s position | Roll-call tally |
| --- | --- | --- | --- | --- |
| May 8, 2026 | **SB1**, 2026 1st Special Session — “Elections; special primary election for redistricting certain State Senate districts authorized in certain circumstances” | “Lee motion to Previous Question - Roll Call 3” | **YEA** | 75 yea, 29 nay, 1 absent, 0 not voting |

The description identifies a procedural motion; the tally is for that roll call. No passage outcome is inferred from it.

## Sources and pagination verification

All legislative facts above come from configured guide-public MCP results in this conversation:

- `list_states(name="Alabama")` established the jurisdiction; `search_people(name="Rex Reynolds")` returned one candidate and no further pages. `show_person_record` verified his Alabama House District 21 seat. The returned [official legislator profile](https://www.legislature.state.al.us/aliswww/ISD/ALRepresentative.aspx?NAME=Reynolds&OID_SPONSOR=100501&OID_PERSON=8445&SESSNAME=) is an identity reference, not a vote citation.
- `get_person_votes` was called with **limit=1 and latest=false**, without date, category, or session filters. Page 1 returned the May 8 vote above and `has_more=true`. Its exact `next_cursor` was supplied to the second call, retaining limit=1 and latest=false.
- Page 2 returned an older date, **May 6, 2026** (HB1, “Lee motion to Previous Question - Roll Call 1,” YEA). That older-date boundary establishes that the May 8 date was exhausted. Earlier history remains available; it was outside the requested latest-date scope. No offset pagination was used, and no intra-day chronological order is asserted: the tool breaks same-date ties by record IDs, not time.
- `list_sessions` resolved the vote’s session as **2026 1st Special Session**. `get_bill` confirmed SB1’s title and session but supplied no additional source URL (`openstates=null`). The vote result’s `bill.source_url` was also null, so **no direct vote source URL was returned**. The vote facts are sourced to the MCP record, without a fabricated external citation.

Retrieved November 2, 2026, at 17:04 UTC. The vote tool reported source freshness of September 28, 2026, at 10:05:38 UTC. “Latest” refers to this dataset’s returned records, not a claim that no later real-world votes occurred. No legislative records were modified.
