# Resolve a legislator identity

Use this procedure directly in the conversation; no delegation is required.

1. Require a name and state. Chamber or district can help but cannot replace verification. Apply only explicit conversation/project defaults and say when used.
2. Page search_people through next_offset while has_more. It has no jurisdiction filter; names and parties do not establish a seat.
3. For plausible candidates use show_person_record or show_official with id for seat data. If needed probe get_person_votes with people_id and inspect bill/session jurisdiction. A vote's jurisdiction is not proof of a current seat.
4. Compare recorded state, chamber and district with the request. Never invent a missing seat. If jurisdiction cannot be verified, report uncertainty rather than attributing requested votes.
5. If several candidates remain, present names and distinguishing recorded facts and ask the user. If none match, report no matching record rather than claiming the person does not exist.
6. Reuse only the verified UUID. Keep internal UUIDs out of prose unless asked. Re-read and check card-originated identifiers before using them.
