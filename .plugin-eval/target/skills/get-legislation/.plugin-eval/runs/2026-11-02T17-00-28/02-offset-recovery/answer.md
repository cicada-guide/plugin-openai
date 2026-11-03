# Alabama HB591 — 2026 Regular Session

Resolved bill: **HB591**, “Rural Health Transformation Program supplemental appropriations for the fiscal year ending September 30, 2026.” Bill UUID: `bb4693da-72c7-476c-8e11-81709813c76f`. Session UUID: `d72fd4b9-0c52-4e09-8b2a-0d6135f7138c`. Sources: configured guide-public `list_states`, `list_sessions`, and scoped `search_bills` results. The returned [enrolled document URL](https://alison.legislature.state.al.us/files/pdf/SearchableInstruments/2026RS/HB591-enr.pdf) identifies the bill document; its text was not read for this test.

The first `get_rollcalls` request used this bill UUID with `offset=999999`, `limit=1`. It returned `isError=true`: “Input validation error: Invalid arguments for tool get_rollcalls: offset: Too big: expected number to be <=10000”. This was an invalid pagination argument, not evidence that the bill had no votes.

Recovery began at `offset=0`, `limit=1`, and followed every returned `next_offset`: **0 → 1 → 2 → 3 → 4**. Each page returned one record and `total=5`. Offsets 0–3 had `has_more=true`; offset 4 had `has_more=false` and no next offset. Every page returned `warnings=[]`.

## Complete recorded roll-call list

These are all five records returned by guide-public `get_rollcalls`, in returned pagination order. NV means not voting. Each tally belongs only to its own record.

| Offset | Date | Recorded description | Yea | Nay | Absent | NV | Total |
|---|---|---|---:|---:|---:|---:|---:|
| 0 | 2026-04-08 | Motion to Read a Third Time and Pass - Roll Call 1282 | 30 | 0 | 5 | 0 | 35 |
| 1 | 2026-04-01 | Motion to Read a Third Time and Pass as Amended - Roll Call 1127 | 104 | 0 | 1 | 0 | 105 |
| 2 | 2026-04-01 | Third Reading in House of Origin | 104 | 0 | 1 | 0 | 105 |
| 3 | 2026-04-01 | HBIR: Passed by House of Origin | 104 | 0 | 1 | 0 | 105 |
| 4 | 2026-04-01 | Motion to Adopt - Roll Call 1126 5VQZH63-1 | 104 | 0 | 1 | 0 | 105 |

Source record IDs, corresponding to the offsets above:

- 0: `6bff9a36-81b4-49ad-b6e2-7cd76dec8e10`
- 1: `92e84d78-6cbb-4677-912d-4e67da326012`
- 2: `5ce684fc-e1a4-401a-936b-b5973ef2cead`
- 3: `2079b4c1-3929-47a5-a83f-a28330d7b53c`
- 4: `0b22141d-b9a4-4bf0-ac79-ed1f1cce6c02`

All five records returned `linked_via="bill"` and the resolved bill UUID. The roll-call responses supplied no vote-source URLs, so the tool names, exact request offsets, and record IDs above provide the vote provenance. The linked bill PDF is not presented as a source for these tallies. Records with similar descriptions or identical tallies are retained separately as returned; no totals are added across records and no vote outcomes are inferred. This is the complete roll-call list in the configured dataset, not an individual legislator-position list. No legislative records were modified.
