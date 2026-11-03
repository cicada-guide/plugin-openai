# Trigger, reference-loading and dossier-checklist refinement

Checked November 2, 2026. These results apply to the revised skills and checklist, separately from the historical eight-case baseline.

## Changes

Clarified get-legislation and voting-record trigger descriptions. The shared skill now routes to relevant reference sections rather than requiring the entire tool catalog and worked-sequences file. Live tool definitions govern parameters.

The bill-brief checklist accepts dossier roll calls when has_more=false, count=total=items.length, and no warning indicates failed or incomplete floor-vote retrieval. Continue get_rollcalls from next_offset for more pages; start at offset 0 for missing/inconsistent completeness metadata, failed retrieval, or the get_bill path. Preserve unresolved warnings even on the last page. This rule is synchronized across the manifest, skill, bill procedure, worked sequence, written review cases and ADR-004. Original benchmark results retain their original criteria.

## Fresh targeted Codex run

Configuration: [refinement.json](refinement.json). Results: [raw harness result](refinement-result.json), [raw-event verification](refinement-result-verified.json), and [actual usage](refinement-usage.jsonl).

| Case | Result | MCP calls | Seconds | Input tokens | Cached input | Output tokens |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| Exact bill lookup | Passed in CLI | 5 | 43.72 | 230,190 | 203,008 | 930 |
| Bill brief | Passed in CLI | 7 | 72.17 | 289,840 | 256,768 | 2,378 |

Both cases used the resolved Alabama/session IDs, returned sourced answers and requested show_bill. All 12 MCP calls had schema-valid arguments and no reported MCP errors. Full answer files were retained before workspace cleanup.

The lookup read only the two skill entrypoints; it did not load supporting references. The brief read those entrypoints and only bill-brief-researcher.md. Neither run read the tool catalog, worked sequences, defaults, identity procedure, or governor-rule reference. The dossier supplied five roll calls with count=total=items.length=5, has_more=false, and warnings=[]; no duplicate get_rollcalls call occurred. The brief preserved all five recorded entries and their tallies, disclosed the unresolved sponsor ID and missing enactment confirmation, and used all 7,298 characters of the enrolled text with no continuation remaining.

## Static evaluation

- get-legislation: **81 → 86**; trigger warning removed. Estimated entrypoint tokens increased from 1,149 to 1,336 because explicit routing was added.
- voting-record: **95 → 100**; trigger warning removed.
- The shared skill's deferred-reference estimate remains high (14,828 tokens). This is the total available reference inventory, not proof that each task loads it. References were retained for fallback and detailed procedures.

The measured runs demonstrate selective reading in these two tasks. They do not establish general token savings, improved implicit triggering, or repeatability: prompts explicitly request the skills, inherited CLI/tool context is substantial, and the live server added metadata since the original benchmark. No causal performance comparison is claimed.

## Verification limits

Source validation, all nine Node tests, live MCP checks and rebuilt ZIP inspection passed. Pagination, missing metadata, floor-vote failures, persistent scan-cap warnings and unrelated dossier warnings are specified in the additional review cases but were not exercised in this targeted live run. Native ChatGPT behavior and card rendering remain unverified.

Repeat the targeted run without overwriting the original suite:

```powershell
node .plugin-eval/prepare.mjs
node .plugin-eval/run.mjs --config .plugin-eval/refinement.json --name refinement
node .plugin-eval/inspect-run.mjs .plugin-eval/refinement-result.json
```
